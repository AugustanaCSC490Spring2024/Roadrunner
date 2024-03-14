---
title: "Audio to text function for backend processing"
excerpt: "Testing the audio to text function proven to work fine for the project. There will be some concern on the run time for the processing."
coverImage: "/assets/blog/audio-to-text/image.png"
date: "2024-03-14"
author:
  name: Viet M. Bui
  # picture: "/assets/blog/authors/tim.jpeg"
ogImage:
  url: "/assets/blog/audio-to-text/image.png"
---

The newly simplified function to process audio to text has been refined and tested. 

There were some issue that I ran into but it was the issue with the MacOS. Simple fix by running `brew install ffmpeg` 

The audio test file was an English podcast record audio that I found randomly online. It is only around 8 mins but took the function test.py inside the infra/audiototext a while to run. 
Noted that the Whisper AI package that I used was a "small.en" one. 

We have to figure out how to speed up the processing time when the audio file is much longer than 8 mins. Maybe a pre-processing inside the Raspberry PI 4?

