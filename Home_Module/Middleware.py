from django.utils.deprecation import MiddlewareMixin
import user_agents
from django.http import HttpResponseRedirect
class RedirectNonMobileMiddleware(MiddlewareMixin):

    def process_request(self, request):
        # Check if the request path is already the redirect page
        if request.path == '/DoNotAllow/':
            return None

        user_agent = user_agents.parse(request.META.get('HTTP_USER_AGENT', ''))

        # Check if the user agent is not a mobile device (including tablets)
        if not (user_agent.is_mobile or user_agent.is_tablet):
            return HttpResponseRedirect('/DoNotAllow/')  # Redirect non-mobile users to /DoNotAllow/

        # If the user agent is a mobile or tablet, continue as normal
        return None

