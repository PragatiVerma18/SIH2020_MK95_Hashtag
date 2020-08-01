from django.contrib.auth.models import AbstractUser
from django.db import models

from accounts.managers import UserManager


ROLE_CHOICES = (
    ('employer', 'Employer'),
    ('employee', 'Employee'))


class User(AbstractUser):
    username = models.CharField(max_length=100, unique=True, blank=False, default='', error_messages={
        'required': "Username must be provided.",
        'unique': "A user with that username already exists."
    })
    role = models.CharField(max_length=12, error_messages={
        'required': "Role must be provided"
    })
    verified = models.BooleanField(default=False)
    email = models.EmailField(unique=True, blank=False,
                              error_messages={
                                  'unique': "A user with that email already exists.",
                              })
    is_active = models.BooleanField(default=True)

    REQUIRED_FIELDS = ["email"]

    def __unicode__(self):
        return self.email

    objects = UserManager()
