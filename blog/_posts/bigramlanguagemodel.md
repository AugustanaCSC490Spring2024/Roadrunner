---
title: "Bigram Language Model"
excerpt: ""
coverImage: "/assets/blog/bigram/bigram.webp"
date: "2024-04-18"
author:
  name: Joshua Fosu-Agyemang
ogImage:
  url: ""
---

We created our own Large Language Model (LLM) - Bigram Model.
Currently, we do not have an effective tokenizer, as characters are simply converted to integers using the 
python `ord()` function. An improvement, which would soon be rolled out, will involve using OpenAI's tokenizer
(tiktoken). While our current tokenizer has about max xhars of 200, tiktoken has about ~150,000 chars.
Additionally, our model has yet to be pretrained. Current available data to train our model is the Guttenberg project
which is downloaded with command `text = load_dataset("biglam/gutenberg-poetry-corpus")`. Currently, this dataset has about 
~3000000 lines of words.

