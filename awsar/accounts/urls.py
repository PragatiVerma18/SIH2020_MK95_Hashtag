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
    EmployerList,
    login
)

urlpatterns = [
    path('employerregister/', EmployerRegisterAPIView.as_view()),
    path('employeeregister/', EmployeeRegisterAPIView.as_view()),
    path('token/obtain/', MyTokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('employees/', EmployeeList.as_view()),
    path('employers/', EmployerList.as_view()),
    path('users/<username>', UserDetail.as_view()),
    path('login/', login)
]
