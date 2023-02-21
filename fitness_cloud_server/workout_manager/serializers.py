from rest_framework import serializers

from .models import Client, Coach, CoachClient, Exercise, Training, TrainingComment, Message, CommentFile



class SimpleCoachClientSerializer(serializers.ModelSerializer):
    coach_id = serializers.IntegerField()
    client_id = serializers.IntegerField()

    def validate_client_id(self, value):
        if not Client.objects.filter(pk=value).exists():
            raise serializers.ValidationError('No client with the given id')

        return value

    def validate_coach_id(self, value):
        if not Coach.objects.filter(pk=value).exists():
            raise serializers.ValidationError('No Coach with the given id')

        return value
    
    def save(self, **kwargs):
        coach_id = self.validated_data['coach_id']
        client_id = self.validated_data['client_id']
        self.instance = CoachClient.objects.create(coach_id=coach_id, client_id=client_id)
        
        return self.instance

    class Meta:
        model = CoachClient
        fields = ['coach_id', 'client_id']


class CoachSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    is_coach = serializers.BooleanField()
    clients = serializers.ListField()

    class Meta:
        model = Coach
        fields = ['id', 'username', 'user_id', "first_name",
                  "last_name", "is_coach", "clients"]


class ClientSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(read_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    is_coach = serializers.BooleanField(read_only=True)
    coaches = serializers.ListField()

    class Meta:
        model = Client
        fields = ['id', 'username', 'user_id', 'membership',
                  "first_name", "last_name", "is_coach", "coaches"]



class CreateTrainingSerializer(serializers.ModelSerializer):
    coach_id = serializers.IntegerField()
    client_id = serializers.IntegerField()
    comments_number = serializers.IntegerField(read_only=True)

    class Meta:
        model = Training
        fields = ['id', 'title', 'coach_id',
                  'client_id', 'date', 'comments_number']


class TrainingSerializer(serializers.ModelSerializer):
    coach = CoachSerializer()
    client = ClientSerializer()
    comments_number = serializers.IntegerField(read_only=True)

    class Meta:
        model = Training
        fields = ['id', 'title', 'coach',
                  'client', 'date', 'comments_number']



class ExerciseSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        training_id = self.context.get('training_id')
        return Exercise.objects.create(training_id=training_id, **validated_data)

    class Meta:
        model = Exercise
        fields = ['id', 'training_id', 'name', 'description',
            'type', 'status', 'load', 'repetitions_number', 'series_number', 'duration']


class CommentFileSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        comment_id = self.context.get('comment_id')
        return CommentFile.objects.create(comment_id=comment_id, **validated_data)

    class Meta:
        model = CommentFile
        fields =['id', 'file']


class TrainingCommentSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField()
    files = CommentFileSerializer(many=True, read_only=True)
    
    def create(self, validated_data):
        training_id = self.context.get('training_id')
        return TrainingComment.objects.create(training_id=training_id, **validated_data)

    class Meta:
        model = TrainingComment
        fields = ['id', 'user_id', 'training_id', 'content', 'date', 'files']


class MessageSerializer(serializers.ModelSerializer):
    contacts_id = serializers.IntegerField()

    class Meta:
        model = Message
        fields = ['id', 'contacts_id', 'content', 'date']



