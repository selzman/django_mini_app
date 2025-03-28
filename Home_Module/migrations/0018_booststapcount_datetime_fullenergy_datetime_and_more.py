# Generated by Django 4.2.6 on 2024-08-23 15:55

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('Home_Module', '0017_alter_booststapcount_count_alter_fullenergy_count_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='booststapcount',
            name='DateTime',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='fullenergy',
            name='DateTime',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='multitap',
            name='DateTime',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='booststapcount',
            name='count',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='fullenergy',
            name='count',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='multitap',
            name='count',
            field=models.IntegerField(default=1),
        ),
    ]
