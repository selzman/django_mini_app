import hashlib
import json
import random

from django.http import HttpResponse

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.utils import timezone
from django.utils.decorators import method_decorator

from django.views import View
from django_ratelimit.decorators import ratelimit
from . import models
from .models import TelegramUser, DailyBonus, EarningsYoutubeVideos, giftcodeandroidapp, NftStore, Tasks
from .models import UserData
from .utils import is_user_inactive_for_10_days
from django.utils.crypto import get_random_string


def desktop_redirect(request):
    return render(request, 'DoNotAllow.html')


@method_decorator(ratelimit(key='ip', rate='25/m', method='GET', block=False), name='dispatch')
class GetUserData(View):
    def dispatch(self, request, *args, **kwargs):
        if getattr(request, 'limited', False):
            # Render the HTML template when the user is rate-limited
            return render(request, 'rate_limit.html')
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        user_id = request.GET.get('user')
        hash_object = hashlib.sha256(user_id.encode())
        hex_dig = hash_object.hexdigest()

        secret_key = hex_dig[:32]

        try:
            main_user = UserData.objects.get(user__telegram_user_id=user_id)
            user_data = {
                'count': main_user.count,
                'energy': main_user.energy,
                'tap': main_user.tap,
                'bostlimit': main_user.bostlimit,
                'energyIncrementRate': 3,
                'secret_key': secret_key,
                'energyIncreaseInterval': 1000,
                'usermainlevel': main_user.level
            }
            response_data = {
                'data': user_data,

            }

            return JsonResponse(response_data)
        except UserData.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)


@method_decorator(ratelimit(key='ip', rate='25/m', method='GET', block=False), name='dispatch')
class HomeView(View):

    def dispatch(self, request, *args, **kwargs):
        if getattr(request, 'limited', False):
            # Render the HTML template when the user is rate-limited
            return render(request, 'rate_limit.html')
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):

        user_token = request.GET.get('jwt_token')

        user_data = self.get_user_data('test')
        # user_data = self.get_user_data(user_token)

        # if not user_data:
            # return render(request, 'DoNotAllow.html')

        main_user, created = UserData.objects.get_or_create(user=user_data)
        self.update_activity_view(user_data)

        progress, all_tasks_completed, all_bonuses_collected = self.calculate_progress(main_user)
        daily_bonuses, claimed_bonuses, current_day = self.get_daily_bonuses(user_data)

        is_first_day = self.is_first_day(user_data)

        context = self.prepare_context(user_data, main_user, daily_bonuses, claimed_bonuses, progress, current_day,
                                       is_first_day, all_tasks_completed, all_bonuses_collected)

        return render(request, 'home.html', context)
        # return render(request, 'test.html', context)

    def get_user_data(self, user_token):
        try:
            return TelegramUser.objects.get(token=user_token)
        except TelegramUser.DoesNotExist:
            return None

    def update_activity_view(self, user_data):
        user_data.update_user_activity()

    def get_daily_bonuses(self, user_data):
        current_day = user_data.current_bonus_day

        daily_bonuses = DailyBonus.objects.all()

        claimed_bonuses = {
            bonus.id: bonus.user.filter(id=user_data.id).exists()
            for bonus in daily_bonuses
        }

        return daily_bonuses, claimed_bonuses, current_day

    def calculate_progress(self, main_user):
        coin = main_user.count
        invited = main_user.invite.all().count()

        total_tasks = models.Tasks.objects.count()
        completed_tasks = models.Tasks.objects.filter(user=main_user.user).count()
        all_tasks_completed = (completed_tasks == total_tasks)

        active_daily_bonuses = models.EarningsYoutubeVideos.objects.count()
        collected_bonuses = models.EarningsYoutubeVideos.objects.filter(user=main_user.user).count()
        all_bonuses_collected = (collected_bonuses == active_daily_bonuses)

        progress_levels = [
            (5000000, 2),
            (13000000, 3),
            (20000000, 4),
            (27000000, 5),
            (35000000, 5),
            (42000000, 5),
            (55000000, 6),
            (75000000, 8),
            (99000000, 10),
        ]

        user_level = 1

        # Determine user level based on coin count
        for i, (max_coin, req_invites) in enumerate(progress_levels):
            if coin >= max_coin:
                user_level = i + 1

        while True:
            progress = 0

            # Calculate progress based on the user's current level
            for i, (max_coin, req_invites) in enumerate(progress_levels):
                if coin >= max_coin and user_level == i + 1:
                    # Coin requirement met
                    if i == 0:  # Special case for level 1
                        progress += 50
                    else:
                        progress += 25

                if invited >= req_invites and user_level == i + 1:
                    # Invite requirement met
                    progress += 25

            # Add additional progress for task completion and bonuses
            if all_tasks_completed:
                progress += 25

            if user_level > 1 and all_bonuses_collected:
                progress += 25

            # Ensure progress does not exceed 100
            progress = min(progress, 100)

            # If progress reaches 100, reset progress and upgrade level
            if progress == 100 and user_level < 10:
                user_level += 1
                # Recalculate based on new level
            else:
                break

        return progress, all_tasks_completed, all_bonuses_collected

    def is_first_day(self, user_data):
        return user_data.last_activity.date() == timezone.now().date()

    def prepare_context(self, user_data, main_user, daily_bonuses, claimed_bonuses, progress, current_day,
                        is_first_day, all_tasks_completed, all_bonuses_collected):

        fill, created = models.Fullenergy.objects.get_or_create(user=main_user)
        boosts, created = models.booststapcount.objects.get_or_create(user=main_user)

        estimate_count, estiamte_dollers = models.EstimatedDollarIncome.objects.get_or_create(user=main_user)
        lootory, create = models.lotteryamount.objects.get_or_create(user=main_user)
        models.DailyCountLog.objects.create(user_data=main_user)

        context = {
            'user_data': user_data,
            'data': user_data,
            'earn': EarningsYoutubeVideos.objects.all(),
            'main_user': main_user,
            'daily_bonuses': daily_bonuses,
            'current_day': current_day,
            'claimed_bonuses': claimed_bonuses,
            'androidGiftCod': giftcodeandroidapp.objects.filter(user=main_user),
            'NftStore': NftStore.objects.all(),
            'tasks': Tasks.objects.all(),
            'invited_user': main_user.invite.all(),
            'progres': progress,
            'is_first_day': is_first_day,
            'all_tasks_completed': all_tasks_completed,
            'all_bonuses_collected': all_bonuses_collected,
            'referal_task': models.refferaltaks.objects.filter(is_active=True).last(),

            'estiamte_dollers': estimate_count,
            'lootory': lootory,

        }

        return context


@method_decorator(ratelimit(key='ip', rate='33/m', method='POST', block=False), name='dispatch')
class HomeViewpost(View):
    def dispatch(self, request, *args, **kwargs):

        if getattr(request, 'limited', False):
            if request.method == 'POST':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Rate limit exceeded. Please try again later.'
                }, status=429)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        user_id = body['data']
        video_id = body['videoIdHidden']

        random_number = random.random()

        if random_number < 0.3:
            try:
                video = get_object_or_404(models.EarningsYoutubeVideos, id=video_id)
                user = get_object_or_404(models.TelegramUser, telegram_user_id=user_id)
                main_user = get_object_or_404(models.UserData, user=user)

                video.user.add(user)

                main_user.count += video.giftCount

                video.save()
                main_user.save()

                return JsonResponse({
                    'status': 'success',
                    'message': 'You get the gift!'
                })
            except Exception as e:

                return JsonResponse({
                    'status': 'error',
                    'message': 'Video or user does not exist!'
                })
        else:
            return JsonResponse({
                'status': 'error',
                'message': 'See video first to get gift.'
            })


@method_decorator(ratelimit(key='ip', rate='33/m', method='POST', block=False), name='dispatch')
class DailyBonusEveryDayView(View):

    def dispatch(self, request, *args, **kwargs):

        if getattr(request, 'limited', False):
            if request.method == 'POST':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Rate limit exceeded. Please try again later.'
                }, status=429)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        user_id = body['data']
        id = body['id']

        get_daily = get_object_or_404(models.DailyBonus, id=id)
        user = get_object_or_404(models.TelegramUser, telegram_user_id=user_id)
        main_user = get_object_or_404(models.UserData, user=user)

        if user.bonus_claimed == False:
            try:
                get_daily.user.add(user)
                main_user.count += get_daily.giftCount
                user.bonus_claimed = True
                user.save(update_fields=['bonus_claimed'])
                main_user.save()
                return JsonResponse({
                    'status': 'success',
                    'message': main_user.count
                })

            except Exception as e:

                return JsonResponse({
                    'status': 'error',
                    'message': 'An error occurred while processing the daily bonus.'
                })
        else:
            return JsonResponse({
                'status': 'error',
                'message': 'you claim daily bonus  today'
            })


@method_decorator(ratelimit(key='ip', rate='33/m', method='POST', block=False), name='dispatch')
class LuckyWheelgetView(View):

    def dispatch(self, request, *args, **kwargs):

        if getattr(request, 'limited', False):
            if request.method == 'POST':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Rate limit exceeded. Please try again later.'
                }, status=429)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            # Decode the request body
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)

            # Extract the count and userid
            count = body['count']
            userid = body['userid']

            # Get the user objects
            main_user = get_object_or_404(models.TelegramUser, telegram_user_id=userid)
            user = get_object_or_404(models.UserData, user=main_user)

            # Update the user's count
            user.count += int(count)
            user.save()

            return JsonResponse({
                'status': 'success',
                'message': 'You got the count updated.'
            })

        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid JSON format.'
            }, status=400)

        except models.TelegramUser.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Telegram user not found.'
            }, status=404)

        except models.UserData.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'User data not found.'
            }, status=404)

        except Exception as e:

            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)


@method_decorator(ratelimit(key='ip', rate='33/m', method='POST', block=False), name='dispatch')
class LuckyWheelCheckView(View):

    def dispatch(self, request, *args, **kwargs):

        if getattr(request, 'limited', False):
            if request.method == 'POST':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Rate limit exceeded. Please try again later.'
                }, status=429)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        id = body['id']

        user = get_object_or_404(models.TelegramUser, telegram_user_id=id)
        main_user = get_object_or_404(models.UserData, user=user)

        try:
            # Check the number of spins already used
            if main_user.luckywheel == 0:
                # First spin is free
                main_user.luckywheel += 1
                main_user.save()
                return JsonResponse({
                    'status': 'success',
                    'message': 'First spin is free!',
                    'count': main_user.luckywheel
                })

            elif main_user.luckywheel == 1:
                return JsonResponse({
                    'status': 'error',
                    'message': 'You can play lucky wheel once a day!'
                })

            # elif 1 <= main_user.luckywheel < 5:
            #     # For subsequent spins, show ads
            #     return JsonResponse({
            #         'status': 'ads',
            #         'message': 'Please watch an ad to spin the wheel.'
            #     })

            # else:
            #     # Maximum 5 spins per day
            #     return JsonResponse({
            #         'status': 'error',
            #         'message': 'You cannot play lucky wheel more than 5 times a day!'
            #     })

        except Exception as e:

            return JsonResponse({
                'status': 'error',
                'message': 'Please try again later.'
            })


@method_decorator(ratelimit(key='ip', rate='20/m', method='POST', block=False), name='dispatch')
class tasksview(View):

    def dispatch(self, request, *args, **kwargs):
        if getattr(request, 'limited', False):
            if request.method == 'POST':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Rate limit exceeded. Please try again later.'
                }, status=429)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)

        user_id = body.get('user_id')
        task_id = body.get('id')

        if not user_id or not task_id:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid request. User ID or Task ID is missing.'
            }, status=400)

        try:
            user_data = models.TelegramUser.objects.get(telegram_user_id=user_id)
            main_user = models.UserData.objects.get(user=user_data)
            task = models.Tasks.objects.get(id=task_id)
        except models.TelegramUser.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'User does not exist.'
            })
        except models.Tasks.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'Task does not exist.'
            })

        random_number = random.random()
        if random_number < 0.3:
            try:
                task.user.add(user_data)
                main_user.count += task.gift
                main_user.save()
                return JsonResponse({
                    'status': 'success',
                    'message': 'You get the task!'
                })
            except Exception as e:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Failed to process the task!'
                })
        else:
            return JsonResponse({
                'status': 'error',
                'message': 'Please complete the task.'
            })


@method_decorator(ratelimit(key='ip', rate='33/m', method='POST', block=False), name='dispatch')
class GetProfitView(View):

    def dispatch(self, request, *args, **kwargs):

        if getattr(request, 'limited', False):
            if request.method == 'POST':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Rate limit exceeded. Please try again later.'
                }, status=429)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        user_id = body['data']

        try:
            user = models.TelegramUser.objects.get(telegram_user_id=user_id)
            main_user = models.UserData.objects.get(user=user)
            total_tasks = Tasks.objects.count()
            completed_tasks = Tasks.objects.filter(user=user).count()
            all_tasks_completed = (completed_tasks == total_tasks)

            if main_user.get_profit:
                get_status = True
            else:
                get_status = False

            if not get_status and is_user_inactive_for_10_days(user_id) and all_tasks_completed:
                main_user.count += 1000000
                main_user.get_profit = True
                main_user.last_activity = timezone.now()
                main_user.save()
                gift = models.giftcodeandroidapp.objects.create(user=main_user, giftcode=get_random_string(10),
                                                                coin=500000)
                gift.save()
                return JsonResponse({
                    'status': 'success',
                    'message': 'You get 1000000 profit.',
                })
            else:
                return JsonResponse({
                    'status': 'failure',
                    'message': 'You are not eligible for profit yet.',
                })

        except models.TelegramUser.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'User not found.'
            }, status=404)

        except Exception as e:

            return JsonResponse({
                'status': 'error',
                'message': 'Please try again later.'
            }, status=500)


@method_decorator(ratelimit(key='ip', rate='90/m', method='POST', block=False), name='dispatch')
class SaveDataView(View):

    def dispatch(self, request, *args, **kwargs):

        if getattr(request, 'limited', False):
            if request.method == 'POST':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Rate limit exceeded. Please try again later.'
                }, status=429)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            user_id = body.get('user_id')

            user = UserData.objects.get(user__telegram_user_id=user_id)
            try:
                user.count = body.get('tokens')
                user.save()

                return JsonResponse({
                    'status': 'success',
                    'message': 'You have successfully saved your data.',

                })
            except:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Please try again later.'
                })

        except Exception as e:

            return JsonResponse({
                'status': 'error',
                'message': 'Please try again later.'
            })


@method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=False), name='dispatch')
class showremainupgrade(View):

    def dispatch(self, request, *args, **kwargs):

        if getattr(request, 'limited', False):
            if request.method == 'POST':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Rate limit exceeded. Please try again later.'
                }, status=429)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            user_id = body.get('userid')
            level_id = body.get('id')

            # Fetch user data based on user ID
            user = UserData.objects.get(user__telegram_user_id=user_id)

            # Define level requirements
            requirements = {
                2: {'coins': 3000000, 'referrals': 1},
                3: {'coins': 5000000, 'referrals': 2},
                4: {'coins': 8000000, 'referrals': 2},
                5: {'coins': 10000000, 'referrals': 2},
                6: {'coins': 13000000, 'referrals': 3},
                7: {'coins': 16000000, 'referrals': 3},
                8: {'coins': 19000000, 'referrals': 3},
                9: {'coins': 22000000, 'referrals': 3},
                10: {'coins': 28000000, 'referrals': 3},

                11: {'coins': 28000000, 'referrals': 3},
                12: {'coins': 31000000, 'referrals': 3},
                13: {'coins': 34000000, 'referrals': 3},
                14: {'coins': 37000000, 'referrals': 3},
                15: {'coins': 40000000, 'referrals': 3},
                16: {'coins': 47000000, 'referrals': 3},
                17: {'coins': 54000000, 'referrals': 3},
                18: {'coins': 61000000, 'referrals': 3},
                19: {'coins': 75000000, 'referrals': 3},
                20: {'coins': 100000000, 'referrals': 3},
            }

            # Calculate completed tasks and referrals
            completed_tasks = Tasks.objects.filter(user=user.user).count()
            total_tasks = Tasks.objects.count()
            all_tasks_completed = (completed_tasks == total_tasks)

            completed_youtube = EarningsYoutubeVideos.objects.filter(user=user.user).count()
            total_youtube = EarningsYoutubeVideos.objects.count()
            all_youtube_completed = (completed_youtube == total_youtube)

            # Check if the requested level is in the requirements
            if int(level_id) in requirements:
                needed_coins = requirements[int(level_id)]['coins']
                needed_referrals = requirements[int(level_id)]['referrals']

                # Calculate remaining coins and referrals
                remaining_coins = max(0, needed_coins - user.count)
                remaining_referrals = max(0, needed_referrals - user.invite.count())

                # Return JSON response with remaining requirements and task statuses
                return JsonResponse({
                    'status': 'success',
                    'remaining_coins': remaining_coins,
                    'remaining_referrals': remaining_referrals,
                    'all_tasks_completed': all_tasks_completed,
                    'all_youtube_completed': all_youtube_completed,
                    'next_level': level_id
                })
            else:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Invalid level ID.'
                })

        except UserData.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'User not found.'
            })

        except Exception as e:

            return JsonResponse({
                'status': 'error',
                'message': 'Please try again later.'
            })


@method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=False), name='dispatch')
class Fullenergy(View):

    def dispatch(self, request, *args, **kwargs):

        if getattr(request, 'limited', False):
            if request.method == 'POST':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Rate limit exceeded. Please try again later.'
                }, status=429)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            user_id = body.get('userid')

            user = UserData.objects.get(user__telegram_user_id=user_id)

            full, create = models.Fullenergy.objects.get_or_create(user=user)

            if full.count == 0:
                return JsonResponse({
                    'status': 'finish',
                    'message': 'you can use full energy once a day.'
                })



            # elif full.count  >= 2:
            #     full.count -= 1
            #     full.save()
            #     return JsonResponse({
            #         'status': 'ads',
            #         'message': 'please watch ads.'
            #     })
            #
            else:

                full.count -= 1
                full.DateTime = timezone.now()
                full.save()
                return JsonResponse({
                    'status': 'success',
                    'message': 'Your energy is full.',
                })


        except Exception as e:

            return JsonResponse({
                'status': 'error',
                'message': 'Please try again later.'
            })


@method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=False), name='dispatch')
class booststapcount(View):

    def dispatch(self, request, *args, **kwargs):

        if getattr(request, 'limited', False):
            if request.method == 'POST':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Rate limit exceeded. Please try again later.'
                }, status=429)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            user_id = body.get('userid')

            main_user = models.UserData.objects.get(user__telegram_user_id=user_id)

            full, create = models.booststapcount.objects.get_or_create(user=main_user)

            if full.count == 0:
                return JsonResponse({
                    'status': 'finish',
                    'message': 'you can use boost once a day.'
                })

            # elif full.count  >= 2:
            #     full.count -= 1
            #     full.save()
            #     return JsonResponse({
            #         'status': 'ads',
            #         'message': 'please watch ads.'
            #     })

            else:

                full.count -= 1
                full.save()
                return JsonResponse({
                    'status': 'success',
                    'tap': main_user.tap,
                    'time': main_user.bostlimit,

                })


        except Exception as e:

            return JsonResponse({
                'status': 'error',
                'message': 'Please try again later.'
            })


# do not complete
@method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=False), name='dispatch')
class Multitap(View):

    def dispatch(self, request, *args, **kwargs):

        if getattr(request, 'limited', False):
            if request.method == 'POST':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Rate limit exceeded. Please try again later.'
                }, status=429)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            user_id = body.get('userid')

            main_user = models.UserData.objects.get(user__telegram_user_id=user_id)

            full, create = models.booststapcount.objects.get_or_create(user=main_user)
            mutlitap, create = models.MultiTap.objects.get_or_create(user=main_user)

            if mutlitap.count == 0:
                return JsonResponse({
                    'status': 'finish',
                    'message': 'you can not use multi tap more than 3 times a day .'
                })

            elif full.count >= 1:
                if full.count == 0:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'ypu can not use multi tap .'
                    })
                else:
                    full.count += 1
                    mutlitap.count -= 1
                    mutlitap.save()
                    full.save()
                    return JsonResponse({
                        'status': 'ads',
                        'message': 'please watch ads.'
                    })

            else:
                full.count += 1
                mutlitap.count -= 1
                mutlitap.save()
                full.save()
            return JsonResponse({
                'status': 'success',
                'message': 'You have successfully get one more boost.',

            })


        except Exception as e:

            return JsonResponse({
                'status': 'error',
                'message': 'Please try again later.'
            })


@method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=False), name='dispatch')
class remaindataboosts(View):

    def dispatch(self, request, *args, **kwargs):

        if getattr(request, 'limited', False):
            if request.method == 'POST':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Rate limit exceeded. Please try again later.'
                }, status=429)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            user_id = body.get('userid')

            main_user = models.UserData.objects.get(user__telegram_user_id=user_id)

            booststapcount, create = models.booststapcount.objects.get_or_create(user=main_user)
            mutlitap, create = models.MultiTap.objects.get_or_create(user=main_user)
            full, create = models.Fullenergy.objects.get_or_create(user=main_user)

            return JsonResponse({
                'status': 'success',
                'booststapcount': booststapcount.count,
                'mutlitap': mutlitap.count,
                'full': full.count,

            })


        except Exception as e:

            return JsonResponse({
                'status': 'error',
                'message': 'Please try again later.'
            })


@method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=False), name='dispatch')
class teamReferralWork(View):

    def dispatch(self, request, *args, **kwargs):

        if getattr(request, 'limited', False):
            if request.method == 'POST':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Rate limit exceeded. Please try again later.'
                }, status=429)
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            user_id = body.get('userid')

            main_user = models.UserData.objects.get(user__telegram_user_id=user_id)
            inviteTask = models.refferaltaks.objects.filter(is_active=True).last()

            refferal_count = int(inviteTask.refferalcount)

            if main_user.invite.count() < refferal_count:

                return JsonResponse({
                    'status': 'invite_needs',
                    'message': f'invite {inviteTask.refferalcount} friends and get {inviteTask.giftcount} score.',

                })


            elif inviteTask.user.filter(id=main_user.id).exists():
                return JsonResponse({
                    'status': 'error',
                    'message': 'you have already get the task!'
                })
            else:
                main_user.count += inviteTask.giftcount
                inviteTask.user.add(main_user)
                inviteTask.save()
                main_user.save()
                gift_code = models.giftcodeandroidapp.objects.create(
                    user=main_user,
                    giftcode=get_random_string(10),
                    coin=100000
                )
                gift_code.save()
                return JsonResponse({
                    'status': 'success',
                    'message': f'congratulation you earn {inviteTask.giftcount}.'
                })

        except Exception as e:

            return JsonResponse({
                'status': 'error',
                'message': 'Please try again later.'
            })
