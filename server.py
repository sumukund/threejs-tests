from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
@app.route('/<name>')
def hello(name=None):
    return render_template('hello.html', name=name)

@app.route('/main.js')
def main_js():
    return send_from_directory(os.path.join(app.root_path, 'templates'), 'main.js')
