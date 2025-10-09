from django.contrib import admin
from unfold.admin import ModelAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from .models import Candidate, StatusVote
from unfold.decorators import display


@admin.register(Candidate)
class CandidateAdmin(ModelAdmin):
    list_display = ['name', 'party', 'votes_count', 'created_at']
    list_filter = ['party', 'created_at']
    search_fields = ['name', 'party', 'description']
    readonly_fields = ['votes_count', 'created_at']

    fieldsets = (
        (None, {
            'fields': ('name', 'party', 'party_website')
        }),
        ('Дополнительно', {
            'fields': ('description', 'photo'),
            'classes': ('collapse',)
        }),
        ('Системные', {
            'fields': ('votes_count', 'created_at'),
            'classes': ('collapse',)
        })
    )

    def votes_count(self, obj):
        return obj.votes_count

    votes_count.short_description = 'Количество голосов'


@admin.register(StatusVote)
class StatusVoteAdmin(ModelAdmin):
    list_display = ["display_status", "closed_vote"]
    list_display_links = ["display_status"]

    # Разрешаем только одну запись
    def has_add_permission(self, request):
        if StatusVote.objects.count() >= 1:
            return False
        return True

    # Красивое отображение статуса
    def display_status(self, obj):
        if obj.closed_vote:
            return "🔒 Голосование закрыто"
        else:
            return "✅ Голосование открыто"

    display_status.short_description = "Статус"

    # Действия для открытия/закрытия
    actions = ["open_voting", "close_voting"]

    def open_voting(self, request, queryset):
        queryset.update(closed_vote=False)
        self.message_user(request, "Голосование открыто")

    open_voting.short_description = "Открыть голосование"

    def close_voting(self, request, queryset):
        queryset.update(closed_vote=True)
        self.message_user(request, "Голосование закрыто")

    close_voting.short_description = "Закрыть голосование"