from django.db import models
from accounts.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at', '-updated_at']


class EmployeeProfile(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, to_field='username')
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=80)
    gender = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    industry = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    skills = models.CharField(max_length=500)

    def __str__(self):
        return self.user.username


class WorkExperience(models.Model):
    employee = models.ForeignKey(
        EmployeeProfile, on_delete=models.CASCADE, related_name='workexperience')
    position = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    location = models.CharField(max_length=100)

    def __str__(self):
        return '%s: %s' % (self.employee, self.position)

    class Meta:
        ordering = ['start_date']
