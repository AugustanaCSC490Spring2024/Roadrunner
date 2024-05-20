import os

from fastapi import UploadFile


async def save_audio_file(audio: UploadFile) -> str:
    """
    Saves the uploaded audio file to a predefined directory and returns the path.

    Args:
    - audio (UploadFile): The audio file uploaded by the user.

    Returns:
    - str: The path where the audio file is saved.
    """
    upload_dir = "audio"
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    full_path = os.path.join(project_root, upload_dir)
    if not os.path.exists(full_path):
        os.makedirs(full_path, exist_ok=True)

    file_location = os.path.join(full_path, audio.filename)
    with open(file_location, "wb+") as file_object:
        file_object.write(await audio.read())
    return file_location
