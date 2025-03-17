# project_name/celery.py

from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'webapp.settings')

app = Celery('webapp')



app.config_from_object('django.conf:settings', namespace='CELERY')



#
# app.conf.beat_schedule = {
#     'check-users-inactivity-every-day': {
#         'task': 'Home_Module.tasks.reset_user_data',
#         'schedule': crontab(minute='*/1')
#     },
# }


app.conf.beat_schedule = {
    'check-users-inactivity-every-day': {
        'task': 'Home_Module.tasks.check_users_inactivity',
        'schedule': crontab(hour=0, minute=0),
    },
}




app.conf.beat_schedule = {
    'check-lottery-every-midnight': {
        'task': 'Home_Module.tasks.reset_user_data',
        'schedule': crontab(hour=0, minute=0),
    },
}





# use in windows
# celery -A webapp beat --loglevel=info
# celery -A webapp worker --loglevel=info
# or
# celery -A webapp worker --loglevel=info --pool=solo

# use in server
# celery -A webapp worker --loglevel=info -B




# Load task modules from all registered Django app configs.
app.autodiscover_tasks()
