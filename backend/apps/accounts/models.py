import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        EMPLOYER = 'EMPLOYER', 'Employer'
        PROFESSIONAL = 'PROFESSIONAL', 'Professional'

    role = models.CharField(max_length=15, choices=Role.choices, default=Role.PROFESSIONAL)

    def __str__(self):
        return self.username
