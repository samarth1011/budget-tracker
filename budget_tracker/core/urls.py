from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import CategoryViewSet, DashboardAPIView, TransactionViewSet, BudgetViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet)
router.register('transactions', TransactionViewSet)
router.register('budgets', BudgetViewSet)
# router.register('dashboard', DashboardAPIView.as_view(), basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardAPIView.as_view(), name='dashboard')
]
