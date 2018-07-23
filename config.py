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


backend = FolderBackend(img_dir="/media/ml/Data/ml/robomow/img",
                       label_dir="/media/ml/Data/ml/robomow/label",
                       predictor=None)

label_def = {"labels":
  [
    {"shortname": "unknown", "color": [255,255,255]},
    {"shortname": "sky", "color": [226, 196, 196]},
    {"shortname": "mowed", "color": [64, 32, 32]},
    {"shortname": "to mow", "color": [255,0,0]},
    {"shortname": "unmowable", "color": [204,255,0]},
  ]
}


