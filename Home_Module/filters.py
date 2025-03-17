from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from datetime import timedelta
from django.utils import timezone
from .models import UserData
from django.db.models import Count

class CountRangeFilter(admin.SimpleListFilter):
    title = _('count')
    parameter_name = 'count'

    def lookups(self, request, model_admin):
        return (
            ('lt_1000000', _('Less than 1,000,000')),
            ('1000000_5000000', _('1,000,000 to 5,000,000')),
            ('5000000_13000000', _('5,000,000 to 13,000,000')),
            ('13000000_20000000', _('13,000,000 to 20,000,000')),
            ('20000000_27000000', _('20,000,000 to 27,000,000')),
            ('27000000_35000000', _('27,000,000 to 35,000,000')),
            ('35000000_42000000', _('35,000,000 to 42,000,000')),
            ('42000000_55000000', _('42,000,000 to 55,000,000')),
            ('55000000_75000000', _('55,000,000 to 75,000,000')),
            ('75000000_99000000', _('75,000,000 to 99,000,000')),
            ('gt_99000000', _('More than 99,000,000')),
        )

    def queryset(self, request, queryset):
        if self.value() == 'lt_1000000':
            return queryset.filter(count__lt=1000000)
        if self.value() == '1000000_5000000':
            return queryset.filter(count__gte=1000000, count__lte=5000000)
        if self.value() == '5000000_13000000':
            return queryset.filter(count__gte=5000000, count__lte=13000000)
        if self.value() == '13000000_20000000':
            return queryset.filter(count__gte=13000000, count__lte=20000000)
        if self.value() == '20000000_27000000':
            return queryset.filter(count__gte=20000000, count__lte=27000000)
        if self.value() == '27000000_35000000':
            return queryset.filter(count__gte=27000000, count__lte=35000000)
        if self.value() == '35000000_42000000':
            return queryset.filter(count__gte=35000000, count__lte=42000000)
        if self.value() == '42000000_55000000':
            return queryset.filter(count__gte=42000000, count__lte=55000000)
        if self.value() == '55000000_75000000':
            return queryset.filter(count__gte=55000000, count__lte=75000000)
        if self.value() == '75000000_99000000':
            return queryset.filter(count__gte=75000000, count__lte=99000000)
        if self.value() == 'gt_99000000':
            return queryset.filter(count__gt=99000000)

class LevelFilter(admin.SimpleListFilter):
    title = _('level')
    parameter_name = 'level'

    def lookups(self, request, model_admin):
        return (
            ('lt_4', _('Less than 4')),
            ('5_8', _('5 to 8')),
            ('9_10', _('level 9 to 10')),
        )

    def queryset(self, request, queryset):
        if self.value() == 'lt_4':
            return queryset.filter(level__lt=4)
        if self.value() == '5_8':
            return queryset.filter(level__gte=5, level__lte=8)
        if self.value() == '9_10':
            return queryset.filter(level__gte=9, level__lte=10)

class InviteRangeFilter(admin.SimpleListFilter):
    title = _('Number of invites')
    parameter_name = 'invite_count'

    def lookups(self, request, model_admin):
        return (
            ('lt_4', _('Less than 4 invites')),
            ('5_8', _('Between 5 and 8 invites')),
            ('gt_9', _('More than 9 invites')),
        )

    def queryset(self, request, queryset):
        # Annotate the queryset with the count of invites
        queryset = queryset.annotate(invite_count=Count('invite'))

        if self.value() == 'lt_4':
            return queryset.filter(invite_count__lt=4)
        if self.value() == '5_8':
            return queryset.filter(invite_count__gte=5, invite_count__lte=8)
        if self.value() == 'gt_9':
            return queryset.filter(invite_count__gt=9)
        return queryset