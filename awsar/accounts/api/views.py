from .serializers import UserSerializer
from ..models import User
from .serializers import EmployerRegisterSerializer, EmployeeRegisterSerializer
from rest_framework import viewsets
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK
)


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


class EmployeeList(generics.ListAPIView):
    model = User
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(role='Employee')


class EmployerList(generics.ListAPIView):
    model = User
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(role='Employer')


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request,username):
        queryset = User.objects.filter(username=username)
        user = get_object_or_404(queryset, username=username)
        serializer = UserSerializer(user)
        return Response(serializer.data)


@api_view(["POST"])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=HTTP_404_NOT_FOUND)
    token = get_tokens_for_user(user)
    serializer = UserSerializer(user)
    data = serializer.data
    return Response({"data": data},
                    status=HTTP_200_OK)
