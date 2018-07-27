# config file for labeling job

import os

from tools.backends import FolderBackendClassification, FolderBackend
from tools.anotator_utils import Transcoder

class PrelabeledPredictor:
   def __init__(self, label_dir):
      self.label_dir=label_dir

   def predict(self, png_bytes, id):
      label_bytes = open(os.path.join(self.label_dir, id), "rb").read()
      return label_bytes


tasks = dict()

def add_task(name, backend, label_def, frontend):
  # todo: sanitize name!
  tasks[name] = {"backend": backend, "label_def": label_def, "frontend": frontend}


add_task(name="1", 
         backend=FolderBackendClassification(img_dir="/home/jan/data-ml/ml/comma/img",
                       label_dir="/home/jan/data-ml/ml/comma/labelClassify",
                       task_id="test",
                       predictor=None), 
         label_def={"labels":
                    [
                      {"shortname": "traffic_light_in_frame", "swipe_dir": "right", "value": 1},
                      {"shortname": "no_traffic_light_in_frame", "swipe_dir": "left", "value": -1},
                    ]
                  }, 
         frontend="swipe")

add_task(name="2", 
         backend=FolderBackend(img_dir="/home/jan/data-ml/ml/comma/img",
                       label_dir="/home/jan/data-ml/ml/comma/label2",
                       predictor=PrelabeledPredictor("/home/jan/data-ml/ml/comma/label")), 
         label_def={"labels":
                    [
                      {"shortname": "eraser", "color": [255,255,255]},
                      {"shortname": "sky", "color": [226, 196, 196]},
                      {"shortname": "road (drivable surfaces)", "color": [64, 32, 32]},
                      {"shortname": "road marks (lane lines, arrows)", "color": [255,0,0]},
                      {"shortname": "undrivable (trees, curbs, etc.)", "color": [204,255,0]},
                      {"shortname": "movable (cars, people, etc.)", "color": [0,255,102]},
                      {"shortname": "signs and traffic lights", "color": [0,102,255]},
                      {"shortname": "my car", "color": [204,0,255]},
                    ]
                  }, 
         frontend="coloringbook")


