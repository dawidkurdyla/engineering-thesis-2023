"""fitness_cloud_server URL Configuration
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
import debug_toolbar
from rest_framework_simplejwt.views import TokenRefreshView
from drf_yasg import openapi
from drf_yasg.views import get_schema_view as swagger_get_schema_view

from core.views import CustomTokenObtainPairView


schema_view = swagger_get_schema_view(
    openapi.Info(
        title="FitnessCloud API",
        default_version='1.0.0',
        description='API documentation of FitnessCloudApp'
    ),
    public=True,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('__debug__/', include(debug_toolbar.urls)),
    path('auth/', include('djoser.urls')),
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('workout_manager/', include('workout_manager.urls')),
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-schema'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
