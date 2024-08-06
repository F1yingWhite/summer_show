import os

import pyvips


def wsi2tile(path, target_path):
    img = pyvips.Image.new_from_file(path, access='sequential')
    img.dzsave(target_path)
