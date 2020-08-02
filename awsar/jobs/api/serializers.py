from rest_framework import serializers
from profiles.serializers import EmployeeProfileSerializer
from accounts.api.serializers import UserSerializer, UserAPISerializer
from ..models import *


class JobSerializer(serializers.ModelSerializer):
    last_date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S")

    class Meta:
        model = Job
        fields = ["id", "user", "title", "description", "location", "type", "category", "last_date",
                  "company_name", "vacancies", "doc_url", "summary", 'qualification', 'experience', 'age_limit', "website", "filled", "salary", "tags", "job_for_women", "job_for_disabled", "created_at", "updated_at"]


class JobDetailSerializer(serializers.ModelSerializer):
    last_date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S")
    user = UserAPISerializer()

    class Meta:
        model = Job
        fields = ["id", "user", "title", "description", "location", "type", "category", "last_date",
                  "company_name", "vacancies", "doc_url", "summary", 'qualification', 'experience', 'age_limit', "website", "filled", "salary", "tags", "job_for_women", "job_for_disabled", "created_at", "updated_at"]


class JobShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ["id", "title", "company_name", "created_at"]


class ApplicantSerializer(serializers.ModelSerializer):
    # user = UserSerializer()
    # job = JobSerializer()

    class Meta:
        model = Applicant
        fields = ["id", "employee", "job", "applied_at",
                  "status", "created_at", "updated_at"]

        # depth = 1


class ApplicantDetailSerializer(serializers.ModelSerializer):
    # user = UserSerializer()
    # job = JobSerializer()
    job = JobShortSerializer()

    class Meta:
        model = Applicant
        fields = ["id", "employee", "applied_at",
                  "status",  "job", "created_at", "updated_at"]
        depth = 1
        read_only_fields = ('id', 'applied_at', 'job')


class StatusUpdateSerializer(serializers.ModelSerializer):
    # user = UserSerializer()
    # job = JobSerializer()

    class Meta:
        model = Applicant
        fields = ["id", "employee", "applied_at",
                  "status", "created_at", "updated_at"]
        depth = 1
        read_only_fields = ('id', 'applied_at', 'job')


class JobAppliedByEmployeeSerializer(serializers.ModelSerializer):
    # job_count = serializers.SerializerMethodField()

    class Meta:
        model = Applicant
        fields = ["id", "job", "applied_at",
                  "status", "created_at", "updated_at"]
        depth = 1
