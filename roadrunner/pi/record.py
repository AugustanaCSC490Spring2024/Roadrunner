import pyaudio  # sudo apt-get install python-pyaudio
import wave
from pydub import AudioSegment
import os
import requests
# import board
# from digitalio import DigitalInOut, Directiosourn, Pull
# import time

# BUTTON_PIN = board.D17
# JOYDOWN_PIN = board.D27
# JOYLEFT_PIN = board.D22
# JOYUP_PIN = board.D23
# JOYRIGHT_PIN = board.D24
# JOYSELECT_PIN = board.D16

# buttons = [BUTTON_PIN, JOYUP_PIN, JOYDOWN_PIN,
#            JOYLEFT_PIN, JOYRIGHT_PIN, JOYSELECT_PIN]

# for i,pin in enumerate(buttons):
#   buttons[i] = DigitalInOut(pin)
#   buttons[i].direction = Direction.INPUT
#   buttons[i].pull = Pull.UP
# button, joyup, joydown, joyleft, joyright, joyselect = buttons

# Set parameters
RATE = 48000
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
RECORD_SECONDS = 60
FOLDER_LOCATION = "audio/"

USER_ID = '1'  # change this for different user


def countfile(directory):
    return os.listdir(directory)

# activate = False
# if not button.value:
#     activate = True
#     time.sleep(0.01)


# while activate:
#     if not button.value:
#         activate = not activate
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

    # let see if we can process and send this audio file. If not then it will be save on the computer
    # Curl process happens here
    try:
        url = 'https://remotely-many-tortoise.ngrok-free.app/audio'
        files = {'audio': open(f'{WAVE_OUTPUT_FILENAME}', 'rb')}
        data = {'user_id': USER_ID}

        response = requests.post(url, files=files, data=data)

        # print the response
        print(response.text)
    except:
        print("Could not send")

    count = count + 1
