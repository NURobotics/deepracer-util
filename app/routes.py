from app import app

@app.route('/index')
@app.route('/')
def index():
    html = "<h1>Hello World</h1>"
    return html