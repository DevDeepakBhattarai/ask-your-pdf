@echo off

REM Install dependencies for Express app (js)
cd .\js\
npm install

REM Install dependencies for Flask app (py)
cd ..\py
pip install -r requirements.txt
