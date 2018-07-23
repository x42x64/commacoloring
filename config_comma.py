# config file for labeling job

import os

from tools.backends import FolderBackend
from tools.anotator_utils import Transcoder

class PrelabeledPredictor:
   def __init__(self, label_dir):
      self.label_dir=label_dir

   def predict(self, png_bytes, id):
      label_bytes = open(os.path.join(self.label_dir, id), "rb").read()
      return label_bytes


backend = FolderBackend(img_dir="/media/ml/Data/ml/comma/img",
                       predictor=PrelabeledPredictor("/media/ml/Data/ml/comma/label"))

label_def = {"labels":
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
}


