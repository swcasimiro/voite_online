from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import Http404
from .models import Candidate, Vote, StatusVote
from .serializers import (CandidateSerializer, VoteSerializer,
                          VoteCreateSerializer, VoteStatusSerializer, CandidateResultSerializer)


class CandidateViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet no jwt"""
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer

    def get_permissions(self):
        """check permissions"""
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]



class CandidateResultViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet no jwt"""
    queryset = Candidate.objects.all()
    serializer_class = CandidateResultSerializer
    permission_classes = [AllowAny]


class VoteViewSet(viewsets.ViewSet):
    """ViewSet FOr vote"""
    permission_classes = [IsAuthenticated]

    def list(self, request):
        try:
            vote = Vote.objects.get(user=request.user)
            serializer = VoteSerializer(vote)
            return Response(serializer.data)
        except Vote.DoesNotExist:
            raise Http404("Вы еще не голосовали")

    def create(self, request):
        """vote POST"""
        user = request.user

        # valid check vote or dont user
        if Vote.objects.filter(user=user).exists():
            return Response(
                {"error": "Вы уже проголосовали"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = VoteCreateSerializer(data=request.data)
        if serializer.is_valid():
            # get object candidate
            candidate = serializer.validated_data['candidate']

            # make vote
            vote = Vote.objects.create(user=user, candidate=candidate)
            return Response(
                VoteSerializer(vote).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def status(self, request):
        """check status vote"""
        has_voted = Vote.objects.filter(user=request.user).exists()

        if has_voted:
            vote = Vote.objects.get(user=request.user)
            return Response({
                'has_voted': True,
                'candidate_id': vote.candidate.id,
                'candidate_name': vote.candidate.name,
                'voted_at': vote.voted_at
            })
        else:
            return Response({
                'has_voted': False
            })


class ResultsViewSet(viewsets.ViewSet):
    """dont work endpoint - fix logic need"""

    def get_permissions(self):
        if self.action in ['list']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def list(self, request):
        candidates = Candidate.objects.all().order_by('-votes_count')
        serializer = CandidateSerializer(candidates, many=True)
        return Response(serializer.data)


class VoteStatusViewSet(viewsets.ReadOnlyModelViewSet):
    """Status vote"""
    queryset = StatusVote.objects.all()
    serializer_class = VoteStatusSerializer
    permission_classes = [AllowAny]