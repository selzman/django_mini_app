# Generated by Django 4.2.6 on 2024-08-25 17:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Home_Module', '0040_alter_giftcodeandroidapp_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='giftcodeandroidapp',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Home_Module.userdata'),
        ),
    ]
