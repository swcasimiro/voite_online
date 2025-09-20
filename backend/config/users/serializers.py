from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser
import os
from django.core.exceptions import ValidationError


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'name', 'is_active_voite',
                  'image_pass', 'image_stats')


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


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('name', 'email')


class ImageUploadSerializer(serializers.ModelSerializer):
    image_type = serializers.ChoiceField(
        choices=[('image_pass', 'Фото паспорта'), ('image_stats', 'Статистика')],
        write_only=True
    )
    image_file = serializers.ImageField(write_only=True)  # Добавляем поле для файла

    class Meta:
        model = CustomUser
        fields = ('image_pass', 'image_stats', 'image_type', 'image_file')
        read_only_fields = ('image_pass', 'image_stats')

    def validate(self, attrs):
        image_type = attrs.get('image_type')
        image_file = attrs.get('image_file')

        if not image_file:
            raise serializers.ValidationError(
                {'image_file': f"Необходимо загрузить изображение для {image_type}"}
            )

        # Проверяем, есть ли уже изображение
        user = self.instance
        if user:
            existing_image = getattr(user, image_type)
            if existing_image:
                raise serializers.ValidationError(
                    {image_type: "Изображение уже загружено. Замена не разрешена."}
                )

        return attrs

    def update(self, instance, validated_data):
        image_type = validated_data['image_type']
        image_file = validated_data['image_file']

        # Сохраняем файл в соответствующее поле
        setattr(instance, image_type, image_file)
        instance.save()

        return instance


class CheckVerifyVoiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'name', 'is_active_voite', 'image_pass', 'image_stats')