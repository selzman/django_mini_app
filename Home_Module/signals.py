import json
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver, Signal
from . import models
from django.utils.crypto import get_random_string
import requests


user_data_signal = Signal()






@receiver(post_save, sender=models.UserData)
def calculate_income(sender, instance, **kwargs):
    current_count = instance.count
    income_score = current_count // 100000
    estimated_income, created = models.EstimatedDollarIncome.objects.get_or_create(user=instance)
    estimated_income.count = income_score
    estimated_income.save()



@receiver(pre_save, sender=models.TelegramUser)
def set_user_referral_codes(sender, instance, **kwargs):
    if not instance.referral_code:
        instance.referral_code = instance.generate_random_string()
    if not instance.token:
        instance.token = instance.generate_token()


@receiver(post_save, sender=models.UserData)
def blueTicker(sender, instance, created, **kwargs):
    if not created:
        coin = instance.count >= 61000000
        level = instance.level >= 18
        invited = instance.invite.count() >= 25

        total_tasks = models.Tasks.objects.count()
        completed_tasks = models.Tasks.objects.filter(user=instance.user).count()
        all_tasks_completed = (completed_tasks == total_tasks)

        if coin and level and invited and all_tasks_completed:
            models.UserData.objects.filter(pk=instance.pk).update(blueTicks=True)


@receiver(post_save, sender=models.UserData)
def userUpgrade(sender, instance, created, **kwargs):
    if created or getattr(instance, '_upgrading', False):
        return
    instance._upgrading = True
    coin = instance.count
    invited = instance.invite.count()

    total_tasks = models.Tasks.objects.count()
    completed_tasks = models.Tasks.objects.filter(user=instance.user).count()
    all_tasks_completed = (completed_tasks == total_tasks)

    youtube = models.EarningsYoutubeVideos.objects.count()
    complete_completed = models.EarningsYoutubeVideos.objects.filter(user=instance.user).count()
    all_youtube_completed = (complete_completed == youtube)

    level_up = False
    previous_level = instance.level

    # Define coin values for each level
    coin_values = {
        2: 1000000,
        3: 1000000,
        4: 1000000,
        5: 1000000,
        6: 1000000,
        7: 3000000,
        8: 3000000,
        9: 3000000,
        10: 3000000,
        11: 3000000,
        12: 6000000,
        13: 6000000,
        14: 6000000,
        15: 6000000,
        16: 6000000,
        17: 10000000,
        18: 10000000,
        19: 10000000,
        20: 10000000,
    }

    # level2
    if coin >= 3000000 and invited >= 1 and all_tasks_completed and all_youtube_completed:
        instance.level = 2
        instance.energy = 4000
        instance.tap = 8
        instance.bostlimit = 10
        level_up = True

    # level3
    if coin >= 5000000 and invited >= 2 and all_tasks_completed and all_youtube_completed:
        instance.level = 3
        instance.energy = 5000
        instance.tap = 10
        instance.bostlimit = 10
        level_up = True

    # level4
    if coin >= 8000000 and invited >= 2 and all_tasks_completed and all_youtube_completed:
        instance.level = 4
        instance.energy = 6000
        instance.tap = 12
        instance.bostlimit = 10
        level_up = True

    # level5
    if coin >= 10000000 and invited >= 2 and all_tasks_completed and all_youtube_completed:
        instance.level = 5
        instance.energy = 6500
        instance.tap = 14
        instance.bostlimit = 10
        level_up = True

    # level6
    if coin >= 13000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 6
        instance.energy = 7000
        instance.tap = 16
        instance.bostlimit = 10
        level_up = True

    # level7
    if coin >= 16000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 7
        instance.energy = 7500
        instance.tap = 18
        instance.bostlimit = 10
        level_up = True

    # level8
    if coin >= 19000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 8
        instance.energy = 8000
        instance.tap = 20
        instance.bostlimit = 10
        level_up = True

    # level9
    if coin >= 22000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 9
        instance.energy = 8500
        instance.tap = 22
        instance.bostlimit = 10
        level_up = True

    # level10
    if coin >= 25000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 10
        instance.energy = 9000
        instance.tap = 24
        instance.bostlimit = 10
        level_up = True

    # level11
    if coin >= 28000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 11
        instance.energy = 9500
        instance.tap = 26
        instance.bostlimit = 10
        level_up = True

    # level12
    if coin >= 31000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 12
        instance.energy = 10000
        instance.tap = 28
        instance.bostlimit = 10
        level_up = True

    # level13
    if coin >= 34000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 13
        instance.energy = 10500
        instance.tap = 30
        instance.bostlimit = 10
        level_up = True

    # level14
    if coin >= 37000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 14
        instance.energy = 11000
        instance.tap = 32
        instance.bostlimit = 10
        level_up = True

    # level15
    if coin >= 40000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 15
        instance.energy = 11500
        instance.tap = 34
        instance.bostlimit = 10
        level_up = True

    # level16
    if coin >= 47000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 16
        instance.energy = 12000
        instance.tap = 36
        instance.bostlimit = 10
        level_up = True

    # level17
    if coin >= 54000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 17
        instance.energy = 12500
        instance.tap = 38
        instance.bostlimit = 10
        level_up = True

    # level18
    if coin >= 61000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 18
        instance.energy = 13000
        instance.tap = 40
        instance.bostlimit = 10
        level_up = True

    # level19
    if coin >= 75000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 19
        instance.energy = 15000
        instance.tap = 45
        instance.bostlimit = 10
        level_up = True

    # level20
    if coin >= 100000000 and invited >= 3 and all_tasks_completed and all_youtube_completed:
        instance.level = 20
        instance.energy = 20000
        instance.tap = 50
        instance.bostlimit = 10
        level_up = True

    if level_up and instance.level != previous_level:
        # Create giftcodeandroidapp object with a different coin value for each level
        coin_value = coin_values.get(instance.level, 230000)  # Default to 230000 if level not in coin_values
        models.giftcodeandroidapp.objects.create(user=instance, giftcode=get_random_string(10), coin=coin_value)
        # Save the changes without triggering the signal again
        instance.save(update_fields=['level', 'energy', 'tap', 'bostlimit'])

    # Remove the flag after saving to allow future upgrades
    del instance._upgrading




# @receiver(post_save, sender=models.giftcodeandroidapp)
# def send_post_request_on_creation(sender, instance, created, **kwargs):
#     if created:
#         # Define the URL to which the POST request should be sent
#         url = 'https://botshop.shop/user/webappgiftcod'  # Replace with the actual URL
#
#         token = '1daadaa794d1f8b9d1cafaf00c0022b9897b54bc'
#
#         # Define the data to send in the POST request
#         data = {
#             'code': instance.giftcode,
#             'gift': instance.coin,
#             'is_used': False
#         }
#
#         try:
#             headers = {
#                 'Content-Type': 'application/json',
#                 'Authorization': f'Token {token}',
#             }
#             # Send the POST request
#             response = requests.post(url, headers=headers, data=json.dumps(data))
#
#             # Optionally, you can check the response status
#             if response.status_code == 200:
#                 print("POST request successful.")
#             else:
#                 print(f"POST request failed with status code: {response.status_code}")
#
#         except requests.exceptions.RequestException as e:
#             print(f"An error occurred: {e}")



