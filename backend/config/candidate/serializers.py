from rest_framework import serializers
from .models import Candidate, Vote
from users.models import CustomUser

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ['id', 'name', 'description', 'photo',
                  'party', 'party_website', 'votes_count',
                  'created_at']
        read_only_fields = ['id', 'created_at', 'votes_count']


