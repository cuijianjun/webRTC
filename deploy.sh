#!/bin/bash

echo "$1"

git add .

git commit -m  "$1"


# git push origin master

# ssh -p 22 root@124.70.208.100 "cd ~/webRTC/; git pull origin master; npm i ;pwd;cd webserver/;pwd; forever stop server.js;forever start server.js"

