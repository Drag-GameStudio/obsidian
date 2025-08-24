from django.shortcuts import render, redirect
from menu.models import Client, Session
from .models import Comment
from menu.authorization import auth
from .text_cipher import content_anticipher, content_cipher
import json
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.utils import timezone
from .gpt_thinking import gpt_think
# Create your views here.

def get_all_herarhi_content(comment: Comment, user_password):
    all_comments = []
    curr_comment = comment
    while curr_comment.parent_id is not None:
        all_comments.append(content_anticipher(curr_comment.content, user_password))
        curr_comment = curr_comment.parent_id
    all_comments.append(content_anticipher(curr_comment.content, user_password))
    all_comments.reverse()
    all_comments_data = "; \n".join(all_comments)

    return all_comments_data


def get_Client(session_id):
    return Session.objects.filter(session_id=session_id).first().client


def render_graph(request):
    session_id = request.COOKIES.get('session_id')  # Example of accessing session_id cookie
    user_password = request.COOKIES.get('user_password')  # Example of accessing user_password cookie
    if auth(session_id, user_password):
        return render(request, 'graph/graph.html', {"username": Session.objects.filter(session_id=session_id).first().client.login})
        
    return redirect('/menu/')  # Redirect to login if session is invalid or cookies are not set

def add_comment(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        content = data.get('content')
        perent_coment_id = data.get('parent_comment_id')

        session_id = request.COOKIES.get('session_id')  # Example of accessing session_id cookie
        user_password = request.COOKIES.get('user_password')  # Example of accessing user_password cookie

        if auth(session_id, user_password):
            cipher_content = content_cipher(content, request.COOKIES.get("user_password"))
            perent_coment = Comment.objects.filter(comment_id=perent_coment_id).first()


            if perent_coment_id is None or perent_coment is None:
                new_comment = Comment.objects.create(
                    content=cipher_content,
                    client=get_Client(session_id),
                )
            else:
                new_comment = Comment.objects.create(
                    content=cipher_content,
                    parent_id=perent_coment,
                    client=get_Client(session_id),

                )
            return JsonResponse({"status": "success", "comment_data": {
                "comment_id": new_comment.comment_id,
                "date": new_comment.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            }}, status=201)
        return redirect('/menu/')  # Redirect to login if session is invalid or cookies are not set

def read_comments(request):
    if request.method == 'GET':
        session_id = request.COOKIES.get('session_id')  # Example of accessing session_id cookie
        user_password = request.COOKIES.get('user_password')  # Example of accessing user_password cookie

        parent_comment_id = request.GET.get('parent_comment_id')
        if parent_comment_id == "undefined":
            parent_comment_id = None
        if auth(session_id, user_password):
            comments_data = []

            comments = Comment.objects.filter(client=get_Client(session_id)).filter(parent_id=parent_comment_id).order_by('created_at')
            for comment in comments:
                comments_data.append({
                    "comment_id": comment.comment_id,
                    "content": content_anticipher(comment.content, user_password),
                    "created_at": timezone.localtime(comment.created_at).strftime("%Y-%m-%d %H:%M:%S"),
                    "withUnder": len([el for el in Comment.objects.filter(parent_id=comment)]) > 0 ,
                    "isGPT": comment.isGPT
                })
            return JsonResponse({"comments": comments_data}, status=200)
        return redirect('/menu/')  # Redirect to login if session is invalid or cookies are not set
    return HttpResponse("Method not allowed", status=405)

def delete_comment(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        comment_id = data.get('comment_id')

        session_id = request.COOKIES.get('session_id')  # Example of accessing session_id cookie
        user_password = request.COOKIES.get('user_password')  # Example of accessing user_password cookie

        if auth(session_id, user_password):
            del_comment = Comment.objects.filter(comment_id=comment_id).filter(client=Session.objects.filter(session_id=session_id).first().client).first()
            if del_comment is None:
                return JsonResponse({"status": "error", "error": "comment hasnt been fouded"})
            del_comment.delete()
            
            return JsonResponse({"status": "success"})
        
    return redirect('/menu/') 


def gpt_think_view(request):
    if request.method == 'GET':
        session_id = request.COOKIES.get('session_id')  # Example of accessing session_id cookie
        user_password = request.COOKIES.get('user_password')  # Example of accessing user_password cookie

        comment_id = request.GET.get('comment_id')
        if auth(session_id, user_password):
            comment = Comment.objects.filter(comment_id=comment_id).first()
            if comment is None:
                return ...
            
            all_content = get_all_herarhi_content(comment, user_password)
            think_content = gpt_think(all_content)
            cipher_content = content_cipher(think_content, user_password)

            
            new_comment = Comment.objects.create(
                    content=cipher_content,
                    parent_id=comment,
                    client=get_Client(session_id),
                    isGPT=True
                    )
            
            return JsonResponse({"status": "success", "comment_data": {
                "comment_id": new_comment.comment_id,
                "content": think_content,
                "date": new_comment.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            }}, status=201)

