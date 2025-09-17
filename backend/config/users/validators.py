# validators.py
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re


def validate_english_name(value):
    """validator check only english name"""

    if not re.match(r'^[a-zA-Z_]+$', value):
        raise ValidationError(
            _('Name must contain only English letters and underscores. Example: John_Doe'),
            code='non_english_characters'
        )


def validate_name_format(value):
    """
    Валидатор для проверки формата полного имени:
    - Должно содержать хотя бы одно нижнее подчеркивание
    - Минимум 2 части разделенные подчеркиванием
    - Каждая часть минимум 2 символа
    - Только английские буквы
    """
    # Сначала проверяем английские символы
    validate_english_name(value)

    if '_' not in value:
        raise ValidationError(
            _('Name must contain at least one underscore to separate first and last name. Example: John_Doe'),
            code='no_underscore'
        )

    parts = value.split('_')

    # Убираем пустые части (если есть двойные подчеркивания)
    parts = [part for part in parts if part]

    if len(parts) < 2:
        raise ValidationError(
            _('Name must contain first name and last name separated by underscore. Example: John_Doe'),
            code='not_enough_parts'
        )

    # Проверяем каждую часть
    for i, part in enumerate(parts):
        if not part:
            raise ValidationError(
                _('Each name part must contain characters. Example: John_Doe'),
                code='empty_part'
            )
        if len(part) < 2:
            raise ValidationError(
                _('Each name part must contain at least 2 letters. Example: Li_Wang'),
                code='part_too_short'
            )
        if not part.isalpha():
            raise ValidationError(
                _('Name parts must contain only letters. Example: John_Smith'),
                code='non_alpha_characters'
            )

    if len(value) > 50:
        raise ValidationError(
            _('Full name cannot exceed 50 characters'),
            code='name_too_long'
        )


def validate_name_not_numeric(value):
    """
    Проверяет, что имя не содержит цифр
    """
    if any(char.isdigit() for char in value):
        raise ValidationError(
            _('Name must not contain digits. Example: John_Doe'),
            code='contains_digits'
        )


def validate_name_no_special_chars(value):
    """
    Проверяет, что имя не содержит специальных символов кроме подчеркивания
    """
    if re.search(r'[^a-zA-Z_]', value):
        raise ValidationError(
            _('Name must contain only English letters and underscores. Example: John_Doe'),
            code='special_characters'
        )


def validate_name_starts_with_letter(value):
    """
    Проверяет, что имя начинается с буквы
    """
    if not value[0].isalpha():
        raise ValidationError(
            _('Name must start with a letter. Example: John_Doe'),
            code='starts_with_non_letter'
        )


def validate_name_ends_with_letter(value):
    """
    Проверяет, что имя заканчивается буквой
    """
    if not value[-1].isalpha():
        raise ValidationError(
            _('Name must end with a letter. Example: John_Doe'),
            code='ends_with_non_letter'
        )