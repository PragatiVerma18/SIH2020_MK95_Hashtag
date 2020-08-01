from .serializers import UserSerializer
from ..models import User
from .serializers import EmployerRegisterSerializer, EmployeeRegisterSerializer
from rest_framework import viewsets
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class EmployerRegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = EmployerRegisterSerializer

    def get_serializer_context(self, *args, **kwargs):
        return {'request': self.request}


class EmployeeRegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = EmployeeRegisterSerializer

    def get_serializer_context(self, *args, **kwargs):
        return {'request': self.request}