from django.urls import path
from .views import render_menu, regist_user, login_user, logout

urlpatterns = [
    path("", render_menu),
    path("regist/", regist_user),
    path("login/", login_user),
    path("logout/", logout)
]