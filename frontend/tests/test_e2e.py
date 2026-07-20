import time
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Configure Chrome to run in headless mode for CI/testing compatibility
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--window-size=1280,800")

@pytest.fixture(scope="module")
def driver():
    # In modern Selenium (v4.6.0+), Selenium Manager automatically downloads and
    # configurations the matching ChromeDriver for the local system.
    driver = webdriver.Chrome(options=chrome_options)
    driver.implicitly_wait(10)
    yield driver
    driver.quit()

def test_login_page_renders(driver):
    driver.get("http://localhost:3000")
    
    # Check that the main title exists
    title_element = driver.find_element(By.TAG_NAME, "h2")
    assert "OpenList" in title_element.text
    
    # Check that email and password input fields are visible
    email_input = driver.find_element(By.ID, "login-email")
    password_input = driver.find_element(By.ID, "login-password")
    submit_btn = driver.find_element(By.ID, "login-submit")
    
    assert email_input is not None
    assert password_input is not None
    assert submit_btn is not None

def test_registration_flow(driver):
    driver.get("http://localhost:3000")
    
    # Navigate to registration page
    register_toggle = driver.find_element(By.XPATH, "//button[contains(text(), 'Cadastre-se grátis')]")
    register_toggle.click()
    
    # Verify title changed
    WebDriverWait(driver, 5).until(
        EC.text_to_be_present_in_element((By.TAG_NAME, "h2"), "Criar Conta")
    )
    
    # Fill in registration details (using a unique test email)
    email_field = driver.find_element(By.ID, "register-email")
    pass_field = driver.find_element(By.ID, "register-password")
    confirm_field = driver.find_element(By.ID, "register-confirm-password")
    submit_btn = driver.find_element(By.ID, "register-submit")
    
    test_email = f"selenium_{int(time.time())}@example.com"
    email_field.send_keys(test_email)
    pass_field.send_keys("password123")
    confirm_field.send_keys("password123")
    
    submit_btn.click()
    
    # Wait for auto-confirm auth redirect to dashboard (checking for header element or email display)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, f"//span[contains(text(), '{test_email}')]"))
    )
    
    # Verify we are on the dashboard
    header_title = driver.find_element(By.TAG_NAME, "h1")
    assert "OpenList" in header_title.text

def test_create_task_on_dashboard(driver):
    # This test assumes the previous test ran and logged in successfully.
    # Open "Nova Tarefa" modal
    add_task_btn = driver.find_element(By.ID, "add-task-btn")
    add_task_btn.click()
    
    # Wait for modal to load and fill input
    task_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.ID, "task-title-input"))
    )
    task_input.send_keys("Minha tarefa do Selenium")
    
    # Save the task
    save_btn = driver.find_element(By.ID, "task-save-btn")
    save_btn.click()
    
    # Verify that the task appeared on the dashboard list
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//h4[contains(text(), 'Minha tarefa do Selenium')]"))
    )
