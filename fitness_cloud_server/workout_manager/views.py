from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework import status
from django.db.models import Q, Count
from django.http import Http404

from .models import Client, Coach, Exercise, Training, CoachClient, TrainingComment, Message, CommentFile
from .serializers import (ClientSerializer, CoachSerializer, ExerciseSerializer,
                          TrainingSerializer, CreateTrainingSerializer, SimpleCoachClientSerializer,
                          TrainingCommentSerializer, MessageSerializer, CommentFileSerializer)

from .permissions import IsAdminOrReadOnly


class ClientViewSet(ModelViewSet):
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Client.objects.prefetch_related().all()
        coach_id = self.request.query_params.get('coach_id')
        search_value = self.request.query_params.get('search_value')

        if coach_id is not None:
           queryset = queryset.filter(_coaches__coach__id=coach_id)

        if search_value is not None:
           queryset = queryset.filter(
            Q(user__username__istartswith=search_value) |
            Q(user__first_name__istartswith=search_value) |
            Q(user__last_name__istartswith=search_value)
           )
        
        return queryset

    @action(detail=False, methods=['GET', 'PUT'])
    def me(self, request):
        (client, created) = Client.objects.get_or_create(user_id=self.request.user.id)
        
        if request.method == 'GET':
            serializer = ClientSerializer(client)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = ClientSerializer(client, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)


class CoachViewSet(ModelViewSet):
    serializer_class = CoachSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Coach.objects.prefetch_related().all()
        client_id = self.request.query_params.get('client_id')
        search_value = self.request.query_params.get('search_value')

        if client_id is not None:
           queryset = queryset.filter(_clients__client__id=client_id)
        
        if search_value is not None:
           queryset = queryset.filter(
               Q(user__username__istartswith=search_value) |
               Q(user__first_name__istartswith=search_value) |
               Q(user__last_name__istartswith=search_value)
           )

        return queryset

    @action(detail=False, methods=['GET', 'PUT'])
    def me(self, request):
        (coach, created) = Coach.objects.get_or_create(
            user_id=self.request.user.id)

        if request.method == 'GET':
            serializer = CoachSerializer(coach)
            return Response(serializer.data)
        elif request.method == 'PUT':
            serializer = CoachSerializer(coach, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)


class CoachClientViewSet(ModelViewSet):
    # queryset = CoachClient.objects.all()
    serializer_class = SimpleCoachClientSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        client_id = self.request.query_params.get('client_id')
        coach_id = self.request.query_params.get('coach_id')
        try:
            if client_id is not None and coach_id is not None:
                return CoachClient.objects.get(coach__id=coach_id, client__id=client_id)
            else:
                return CoachClient.objects.get(pk=pk)
        except CoachClient.DoesNotExist:
            raise Http404

    def get_queryset(self):
        queryset = CoachClient.objects.prefetch_related().all()
        client_id = self.request.query_params.get('client_id')
        coach_id = self.request.query_params.get('coach_id')

        if client_id is not None and coach_id is not None:
            queryset = queryset.filter(
                Q(coach__id=coach_id) & Q(client__id=client_id)
            )

        return queryset

    def delete(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class TrainingViewSet(ModelViewSet):
    # serializer_class = TrainingSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateTrainingSerializer

        return TrainingSerializer

    def get_queryset(self):
        queryset = Training.objects\
            .prefetch_related()\
            .all()\
            .order_by('date')\
            .annotate(comments_number=Count('comments'))

        client_id = self.request.query_params.get('client_id')
        coach_id = self.request.query_params.get('coach_id')

        if client_id is not None or coach_id is not None:
            queryset = queryset.filter(
                Q(coach__id=coach_id) | Q(client__id=client_id)
            )    

        return queryset


class ExerciseViewSet(ModelViewSet):
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Exercise.objects.filter(
            training_id=self.kwargs['training_pk']).all()

    def get_serializer_context(self):
        return {'training_id': self.kwargs['training_pk']}


class TrainingCommentViewSet(ModelViewSet):
    serializer_class = TrainingCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = TrainingComment.objects.prefetch_related('files').all().filter(
            training_id=self.kwargs['training_pk']).order_by('-date')

        return queryset

    def get_serializer_context(self):
        return {'training_id': self.kwargs['training_pk']}

class MessageViewSet(ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Message.objects.prefetch_related().all()
        contacts_id = self.request.query_params.get('contacts_id')

        if contacts_id is not None:
            queryset = queryset.filter(contacts__id=contacts_id)

        return queryset


class CommentFileViewSet(ModelViewSet):
    serializer_class = CommentFileSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def get_queryset(self):
        return CommentFile.objects.filter(comment_id=self.kwargs['comment_pk'])

    def get_serializer_context(self):
        return {'comment_id': self.kwargs['comment_pk']}
