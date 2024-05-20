---
title: "Deployed backend to GCP"
excerpt: "Our infrastructure has been containerized, and deployed to GCP to allow deployment of the app"
coverImage: "/assets/blog/gcp/img-gcp.png"
date: "2024-04-14"
author:
  name: Joshua Fosu-Agyemang
  # picture: "/assets/blog/authors/tim.jpeg"
ogImage:
  url: ""
---

The Docker sets up a containerized backend deployed on Google Cloud Platform (GCP).

It utilizes a Python 3.12 base image and configures the working directory to /app within the container.
Dependencies listed in requirements.txt are installed, and all files, including the application code, are copied into the container.

An environment variable OPENAI_API_KEY is set for accessing OpenAI services.

Port 8000 is exposed to enable communication with services running inside the container.
Finally, it specifies the command to start the Uvicorn server, serving the application located at infra.main:app,
listening on host 0.0.0.0 and port 8080, with automatic reloading enabled for code changes.
