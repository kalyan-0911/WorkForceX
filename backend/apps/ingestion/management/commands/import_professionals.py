import os
import pandas as pd
import numpy as np
from datetime import datetime
from django.core.management.base import BaseCommand
from django.db import transaction
from django.conf import settings
from apps.professionals.models import Professional, Department
from apps.organizations.models import Organization

class Command(BaseCommand):
    help = 'Import professionals from Excel dataset'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default=os.path.join(settings.BASE_DIR.parent, 'data', 'cleaned', 'Employee datas.xlsx'),
            help='Path to the Excel file to import'
        )

    def handle(self, *args, **options):
        file_path = options['file']
        
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File not found: {file_path}'))
            return

        self.stdout.write(self.style.NOTICE(f'Loading data from {file_path}...'))
        
        try:
            df = pd.read_excel(file_path)
            
            if 'Unnamed: 0' in df.columns:
                df = df.drop(columns=['Unnamed: 0'])
                
            # Date columns to parse
            date_columns = ['StartDate', 'ExitDate', 'DOB', 'Survey Date', 'Training Date']
            for col in date_columns:
                if col in df.columns:
                    df[col] = pd.to_datetime(df[col], errors='coerce')
                    
            # Replace NaNs with None for DB insertion
            df = df.replace({np.nan: None})

            imported = 0
            updated = 0
            errors = 0

            self.stdout.write(self.style.NOTICE('Starting database transaction...'))

            with transaction.atomic():
                # 0. Get or Create Demo Organization
                demo_org, _ = Organization.objects.get_or_create(
                    name="Acme Corp (Demo)",
                    defaults={'is_demo': True}
                )
                
                for index, row in df.iterrows():
                    try:
                        # 1. Calculate Readiness Score
                        perf_score = str(row.get('Performance Score', '')).strip().lower()
                        perf_val = 50 # Default
                        if 'exceeds' in perf_score: perf_val = 100
                        elif 'fully' in perf_score: perf_val = 75
                        elif 'pip' in perf_score: perf_val = 25

                        training_outcome = str(row.get('Training Outcome', '')).strip().lower()
                        train_val = 50 # Default
                        if 'pass' in training_outcome or 'complet' in training_outcome: train_val = 100
                        elif 'fail' in training_outcome: train_val = 0

                        engagement = row.get('Engagement Score')
                        engagement_val = (float(engagement) / 5 * 100) if engagement else 50

                        wlb = row.get('Work-Life Balance Score')
                        wlb_val = (float(wlb) / 5 * 100) if wlb else 50

                        def get_val(val):
                            if pd.isna(val):
                                return None
                            return val

                        rating_raw = get_val(row.get('Current Employee Rating'))
                        rating = rating_raw
                        rating_val = (float(rating) / 5 * 100) if rating else 50

                        # Weighted Score: Perf 35%, Train 25%, Eng 20%, WLB 10%, Rating 10%
                        readiness_score = (
                            (perf_val * 0.35) +
                            (train_val * 0.25) +
                            (engagement_val * 0.20) +
                            (wlb_val * 0.10) +
                            (rating_val * 0.10)
                        )

                        # 2. Get or Create Department
                        dept_name = get_val(row.get('DepartmentType'))
                        division = get_val(row.get('Division'))
                        department = None
                        if dept_name:
                            department, _ = Department.objects.get_or_create(
                                name=dept_name,
                                defaults={
                                    'division': division,
                                    'organization': demo_org
                                }
                            )

                        # 3. Update or Create Professional (Idempotent)
                        emp_id = str(row.get('Employee ID', f'TEMP-{index}'))
                        
                        defaults = {
                            'organization': demo_org,
                            'first_name': get_val(row.get('FirstName')) or '',
                            'last_name': get_val(row.get('LastName')) or '',
                            'email': get_val(row.get('ADEmail')),
                            'title': get_val(row.get('Title')),
                            'supervisor': get_val(row.get('Supervisor')),
                            'start_date': get_val(row.get('StartDate')),
                            'exit_date': get_val(row.get('ExitDate')),
                            'employee_status': get_val(row.get('EmployeeStatus')),
                            'employee_type': get_val(row.get('EmployeeType')),
                            'employee_classification_type': get_val(row.get('EmployeeClassificationType')),
                            'pay_zone': get_val(row.get('PayZone')),
                            'termination_type': get_val(row.get('TerminationType')),
                            'termination_description': get_val(row.get('TerminationDescription')),
                            'department': department,
                            'dob': get_val(row.get('DOB')),
                            'state': get_val(row.get('State')),
                            'location_code': get_val(row.get('LocationCode')),
                            'gender_code': get_val(row.get('GenderCode')),
                            'race_desc': get_val(row.get('RaceDesc')),
                            'marital_desc': get_val(row.get('MaritalDesc')),
                            'readiness_score': round(readiness_score, 2),
                            'performance_score': get_val(row.get('Performance Score')),
                            'current_employee_rating': rating_raw,
                            'survey_date': get_val(row.get('Survey Date')),
                            'engagement_score': get_val(row.get('Engagement Score')),
                            'satisfaction_score': get_val(row.get('Satisfaction Score')),
                            'work_life_balance_score': get_val(row.get('Work-Life Balance Score')),
                            'training_date': get_val(row.get('Training Date')),
                            'training_program_name': get_val(row.get('Training Program Name')),
                            'training_type': get_val(row.get('Training Type')),
                            'training_outcome': get_val(row.get('Training Outcome')),
                            'trainer': get_val(row.get('Trainer')),
                            'training_duration_days': get_val(row.get('Training Duration(Days)')),
                            'training_cost': get_val(row.get('Training Cost')),
                        }

                        obj, created = Professional.objects.update_or_create(
                            employee_id=emp_id,
                            defaults=defaults
                        )

                        if created:
                            imported += 1
                        else:
                            updated += 1
                    except Exception as e:
                        errors += 1
                        self.stdout.write(self.style.WARNING(f"Error importing row {index} ({emp_id}): {str(e)}"))

            self.stdout.write(self.style.SUCCESS('Import complete!'))
            self.stdout.write(f'Imported: {imported}')
            self.stdout.write(f'Updated: {updated}')
            self.stdout.write(f'Errors: {errors}')

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to process file: {str(e)}'))
