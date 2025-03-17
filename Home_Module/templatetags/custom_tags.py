from django import template

register = template.Library()

@register.filter
def pluck(queryset, attr):
    """
    Extracts a specific attribute from each object in a queryset and returns a list of those attribute values.
    """
    return [getattr(item, attr) for item in queryset]


@register.filter
def format_number(value):
    """Formats a number with commas."""
    try:
        value = int(value)
        return f"{value:,}"
    except (ValueError, TypeError):
        return value