# deepracer-util

## Setup/installation

### Step 1. Make sure you have Python3 installed

Try:

```
python -V
```

or

```
python3 -V
```

If neither work, you'll have to go install python [here](https://www.python.org/downloads/).



### Step 2. Make sure pip is installed

Try: 
```
pip -V
```

or

```
pip3 -V
```

Make sure the version of pip you're using is associated with the version of Python you're using.


### Step 3. Install dependencies

```
pip3 install flask
```


## Running the code

From the root directory, set the flask app variable:

For Windows:
```
set FLASK_APP=analytics.py
```

For Mac/Linux:
```
export FLASK_APP=analytics.py
```


Finally, run the command:
```
flask run
```

And open your browser to [http://127.0.0.1:5000/](http://127.0.0.1:5000).
