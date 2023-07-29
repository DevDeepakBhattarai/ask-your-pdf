@echo off

rem Change directory to the js folder and execute the npm run start command
cd .\js\
start npm run start

rem Change directory to the py folder and execute the python index.py command
cd ..
start python -u "g:\Coding\chatgpt-pdf-reader\py\index.py"
