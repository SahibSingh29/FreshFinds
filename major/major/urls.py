"""
URL configuration for major project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app.views import *
from app.views import TaskListCreateView, TaskUpdateDeleteView, RegisterView, LoginView
from django.conf import settings
from django.conf.urls.static import static
from app.views import crop_recommendation_api
from app.views import predict_crop_details
from app.views import VendorListAPIView, CropSellRequestCreateAPIView, VendorRequestsAPIView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', ReactView.as_view(), name="anything"),
    path('tasks/', TaskListCreateView.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskUpdateDeleteView.as_view(), name='task-detail'),
    path('predict/', predict_disease),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('api/recommend-crop/', crop_recommendation_api, name='recommend-crop'),
    path('predict-crop/', predict_crop_details),
    path('vendors/', VendorListAPIView.as_view()),
    path('sell-request/', CropSellRequestCreateAPIView.as_view()),
    path('vendor-requests/', VendorRequestsAPIView.as_view()),
    path('create-vendor-profile/', create_vendor_profile),
    path('check-vendor-profile/', check_vendor_profile),
    ]


