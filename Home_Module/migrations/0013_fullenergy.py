# Generated by Django 4.2.6 on 2024-08-22 18:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Home_Module', '0012_alter_userdata_count'),
    ]

    operations = [
        migrations.CreateModel(
            name='Fullenergy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.IntegerField(default=3)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Home_Module.telegramuser')),
            ],
        ),
    ]
