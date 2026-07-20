from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes

from .models import Category, Task
from .serializers import CategorySerializer, TaskSerializer

User = get_user_model()

class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing categories.
    Users can only access their own categories.
    """
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tasks.
    Users can access tasks they own or tasks shared with them.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        parameters=[
            OpenApiParameter(name='completed', description='Filter by completion status (true/false)', required=False, type=OpenApiTypes.BOOL),
            OpenApiParameter(name='category', description='Filter by Category UUID', required=False, type=OpenApiTypes.STR),
            OpenApiParameter(name='search', description='Search in task title and description', required=False, type=OpenApiTypes.STR),
        ]
    )
    def get_queryset(self):
        user = self.request.user
        # Retrieve tasks owned by the user OR shared with the user
        queryset = Task.objects.filter(Q(user=user) | Q(shared_with=user)).distinct()

        # Filtering by completion status
        completed = self.request.query_params.get('completed')
        if completed is not None:
            queryset = queryset.filter(completed=completed.lower() == 'true')

        # Filtering by category
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        # Search filter
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search)
            )

        return queryset

    @extend_schema(
        request=None,
        responses={200: TaskSerializer},
        description="Toggle task completion status between completed and uncompleted."
    )
    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        task = self.get_object()
        # Toggle completed state
        task.completed = not task.completed
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=OpenApiTypes.OBJECT,
        responses={200: OpenApiTypes.OBJECT},
        description="Share task with another user via their email address."
    )
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        task = self.get_object()

        # Only the task owner can share the task
        if task.user != request.user:
            return Response(
                {"detail": "Only the task owner can share this task."}, 
                status=status.HTTP_403_FORBIDDEN
            )

        email = request.data.get('email')
        if not email:
            return Response(
                {"email": "This field is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        email = email.strip().lower()

        # Prevent sharing with self
        if email == request.user.email.lower():
            return Response(
                {"detail": "You cannot share a task with yourself."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get or create the shared user. If they do not exist yet,
        # we create a placeholder user with their email as username.
        # This will be updated when they log in for the first time.
        shared_user, created = User.objects.get_or_create(
            email=email,
            defaults={'username': email}
        )

        task.shared_with.add(shared_user)
        return Response(
            {"detail": f"Task shared successfully with {email}."}, 
            status=status.HTTP_200_OK
        )
