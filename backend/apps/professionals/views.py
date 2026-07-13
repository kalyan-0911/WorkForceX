from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Count, F
from .models import Professional, Department
from .serializers import ProfessionalSerializer

class ProfessionalListView(generics.ListAPIView):
    queryset = Professional.objects.all()
    serializer_class = ProfessionalSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department', 'employee_status']
    search_fields = ['first_name', 'last_name', 'employee_id']
    ordering_fields = ['readiness_score', 'first_name', 'start_date']
    ordering = ['-readiness_score']

class ProfessionalMeView(generics.RetrieveAPIView):
    serializer_class = ProfessionalSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Return the professional profile linked to the authenticated user
        user = self.request.user
        if hasattr(user, 'professional_profile'):
            return user.professional_profile
        from rest_framework.exceptions import NotFound
        raise NotFound("No professional profile is associated with this user account.")

class ProfessionalDetailView(generics.RetrieveAPIView):
    queryset = Professional.objects.all()
    serializer_class = ProfessionalSerializer
    permission_classes = [IsAuthenticated]

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_professionals = Professional.objects.count()
        total_departments = Department.objects.count()
        active_professionals = Professional.objects.filter(employee_status__icontains='active').count()

        import math
        def safe_avg(val):
            if val is None or math.isnan(val):
                return 0.0
            return float(val)

        avg_readiness = safe_avg(Professional.objects.aggregate(Avg('readiness_score'))['readiness_score__avg'])
        
        # Insights
        largest_dept = Professional.objects.values('department__name').annotate(count=Count('id')).order_by('-count').first()
        highest_readiness_dept = Professional.objects.values('department__name').annotate(avg_r=Avg('readiness_score')).order_by('-avg_r').first()
        most_common_title = Professional.objects.values('title').annotate(count=Count('id')).order_by('-count').first()

        # Top 5 Departments
        top_departments = Professional.objects.values('department__name').annotate(count=Count('id')).order_by('-count')[:5]
        
        # Top 5 Job Titles
        top_titles = Professional.objects.values('title').annotate(count=Count('id')).order_by('-count')[:5]

        return Response({
            'total_professionals': total_professionals,
            'active_professionals': active_professionals,
            'avg_readiness_score': round(avg_readiness, 2),
            'total_departments': total_departments,
            
            'highest_readiness_department': highest_readiness_dept['department__name'] if highest_readiness_dept else 'N/A',
            'largest_department': largest_dept['department__name'] if largest_dept else 'N/A',
            'most_common_title': most_common_title['title'] if most_common_title else 'N/A',

            'top_departments': [{'name': d['department__name'] or 'Unknown', 'count': d['count']} for d in top_departments],
            'top_titles': [{'title': t['title'] or 'Unknown', 'count': t['count']} for t in top_titles],
        })
