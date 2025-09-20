from django.db import models
from users.models import CustomUser
from django.core.validators import URLValidator


class Candidate(models.Model):
    """Models for candidates.
    URL frontend - /candidate"""
    name = models.CharField(
        'Имя кандидата',
        max_length=100
    )
    description = models.TextField(
        'Описание кандидата',
        blank=True
    )
    photo = models.ImageField(
        'Фото кандидата',
        upload_to='candidates/',
        blank=True,
        null=True
    )
    party = models.CharField(
        'Партия',
        max_length=100
    )
    party_website = models.URLField(
        'Сайт партии',
        blank=True,
        validators=[URLValidator()], # Validator urls
        help_text='Ссылка на официальный сайт партии'
    )
    created_at = models.DateTimeField(
        'Дата создания',
        auto_now_add=True
    )

    class Meta:
        verbose_name = 'Кандидат'
        verbose_name_plural = 'Кандидаты'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.party})"

    # count vote for candidate
    @property
    def votes_count(self):
        return self.votes.count()


class Vote(models.Model):
    """ model for vote.
    user-candidate relationship
    """
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        verbose_name='Пользователь',
        related_name='vote'
    )

    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.CASCADE,
        verbose_name='Кандидат',
        related_name='votes'
    )

    voted_at = models.DateTimeField(
        'Время голосования',
        auto_now_add=True
    )

    class Meta:
        verbose_name = 'Голос'
        verbose_name_plural = 'Голоса'
        ordering = ['-voted_at']
        constraints = [
            models.UniqueConstraint(fields=['user'],  # 1 vote user for candidate.
                                    name='unique_user_vote'
                                    )
        ]

    def __str__(self):
        return f'{self.user.name} - {self.candidate.name}'