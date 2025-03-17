from datetime import timedelta
from django.utils import timezone
from .models import UserData
import random
from celery import shared_task
from Home_Module import models



@shared_task
def check_lottery_time(lottery_id):
    from Home_Module.models import Lottery, UserData, lotteryamount  # Corrected import
    import random

    lottery = Lottery.objects.get(id=lottery_id)
    eligible_users = list(UserData.objects.filter(level=lottery.level))

    if len(eligible_users) > lottery.user_amount:
        selected_users = random.sample(eligible_users, lottery.user_amount)
    else:
        selected_users = eligible_users

    if selected_users:
        amount_per_user = lottery.price / len(selected_users)
    else:
        amount_per_user = 0

    for user in selected_users:

        user_lottery_amount, created = lotteryamount.objects.get_or_create(
            user=user)

        if not created:
            # If the object already exists, update the amount
            user_lottery_amount.amount += amount_per_user
            user_lottery_amount.lottery=lottery

            user_lottery_amount.save()


@shared_task
def reset_user_data():

    remaining = models.TelegramUser.objects.all()
    luckyWheelchance = models.UserData.objects.all()
    fullenergy = models.Fullenergy.objects.all()
    boosts = models.booststapcount.objects.all()




    for full in fullenergy:
        full.count = 1
    models.Fullenergy.objects.bulk_update(fullenergy, ['count'])


    for boost in boosts:
        boost.count = 1
    models.booststapcount.objects.bulk_update(boosts, ['count'])


    for chance in luckyWheelchance:
        chance.luckywheel = 0
    models.UserData.objects.bulk_update(luckyWheelchance, ['luckywheel'])


    for user in remaining:
        user.bonus_claimed = False
    models.TelegramUser.objects.bulk_update(remaining, ['bonus_claimed'])





@shared_task
def check_users_inactivity():
    current_date = timezone.now()
    ten_days_ago = current_date - timedelta(days=10)

    inactive_users = UserData.objects.filter(last_activity__lt=ten_days_ago)

    for user_data in inactive_users:
        user_data.get_profit = False
        user_data.save()





