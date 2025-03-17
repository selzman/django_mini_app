# # import threading
# # import time
# # from datetime import datetime, timedelta
# #
# #
# # def my_function():
# #     from .models import TelegramUser, UserData ,Fullenergy,booststapcount
# #
# #     remaining = TelegramUser.objects.all()
# #     luckyWheelchance = UserData.objects.all()
# #     fullenergy=Fullenergy.objects.all()
# #     boosts=booststapcount.objects.all()
# #
# #     for counter in fullenergy and boosts:
# #         counter.count =1
# #         counter.save()
# #
# #     for chance in luckyWheelchance:
# #         chance.luckywheel = 0
# #         chance.save()
# #
# #     for i in remaining:
# #         i.bonus_claimed = False
# #         i.save()
# #
# #
# # def run_function_at_midnight():
# #     while True:
# #         current_time = datetime.now()
# #         # Calculate the next midnight (00:00:00 of the next day)
# #         next_midnight = current_time.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
# #         time_until_midnight = (next_midnight - current_time).total_seconds()
# #         time.sleep(time_until_midnight)
# #
# #         my_function()
# #
# #
# #
# #
# # def run_function_every_5_seconds():
# #     while True:  # Adding a loop to keep the function running indefinitely
# #         print('10 sec')
# #         my_function()  # Call the function once
# #         time.sleep(10)
# #
# #
# #
# # def start_function_thread():
# #     current_time = datetime.now()
# #
# #     thread = threading.Thread(target=run_function_at_midnight)
# #     # thread = threading.Thread(target=run_function_every_5_seconds)
# #     thread.daemon = True  # Daemon thread will exit when the main program exits
# #     thread.start()
# #
# #
# from apscheduler.schedulers.background import BackgroundScheduler
# from datetime import datetime, timedelta
#
# def my_function():
#     from .models import TelegramUser, UserData, Fullenergy, booststapcount
#     print('do')
#     remaining = TelegramUser.objects.all()
#     luckyWheelchance = UserData.objects.all()
#     fullenergy = Fullenergy.objects.all()
#     boosts = booststapcount.objects.all()
#
#     for counter in fullenergy and boosts:
#         counter.count = 1
#         counter.save()
#
#     for chance in luckyWheelchance:
#         chance.luckywheel = 0
#         chance.save()
#
#     for i in remaining:
#         i.bonus_claimed = False
#         i.save()
#
# scheduler = BackgroundScheduler()
#
# # Run the function at midnight every day
# scheduler.add_job(my_function, 'cron', hour=0, minute=0)
#
# # Run the function every 10 seconds
# # scheduler.add_job(my_function, 'interval', seconds=5)
#
# scheduler.start()
