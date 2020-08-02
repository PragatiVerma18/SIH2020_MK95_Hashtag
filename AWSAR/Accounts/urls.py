from .api.custom_claims import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path
from .api.views import(
    EmployerRegisterAPIView,
    EmployeeRegisterAPIView,
    EmployeeList,
    UserDetail,
    EmployerList
)

urlpatterns = [
    path('employerregister', EmployerRegisterAPIView.as_view()),
    path('employeeregister', EmployeeRegisterAPIView.as_view()),
    path('login/', MyTokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('employees/', EmployeeList.as_view()),
    path('employers/', EmployerList.as_view()),
    path('users/<int:pk>/', UserDetail.as_view()),
]