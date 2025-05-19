from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Transaction, Budget
from datetime import date

from .models import *


def update_budget_summary(user, month, year):
    # Get all Expense transactions for the user for the month/year
    expenses = Transaction.objects.filter(
        user=user,
        transaction_type='Expense',
        date__month=month,
        date__year=year
    ).aggregate(total=models.Sum('amount'))['total'] or 0

    try:
        budget = Budget.objects.get(user=user, month=month, year=year)
        budget.budget_spent = expenses
        budget.budget_remaining = budget.amount - expenses
        budget.save()
    except Budget.DoesNotExist:
        pass  # No budget exists yet


@receiver(post_save, sender=Transaction)
def handle_transaction_save(sender, instance, **kwargs):
    update_budget_summary(instance.user, instance.date.month, instance.date.year)


@receiver(post_delete, sender=Transaction)
def handle_transaction_delete(sender, instance, **kwargs):
    update_budget_summary(instance.user, instance.date.month, instance.date.year)
# The above function will be called whenever a Transaction is saved or deleted.
# It will update the corresponding Budget's budget_spent and budget_remaining fields.