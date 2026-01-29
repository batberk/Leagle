from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DocumentViewSet, ConversationViewSet

router = DefaultRouter()
router.register(r"conversations", ConversationViewSet, basename="conversation")

urlpatterns = [
    path("upload/", DocumentViewSet.as_view({"post": "create"}), name="upload-document"),
    path("", include(router.urls)),
]
