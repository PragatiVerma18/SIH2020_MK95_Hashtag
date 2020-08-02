import re
from django.db import models
from accounts.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from phonenumber_field.modelfields import PhoneNumberField
from django.core.validators import RegexValidator

validate_pan = RegexValidator(
    r'[A-Z]{5}[0-9]{4}[A-Z]{1}', 'Enter a Valid PAN Number')


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at', '-updated_at']


class EmployeeProfile(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, to_field='username', unique=True)
    first_name = models.CharField(max_length=80)
    last_name = models.CharField(max_length=80)
    gender = models.CharField(max_length=50)
    disabled = models.BooleanField(null=True, default=False)
    about = models.TextField(max_length=500)
    phone_number = PhoneNumberField(blank=True)
    email = models.EmailField()
    dob = models.DateField(null=True)
    title = models.CharField(max_length=100)
    industry = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    skills = models.TextField()
    portfolio = models.URLField(blank=True)
    github = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    image = models.URLField(
        default='https://www.pngkey.com/png/full/305-3050875_employee-parking-add-employee-icon-png.png')

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


class Education(models.Model):
    employee = models.ForeignKey(
        EmployeeProfile, on_delete=models.CASCADE, related_name='education')
    institution = models.CharField(max_length=100)
    degree = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()

    class Meta:
        ordering = ['start_date']

    def __str__(self):
        return '%s: %s' % (self.employee, self.degree)


class EmployerProfile(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, to_field='username')
    email = models.EmailField()
    company_name = models.CharField(max_length=200)
    full_form = models.CharField(max_length=500, blank=True)
    location = models.CharField(max_length=100)
    website = models.URLField(null=True, blank=True)
    industry = models.CharField(max_length=50)
    company_size = models.IntegerField()
    company_type = models.CharField(max_length=50)
    pan = models.CharField(max_length=10, validators=[
                           validate_pan], blank=True)
    overview = models.TextField(max_length=500)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    image = models.URLField(
        default='https://cdn0.iconfinder.com/data/icons/building-vol-9/512/12-512.png')

    def __str__(self):
        return '%s' % (self.company_name)
