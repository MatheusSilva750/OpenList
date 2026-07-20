from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Task

User = get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        # Automatically assign the logged-in user as the category owner
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']


class TaskSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source='category', read_only=True)
    shared_with = UserSummarySerializer(many=True, read_only=True)
    owner_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 
            'title', 
            'description', 
            'completed', 
            'due_date', 
            'category', 
            'category_details', 
            'owner_email', 
            'shared_with', 
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'owner_email', 'shared_with', 'created_at', 'updated_at']

    def validate_category(self, value):
        # Ensure that users cannot assign tasks to other users' categories
        if value and value.user != self.context['request'].user:
            raise serializers.ValidationError("Category does not belong to the authenticated user.")
        return value

    def create(self, validated_data):
        # Automatically assign the logged-in user as the task owner
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
