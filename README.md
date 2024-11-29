# Pathogen_DB

This project was made using `Python 3.12`, `Flask 3.0.0` and `8.0.36`. It is recommended that you have the same versions of the softwares installed, however, the writer of this paragraph personally believes that the code should run just fine `Python 3.8` onwards.

(If your linter shows error saying *could not import 'cred'*, don't worry; just follow the installation instructions).

Installation instructions:

1. Install `Python 3.12` and `MySQL 8.0.36` if not already installed.

2. Create a Python virtual environment (Python `3.12` recommended; minimum Python `3.8` required) in whatever directory you want.

3. Install Python modules from `requirements.txt` by executing `pip install -r requirements.txt`

4. Create a Python module (a file) named `cred.py` in this, same, root folder with your MySQL credentials *(ya i know, it's the most secure way)* as follows:

```python3=
# cred.py
mysqluser = "<your username>"   # mostly "root"
mysqlpw = "<password_for_your_username>"
```

Nice! Installed!

First time initialization:

- Ensure that your MySQL server is up and running.

- Run `table_population.py` by executing `python table_population.py` (or `py table_population.py` or whatever works).

Running the code:

- Ensure that your MySQL server is up and running.

- Run the Flask app by executing `flask run`

- Visit the webpage at `http://localhost:5000` / `http://127.0.0.1:5000` (or whatever address is shown on the terminal).
