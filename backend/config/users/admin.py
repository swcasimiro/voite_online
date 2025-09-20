from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from unfold.admin import ModelAdmin
from unfold.contrib.forms.widgets import WysiwygWidget
from django import forms
from .models import CustomUser


class CustomUserForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = '__all__'
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'Введите имя и фамилию'}),
        }


@admin.register(CustomUser)
class CustomUserAdmin(ModelAdmin, UserAdmin):
    form = CustomUserForm
    list_display = ['email', 'name', 'is_active_voite', 'is_active', 'date_joined']
    list_filter = ['is_active_voite', 'is_active', 'is_staff', 'date_joined']
    search_fields = ['email', 'name']
    ordering = ['-date_joined']

    # Поля для отображения в форме
    fieldsets = (
        (None, {
            'fields': ('email', 'password')
        }),
        ('Персональная информация', {
            'fields': ('name',)
        }),
        ('Статусы', {
            'fields': ('is_active_voite', 'is_active', 'is_staff', 'is_superuser')
        }),
        ('Документы', {
            'fields': ('image_pass', 'image_stats'),
            'classes': ('collapse',)
        }),
        ('Важные даты', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
        ('Права доступа', {
            'fields': ('groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
    )

    # Поля только для чтения
    readonly_fields = ['last_login', 'date_joined']

    # Поля при создании пользователя
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'is_active_voite'),
        }),
    )

    # Дополнительные настройки unfold
    prepopulated_fields = {}
    filter_horizontal = ['groups', 'user_permissions']

    # Иконки для действий
    actions = ['activate_voite', 'deactivate_voite']

    def activate_voite(self, request, queryset):
        queryset.update(is_active_voite=True)

    activate_voite.short_description = "Активировать право голоса"

    def deactivate_voite(self, request, queryset):
        queryset.update(is_active_voite=False)

    deactivate_voite.short_description = "Деактивировать право голоса"