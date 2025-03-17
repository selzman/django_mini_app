from datetime import timezone

from django.db import models
import random
import string

from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone
import hashlib
from datetime import timedelta ,datetime
from django.utils.crypto import get_random_string
class TelegramUser(models.Model):
    telegram_user_id = models.BigIntegerField(unique=True)
    username = models.CharField(max_length=150, blank=True, null=True)
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    last_activity = models.DateTimeField(blank=True, null=True)
    referral_code = models.CharField(max_length=150, unique=True, blank=True, null=True)
    token = models.CharField(max_length=150, blank=True, null=True, unique=True)
    bonus_claimed = models.BooleanField(default=False)
    current_bonus_day = models.IntegerField(default=1)



    def __str__(self):
        return self.username or "No Username"

    def generate_random_string(self, length=20):
        characters = string.ascii_letters + string.digits
        return ''.join(random.choice(characters) for i in range(length))

    def generate_token(self):
        raw_token = self.generate_random_string(50)
        hashed_token = hashlib.sha256(raw_token.encode()).hexdigest()
        return hashed_token



    def update_user_activity(self):
        now = timezone.now()
        two_days_ago = now - timedelta(days=2)

        # If the user has been inactive for more than 2 days or has no activity
        if self.last_activity is None or (now - self.last_activity).total_seconds() > 2 * 24 * 3600:
            # Reset current bonus day to 1
            self.current_bonus_day = 1

            # Remove the user from all DailyBonus instances
            daily_bonuses = DailyBonus.objects.filter(user=self)
            for daily_bonus in daily_bonuses:
                daily_bonus.user.remove(self)  # Correct way to remove user from ManyToManyField

        else:
            # If the user was active before today, update their bonus day
            if self.last_activity.date() < now.date():
                self.current_bonus_day = (self.current_bonus_day % 9) + 1

        # Update last activity time and save the changes
        self.last_activity = now
        self.save()






class UserData(models.Model):
    user = models.ForeignKey('TelegramUser', on_delete=models.CASCADE)
    count = models.BigIntegerField(default=1000000)
    energy = models.BigIntegerField(default=3000)
    level = models.IntegerField(default=1)
    invite = models.ManyToManyField('TelegramUser', blank=True, related_name='invites')
    ads = models.IntegerField(default=0)
    luckywheel = models.IntegerField(default=0)
    get_profit = models.BooleanField(default=True)
    blueTicks = models.BooleanField(default=False)
    tap = models.IntegerField(default=4)
    bostlimit = models.IntegerField(default=10)
    last_activity = models.DateTimeField(auto_now_add=True)
    invited_by = models.ForeignKey('TelegramUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='invited_users')
    reward_given = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        today = timezone.now().date()

        if is_new:
            # Save the new UserData object first to get its ID
            super(UserData, self).save(*args, **kwargs)


            # Create associated giftcodeandroidapp entry
            giftcodeandroidapp.objects.create(
                user=self,
                giftcode=get_random_string(10),
                coin=500000
            )

            # Initialize the DailyCountLog with zero count_added for the new user
            DailyCountLog.objects.create(
                user_data=self,
                date=today,
                count_added=0
            )

        else:
            # Fetch previous count for calculation
            previous_data = UserData.objects.get(pk=self.pk)
            previous_count = previous_data.count

            # Save the updated UserData object first
            super(UserData, self).save(*args, **kwargs)

            # Calculate the increment
            increment = self.count - previous_count


            # Get the latest daily log for this user
            daily_log = DailyCountLog.objects.filter(user_data=self).latest('date')

            # Check if the log is from a previous day
            if daily_log.date < today:
                # It's a new day, reset the count_added to 0
                daily_log.count_added = 0

            # Update today's log with the increment
            daily_log.count_added += increment
            daily_log.date = today  # Update the date to today
            daily_log.save()



    def __str__(self):
        return str(self.user)


class Tasks(models.Model):
    user = models.ManyToManyField(TelegramUser, blank=True)
    name = models.CharField(max_length=150, blank=True, null=True)
    image = models.ImageField(blank=True, null=True)
    gift = models.IntegerField(default=0)
    link = models.URLField(blank=True, null=True)


    def __str__(self):
        return self.name




class EarningsYoutubeVideos(models.Model):
    user = models.ManyToManyField(TelegramUser, blank=True)
    title = models.CharField(max_length=150, blank=True, null=True)
    link = models.URLField(max_length=150, blank=True, null=True)
    giftCount = models.IntegerField(default=0)








class DailyBonus(models.Model):
    user = models.ManyToManyField(TelegramUser, blank=True, related_name='dailyBonus')
    title = models.CharField(max_length=150, blank=True, null=True)
    giftCount = models.IntegerField(default=0)

    day = models.IntegerField()

    def __str__(self):
        return self.title







class NftStore(models.Model):
    image=models.ImageField(unique='/uploads/nft_store',blank=True, null=True)
    title=models.CharField(max_length=150, blank=True, null=True)
    link=models.URLField(max_length=150, blank=True, null=True)


    def __str__(self):
        return self.title




class giftcodeandroidapp(models.Model):
    user=models.ForeignKey(UserData,on_delete=models.CASCADE)
    giftcode=models.CharField(max_length=150,unique=True , blank=True, null=True)
    coin=models.IntegerField(default=0)


    def __str__(self):
        return self.giftcode

















class TelegramMessage(models.Model):
    message = models.TextField(blank=True, null=True)
    image = models.ImageField(blank=True, null=True)
    link_text = models.CharField(max_length=150, blank=True, null=True)
    link = models.URLField(max_length=150, blank=True, null=True)
    link2_text = models.CharField(max_length=150, blank=True, null=True)
    link2 = models.URLField(max_length=150, blank=True, null=True)
    link3_text = models.CharField(max_length=150, blank=True, null=True)
    link3 = models.URLField(max_length=150, blank=True, null=True)





class GlobalRechargeTracker(models.Model):
    last_recharge_time = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Last recharge time: {self.last_recharge_time}"





class Fullenergy(models.Model):
    user = models.ForeignKey(UserData, on_delete=models.CASCADE)
    count = models.IntegerField(default=1)
    DateTime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{str(self.user)} , {self.count}'




class booststapcount(models.Model):
    user=models.ForeignKey(UserData, on_delete=models.CASCADE)
    count=models.IntegerField(default=1)
    DateTime = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f'{str(self.user)} , {self.count}'


class MultiTap(models.Model):
    user=models.ForeignKey(UserData, on_delete=models.CASCADE)
    count=models.IntegerField(default=1)
    DateTime = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{str(self.user)} , {self.count}'







class refferaltaks(models.Model):
    user=models.ManyToManyField(UserData,blank=True, )
    name=models.CharField(max_length=150, blank=True, null=True)
    refferalcount=models.IntegerField(default=0)
    giftcount=models.IntegerField(default=0)
    is_active=models.BooleanField(default=False)

    def __str__(self):
        return f'{str(self.giftcount)} , {self.refferalcount}'





class EstimatedDollarIncome(models.Model):
    user=models.ForeignKey(UserData, on_delete=models.CASCADE)
    count=models.IntegerField(default=0)

    def __str__(self):
        return f' {self.count}'





class Lottery(models.Model):
    level = models.IntegerField(default=1)
    price = models.IntegerField(default=100)
    Date = models.DateTimeField()
    user_amount = models.IntegerField(default=10)

    def __str__(self):
        return f'{self.level}, {self.price}'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        from Home_Module.tasks import check_lottery_time
        if self.Date > timezone.now():
            # Schedule the task to run at the specified future date
            check_lottery_time.apply_async((self.id,), eta=self.Date)





class lotteryamount(models.Model):
    user=models.ForeignKey(UserData, on_delete=models.CASCADE)
    lottery = models.ForeignKey(Lottery, on_delete=models.CASCADE,null=True, blank=True)
    amount=models.IntegerField(default=0)

    def __str__(self):
        return f' {self.amount}'


class DailyCountLog(models.Model):
    user_data = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='daily_logs')
    date = models.DateField(default=timezone.now)
    count_added = models.BigIntegerField(default=0)

    def __str__(self):
        return f"{self.user_data.user} - {self.date}: {self.count_added} counts"




