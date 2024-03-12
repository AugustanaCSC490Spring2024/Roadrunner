import os
import re
import torch
from pathlib import Path


import whisper
from whisper.utils import get_writer


def audio_to_text(input_format, file_location, plain):
    # Use CUDA, if available
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

    # Load the desired model
    model = whisper.load_model("medium.en").to(DEVICE)
    file_path = Path(file_location)
    print(f"Transcribe from: {file_path}")

    output_directory = file_path.parent

    result = model.transcribe(file_location, verbose=False, language='en')

    if plain:
        text_path = file_path.with_suffix(".txt")
        print(f"\nCreating text file")
        with open(text_path, "w", encoding="utf-8") as txt:
            txt.write(result["text"])

    return result
