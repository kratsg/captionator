Captionator
===========

Uses Node because I should learn to use Node for a small project, like this.

Getting Started
---------------

To get started, I installed ``nvm``::

    brew install nvm

and then install Node and npm simultaneously::

    nvm install v5.5.0

In future logins, I can ``cd`` into the directory and run::

    nvm use v5.5.0

to get Node and npm in my environment.

Running
-------

Simply run::

    npm start

and we are good to go. We will probably incorporate forever::

    npm install -g forever

and then run::

    forever start --minUptime 1000 --spinSleepTime 1000 ./bin/www

ajv
---

To get this file::

    git clone epoberezkin/ajv
    cd ajv
    npm install
    npm bundle run

and inside the ``dist/`` folder is the output you need

yaml
----

To get this file, I just did::

    wget https://raw.githubusercontent.com/jeremyfa/yaml.js/develop/dist/yaml.min.js -O public/js/yaml.min.js
