
class AppException(Exception):
  def __init__(self,message : str,status_code : int = 400):
    self.message = message
    self.status_code = status_code

class BadRequestException(AppException):
  def __init__(self, message : str = "Bad request error"):
    super().__init__(message, status_code=400)

class UnauthorizedException(AppException):
  def __init__(self, message : str = "Unauthorized access"):
    super().__init__(message, status_code = 401)

class NotFoundException(AppException):
  def __init__(self, message : str = "Value not found"):
    super().__init__(message, status_code=404)
  
class ConflictException(AppException):
  def __init__(self, message : str = "conflict occured"):
    super().__init__(message, status_code=409)
