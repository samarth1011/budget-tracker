from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError
import datetime
from django.db.models import Sum
# Create your views here.
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, DashboardSerializer, TransactionSerializer, BudgetSerializer
from collections import defaultdict
from rest_framework.response import Response
from django.db.models.functions import TruncMonth

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        month = serializer.validated_data.get('month')
        year = serializer.validated_data.get('year')
        current_year = datetime.date.today().year

        # Check if the year is not the current year
        if year != current_year:
            raise ValidationError({'year': 'You can only create a budget for the current year.'})

        # Check if a budget for this month/year already exists for this user
        if Budget.objects.filter(user=user, month=month, year=year).exists():
            raise ValidationError({'month': 'A budget for this month already exists for this user.'})

        serializer.save(user=user)


from rest_framework.views import APIView

class DashboardAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        current_year = datetime.datetime.now().year
        current_month = datetime.datetime.now().month

        # Total Income
        total_income = (
            Transaction.objects.filter(user=user, transaction_type="Income")
            .aggregate(total=Sum("amount"))["total"]
            or 0
        )

        # Total Expense
        total_expense = (
            Transaction.objects.filter(user=user, transaction_type="Expense")
            .aggregate(total=Sum("amount"))["total"]
            or 0
        )

        # Latest Budget (for current month & year)
        latest_budget = (
            Budget.objects.filter(user=user, month=current_month, year=current_year)
            .order_by("-created_at")
            .first()
        )

        total_budget = latest_budget.amount if latest_budget else 0
        budget_remaining = latest_budget.budget_remaining if latest_budget else 0

        # Monthly Income & Expense
        monthly_data = (
            Transaction.objects.filter(user=user)
            .annotate(month=TruncMonth("date"))
            .values("month", "transaction_type")
            .annotate(amount=Sum("amount"))
        )

        monthly_summary = defaultdict(lambda: {"income": 0, "expense": 0})
        for item in monthly_data:
            month_name = item["month"].strftime("%b")
            if item["transaction_type"] == "Income":
                monthly_summary[month_name]["income"] = item["amount"]
            else:
                monthly_summary[month_name]["expense"] = item["amount"]

        income_expense_monthly = [
            {
                "month": month,
                "income": values["income"],
                "expense": values["expense"],
            }
            for month, values in monthly_summary.items()
        ]

        # Category-wise Expense
        category_data = (
            Transaction.objects.filter(user=user, transaction_type="Expense")
            .values("category__name")
            .annotate(amount=Sum("amount"))
        )

        category_expenses = [
            {"category": item["category__name"], "amount": item["amount"]}
            for item in category_data
        ]

        # Serialize response
        data = {
            "total_income": total_income,
            "total_expense": total_expense,
            "total_budget": total_budget,
            "budget_remaining": budget_remaining,
            "income_expense_monthly": income_expense_monthly,
            "category_expenses": category_expenses,
        }

        serializer = DashboardSerializer(data)
        return Response(serializer.data)


