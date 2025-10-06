from rest_framework import serializers
from .models import Candidate, Vote


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ['id', 'name', 'description', 'photo', 'party',
                  'party_website']
        read_only_fields = ['id']


class VoteSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)

    class Meta:
        model = Vote
        fields = ['id', 'candidate', 'candidate_name', 'voted_at']
        read_only_fields = ['id', 'candidate_name', 'voted_at']


class VoteCreateSerializer(serializers.ModelSerializer):
    candidate = serializers.PrimaryKeyRelatedField(queryset=Candidate.objects.all())

    class Meta:
        model = Vote
        fields = ['candidate']