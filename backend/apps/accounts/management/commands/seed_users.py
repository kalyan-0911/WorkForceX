from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with an Employer and a Professional'

    def handle(self, *args, **kwargs):
        # Employer
        employer, created = User.objects.get_or_create(username='employer')
        if created:
            employer.set_password('employer123')
            employer.role = User.Role.EMPLOYER
            employer.email = 'employer@workforcex.com'
            employer.first_name = 'Acme'
            employer.last_name = 'Corp'
            employer.save()
            self.stdout.write(self.style.SUCCESS('Successfully created employer user.'))
        else:
            self.stdout.write(self.style.WARNING('Employer user already exists.'))

        # Professional
        professional, created = User.objects.get_or_create(username='professional')
        if created:
            professional.set_password('professional123')
            professional.role = User.Role.PROFESSIONAL
            professional.email = 'professional@workforcex.com'
            professional.first_name = 'John'
            professional.last_name = 'Doe'
            professional.save()
            self.stdout.write(self.style.SUCCESS('Successfully created professional user.'))
        else:
            self.stdout.write(self.style.WARNING('Professional user already exists.'))
