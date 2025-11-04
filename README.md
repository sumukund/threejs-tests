# ThreeJS test


## Tech Share Link

https://drive.google.com/file/d/1TmvwjbrY4xsLZlH753j2LOFPR6Drc4t0/view?usp=drive_link.

## webpages 
https://threejs-tests.onrender.com/

Fun examples: 

https://threejs-tests.onrender.com/interactive
https://threejs-tests.onrender.com/wormhole



### Housekeeping 

## What steps do I need to do when I download this repo to get it running?

\. "$HOME/.nvm/nvm.sh"
. /Users/skmukund/.local/share/virtualenvs/threejs-tests-Tv-umbKz/bin/activate

pipenv install 
pipenv shell 
flask --app server run --debug

## What commands starts the server?
gunicorn server:app