from datasets import load_dataset
import torch

def download_data(dataset_name):
    text = load_dataset(dataset_name)
    interim = []
    interim = [(encode(sublist)) for sublist in text['train'][slice(None, 5, None)]['line']]
    res = []
    for _ in interim:
        res.extend(_)
    print("res", res)
    data = torch.tensor(res, dtype=torch.long)
    print("data", data)
    n = int(0.9*len(data)) 
    train_data = data[:n]
    val_data = data[n:]

def encode(s):
    print(s)
    return [ord(char) for char in s if char.isalpha() or char.isspace()]

if __name__ == "__main__":
    download_data("biglam/gutenberg-poetry-corpus")



