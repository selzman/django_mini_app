# Generated by Django 4.2.6 on 2024-09-01 12:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Home_Module', '0047_dailycountlog'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdata',
            name='count',
            field=models.BigIntegerField(default=1000000),
        ),
    ]
