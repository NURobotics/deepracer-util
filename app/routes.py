from app import app
from flask import render_template

@app.route('/index')
@app.route('/')
def index():
    html = render_template('index.html')
    return html
