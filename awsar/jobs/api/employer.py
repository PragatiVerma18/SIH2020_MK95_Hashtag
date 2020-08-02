from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from rest_framework import generics
from ..decorators import user_is_employer
from ..models import Job, Applicant
from .serializers import JobSerializer, ApplicantSerializer, ApplicantDetailSerializer, JobAppliedByEmployeeSerializer, JobDetailSerializer, StatusUpdateSerializer


class ApplicantPerJobView(generics.ListAPIView):
    model = Applicant
    serializer_class = ApplicantDetailSerializer

    # @method_decorator(user_is_employer)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(self.request, *args, **kwargs)

    def get_queryset(self):
        return Applicant.objects.filter(job_id=self.kwargs['job_id']).order_by('id')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['job'] = Job.objects.get(id=self.kwargs['job_id'])
        return context


class JobCreateView(generics.CreateAPIView):
    model = Job
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class JobRetrieveUpdateView(generics.RetrieveUpdateDestroyAPIView):
    model = Job
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class JobFilterByEmployerView(generics.ListAPIView):
    model = Job
    serializer_class = JobDetailSerializer
    lookup_field = 'user'

    def get_queryset(self):
        username = self.kwargs['user']
        return Job.objects.filter(user=username)


class JobAppliedByEmployeeView(generics.ListAPIView):
    model = Applicant
    serializer_class = JobAppliedByEmployeeSerializer
    lookup_field = 'user'

    def get_queryset(self):
        username = self.kwargs['user']
        return Applicant.objects.filter(employee=username)


class StatusUpdateAPIView(generics.RetrieveUpdateAPIView):
    model = Applicant
    serializer_class = StatusUpdateSerializer
    queryset = Applicant.objects.all()
