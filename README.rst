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

ajv.min.js
----------

To get this file::

    git clone epoberezkin/ajv
    cd ajv
    npm install
    npm bundle run

and inside the ``dist/`` folder is the output you need

yaml.min.js
-----------

To get this file, I just did::

    wget https://raw.githubusercontent.com/jeremyfa/yaml.js/develop/dist/yaml.min.js -O public/js/yaml.min.js

ace and custom worker
---------------------

The following steps should be sufficient for making ``ace``::

    git clone ajaxorg/ace
    cd ace
    npm install
    node Makefile.dryice.js

Now, in order to actually build the files we need - things get a LITTLE tricky. First, we have the ``ajv.min.js`` and ``yaml.min.js`` files from above. These are going to be in ``public/js/``. If you also look in there, we provide a folder ``public/js/ace/lib/ace/mode/`` which contains two files:

- `captionatoryaml.js <public/js/ace/lib/ace/mode/captionatoryaml.js>`_ -- custom mode which enables custom worker
- `captionatoryaml_worker.js <public/js/ace/lib/mode/captionatoryaml_worker.js>`_  -- custom worker enabled by the above custom mode

These need to be copied over to the ``ace/lib/ace/mode`` folder. When they're copied over, the ``Makefile.dryice.js`` will automatically pick these up and compile it for us. So when we rerun::

    node Makefile.dryice.js

again, this will produce two new files that we get to copy into `ace-build/ <public/js/ace-build/>`_ as well. Since I'm also using the ``twilight`` theme, `ace-build/ <public/js/ace-build/>`_ will contain the following files at a minimum

- `ace.js <public/js/ace-build/ace.js>`_
- `theme-twilight.js <public/js/ace-build/theme-twilight.js>`_
- `mode-captionatoryaml <public/js/ace-build/mode-captionatoryaml.js>`_
- `worker-captionatoryaml <public/js/ace-build/worker-captionatoryaml.js>`_

and that should be all we need. Lastly, of special note is the worker file above. It has the following ``importScripts`` line::

    importScripts('/js/ajv.min.js', '/js/yaml.min.js');

at the very top (or near it). These are the minimized files I had mentioned above and will be loaded into the Web Worker so that the JSON Schema Validator and YAML parser are available to us. Please make sure these are similarly accessible. The above line is roughly equivalent to doing::

    <script type="text/javascript" src="/js/ajv.min.js"></script>
    <script type="text/javascript" src="/js/yaml.min.js"></script>

in a normal HTML file. This is how we load custom libraries into the Web Worker correctly. The following web resources were indubitably helpful in figuring out how to do this:

- https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode
- https://ace.c9.io/#nav=higlighter
- https://github.com/ajaxorg/ace/issues/895#issuecomment-20208600
- https://github.com/ajaxorg/ace/blob/master/lib/ace/mode/yaml.js
- https://github.com/ajaxorg/ace/blob/master/lib/ace/mode/javascript.js
- https://github.com/ajaxorg/ace/blob/master/lib/ace/mode/javascript_worker.js
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Importing_scripts_and_libraries
- http://stackoverflow.com/questions/16310091/importscripts-web-workers
- http://stackoverflow.com/questions/30974520/how-to-integrate-syntax-check-in-ace-editor-using-custom-mode
