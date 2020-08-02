from django.urls import path, include
from rest_framework import generics
from .views import EmployeeProfileCreateView, EmployeeProfileListView, EmployerProfileListView, EmployerProfileCreateView

urlpatterns = (
    path('create-employee-profile/', EmployeeProfileCreateView.as_view()),
    path('employeeprofile/<int:pk>/', EmployeeProfileListView.as_view()),
    path('create-employer-profile/', EmployerProfileCreateView.as_view()),
    path('employerprofile/<int:pk>/', EmployerProfileListView.as_view()),
)