from rest_framework import serializers

from accounts.api.serializers import UserSerializer
from ..models import *


class JobSerializer(serializers.ModelSerializer):

    class Meta:
        model = Job
        fields = ["id", "user", "title", "description", "location", "type", "category", "last_date",
                  "company_name", "vacancies", "doc_url", "summary", "website", "filled", "salary"]


class ApplicantSerializer(serializers.ModelSerializer):
    # user = UserSerializer()
    # job = JobSerializer()

    class Meta:
        model = Applicant
        fields = ["id", "user", "job"]