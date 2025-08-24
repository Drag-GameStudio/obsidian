from django.urls import path
from .views import render_graph, add_comment, read_comments, delete_comment, gpt_think_view, edit_comment
urlpatterns = [
    path("", render_graph),
    path("add_comment/", add_comment),
    path("read_comments/", read_comments),
    path("delete_comment/", delete_comment),
    path("gpt_think/", gpt_think_view),
    path("edit_comment/", edit_comment)
]