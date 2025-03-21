# Generated by Django 4.2.6 on 2024-08-12 14:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Home_Module', '0004_delete_useractivity'),
    ]

    operations = [
        migrations.CreateModel(
            name='DailyActivity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity_date', models.DateField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Home_Module.telegramuser')),
            ],
            options={
                'unique_together': {('user', 'activity_date')},
            },
        ),
    ]
