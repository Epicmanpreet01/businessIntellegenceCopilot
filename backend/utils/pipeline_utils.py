
def get_default_period(freq : str):
  if freq == 'D':
    return 365
  elif freq == 'W':
    return 52
  elif freq == 'M':
    return 12
  else:
    return 365