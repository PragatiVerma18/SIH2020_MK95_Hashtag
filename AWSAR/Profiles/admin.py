from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import EmployeeProfile, WorkExperience, Education, EmployerProfile

admin.site.register(EmployeeProfile)
admin.site.register(WorkExperience)

admin.site.register(Education)
admin.site.register(EmployerProfile)