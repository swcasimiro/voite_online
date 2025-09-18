from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager
from .validators import (validate_name_format,
                         validate_name_not_numeric,
                         validate_name_no_special_chars)


class CustomUserManager(BaseUserManager):
    """Менеджер для валидации email"""
    def create_user(self, email, password=None, **extra_fields):
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    # username = none. using email
    username = None

    email = models.EmailField(
        unique=True,
    )

    name = models.CharField(
        'Имя Фамилия пользователя',
        max_length=50,
        validators=[
            validate_name_format,
            validate_name_not_numeric,
            validate_name_no_special_chars
        ],
    )

    #auth = models.BooleanField(
    #    'Подтвержден',
    #    default=False,
    #    help_text='Если аккаунт подтвержден, то может голосовать.'
    #)

    #image_pass = models.ImageField(
    #    'Паспорт',
    #    upload_to='images/',
    #    help_text='Фотография паспорта'
    #)

    #image_stats = models.ImageField(
    #    'Статистика',
    #    upload_to='images/',
    #    help_text='Фотография статистики'
    #)

    # using auth
    USERNAME_FIELD = 'email'

    # for createsuperuser
    REQUIRED_FIELDS = ['name']

    objects = CustomUserManager()

    def __str__(self):
        return self.name
