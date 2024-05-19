import pyaudio
import wave
from pydub import AudioSegment
import os
import requests
import argparse
import logging
import threading
import numpy as np
import time
import signal

# Set parameters
RATE = 48000
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
FOLDER_LOCATION = "audio/"
WAVE_OUTPUT_FILENAME = 'recording{}.wav'
# Create the folder if it doesn't exist
if not os.path.exists(FOLDER_LOCATION):
    os.makedirs(FOLDER_LOCATION)

# Configure logging
logger = logging.getLogger('AudioRecorder')
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
logger.addHandler(ch)

# Argument parser
parser = argparse.ArgumentParser(description='Record audio and send it to a server.')
parser.add_argument('-u', '--base-url', type=str, default="https://roadrunner.huwngtran.com",
                    help="The base URL to which the recordings are sent (default: https://roadrunner.huwngtran.com).")
parser.add_argument('-s', '--seconds', type=int, default=10,
                    help="Duration of each recording segment in seconds (default: 10).")
parser.add_argument('-l', '--save', action='store_true', help="Save recordings locally.")
parser.add_argument('-v', '--verbose', action='store_true', help="Enable verbose output for debugging.")
parser.add_argument('--username', type=str, required=True, help="Username for login.")
parser.add_argument('--password', type=str, required=True, help="Password for login.")

# Parse the arguments
args = parser.parse_args()

if args.verbose:
    logger.setLevel(logging.DEBUG)

audio = pyaudio.PyAudio()

def is_silent(data_chunk):
    as_ints = np.frombuffer(data_chunk, dtype=np.int16)
    mean = np.mean(as_ints ** 2)
    if np.isnan(mean):
        return None
    volume = np.sqrt(mean)
    return volume < 1000  # Sensitivity threshold

def get_wav_filename(count):
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    return f"output_{timestamp}_{count}.wav"


def count_files(directory):
    return os.listdir(directory)

def login():
    url = f'{args.base_url}/login'
    headers = {'Content-Type': 'application/json'}
    data = {
        'username': args.username,
        'password': args.password
    }
    
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        user_id = response.json().get('user_id')
        logger.info(f"Login successful, user_id: {user_id}")
        return user_id
    else:
        logger.error("Login failed", response.text)
        return None

def store_sound(frames, user_id, count):
    logger.debug('Store and sending wav.')
    filename = get_wav_filename(count)
    wf = wave.open(f"audio/{filename}", 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(audio.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()

    with open(f"audio/{filename}", 'rb') as f:
        files = {'audio': (filename, f, 'audio/wav')}
        response = requests.post(f'{args.base_url}/audio', files=files, data={'user_id': user_id}, timeout=540)
    logger.info(response.text)

def record_audio(user_id):
    logger.info(f"Starting audio recording with URL: {args.base_url}")
    stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)

    def exit_script(_, __):
        logger.info('Exiting...')
        stream.stop_stream()
        stream.close()
        audio.terminate()
        exit(0)

    signal.signal(signal.SIGINT, exit_script)
    logger.info('Listening... (press Ctrl+C to stop)')

    count = 0
    try:
        while count < 100:
            files = count_files(FOLDER_LOCATION)
            full_path = [os.path.join(FOLDER_LOCATION, x) for x in files]
            if len(files) >= 2:
                oldest = min(full_path, key=os.path.getctime)
                try:
                    os.remove(os.path.abspath(oldest))
                except:
                    logger.error("File cannot be removed")

            data = stream.read(CHUNK, exception_on_overflow=False)
            if not is_silent(data):
                logger.info('Recording started')
                start_time = time.time()
                frames = [data]
                while (time.time() - start_time) < args.seconds:
                    data = stream.read(CHUNK, exception_on_overflow=False)
                    frames.append(data)
                threading.Thread(target=store_sound, args=(frames, user_id, count)).start()
                count += 1
                logger.info('Recording stopped, waiting for next sound')
    except KeyboardInterrupt:
        logger.info('Recording stopped by user.')
    finally:
        stream.stop_stream()
        stream.close()
        audio.terminate()

if __name__ == "__main__":
    user_id = login()
    print("user_id", user_id)
    if user_id:
        record_audio(user_id)
