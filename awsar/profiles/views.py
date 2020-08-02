from django.shortcuts import render
from rest_framework import generics
from .serializers import EmployeeProfileSerializer, EmployerProfileSerializer
from .models import EmployeeProfile, WorkExperience, Education, EmployerProfile
from django.shortcuts import get_object_or_404
from rest_framework.response import Response


class EmployeeProfileCreateView(generics.CreateAPIView):
    serializer_class = EmployeeProfileSerializer

    def get_serializer_context(self, *args, **kwargs):
        return {'request': self.request}

    def get_queryset(self):
        user = self.request.user
        return EmployeeProfile.objects.all()


class EmployeeProfileListView(generics.RetrieveUpdateAPIView):
    model = EmployeeProfile
    serializer_class = EmployeeProfileSerializer
    queryset = EmployeeProfile.objects.all()
    lookup_field = 'user'

    def retrieve(self, request, user):
        queryset = EmployeeProfile.objects.filter(user=user)
        profile = get_object_or_404(queryset, user=user)
        serializer = EmployeeProfileSerializer(profile)
        return Response(serializer.data)

    # def get_serializer_context(self, *args, **kwargs):
    #     return {'request': self.request}

    # def get_queryset(self):
    #     user = self.request.user
    #     return EmployeeProfile.objects.all()


class EmployerProfileCreateView(generics.CreateAPIView):
    model = EmployerProfile
    serializer_class = EmployerProfileSerializer


class EmployerProfileListView(generics.RetrieveUpdateAPIView):
    model = EmployerProfile
    serializer_class = EmployerProfileSerializer
    queryset = EmployerProfile.objects.all()
    lookup_field = 'user'

    def retrieve(self, request, user):
        queryset = EmployerProfile.objects.filter(user=user)
        profile = get_object_or_404(queryset, user=user)
        serializer = EmployerProfileSerializer(profile)
        return Response(serializer.data)
