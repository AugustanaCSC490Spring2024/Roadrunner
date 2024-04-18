import pyaudio
import wave
from pydub import AudioSegment
import os
import requests

# Set parameters
RATE = 48000
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
RECORD_SECONDS = 60
FOLDER_LOCATION = "audio/"


def countfile(directory):
    return os.listdir(directory)


count = 0
while count < 100:
    files = countfile(FOLDER_LOCATION)
    full_path = ["audio/{0}".format(x) for x in files]
    if len(files) >= 2:
        oldest = min(full_path, key=os.path.getctime)
        try:
            os.remove(os.path.abspath(oldest))
        except:
            print("File cannot be removed")

    WAVE_OUTPUT_FILENAME = FOLDER_LOCATION + "output" + str(count) + ".wav"
    MP3_OUTPUT_FILENAME = FOLDER_LOCATION + "output" + str(count) + ".mp3"
    # Initialize PyAudio
    p = pyaudio.PyAudio()

    # Open a stream for recording
    stream = p.open(rate=RATE,
                    channels=CHANNELS,
                    format=FORMAT,
                    input=True,
                    frames_per_buffer=CHUNK)

    print("Recording initiated")

    # Create an empty list to store audio frames
    frames = []

    # Record audio for the specified duration
    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data)

    print("Recording stopped")

    # Stop and close the stream
    stream.stop_stream()
    stream.close()
    p.terminate()

    # Save the recorded audio frames as a WAVE file
    wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()

    # Convert the WAVE file to MP3
    sound = AudioSegment.from_wav(WAVE_OUTPUT_FILENAME)
    # sound.export(MP3_OUTPUT_FILENAME, format="mp3")

    print(f"Audio recording saved as {MP3_OUTPUT_FILENAME}")

    # Curl process happens here
    url = 'https://remotely-many-tortoise.ngrok-free.app/audio'
    files = {'audio': open(f'{WAVE_OUTPUT_FILENAME}', 'rb')}
    data = {'user_id': '1'}

    response = requests.post(url, files=files, data=data)

    # print the response
    print(response.text)

    count = count + 1
