from litellm import completion
import os

messages = [{ "content": "Hello, how are you?","role": "user"}]

response = completion(model="gpt-3.5-turbo", messages=messages)
