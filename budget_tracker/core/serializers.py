from rest_framework import serializers
from .models import Category, Transaction, Budget

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'user', 'created_at']  # Include user but don't require it
        read_only_fields = ['user']      

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'category', 'amount', 'transaction_type', 'date', 'description', 'user']
        read_only_fields = ['user','id']   

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'month', 'amount', 'user','created_at', 'year', 'budget_remaining', 'budget_spent']
        read_only_fields = ['user','id']



class IncomeExpenseMonthlySerializer(serializers.Serializer):
    month = serializers.CharField()
    income = serializers.DecimalField(max_digits=10, decimal_places=2)
    expense = serializers.DecimalField(max_digits=10, decimal_places=2)


class CategoryExpenseSerializer(serializers.Serializer):
    category = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)


class DashboardSerializer(serializers.Serializer):
    total_income = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_expense = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_budget = serializers.DecimalField(max_digits=10, decimal_places=2)
    budget_remaining = serializers.DecimalField(max_digits=10, decimal_places=2)
    income_expense_monthly = IncomeExpenseMonthlySerializer(many=True)
    category_expenses = CategoryExpenseSerializer(many=True)

        
