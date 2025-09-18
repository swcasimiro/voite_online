from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'name')


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(email=email, password=password)

            if not user:
                raise serializers.ValidationError('Неверные учетные данные')

            if not user.is_active:
                raise serializers.ValidationError('Аккаунт отключен')

            data['user'] = user
            return data
        else:
            raise serializers.ValidationError('Email и пароль обязательны')