from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from . serializers import *
from rest_framework.response import Response

from rest_framework import generics, permissions
from .models import Task
from .serializers import TaskSerializer

import numpy as np
import tensorflow as tf
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
from PIL import Image
import os

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

import joblib
import numpy as np
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import os

from .models import VendorProfile, CropSellRequest
from .serializers import VendorProfileSerializer, CropSellRequestSerializer

class ReactView(APIView):
    def get (self, request):
        output = [{"employee": output.employee,
                   "department": output.department}
                   for output in React.objects.all()]
        return Response(output)
    
    def post(self, request):
        serializers = ReactSerializer(data=request.data)
        if serializers.is_valid(raise_exception=True):
            serializers.save()
            return Response(serializers.data)

class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


#model = tf.keras.models.load_model('trained_model.keras')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
model_path = os.path.join(BASE_DIR, 'trained_model.keras')

disease_model = tf.keras.models.load_model(model_path)

class_name = ['Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
              'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
              'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
              'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot',
              'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
              'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
              'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
              'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
              'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
              'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
              'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite',
              'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
              'Tomato___healthy']

@api_view(['POST'])
def predict_disease(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No image uploaded'}, status=400)

    image_file = request.FILES['image']
    file_path = default_storage.save('temp.jpg', image_file)

    img = Image.open(file_path).convert('RGB')
    img = img.resize((256, 256))
    input_arr = np.array(img)

    input_arr = np.expand_dims(input_arr, axis=0)

    prediction = disease_model.predict(input_arr)
    result_index = np.argmax(prediction)
    model_prediction = class_name[result_index]

    os.remove(file_path)  # Clean up

    return Response({'prediction': model_prediction})


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"msg": "Registration successful"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            role = user.userprofile.role
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'role': role
            })
        return Response({'msg': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)


crop_model = joblib.load(os.path.join(BASE_DIR, 'crop_recommendation_model.pkl'))
le = joblib.load(os.path.join(BASE_DIR, 'label_encoder.pkl'))

@csrf_exempt
def crop_recommendation_api(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            features = [
                float(data['N']),
                float(data['P']),
                float(data['K']),
                float(data['temperature']),
                float(data['humidity']),
                float(data['ph']),
                float(data['rainfall']),
            ]
            prediction = crop_model.predict([features])
            crop_name = le.inverse_transform(prediction)[0]
            return JsonResponse({'recommended_crop': crop_name})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

import os
import joblib
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# MODEL_DIR = os.path.join(BASE_DIR, 'ml_model')

model = joblib.load(os.path.join(BASE_DIR, 'crop_model.pkl'))
le_crop = joblib.load(os.path.join(BASE_DIR, 'le_crop.pkl'))
le_region = joblib.load(os.path.join(BASE_DIR, 'le_region.pkl'))
le_soil = joblib.load(os.path.join(BASE_DIR, 'le_soil.pkl'))
le_weather = joblib.load(os.path.join(BASE_DIR, 'le_weather.pkl'))

@csrf_exempt
def predict_crop_details(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        crop_name = data.get('crop')

        if crop_name is None:
            return JsonResponse({'error': 'Crop name is required'}, status=400)

        try:
            crop_encoded = le_crop.transform([crop_name])[0]
            prediction = model.predict([[crop_encoded]])[0]

            response = {
                'Region': le_region.inverse_transform([int(prediction[0])])[0],
                'Soil_Type': le_soil.inverse_transform([int(prediction[1])])[0],
                'Rainfall_mm': round(prediction[2], 2),
                'Temperature_Celsius': round(prediction[3], 2),
                'Fertilizer_Used': bool(round(prediction[4])),
                'Irrigation_Used': bool(round(prediction[5])),
                'Weather_Condition': le_weather.inverse_transform([int(prediction[6])])[0],
            }
            return JsonResponse(response)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

class VendorListAPIView(generics.ListAPIView):
    queryset = VendorProfile.objects.all()
    serializer_class = VendorProfileSerializer

from rest_framework.exceptions import ValidationError, PermissionDenied


class CropSellRequestCreateAPIView(generics.CreateAPIView):
    serializer_class = CropSellRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        try:
            user_profile = self.request.user.userprofile
        except UserProfile.DoesNotExist:
            raise ValidationError("UserProfile not found for this user.")
        
        vendor_id = self.request.data.get('vendor')
        
        if not vendor_id:
            raise ValidationError("Vendor ID is required.")
        
        try:
            vendor_profile = VendorProfile.objects.get(id=vendor_id)
            vendor_user_profile = vendor_profile.user
        except VendorProfile.DoesNotExist:
            raise ValidationError("Vendor not found.")

        if vendor_user_profile.role != 'vendor':
            raise ValidationError("The selected vendor is not valid.")

        serializer.save(farmer=user_profile, vendor=vendor_user_profile)



class VendorRequestsAPIView(generics.ListAPIView):
    serializer_class = CropSellRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            user_profile = self.request.user.userprofile
        except UserProfile.DoesNotExist:
            raise ValidationError("UserProfile not found for this user.")

        if user_profile.role != 'vendor':
            raise PermissionDenied("Only vendors can view their crop requests.")
        
        return CropSellRequest.objects.filter(vendor=user_profile)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import VendorProfile, UserProfile
from .serializers import VendorProfileSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_vendor_profile(request):
    try:
        user_profile = request.user.userprofile  
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found.'}, status=404)
    
    if VendorProfile.objects.filter(user=user_profile).exists():
        return Response({'error': 'Vendor profile already exists!'}, status=400)

    serializer = VendorProfileSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=user_profile)  
        return Response({'message': 'Vendor profile created successfully!'})
    return Response(serializer.errors, status=400)

    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_vendor_profile(request):
    has_profile = VendorProfile.objects.filter(user=request.user.userprofile).exists()
    return Response({'has_profile': has_profile})


