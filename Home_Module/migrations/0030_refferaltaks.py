# Generated by Django 4.2.6 on 2024-08-24 15:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Home_Module', '0029_remove_tasks_completed'),
    ]

    operations = [
        migrations.CreateModel(
            name='refferaltaks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('refferalcount', models.IntegerField(default=0)),
                ('giftcount', models.IntegerField(default=0)),
                ('is_active', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Home_Module.userdata')),
            ],
        ),
    ]
