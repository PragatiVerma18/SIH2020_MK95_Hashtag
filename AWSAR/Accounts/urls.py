from .api.custom_claims import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path
from .api.views import(
    EmployerRegisterAPIView,
    EmployeeRegisterAPIView,
)

urlpatterns = [
    path('employerregister', EmployerRegisterAPIView.as_view()),
    path('employeeregister', EmployeeRegisterAPIView.as_view()),
    path('login/', MyTokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
]