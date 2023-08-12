@echo off

echo Installing JS dependencies...
cd .\js
start npm install
echo JS dependencies installation complete.


REM to install python dependencies
cd ..
cd .\py\
start pip install -r requirements.txt
echo Done
