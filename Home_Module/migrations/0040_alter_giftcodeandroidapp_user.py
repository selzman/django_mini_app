# Generated by Django 4.2.6 on 2024-08-25 17:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Home_Module', '0039_delete_botlinks'),
    ]

    operations = [
        migrations.AlterField(
            model_name='giftcodeandroidapp',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Home_Module.telegramuser'),
        ),
    ]
