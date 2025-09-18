from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from .views import LoginView, RefreshTokenView

urlpatterns = [
    path('login/', LoginView.as_view(), name='token_login'), # http://127.0.0.1:8000/api/users/v1.0.0/login
    path('refresh/', RefreshTokenView.as_view(), name='token_refresh'), # http://127.0.0.1:8000/api/users/v1.0.0/refresh
    path('verify/', TokenVerifyView.as_view(), name='token_verify'), # http://127.0.0.1:8000/api/users/v1.0.0/verify
]