from functools import wraps

import torch


def no_grad(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        with torch.no_grad():
            return func(*args, **kwargs)

    return wrapper
