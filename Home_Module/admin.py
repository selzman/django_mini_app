
from .import models
from .models import Tasks, TelegramUser
from django.contrib import admin
from .filters import CountRangeFilter, LevelFilter, InviteRangeFilter  # Import custom filters




@admin.register(Tasks)
class TasksAdmin(admin.ModelAdmin):
    list_display = ('name', 'gift', 'link')
    search_fields = ('name',)
    list_filter = ('gift',)
    filter_horizontal = ('user',)




@admin.register(TelegramUser)
class TelegramUserAdmin(admin.ModelAdmin):
    list_display = ('telegram_user_id', 'username', 'first_name', 'last_name', 'last_activity')
    search_fields = ('telegram_user_id', 'username', 'first_name', 'last_name')
    list_filter = ('last_activity',)






@admin.register(models.UserData)
class UserCounterAdmin(admin.ModelAdmin):
    list_display = ('user', 'count', 'level', 'last_activity',)
    search_fields = ('user__username', 'count', 'level',)  # user__username if it's a ForeignKey to User
    # list_filter = (CountRangeFilter, LevelFilter, InviteRangeFilter)  # Custom filters
    list_filter = ('last_activity','level', CountRangeFilter , InviteRangeFilter,)
    filter_horizontal = ('invite',)
    ordering = ('-count',)









@admin.register(models.EarningsYoutubeVideos)
class EarningsYoutubeVideosAdmin(admin.ModelAdmin):
    list_display = ('title','giftCount','link',)
    list_editable = ('giftCount','link',)
    search_fields = ('title','giftCount','link',)
    list_filter = ('title','giftCount','link',)
    filter_horizontal = ('user',)





@admin.register(models.DailyBonus)
class DailyBonusAdmin(admin.ModelAdmin):
    list_display = ('title','giftCount',)
    filter_horizontal = ('user',)





@admin.register(models.NftStore)
class NftStoreAdmin(admin.ModelAdmin):
    list_display = ('title','link',)
    search_fields = ('title','link',)
    list_filter = ('title','link',)





@admin.register(models.giftcodeandroidapp)
class GiftcodeandroidAppAdmin(admin.ModelAdmin):
    list_display = ('giftcode',)
    search_fields = ('giftcode',)
    list_filter = ('giftcode',)








@admin.register(models.TelegramMessage)
class TelegramMessageAdmin(admin.ModelAdmin):
    list_display = ('message',)





@admin.register(models.Fullenergy)
class FullenergyAdmin(admin.ModelAdmin):
    list_display = ('user','count','DateTime',)


@admin.register(models.booststapcount)
class booststapcountAdmin(admin.ModelAdmin):
    list_display = ('user', 'count', 'DateTime',)

@admin.register(models.MultiTap)
class MultiTapAdmin(admin.ModelAdmin):
    list_display = ('user', 'count', 'DateTime',)


@admin.register(models.refferaltaks)
class MultiTapAdmin(admin.ModelAdmin):
    list_display = ('refferalcount', 'giftcount', 'is_active',)
    list_editable =('is_active',)
    filter_horizontal = ('user',)



@admin.register(models.EstimatedDollarIncome)
class MultiTapAdmin(admin.ModelAdmin):
    list_display = ('user','count',)



@admin.register(models.Lottery)
class LotteryAdmin(admin.ModelAdmin):
    list_display = ('price','level','Date')

@admin.register(models.lotteryamount)
class LotteryAdmin(admin.ModelAdmin):
    list_display = ('user','amount',)


@admin.register(models.DailyCountLog)
class DailyCountLogAdmin(admin.ModelAdmin):
    list_display = ('user_data','count_added','date')
    search_fields = ('user_data','count_added','date')
    list_filter = ('date','count_added',)
    ordering = ('-count_added',)
