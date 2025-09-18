# admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django import forms
from unfold.admin import ModelAdmin
from .models import CustomUser
from unfold.widgets import AdminTextInputWidget


class CustomUserForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = '__all__'
        widgets = {
            'name': AdminTextInputWidget(attrs={  # меняйте название здесь тоже
                'placeholder': 'Введите Имя и Фамилию через пробел'
            }),
            'email': AdminTextInputWidget(attrs={  # меняйте название здесь тоже
                'type': 'email',
                'placeholder': 'example@mail.com'
            }),
        }


@admin.register(CustomUser)
class CustomUserAdmin(ModelAdmin, UserAdmin):
    form = CustomUserForm
    list_display = ['email', 'name', 'is_staff', 'is_active']
    list_filter = ['is_staff', 'is_active', 'date_joined']
    search_fields = ['email', 'name']
    ordering = ['email']

    fieldsets = (
        (None, {
            'fields': ('email', 'password')
        }),
        ('Персональная информация', {
            'fields': ('name',)
        }),
        ('Права доступа', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Важные даты', {
            'fields': ('last_login', 'date_joined')
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )
