from django.contrib import admin
from unfold.admin import ModelAdmin
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm
from .models import Candidate, Vote


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