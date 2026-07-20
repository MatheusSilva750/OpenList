import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Category(models.Model):
    """
    Model representing task categories created by users.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_name=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        unique_together = ('name', 'user')
        ordering = ['name']

    def __str__(self):
        return self.name


class Task(models.Model):
    """
    Model representing tasks with categorization, completion status, 
    due dates, ownership, and user sharing capability.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_name=255)
    description = models.TextField(blank=True, default='')
    completed = models.BooleanField(default=False)
    due_date = models.DateField(null=True, blank=True)
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='tasks'
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_tasks')
    shared_with = models.ManyToManyField(User, related_name='shared_tasks', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['completed', '-created_at']

    def __str__(self):
        return self.title
