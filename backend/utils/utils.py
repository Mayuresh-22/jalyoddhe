from random import choices

def rand_str(len:int):
    return "".join(choices("abcdefghijklmnopqrstuvwxyz0123456789", k=len))