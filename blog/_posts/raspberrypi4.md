---
title: "Raspberry Pi recording and saving audio to file"
excerpt: "Test out the capability of RP4 to record and saving file."
coverImage: "/assets/blog/raspberrypi4/rp4.jpeg"
date: "2024-04-04"
author:
  name: Viet M. Bui
  # picture: "/assets/blog/authors/tim.jpeg"
ogImage:
  url: "/assets/blog/raspberrypi4/rp4.jpeg"
---

```python
import pyaudio
import wave
from pydub import AudioSegment
import os

# Set parameters
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100
RECORD_SECONDS = 10
FOLDER_LOCATION = "audio/"

def countfile(directory):
    return os.listdir(directory)

count = 0
while count < 100:
    files = countfile(FOLDER_LOCATION)
    full_path = ["audio/{0}".format(x) for x in files]
    if len(files) >= 10:
        oldest = min(full_path, key=os.path.getctime)
        try:
            os.remove(os.path.abspath(oldest))
        except:
            print("File cannot be removed")

    WAVE_OUTPUT_FILENAME = FOLDER_LOCATION + "output" + str(count) + ".wav"
    MP3_OUTPUT_FILENAME = FOLDER_LOCATION + "output"+ str(count) + ".mp3"
    # Initialize PyAudio
    p = pyaudio.PyAudio()

    # Open a stream for recording
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
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
    count = count + 1
```

Since I cannot always commit all the files on raspberry pi so I just drop all of my works on this blog.

The biggest issue and concerns in remote ssh in to the pi and also have to deal with the potential of carrying the pi to a different wifi network and attempt to connect that into the network.

The script works by limiting the number of files that it write, max out at 10 files and automatically delete the oldest file in the audio folder.

What to work on from now is compress the audio wav file and api upload this to the infra str from Hung's works.
