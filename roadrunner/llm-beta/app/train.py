from datasets import load_dataset
import tiktoken
import torch

enc = tiktoken.get_encoding("cl100k_base")

# To get the tokeniser corresponding to a specific model in the OpenAI API:
enc = tiktoken.encoding_for_model("gpt-4")

batch_size = 16 # independent sequences to process in parallel
block_size = 32 # maximum context length for predictions
max_iters = 10000
eval_interval = 100
eval_iters = 200
learning_rate = 1e-3
device = 'cuda' if torch.cuda.is_available() else 'cpu'

class Train:
    def __init__(self, dataset_name, rows):
        self.dataset_name = dataset_name
        self.text = ""
        self.data = None
        self.train_data = None
        self.val_data = None
        self.rows = rows
    
    def expand_text(self):
        for sublist in self.text['train'][slice(None, self.rows, None)]['line']:
            print(sublist)
            
    def download_data(self):
        self.text = load_dataset(self.dataset_name)
        interim = []
        interim = (self._encode(sublist for sublist in self.text['train'][slice(None, self.rows, None)]['line']))
        res = []
        for _ in interim:
            res.extend(_)
        self.data = torch.tensor(res, dtype=torch.long)
        n = int(0.9*len(self.data)) 
        self.train_data = self.data[:n]
        self.val_data = self.data[n:]
    
    def _encode(self, s):
        return [enc.encode(word) for word in s]

    def _decode(self, s):
        return ''.join([enc.decode(s)])
    
    #data loading
    def _get_batch(self, split):
        # generate a small batch of data of inputs x and targets y
        data = self.train_data if split == 'train' else self.val_data
        ix = torch.randint(len(data) - block_size, (batch_size,))
        x = torch.stack([data[i:i+block_size] for i in ix])
        y = torch.stack([data[i+1:i+block_size+1] for i in ix])
        x, y = x.to(device), y.to(device)
        return x, y
    
    @torch.no_grad()
    def _estimate_loss(self, model):
        out = {}
        model.eval()
        for split in ['train', 'val']:
            losses = torch.zeros(eval_iters)
            for k in range(eval_iters):
                X, Y = self._get_batch(split)
                logits, loss = model(X, Y)
                losses[k] = loss.item()
            out[split] = losses.mean()
        model.train()
        return out

    def train_model(self, model):
        self.download_data()
        # create a PyTorch optimizer
        optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate)
        for iter in range(max_iters):
            # every once in a while evaluate the loss on train and val sets
            if iter % eval_interval == 0 or iter == max_iters - 1:
                losses = self._estimate_loss(model)
                print(f"step {iter}: train loss {losses['train']:.4f}, val loss {losses['val']:.4f}")
            # sample a batch of data
            xb, yb = self._get_batch('train')

            # evaluate the loss
            logits, loss = model(xb, yb)
            optimizer.zero_grad(set_to_none=True)
            loss.backward()
            optimizer.step()

    
    
    
    
    