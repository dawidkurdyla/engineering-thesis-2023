from django.db import models
from django.conf import settings
from django.contrib import admin
from django.core.validators import FileExtensionValidator

# Create your models here.
class Client(models.Model):
    MEMBERSHIP_BRONZE = 'B'
    MEMBERSHIP_SILVER = 'S'
    MEMBERSHIP_GOLD = 'G'

    MEMBERSHIP_CHOICES = [
        (MEMBERSHIP_BRONZE, 'Bronze'),
        (MEMBERSHIP_SILVER, 'Silver'),
        (MEMBERSHIP_GOLD, 'Gold'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    membership = models.CharField(
        max_length=1, choices=MEMBERSHIP_CHOICES, default=MEMBERSHIP_BRONZE)

    def __str__(self):
        return self.user.username

    def username(self):
        return self.user.username

    # Możliwość sortowania w admin panelu
    @admin.display(ordering='user__first_name')
    def first_name(self):
        return self.user.first_name

    @admin.display(ordering='user__last_name')
    def last_name(self):
        return self.user.last_name

    def is_coach(self):
        return self.user.is_coach

    @property
    def coaches(self):
        return [contact.coach.id for contact in self._coaches.all()]

    class Meta:
        ordering = ['user__first_name', 'user__last_name']


class Coach(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username

    def username(self):
        return self.user.username

    @admin.display(ordering='user__first_name')
    def first_name(self):
        return self.user.first_name

    @admin.display(ordering='user__last_name')
    def last_name(self):
        return self.user.last_name

    def is_coach(self):
        return self.user.is_coach

    @property
    def clients(self):
        return [contantc.client.id for contantc in self._clients.all()]

    class Meta:
        ordering = ['user__first_name', 'user__last_name']


class CoachClient(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='_coaches')
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name='_clients')

    class Meta:
        unique_together = [['client', 'coach']]


class Training(models.Model):
    title = models.CharField(max_length=255)
    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name='trainings')
    coach = models.ForeignKey(
        Coach, on_delete=models.CASCADE, related_name='trainings')
    date = models.DateTimeField()



class Exercise(models.Model):
    TYPE_WEIGHT = 'W'
    TYPE_TIME= 'T'
    TYPE_CUSTOM = 'C'

    TYPE_CHOICES = [
        (TYPE_WEIGHT, 'Weight'),
        (TYPE_TIME, 'Time'),
        (TYPE_CUSTOM, 'Custom'),
    ]

    STATUS_DONE = 'D'
    STATUS_PARTIALLY = 'P'
    STATUS_UNDONE = 'U'
    STATUS_WAITING = 'W'

    STATUS_CHOICES = [
        (STATUS_DONE, 'Done'),
        (STATUS_PARTIALLY, 'Partially'),
        (STATUS_UNDONE, 'Undone'),
        (STATUS_WAITING, 'Waiting'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(null=True)
    type = models.CharField(max_length=1, choices=TYPE_CHOICES)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=STATUS_WAITING)
    training = models.ForeignKey(Training, on_delete=models.CASCADE, related_name='exercises')
    load = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    repetitions_number = models.IntegerField(blank=True, null=True)
    series_number = models.IntegerField(blank=True, null=True)
    duration = models.DurationField(blank=True, null=True)


class TrainingComment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False, blank=False)
    training = models.ForeignKey(
        Training, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)


class CommentFile(models.Model):
    comment = models.ForeignKey(TrainingComment, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(
        upload_to='comments/files',
        validators=[FileExtensionValidator(
            allowed_extensions=['jpg', 'png', 'mp4', 'jpeg'])]
    )


class Message(models.Model):
    contacts = models.ForeignKey(CoachClient, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField(null=False, blank=False)
    date = models.DateTimeField(auto_now_add=True)
