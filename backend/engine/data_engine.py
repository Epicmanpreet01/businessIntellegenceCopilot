import pandas as pd
from dateutil.parser import parse

from core.exceptions import BadRequestException, NotFoundException

class Preprocessor:
  def __init__(self, key_map = None, weights=None):
    if not key_map and weights:
      raise BadRequestException('Weights can not be set without key_map')
    self.key_map = key_map or {}
    self.weights = weights or {}
    self.agg_map = {
      "revenue": "sum",
      "sales": "sum",
      "profit": "sum",
      "cost": "sum",
      "amount": "sum",
      "quantity": "sum",

      "price": "mean",
      "discount": "mean",
      "rate": "mean"
    }
  
  def _normalize_col_name(self,col_name:str):
    return "".join(filter(str.isalpha, col_name)).lower()

  def _detect_aggregation(self, col_name: str):
    col_name = col_name.lower()

    matches = [
      (key, agg)
      for key, agg in self.agg_map.items()
      if key in col_name
    ]

    if not matches:
      return "sum"
    
    matches.sort(key=lambda x: len(x[0]), reverse=True)

    return matches[0][1]

  def _fuzzy_matching(self,feature_name, desired_features):
    if any(key in feature_name for key in desired_features):
      return True
    return False

  def _is_date(self,string, fuzzy=False):
    try:
      dt = parse(str(string), fuzzy=fuzzy)
      return 1900 <= dt.year <= 2100
    except:
      return False

  def _extract_columns(self,data: pd.DataFrame, desired_features):
    if desired_features is None:
      return data
    cols_to_keep = [col for col in data.columns if self._fuzzy_matching(col, desired_features)]
    return data[cols_to_keep]
  
  def _extract_date_column(
    self,
    df: pd.DataFrame,
    desired_keys=None,
    threshold=0.6,
    min_non_null=5
  ):
    if df.empty:
      return None
    
    scores = {}
    
    for col in df.columns:
      series = df[col].dropna()

      if pd.api.types.is_numeric_dtype(series):
        continue

      if len(series) < min_non_null:
        continue

      valid_count = series.apply(self._is_date).sum()
      score = valid_count / len(series)

      if desired_keys:
        if any(key.lower() in col.lower() for key in desired_keys):
          score += 0.2  

      scores[col] = score

    if not scores:
      return None

    best_col = max(scores, key=scores.get)
    best_score = scores[best_col]

    if best_score < threshold:
      return None

    try:
      return pd.to_datetime(df[best_col], errors="coerce")
    except Exception:
      return None
  
  def _extract_target_column(
    self,
    data: pd.DataFrame,
    desired_keys=None,
    desired_weights=None,
    threshold=0.5,
    min_non_null=5
  ):
    if data.empty:
      return None

    scores = {}

    for col in data.columns:
      series = data[col].dropna()

      if not pd.api.types.is_numeric_dtype(series):
        continue

      if len(series) < min_non_null:
        continue

      score = 0
      
      completeness = len(series) / len(data)
      score += completeness * 0.4

      if series.nunique() > 1:
        score += 0.2

      if series.nunique() == 1:
        score -= 0.3

      non_zero_ratio = (series != 0).mean()
      score += non_zero_ratio * 0.2

      if desired_keys:
        best_weight = max(
          [
            desired_weights.get(k, 0.5)
            for k in desired_keys
            if k in col.lower()
          ],
          default=0
        )

        score += 0.3 * best_weight

      scores[col] = score

    if not scores:
      return None

    best_col = max(scores, key=scores.get)

    if scores[best_col] < threshold:
      return None

    return data[best_col]

  def _finalize_for_prophet(self, df: pd.DataFrame, target_col_name: str):
    df = df.dropna(subset=["ds", "y"])
    
    df["ds"] = pd.to_datetime(df["ds"], errors="coerce")
    df["y"] = pd.to_numeric(df["y"], errors="coerce")

    df = df.dropna(subset=["ds", "y"])

    agg_func = self._detect_aggregation(target_col_name)
    df = df.groupby("ds", as_index=False)["y"].agg(agg_func)
    
    df = df.sort_values("ds")
    return df

  def _clip_outliers(self, df):
    q_low = df["y"].quantile(0.01)
    q_high = df["y"].quantile(0.99)

    df["y"] = df["y"].clip(q_low, q_high)
    return df 

  def preprocess(self,data : pd.DataFrame, thresh = 0.6,min_non_null=5):
    if data.empty:
      raise NotFoundException("Empty dataframe error")
    
    data.columns = [self._normalize_col_name(col_name) for col_name in data.columns]
    data = self._extract_columns(data, self.key_map.get('all'))
    ds = self._extract_date_column(data, self.key_map.get('ds'), thresh, min_non_null)
    y = self._extract_target_column(data, self.key_map.get('y'), self.weights, thresh, min_non_null)
    
    if ds is None:
      raise ValueError("No valid date column found")

    if y is None:
      raise ValueError("No valid target column found")
    
    target_col_name = y.name
    result = pd.DataFrame({'ds': ds, 'y': y})
    
    result = self._finalize_for_prophet(result, target_col_name)
    result = self._clip_outliers(result)
    
    if result.empty:
      return None
    
    if result["y"].nunique() <= 1:
      return None

    return result
    