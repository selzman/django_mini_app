# Generated by Django 4.2.6 on 2024-08-23 20:31

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('Home_Module', '0021_alter_fullenergy_datetime'),
    ]

    operations = [
        migrations.CreateModel(
            name='GlobalRechargeTracker',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_recharge_time', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
    ]
