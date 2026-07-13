from django.urls import path
from .views import ProfessionalListView, ProfessionalDetailView, DashboardSummaryView, ProfessionalMeView

urlpatterns = [
    path('', ProfessionalListView.as_view(), name='professional-list'),
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('me/', ProfessionalMeView.as_view(), name='professional-me'),
    path('<uuid:pk>/', ProfessionalDetailView.as_view(), name='professional-detail'),
]
