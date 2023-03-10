# Generated by Django 4.1.3 on 2023-01-14 16:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('workout_manager', '0005_training_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='training',
            name='client',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trainings', to='workout_manager.client'),
        ),
        migrations.AlterField(
            model_name='training',
            name='coach',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trainings', to='workout_manager.coach'),
        ),
    ]
