from django.db import models
from django.utils import timezone
from accounts.models import User
from profiles.models import EmployeeProfile


class Job(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, to_field='username')
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=150)
    type = models.CharField(max_length=10)
    category = models.CharField(max_length=100)
    last_date = models.DateTimeField()
    company_name = models.CharField(max_length=100)
    vacancies = models.IntegerField(default=1)
    doc_url = models.URLField(blank=True)
    summary = models.TextField(blank=True)
    qualification = models.TextField(blank=True)
    experience = models.PositiveIntegerField(default=0)
    age_limit = models.CharField(max_length=500, default='age >18')
    website = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    filled = models.BooleanField(default=False)
    salary = models.IntegerField(default=0, blank=True)
    tags = models.TextField(default='')
    job_for_women = models.BooleanField(default=False, null=True)
    job_for_disabled = models.BooleanField(default=False, null=True)

    def __str__(self):
        return self.title


class Applicant(models.Model):
    employee = models.ForeignKey(
        EmployeeProfile, on_delete=models.CASCADE, to_field='user', related_name='applicants')
    job = models.ForeignKey(Job, on_delete=models.CASCADE,
                            related_name='applicants')
    applied_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=15, default='Applied')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.employee.first_name
