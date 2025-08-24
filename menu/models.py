from django.db import models

# Create your models here.
class Client(models.Model):
    login = models.CharField(max_length=100, primary_key=True)
    password = models.CharField(max_length=300)


class Session(models.Model):
    session_id = models.CharField(max_length=300, primary_key=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    