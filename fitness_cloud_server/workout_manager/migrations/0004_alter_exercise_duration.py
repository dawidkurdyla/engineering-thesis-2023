# Generated by Django 4.1.3 on 2022-12-11 21:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workout_manager', '0003_training_exercise'),
    ]

    operations = [
        migrations.AlterField(
            model_name='exercise',
            name='duration',
            field=models.DurationField(blank=True, null=True),
        ),
    ]
