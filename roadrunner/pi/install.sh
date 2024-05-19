#!/bin/bash
cd ~
sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt-get -y install cmake
sudo apt install --upgrade python3-setuptools
sudo apt-get install libasound2-dev
sudo apt-get install libcurl4-openssl-dev

sudo apt install python3.11-venv
python -m venv env --system-site-packages

source env/bin/activate

# Setup Blinka
sudo pip3 install --upgrade adafruit-python-shell
wget https://raw.githubusercontent.com/adafruit/Raspberry-Pi-Installer-Scripts/master/raspi-blinka.py
sudo python3 raspi-blinka.py

# Setup adafruit dotstar
pip3 install --upgrade adafruit-circuitpython-dotstar adafruit-circuitpython-motor adafruit-circuitpython-bmp280

# Essential stuff for record.py
pip3 install pyaudio numpy requests

echo "Setup complete!"
