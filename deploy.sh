#!/bin/bash

echo $1 $2

git add .

git commit -m  $1

git push origin master

# CurrentDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# echo CurrentDir


