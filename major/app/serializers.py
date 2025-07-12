from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from .models import Task, React, CropSellRequest, VendorProfile, UserProfile

User = get_user_model()

class ReactSerializer(serializers.ModelSerializer):
    class Meta:
        model = React
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    is_overdue = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = '__all__'

    def get_is_overdue(self, obj):
        return obj.is_overdue


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=[('farmer', 'Farmer'), ('vendor', 'Vendor')], required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def create(self, validated_data):
        role = validated_data.pop('role')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        UserProfile.objects.create(user=user, role=role)
        return user


class VendorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorProfile
        fields = '__all__'
        extra_kwargs = {
            'user': {'required': False}  # 👈 Add this
        }



class CropSellRequestSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.username', read_only=True)

    class Meta:
        model = CropSellRequest
        fields = '__all__'
        read_only_fields = ['farmer', 'vendor'] 

    def validate(self, data):
        return data  

