# Generated by Django 4.2.6 on 2024-08-24 18:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Home_Module', '0020_alter_booststapcount_datetime_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='fullenergy',
            name='DateTime',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
