from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from .views import LoginView, RefreshTokenView
from .views import UserViewSet


urlpatterns = [
    path('login/', LoginView.as_view(), name='token_login'), # http://127.0.0.1:8000/api/users/v1.0.0/login
    path('refresh/', RefreshTokenView.as_view(), name='token_refresh'), # http://127.0.0.1:8000/api/users/v1.0.0/refresh
    path('verify/', TokenVerifyView.as_view(), name='token_verify'), # http://127.0.0.1:8000/api/users/v1.0.0/verify

    path('me/', UserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'}),
         {'pk': 'me'}, name='user-me'), # http://127.0.0.1:8000/api/users/v1.0.0/me

    path('me/upload-image/', UserViewSet.as_view({'post': 'upload_image'}), {'pk': 'me'},
         name='user-upload-image'), # http://127.0.0.1:8000/api/users/v1.0.0/me/upload-image

    path('me/profile/', UserViewSet.as_view({'get': 'my_profile'}), {'pk': 'me'},
         name='user-profile'), # http://127.0.0.1:8000/api/users/v1.0.0/me/profile

    path('<int:pk>/', UserViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'}),
         name='user-detail'), # http://127.0.0.1:8000/api/users/v1.0.0/int:pk

    path('<int:pk>/upload-image/', UserViewSet.as_view({'post': 'upload_image'}),
         name='user-upload-image-detail'), # http://127.0.0.1:8000/api/users/v1.0.0/int:pk/upload-image
]