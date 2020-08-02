from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import JobViewSet, SearchApiView, ApplyJobApiView
from .employer import (
    ApplicantPerJobView,
    JobCreateView,
    JobRetrieveUpdateView,
    JobFilterByEmployerView,
    JobAppliedByEmployeeView,
    StatusUpdateAPIView
)

from .views import *

router = DefaultRouter()
router.register('jobs', JobViewSet)

urlpatterns = [
    path('search', SearchApiView.as_view()),
    path('apply-job/<int:job_id>', ApplyJobApiView.as_view()),
    path('jobs/', JobViewSet.as_view({'get': 'list'})),
    path('applicants/<int:job_id>', ApplicantPerJobView.as_view()),
    path('create-job/', JobCreateView.as_view()),
    path('update/<int:pk>/', JobRetrieveUpdateView.as_view()),
    path('employer/<user>', JobFilterByEmployerView.as_view()),
    path('applied/<user>/', JobAppliedByEmployeeView.as_view()),
    path('status/<int:pk>', StatusUpdateAPIView.as_view())
]

urlpatterns += router.urls
