import pytest
import jwt
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from api.models import Category, Task
from api.auth import SupabaseJWTAuthentication

User = get_user_model()

# ==========================================
# AUTHENTICATION TESTS
# ==========================================

def test_auth_middleware_no_header(rf):
    request = rf.get('/api/tasks/')
    auth = SupabaseJWTAuthentication()
    assert auth.authenticate(request) is None


def test_auth_middleware_invalid_header_format(rf):
    request = rf.get('/api/tasks/', HTTP_AUTHORIZATION='Bearer')
    auth = SupabaseJWTAuthentication()
    assert auth.authenticate(request) is None

    request2 = rf.get('/api/tasks/', HTTP_AUTHORIZATION='Token xyz')
    assert auth.authenticate(request2) is None


@pytest.mark.django_db
def test_auth_middleware_valid_token(rf, mocker):
    payload = {"sub": "user-uuid-123", "email": "user@example.com"}
    mocker.patch('jwt.decode', return_value=payload)

    request = rf.get('/api/tasks/', HTTP_AUTHORIZATION='Bearer valid-jwt')
    auth = SupabaseJWTAuthentication()
    user, token_ret = auth.authenticate(request)

    assert user is not None
    assert user.username == "user-uuid-123"
    assert user.email == "user@example.com"
    assert token_ret is None


@pytest.mark.django_db
def test_auth_middleware_placeholder_linking(rf, mocker):
    # Create placeholder user (e.g. created during task sharing)
    placeholder = User.objects.create(username="user@example.com", email="user@example.com")
    
    payload = {"sub": "user-uuid-123", "email": "user@example.com"}
    mocker.patch('jwt.decode', return_value=payload)

    request = rf.get('/api/tasks/', HTTP_AUTHORIZATION='Bearer valid-jwt')
    auth = SupabaseJWTAuthentication()
    user, _ = auth.authenticate(request)

    # Username should be updated to Supabase UUID
    user.refresh_from_db()
    assert user.username == "user-uuid-123"
    assert user.email == "user@example.com"


@pytest.mark.django_db
def test_auth_middleware_email_sync(rf, mocker):
    user = User.objects.create(username="user-uuid-123", email="old@example.com")
    
    payload = {"sub": "user-uuid-123", "email": "new@example.com"}
    mocker.patch('jwt.decode', return_value=payload)

    request = rf.get('/api/tasks/', HTTP_AUTHORIZATION='Bearer valid-jwt')
    auth = SupabaseJWTAuthentication()
    user_ret, _ = auth.authenticate(request)

    user.refresh_from_db()
    assert user.email == "new@example.com"


def test_auth_middleware_expired_token(rf, mocker):
    mocker.patch('jwt.decode', side_effect=jwt.ExpiredSignatureError)

    request = rf.get('/api/tasks/', HTTP_AUTHORIZATION='Bearer expired-jwt')
    auth = SupabaseJWTAuthentication()
    with pytest.raises(AuthenticationFailed) as excinfo:
        auth.authenticate(request)
    assert 'expired' in str(excinfo.value)


def test_auth_middleware_invalid_token(rf, mocker):
    mocker.patch('jwt.decode', side_effect=jwt.InvalidTokenError)

    request = rf.get('/api/tasks/', HTTP_AUTHORIZATION='Bearer invalid-jwt')
    auth = SupabaseJWTAuthentication()
    with pytest.raises(AuthenticationFailed) as excinfo:
        auth.authenticate(request)
    assert 'Invalid token' in str(excinfo.value)


@pytest.mark.django_db
def test_auth_middleware_missing_sub(rf, mocker):
    mocker.patch('jwt.decode', return_value={"email": "no-sub@example.com"})

    request = rf.get('/api/tasks/', HTTP_AUTHORIZATION='Bearer valid-jwt')
    auth = SupabaseJWTAuthentication()
    with pytest.raises(AuthenticationFailed) as excinfo:
        auth.authenticate(request)
    assert 'missing sub' in str(excinfo.value)


# ==========================================
# MODEL STR TESTS
# ==========================================

@pytest.mark.django_db
def test_model_str():
    user = User.objects.create(username="usr")
    category = Category.objects.create(name="Trabalho", user=user)
    task = Task.objects.create(title="Fazer café", user=user, category=category)

    assert str(category) == "Trabalho"
    assert str(task) == "Fazer café"


# ==========================================
# API ENDPOINT & VIEWSET TESTS
# ==========================================

@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()


@pytest.fixture
def auth_client(api_client, mocker):
    """Fixture to provide an authenticated client and the user object."""
    user = User.objects.create(username="user-1", email="user1@example.com")
    api_client.force_authenticate(user=user)
    return api_client, user


@pytest.mark.django_db
class TestCategoryAPI:
    def test_list_categories(self, auth_client):
        client, user = auth_client
        Category.objects.create(name="Cat 1", user=user)
        
        # Another user's category
        other_user = User.objects.create(username="other")
        Category.objects.create(name="Other Cat", user=other_user)

        url = reverse('category-list')
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        # DRF has default pagination enabled, so it should be in results
        results = response.data.get('results', response.data)
        assert len(results) == 1
        assert results[0]['name'] == "Cat 1"

    def test_create_category(self, auth_client):
        client, user = auth_client
        url = reverse('category-list')
        data = {"name": "Nova Categoria"}
        response = client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Category.objects.filter(name="Nova Categoria", user=user).exists()


@pytest.mark.django_db
class TestTaskAPI:
    def test_list_tasks_and_sharing(self, auth_client):
        client, user = auth_client
        
        # User owned task
        task_owned = Task.objects.create(title="Minha Tarefa", user=user)
        
        # Task shared with user
        owner = User.objects.create(username="owner", email="owner@example.com")
        task_shared = Task.objects.create(title="Tarefa Compartilhada", user=owner)
        task_shared.shared_with.add(user)

        # Unrelated task
        unrelated_user = User.objects.create(username="unrelated")
        Task.objects.create(title="Tarefa Alheia", user=unrelated_user)

        url = reverse('task-list')
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        
        results = response.data.get('results', response.data)
        assert len(results) == 2
        titles = [t['title'] for t in results]
        assert "Minha Tarefa" in titles
        assert "Tarefa Compartilhada" in titles

    def test_filter_tasks(self, auth_client):
        client, user = auth_client
        cat1 = Category.objects.create(name="Cat 1", user=user)
        cat2 = Category.objects.create(name="Cat 2", user=user)

        t1 = Task.objects.create(title="Task A", completed=False, category=cat1, user=user)
        t2 = Task.objects.create(title="Task B", completed=True, category=cat2, user=user)

        url = reverse('task-list')

        # Filter by category
        res = client.get(url, {'category': cat1.id})
        results = res.data.get('results', res.data)
        assert len(results) == 1
        assert results[0]['title'] == "Task A"

        # Filter by completed
        res = client.get(url, {'completed': 'true'})
        results = res.data.get('results', res.data)
        assert len(results) == 1
        assert results[0]['title'] == "Task B"

        # Search filter
        res = client.get(url, {'search': 'Task A'})
        results = res.data.get('results', res.data)
        assert len(results) == 1
        assert results[0]['title'] == "Task A"

    def test_create_task_invalid_category(self, auth_client):
        client, user = auth_client
        other_user = User.objects.create(username="other")
        other_cat = Category.objects.create(name="Outra Categoria", user=other_user)

        url = reverse('task-list')
        data = {
            "title": "Task com categoria errada",
            "category": other_cat.id
        }
        response = client.post(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "Category does not belong" in str(response.data)

    def test_create_task_valid(self, auth_client):
        client, user = auth_client
        cat = Category.objects.create(name="Minha Cat", user=user)

        url = reverse('task-list')
        data = {
            "title": "Task Válida",
            "category": cat.id,
            "description": "Uma descrição simples."
        }
        response = client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert Task.objects.filter(title="Task Válida", user=user, category=cat).exists()

    def test_toggle_task(self, auth_client):
        client, user = auth_client
        task = Task.objects.create(title="Task T", completed=False, user=user)

        url = reverse('task-toggle', args=[task.id])
        response = client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['completed'] is True
        
        task.refresh_from_db()
        assert task.completed is True

    def test_share_task_success(self, auth_client):
        client, user = auth_client
        task = Task.objects.create(title="Share Target", user=user)

        url = reverse('task-share', args=[task.id])
        data = {"email": "friend@example.com"}
        response = client.post(url, data)
        assert response.status_code == status.HTTP_200_OK
        assert "shared successfully" in response.data['detail']

        # Verifies placeholder was created
        friend = User.objects.get(email="friend@example.com")
        assert task.shared_with.filter(id=friend.id).exists()

    def test_share_task_missing_email(self, auth_client):
        client, user = auth_client
        task = Task.objects.create(title="Share Target", user=user)

        url = reverse('task-share', args=[task.id])
        response = client.post(url, {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data

    def test_share_task_with_self(self, auth_client):
        client, user = auth_client
        task = Task.objects.create(title="Share Target", user=user)

        url = reverse('task-share', args=[task.id])
        data = {"email": user.email}
        response = client.post(url, data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "cannot share a task with yourself" in response.data['detail']

    def test_share_task_not_owner(self, auth_client):
        client, user = auth_client
        other_user = User.objects.create(username="other", email="other@example.com")
        task = Task.objects.create(title="Other's Task", user=other_user)

        url = reverse('task-share', args=[task.id])
        data = {"email": "friend@example.com"}
        response = client.post(url, data)
        assert response.status_code == status.HTTP_404_NOT_FOUND

