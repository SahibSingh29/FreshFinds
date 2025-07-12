from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.contrib.auth.models import AbstractUser
from rest_framework.exceptions import ValidationError

# Create your models here.
class React(models.Model):
    employee = models.CharField(max_length=30)
    department = models.CharField(max_length=200)

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    date = models.DateField()
    time = models.TimeField()
    completed = models.BooleanField(default=False)

    @property
    def is_overdue(self):
        task_datetime = datetime.combine(self.date, self.time)
        return not self.completed and task_datetime < datetime.now()

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('farmer', 'Farmer'),
        ('vendor', 'Vendor'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

class VendorProfile(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    phone = models.CharField(max_length=15)

    def __str__(self):
        return self.company_name
    
class CropSellRequest(models.Model):
    farmer = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='crop_requests')
    vendor = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_requests')
    crop = models.CharField(max_length=100)
    quantity = models.FloatField()
    location = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
