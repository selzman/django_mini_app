from django.urls import path
from . import views
urlpatterns = [

    path('', views.HomeView.as_view(), name='home'),
    path('data', views.GetUserData.as_view(), name='data'),
    path('HomeViewpost', views.HomeViewpost.as_view(), name='HomeViewpost'),
    path('DailyBonus', views.DailyBonusEveryDayView.as_view(), name='DailyBonus'),

    path('getTasks', views.tasksview.as_view(), name='get_tasks'),
    path('GetProfitView', views.GetProfitView.as_view(), name='get_tasks'),
    path('save', views.SaveDataView.as_view(), name='save'),

    path('luckywheelcheck', views.LuckyWheelCheckView.as_view(), name='luckywheelCehckview'),
    path('luckywheelget', views.LuckyWheelgetView.as_view(), name='luckywheelget'),

    path('DoNotAllow/', views.desktop_redirect, name='desktop_redirect'),
    path('showremainupgrade', views.showremainupgrade.as_view(), name='showremainupgrade'),

    path('remaindataboosts', views.remaindataboosts.as_view(), name='remaindataboosts'),
    path('Fullenergy', views.Fullenergy.as_view(), name='Fullenergy'),
    path('booststapcount', views.booststapcount.as_view(), name='booststapcount'),
    path('Multitap', views.Multitap.as_view(), name='Multitap'),


    path('teamReferralWork', views.teamReferralWork.as_view(), name='teamReferralWork'),




    # path('get_obfuscated_js', views.get_obfuscated_js, name='get-counter'),
    # path('update-counter/', views.update_counter, name='update-counter'),
]