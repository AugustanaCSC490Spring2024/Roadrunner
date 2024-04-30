from flask import Blueprint, request, jsonify
import os
import torch
from datasets import load_dataset
from ..train import Train
from .. import m
import asyncio

train = Blueprint('train', __name__)

my_training = Train("biglam/gutenberg-poetry-corpus", 20000)



print("Entry point for train routes")


def start_pretraining():
    print("Started pretraining")
    my_training.train_model(m) 


@train.route('train/', methods=['GET'])
async def train_el():
    start_pretraining()
    return "Pretraining done!"

@train.route('hello/', methods=['GET'])
def hello_world():
    return 'Hello world'


@train.route('chat/', methods=['GET'])
def generate_context():
    if request.method == 'GET':
        req = request.json
        text = req.get('text')
        return my_training.get_context(text)

    
    
