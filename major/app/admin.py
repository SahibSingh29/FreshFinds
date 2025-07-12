from django.contrib import admin
from .models import Task, UserProfile, VendorProfile, CropSellRequest

admin.site.register(Task)
admin.site.register(UserProfile)
admin.site.register(VendorProfile)
admin.site.register(CropSellRequest)
