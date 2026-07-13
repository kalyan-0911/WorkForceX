from django.db import models
from django.conf import settings
import uuid

class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey('organizations.Organization', on_delete=models.CASCADE, related_name='departments', null=True, blank=True)
    name = models.CharField(max_length=255, unique=True)
    division = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name

class Professional(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey('organizations.Organization', on_delete=models.CASCADE, related_name='professionals', null=True, blank=True)
    
    # Optional link to user account if they sign in
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='professional_profile')
    
    # Core identifying field (used for idempotency)
    employee_id = models.CharField(max_length=100, unique=True)
    
    # Basic Info
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(null=True, blank=True)
    
    # Employment
    title = models.CharField(max_length=255, null=True, blank=True)
    supervisor = models.CharField(max_length=255, null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    exit_date = models.DateField(null=True, blank=True)
    
    employee_status = models.CharField(max_length=100, null=True, blank=True)
    employee_type = models.CharField(max_length=100, null=True, blank=True)
    employee_classification_type = models.CharField(max_length=100, null=True, blank=True)
    pay_zone = models.CharField(max_length=100, null=True, blank=True)
    
    termination_type = models.CharField(max_length=100, null=True, blank=True)
    termination_description = models.TextField(null=True, blank=True)
    
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='professionals')
    
    # Demographics
    dob = models.DateField(null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    location_code = models.CharField(max_length=100, null=True, blank=True)
    gender_code = models.CharField(max_length=20, null=True, blank=True)
    race_desc = models.CharField(max_length=100, null=True, blank=True)
    marital_desc = models.CharField(max_length=50, null=True, blank=True)
    
    # Analytics / AI Scoring
    readiness_score = models.FloatField(default=0.0)

    # TODO: Normalize Performance and Training fields into separate models in a future version.
    # For MVP, we merge these fields directly into the Professional model.
    
    # Performance (MVP Merged)
    performance_score = models.CharField(max_length=100, null=True, blank=True)
    current_employee_rating = models.IntegerField(null=True, blank=True)
    survey_date = models.DateField(null=True, blank=True)
    engagement_score = models.FloatField(null=True, blank=True)
    satisfaction_score = models.FloatField(null=True, blank=True)
    work_life_balance_score = models.FloatField(null=True, blank=True)
    
    # Training (MVP Merged)
    training_date = models.DateField(null=True, blank=True)
    training_program_name = models.CharField(max_length=255, null=True, blank=True)
    training_type = models.CharField(max_length=100, null=True, blank=True)
    training_outcome = models.CharField(max_length=100, null=True, blank=True)
    trainer = models.CharField(max_length=255, null=True, blank=True)
    training_duration_days = models.IntegerField(null=True, blank=True)
    training_cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.employee_id})"

class Skill(models.Model):
    # Future-ready model for Skills
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return self.name

class ProfessionalSkill(models.Model):
    # Future-ready model mapping professionals to skills
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE, related_name='skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    proficiency = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return f"{self.professional.first_name} - {self.skill.name}"
