from rest_framework import serializers
from .models import Professional, Department

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class ProfessionalSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = Professional
        fields = '__all__'

    def to_representation(self, instance):
        import math
        data = super().to_representation(instance)
        for key, value in data.items():
            if isinstance(value, float) and math.isnan(value):
                data[key] = None
        return data
