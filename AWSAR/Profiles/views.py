from django.shortcuts import render
from rest_framework import generics
from .serializers import EmployeeProfileSerializer, EmployerProfileSerializer
from .models import EmployeeProfile, WorkExperience, Education, EmployerProfile


class EmployeeProfileCreateView(generics.CreateAPIView):
    serializer_class = EmployeeProfileSerializer

    def get_serializer_context(self, *args, **kwargs):
        return {'request': self.request}

    def get_queryset(self):
        user = self.request.user
        return EmployeeProfile.objects.all()


class EmployeeProfileListView(generics.RetrieveUpdateAPIView):
    serializer_class = EmployeeProfileSerializer

    def get_serializer_context(self, *args, **kwargs):
        return {'request': self.request}

    def get_queryset(self):
        user = self.request.user
        return EmployeeProfile.objects.all()


class EmployerProfileCreateView(generics.CreateAPIView):
    model = EmployerProfile
    serializer_class = EmployerProfileSerializer


class EmployerProfileListView(generics.RetrieveUpdateAPIView):
    model = EmployerProfile
    serializer_class = EmployerProfileSerializer

    def get_queryset(self):
        user = self.request.user
        return EmployerProfile.objects.all()