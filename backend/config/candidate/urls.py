from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# http://127.0.0.1:8000/api/candidate/v1.0.0/candidates/ - список всех кандидатов
# http://127.0.0.1:8000/api/candidate/v1.0.0/candidates/{id}/ - список отдельного кандидата
router.register(r'candidates', views.CandidateViewSet, basename='candidate')

# http://127.0.0.1:8000/api/candidate/v1.0.0/vote/ - голос, и проголосовать [GET, POST]
router.register(r'vote', views.VoteViewSet, basename='vote')

# http://127.0.0.1:8000/api/candidate/v1.0.0/results/ - голос
router.register(r'results', views.ResultsViewSet, basename='results')

# http://127.0.0.1:8000/api/candidate/v1.0.0/status-vote/
router.register(r'status-vote', views.VoteStatusViewSet, basename='status-vote')

# http://127.0.0.1:8000/api/candidate/v1.0.0/candidate-status/
router.register(r'candidate-status', views.CandidateResultViewSet, basename='candidate-status')

urlpatterns = [
    path('', include(router.urls)),
]