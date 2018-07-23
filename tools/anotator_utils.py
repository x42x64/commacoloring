import random, os, base64

class Transcoder:
    def __init__(self):
        self.encoding_prefix = "data:image/png;base64,"

    def encode_image_bytestream(self, bs):
        return self.encoding_prefix + base64.b64encode(bs).decode("utf-8")

    def decode_image_base64(self, s):
        b64str = s.replace(self.encoding_prefix, "")
        return base64.b64decode(b64str)


