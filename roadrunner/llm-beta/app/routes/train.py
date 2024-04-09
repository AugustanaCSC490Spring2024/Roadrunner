from flask import Blueprint, request, jsonify
import os
import torch
from datasets import load_dataset
from .. import m

train = Blueprint('train', __name__)

batch_size = 16 # independent sequences to process in parallel
block_size = 32 # maximum context length for predictions
max_iters = 20000
eval_interval = 100
eval_iters = 200
learning_rate = 1e-3
device = 'cuda' if torch.cuda.is_available() else 'cpu'


encode = lambda s: [ord(char) for char in s]
decode = lambda l: ''.join([chr(i) for i in l])


def encode_gutenberg(data):
    res = []
    for sublist in data['train'][slice(None, 30000, None)]['line']:
        res.extend(encode(sublist))
    return res

text = load_dataset("biglam/gutenberg-poetry-corpus")
data = torch.tensor(encode_gutenberg(text), dtype=torch.long)
n = int(0.9*len(data)) # first 90% will be train, rest val
train_data = data[:n]
val_data = data[n:]




@train.route('/train', methods=['GET'])
def train_el():
    train_model(m)
    

#data loading
def get_batch(split):
    # generate a small batch of data of inputs x and targets y
    data = train_data if split == 'train' else val_data
    ix = torch.randint(len(data) - block_size, (batch_size,))
    x = torch.stack([data[i:i+block_size] for i in ix])
    y = torch.stack([data[i+1:i+block_size+1] for i in ix])
    x, y = x.to(device), y.to(device)
    return x, y
 

@torch.no_grad()
def estimate_loss(model):
    out = {}
    model.eval()
    for split in ['train', 'val']:
        losses = torch.zeros(eval_iters)
        for k in range(eval_iters):
            X, Y = get_batch(split)
            logits, loss = model(X, Y)
            losses[k] = loss.item()
        out[split] = losses.mean()
    model.train()
    return out


def train_model(model):
    # create a PyTorch optimizer
    optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate)
    for iter in range(max_iters):
        # every once in a while evaluate the loss on train and val sets
        if iter % eval_interval == 0 or iter == max_iters - 1:
            losses = estimate_loss(model)
            print(f"step {iter}: train loss {losses['train']:.4f}, val loss {losses['val']:.4f}")
        # sample a batch of data
        xb, yb = get_batch('train')

        # evaluate the loss
        logits, loss = model(xb, yb)
        optimizer.zero_grad(set_to_none=True)
        loss.backward()
        optimizer.step()