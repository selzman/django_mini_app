# Generated by Django 4.2.6 on 2024-08-13 06:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Home_Module', '0009_userdata_reward_given'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdata',
            name='get_profit',
            field=models.BooleanField(default=False),
        ),
    ]
