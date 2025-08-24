from django.db import models
from django.utils import timezone


def kyiv_now():
    ...
# Create your models here.
class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    parent_id = models.ForeignKey('self', blank=True, null=True, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.localtime) 
    client = models.ForeignKey('menu.Client', on_delete=models.CASCADE, null=True, blank=True)
    isGPT = models.BooleanField(default=False)