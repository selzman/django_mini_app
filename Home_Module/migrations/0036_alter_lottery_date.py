# Generated by Django 4.2.6 on 2024-08-25 08:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Home_Module', '0035_remove_lottery_user_lottery_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lottery',
            name='Date',
            field=models.DateTimeField(),
        ),
    ]
