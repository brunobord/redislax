# Redislax - Relax with Redis support

A new strange experiment. Clutter-less markdown-enabled text editor, able to save files on a Redis database.

## Requirements

* Access to a Redis database,
* Ability to run a Python WSGI server for the Flask app,

### Install the Python packages

Inside a virtualenv (preferrably):

```
pip install -r requirements.txt
```

### Configuration

By default, the application will try to connect on the following database.

```python
REDIS_HOST = 'localhost'
REDIS_PORT = 6379
REDIS_DB = 0
```

To override this default values, create a ``local_settings.py`` file and change these parameters to fit your needs.


## Run

Run the following command:

```
python app.py
```

and go to the following URL with your browser: ``http://localhost:5000/``.

### Serve to the world

If you want to expose this application on the network, you'll have to set your configuration as follows:

```python
HOST = '0.0.0.0'
PORT = 8080
```

To run the application with this setup, you'll have to do it as root:

```
sudo /home/user/.virtualenvs/MYVIRTUALENV/bin/python app.py
```

## Screen capture

![Screen capture](doc/redislax.png)

## License

This code is published under the terms of the [WTFPL](http://www.wtfpl.net/).
