#!/usr/bin/env python
from flask import Flask, request, send_from_directory, Response
import random, os, base64, json

from config import backend, label_def



# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')

@app.route('/js/<path:path>')
def send_js(path):
  return send_from_directory('js', path)

@app.route('/img/<path:path>')
def send_img(path):
  return send_from_directory('img', path)

@app.route('/css/<path:path>')
def send_css(path):
  return send_from_directory('css', path)

@app.route('/sample')
def sample():
  name, data = backend.get_encoded_image_random()
  ret = {"name": name, "data": data}
  print(name)
  return Response(json.dumps(ret))

@app.route('/suggestion/<name>')
def suggestion(name):
  data = backend.get_encoded_label(name)
  ret = {"data": data}
  return Response(json.dumps(ret))

@app.route('/submit', methods=["POST"])
def submit():
  data = request.form['data']
  print (request.form['name'])
  backend.set_label(request.form['name'], request.form['data'], request.form['track'], request.form['gid'])
  return "thanks"

@app.route('/labels/description')
def label_desc():
  labels = {
    "labels": [l["shortname"] for l in label_def["labels"]]
  }
  return Response(json.dumps(labels))

@app.route('/labels/color')
def label_color():
  colors = {
    "colors": [l["color"] for l in label_def["labels"]]
  }
  return Response(json.dumps(colors))

@app.route('/')
def root():
  return send_from_directory('', 'index.html')

@app.route('/favicon.ico')
def favicon():
  return send_from_directory('', 'favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == "__main__":
  app.run(debug=True)

