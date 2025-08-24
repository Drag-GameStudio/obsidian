from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from .models import Client, Session
from .authorization import regist, login, auth
import json
# Create your views here.
def render_menu(request):
    session_id = request.COOKIES.get('session_id')  # Example of accessing session_id cookie
    user_password = request.COOKIES.get('user_password')
    if auth(session_id=session_id, user_password=user_password):
        return redirect("/graph/")
    return render(request, 'menu/menu.html')

def regist_user(request):
    # This function will handle user registration
    if request.method == 'POST':
        data = json.loads(request.body)
        user_login = data.get('login')
        password = data.get('password')

        registration_result = regist(user_login, password)
        if registration_result == -1:
            return JsonResponse({"status": "error", "message": "Registration failed. User may already exist."}, status=400)
        return login_user(request)

    return HttpResponse("Method not allowed", status=405)

def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        login_user = data.get('login')
        password = data.get('password')

        session = login(login_user, password)
        if session == -1:
            return JsonResponse({"status": "error", "message": "Login failed. Invalid login."}, status=400)
        elif session == -2:
            return JsonResponse({"status": "error", "message": "Login failed. Invalid password."}, status=400)


        response = JsonResponse({"status": "success"})
        response.set_cookie('session_id', session.session_id, httponly=True, max_age=3600 * 24 * 7)
        response.set_cookie('user_password', password, httponly=True, max_age=3600 * 24 * 7)

        return response
    
def logout(request):
    if request.method == 'POST':
        session_id = request.COOKIES.get('session_id')  # Example of accessing session_id cookie
        user_password = request.COOKIES.get('user_password')  # Example of accessing user_password cookie

        if auth(session_id, user_password):
            Session.objects.filter(session_id=session_id).first().delete()

        return redirect('/menu/')  # Redirect to login if session is invalid or cookies are not set
    
    return HttpResponse("Method not allowed", status=405)
