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

    is_active_voite = models.BooleanField(
        'Голос',
        default=False,
        help_text='Может ли он голосовать?'
    )

    image_pass = models.ImageField(
        upload_to='images/',
        blank=True,
        null=True,
        verbose_name="Паспорт"
    )

    image_stats = models.ImageField(
        upload_to='images/',
        blank=True,
        null=True,
        verbose_name='Статистика'
    )

    # using auth
    USERNAME_FIELD = 'email'

    # for createsuperuser
    REQUIRED_FIELDS = ['name']

    objects = CustomUserManager()

    def __str__(self):
        return self.name
