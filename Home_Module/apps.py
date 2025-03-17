from django.apps import AppConfig
import os


class HomeModuleConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Home_Module'

    def ready(self):
        import Home_Module.signals




