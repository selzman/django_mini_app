from . import models
import datetime
from datetime import datetime
from django.utils import timezone
from datetime import timedelta


def is_user_inactive_for_10_days(telegram_user):
    try:
        # Get the user data only once
        user_data = models.UserData.objects.get(user__telegram_user_id=telegram_user)
        last_active_date = user_data.last_activity
        current_date = timezone.now()

        if last_active_date is not None:

            if timezone.is_naive(last_active_date):
                last_active_date = timezone.make_aware(last_active_date, timezone.get_default_timezone())

            difference = current_date - last_active_date

            if difference > timedelta(days=10):


                return True
            else:
                return False
        else:

            return True

    except models.UserData.DoesNotExist:

        return False




def user_progress_summary(user):
    total_tasks = models.Tasks.objects.count()
    completed_tasks = models.Tasks.objects.filter(user=user).count()
    all_tasks_completed = (completed_tasks == total_tasks)

    active_daily_bonuses = models.DailyBonus.objects.count()
    collected_bonuses = models.DailyBonus.objects.filter(user=user).count()
    all_bonuses_collected = (collected_bonuses == active_daily_bonuses)

    return {
        'all_tasks_completed': all_tasks_completed,
        'all_bonuses_collected': all_bonuses_collected,
    }
