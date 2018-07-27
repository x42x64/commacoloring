#!/usr/bin/env python
from flask import Flask, request, send_from_directory, Response
import random, os, base64, json

from config import tasks





# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')

@app.route('/<task>/js/<path:path>')
def send_js(task, path):
  frontend = tasks[task]["frontend"]
  return send_from_directory('frontends/' + frontend + '/js', path)

@app.route('/<task>/img/<path:path>')
def send_img(task, path):
  frontend = tasks[task]["frontend"]
  return send_from_directory('frontends/' + frontend + '/img', path)

@app.route('/<task>/css/<path:path>')
def send_css(task, path):
  frontend = tasks[task]["frontend"]
  return send_from_directory('frontends/' + frontend + '/css', path)

@app.route('/<task>/sample')
def sample(task):
  be = tasks[task]["backend"]
  name, data = be.get_encoded_image_random()
  ret = {"name": name, "data": data}
  return Response(json.dumps(ret))

@app.route('/<task>/suggestion/<name>')
def suggestion(task, name):
  be = tasks[task]["backend"]
  data = be.get_encoded_label(name)
  ret = {"data": data}
  return Response(json.dumps(ret))

@app.route('/<task>/submit', methods=["POST"])
def submit(task):
  be = tasks[task]["backend"]
  data = request.form['data']
  print (request.form['name'])
  be.set_label(request.form['name'], request.form['data'], request.form['track'], request.form['gid'])
  return "thanks"

@app.route('/<task>/labels/description')
def label_desc(task):
  label_definition = tasks[task]["label_def"]
  labels = {
    "labels": [l["shortname"] for l in label_definition["labels"]]
  }
  return Response(json.dumps(labels))

@app.route('/<task>/labels/color')
def label_color(task):
  label_definition = tasks[task]["label_def"]
  colors = {
    "colors": [l["color"] for l in label_definition["labels"]]
  }
  return Response(json.dumps(colors))
  
@app.route('/<task>/labels')
def label_all(task):
  label_definition = tasks[task]["label_def"]
  return Response(json.dumps(label_definition))

@app.route('/<task>/')
def task_root(task):
  frontend = tasks[task]["frontend"]
  return send_from_directory('frontends/' + frontend + '/', 'index.html')

@app.route('/')
def root():
  return send_from_directory('', 'index.html')

@app.route('/favicon.ico')
def favicon():
  return send_from_directory('', 'favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == "__main__":
  app.run(debug=True)

