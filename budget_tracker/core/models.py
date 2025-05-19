import calendar
from django.contrib.auth.models import User
from django.db import models

class Category(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('Income', 'Income'),
        ('Expense', 'Expense'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=7, choices=TRANSACTION_TYPES)
    date = models.DateField()
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.category.name} - {self.amount}"

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    month = models.IntegerField(choices=[(i, calendar.month_name[i]) for i in range(1, 13)])
    year = models.IntegerField()
    budget_remaining = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    budget_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'month', 'year')  # Only one budget per month per user

    def __str__(self):
        return f"{self.user.username} - {calendar.month_name[self.month]} {self.year}: {self.amount}"
