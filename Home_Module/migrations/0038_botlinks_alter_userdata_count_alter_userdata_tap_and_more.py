# Generated by Django 4.2.6 on 2024-08-25 16:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Home_Module', '0037_remove_lottery_user_lotteryamount'),
    ]

    operations = [
        migrations.CreateModel(
            name='BotLinks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('webapp_url', models.URLField(blank=True, max_length=150, null=True)),
                ('website', models.URLField(blank=True, max_length=150, null=True)),
                ('download_app_url', models.URLField(blank=True, max_length=150, null=True)),
            ],
        ),
        migrations.AlterField(
            model_name='userdata',
            name='count',
            field=models.BigIntegerField(default=999999),
        ),
        migrations.AlterField(
            model_name='userdata',
            name='tap',
            field=models.IntegerField(default=4),
        ),
        migrations.DeleteModel(
            name='userprofit',
        ),
    ]
