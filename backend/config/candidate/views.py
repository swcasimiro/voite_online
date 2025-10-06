from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import Http404
from .models import Candidate, Vote
from .serializers import CandidateSerializer, VoteSerializer, VoteCreateSerializer


class CandidateViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для кандидатов - только чтение"""
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer

    def get_permissions(self):
        """Разрешаем доступ без авторизации только к списку и деталям"""
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class VoteViewSet(viewsets.ViewSet):
    """ViewSet для голосования"""
    permission_classes = [IsAuthenticated]

    def list(self, request):
        """Получить свой голос"""
        try:
            vote = Vote.objects.get(user=request.user)
            serializer = VoteSerializer(vote)
            return Response(serializer.data)
        except Vote.DoesNotExist:
            raise Http404("Вы еще не голосовали")

    def create(self, request):
        """Проголосовать"""
        user = request.user

        # Проверяем, не голосовал ли пользователь уже
        if Vote.objects.filter(user=user).exists():
            return Response(
                {"error": "Вы уже проголосовали"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = VoteCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Получаем объект кандидата из validated_data
            candidate = serializer.validated_data['candidate']

            # Создаем голос
            vote = Vote.objects.create(user=user, candidate=candidate)
            return Response(
                VoteSerializer(vote).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def status(self, request):
        """Проверить статус голосования"""
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
    """ViewSet для результатов голосования"""

    def get_permissions(self):
        """Разрешаем доступ без авторизации к результатам"""
        if self.action in ['list']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def list(self, request):
        """Получить результаты голосования"""
        candidates = Candidate.objects.all().order_by('-votes_count')
        serializer = CandidateSerializer(candidates, many=True)
        return Response(serializer.data)