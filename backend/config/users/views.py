from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.permissions import AllowAny
from .serializers import LoginSerializer, CustomUserSerializer
from .models import CustomUser
from .serializers import (UserUpdateSerializer, ImageUploadSerializer,
                          CheckVerifyVoiteSerializer)

from rest_framework.decorators import action
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response

class LoginView(APIView):
    """auth ViewSets"""
    permission_classes = [AllowAny]

    def post(self, request):
        """create JWT-token"""
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        user_data = CustomUserSerializer(user).data

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_data
        }, status=status.HTTP_200_OK)


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response(
                {'error': 'Refresh token обязателен'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            return Response({
                'access': access_token
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': 'Неверный refresh token'},
                status=status.HTTP_400_BAD_REQUEST
            )


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с пользователями
    """
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'update' or self.action == 'partial_update':
            return UserUpdateSerializer
        elif self.action == 'upload_image':
            return ImageUploadSerializer
        return CheckVerifyVoiteSerializer

    def get_object(self):
        # Пользователь может работать только со своим профилем
        if self.kwargs.get('pk') == 'me':
            return self.request.user
        return super().get_object()

    def list(self, request):
        # Запрещаем список всех пользователей
        return Response(
            {"detail": "Метод не разрешен."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def retrieve(self, request, pk=None):
        # Разрешаем получать только свой профиль
        if pk != 'me' and int(pk) != request.user.id:
            return Response(
                {"detail": "Нет прав для просмотра этого профиля."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().retrieve(request, pk)

    def update(self, request, pk=None):
        # Разрешаем обновлять только свой профиль
        if pk != 'me' and int(pk) != request.user.id:
            return Response(
                {"detail": "Нет прав для изменения этого профиля."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, pk)

    @action(detail=True, methods=['post'], url_path='upload-image')
    def upload_image(self, request, pk=None):
        """
        Загрузка изображения (паспорта или статистики)
        """
        user = self.get_object()

        # Проверяем, что пользователь работает со своим профилем
        if user != request.user:
            return Response(
                {"detail": "Нет прав для загрузки изображений для этого пользователя."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ImageUploadSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Изображение успешно загружено",
                    "user": CheckVerifyVoiteSerializer(user).data
                },
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], url_path='my-profile')
    def my_profile(self, request, pk=None):
        """
        Получение профиля текущего пользователя
        """
        user = request.user
        serializer = CheckVerifyVoiteSerializer(user)
        return Response(serializer.data)
