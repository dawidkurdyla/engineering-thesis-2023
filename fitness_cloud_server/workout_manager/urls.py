from rest_framework_nested import routers
from django.urls import path, include

from . import views


router = routers.DefaultRouter()
router.register('client', views.ClientViewSet, basename='client')
router.register('coach', views.CoachViewSet, basename='coach')
router.register('coach-client', views.CoachClientViewSet, basename='coach-client')
router.register('messages', views.MessageViewSet, basename='message')



router.register('trainings', views.TrainingViewSet, basename='training')
training_router = routers.NestedDefaultRouter(router, 'trainings', lookup='training')
training_router.register('exercises', views.ExerciseViewSet, basename='training-exercises')

training_router.register(
    'comments', views.TrainingCommentViewSet, basename='training-comment')

training_comments_router = routers.NestedDefaultRouter(training_router, 'comments', lookup='comment')
training_comments_router.register('files', views.CommentFileViewSet, basename='comment-files')

urlpatterns = router.urls + training_router.urls + training_comments_router.urls

