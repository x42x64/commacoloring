import random, os, base64, glob
from .anotator_utils import Transcoder

class Backend:
    def __init__(self, predictor=None):
        self.encoding_prefix = "data:image/png;base64,"
        self.predictor = predictor

    def get_encoded_image_random(self):
        error("get_encoded_image_random not implemented!")

    def get_image(self, id):
        error("get_image not implemented")
  
    def set_label(self, name, data, session, user):
        error("set_label not implemented!")

    def get_encoded_label(self, id):
        if self.predictor:
            png_bytes = self.get_image(id)
            label = self.predictor.predict(png_bytes, id)
            return Transcoder().encode_image_bytestream(label)
        else:
            return ""


class FolderBackend(Backend):
    def __init__(self, img_dir, label_dir, predictor=None):
        Backend.__init__(self, predictor)
        self.img_dir = img_dir
        self.label_dir = label_dir

    def get_encoded_image_random(self):
        all_img = [f for f in os.listdir(os.path.abspath(self.img_dir)) if os.path.isfile(os.path.join(self.img_dir, f))]
        all_labels = [os.path.basename(f) for f in glob.glob(os.path.join(self.label_dir, "*", "*", "*.png")) if os.path.isfile(f)]
        fn = random.choice(list(set(all_img) ^ set(all_labels)))
        png_bytes = self.get_image(fn)
        return fn, Transcoder().encode_image_bytestream(png_bytes)

    def get_image(self, id):
        return open(os.path.join(self.img_dir, id), "rb").read()
  
    def set_label(self, name, data, session, user):
        filepath = os.path.join(self.label_dir, user, session)
        try:
            os.makedirs(filepath)
        except OSError:
            pass
    
        png_bytes = Transcoder().decode_image_base64(data)
        with open(os.path.join(filepath, name), 'wb') as f:
            f.write(png_bytes)

        
    
