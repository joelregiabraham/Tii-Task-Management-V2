import requests
import json
import sys
from datetime import datetime, timedelta

# API URLs
AUTH_API_URL = "https://localhost:7071/api"
PROJECT_API_URL = "https://localhost:7072/api"
TASK_API_URL = "https://localhost:7073/api"

# Test user credentials
USERNAME = "Tester1"
PASSWORD = "Tester1@123"

# Project details
PROJECT_NAME = "Task API Test Project"
PROJECT_DESCRIPTION = "Project for testing the Task API"

# Task details
TASK_TITLE = "Test Task"
TASK_DESCRIPTION = "This is a test task created by the automated test script"
UPDATED_TASK_TITLE = "Updated Test Task"
UPDATED_TASK_DESCRIPTION = "This description was updated by the automated test script"
TASK_DUE_DATE = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%dT%H:%M:%S.%fZ")

def login(username, password):
    """Authenticate using the Auth API and return JWT token"""
    print(f"Authenticating with user: {username}...")
    
    login_url = f"{AUTH_API_URL}/auth/login"
    login_data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(login_url, json=login_data, verify=False)
        
        if response.status_code == 200:
            token_data = response.json()
            print("✅ Authentication successful!")
            return token_data
        else:
            print(f"❌ Authentication failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Authentication error: {str(e)}")
        return None

def create_project(token, user_id):
    """Create a test project to use for task testing"""
    print("\nCreating test project...")
    
    project_url = f"{PROJECT_API_URL}/projects"
    project_data = {
        "name": PROJECT_NAME,
        "description": PROJECT_DESCRIPTION
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(project_url, json=project_data, headers=headers, verify=False)
        
        if response.status_code == 201:
            project = response.json()
            print(f"✅ Test project created: ID {project['projectId']}")
            return project
        else:
            print(f"❌ Project creation failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Project creation error: {str(e)}")
        return None

def create_task(token, project_id, user_id):
    """Step 1: Create a task using the Task API"""
    print("\nStep 1: Creating a task...")
    
    task_url = f"{TASK_API_URL}/tasks"
    task_data = {
        "projectId": project_id,
        "title": TASK_TITLE,
        "description": TASK_DESCRIPTION,
        "status": "ToDo",
        "assignedTo": user_id,  # Add the user_id as the assignee
        "dueDate": TASK_DUE_DATE
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(task_url, json=task_data, headers=headers, verify=False)
        
        if response.status_code == 201:
            task = response.json()
            print("✅ Task created successfully!")
            print(f"Task ID: {task['taskId']}")
            print(f"Task Title: {task['title']}")
            print(f"Task Status: {task['status']}")
            return task
        else:
            print(f"❌ Task creation failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Task creation error: {str(e)}")
        return None

def update_task(token, task_id):
    """Step 2: Update the task using the Task API"""
    print(f"\nStep 2: Updating task (ID: {task_id})...")
    
    task_url = f"{TASK_API_URL}/tasks/{task_id}"
    task_data = {
        "taskId": task_id,
        "title": UPDATED_TASK_TITLE,
        "description": UPDATED_TASK_DESCRIPTION,
        "dueDate": TASK_DUE_DATE
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.put(task_url, json=task_data, headers=headers, verify=False)
        
        if response.status_code == 204:
            print("✅ Task updated successfully!")
            return True
        else:
            print(f"❌ Task update failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Task update error: {str(e)}")
        return False

def verify_task_update(token, task_id):
    """Verify the task was updated correctly"""
    print(f"\nVerifying task update...")
    
    task_url = f"{TASK_API_URL}/tasks/{task_id}"
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(task_url, headers=headers, verify=False)
        
        if response.status_code == 200:
            task = response.json()
            
            # Verify task details
            if (task["title"] == UPDATED_TASK_TITLE and 
                task["description"] == UPDATED_TASK_DESCRIPTION):
                print("✅ Task update verification successful!")
                return True
            else:
                print("❌ Task update verification failed: details don't match")
                print(f"Expected: {UPDATED_TASK_TITLE}, {UPDATED_TASK_DESCRIPTION}")
                print(f"Received: {task['title']}, {task['description']}")
                return False
        else:
            print(f"❌ Task verification failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Task verification error: {str(e)}")
        return False

def update_task_status(token, task_id, new_status):
    """Step 3: Update the task status"""
    print(f"\nStep 3: Updating task status to '{new_status}'...")
    
    status_url = f"{TASK_API_URL}/tasks/{task_id}/status"
    status_data = {
        "status": new_status
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.put(status_url, json=status_data, headers=headers, verify=False)
        
        if response.status_code == 204:
            print(f"✅ Task status updated to '{new_status}' successfully!")
            return True
        else:
            print(f"❌ Task status update failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Task status update error: {str(e)}")
        return False

def verify_task_status(token, task_id, expected_status):
    """Verify the task status was updated correctly"""
    print(f"\nVerifying task status update...")
    
    task_url = f"{TASK_API_URL}/tasks/{task_id}"
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(task_url, headers=headers, verify=False)
        
        if response.status_code == 200:
            task = response.json()
            
            if task["status"] == expected_status:
                print("✅ Task status verification successful!")
                return True
            else:
                print("❌ Task status verification failed")
                print(f"Expected status: {expected_status}")
                print(f"Actual status: {task['status']}")
                return False
        else:
            print(f"❌ Task verification failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Task verification error: {str(e)}")
        return False

def delete_task(token, task_id):
    """Step 4: Delete the task"""
    print(f"\nStep 4: Deleting task (ID: {task_id})...")
    
    task_url = f"{TASK_API_URL}/tasks/{task_id}"
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.delete(task_url, headers=headers, verify=False)
        
        if response.status_code == 204:
            print("✅ Task deleted successfully!")
            return True
        else:
            print(f"❌ Task deletion failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Task deletion error: {str(e)}")
        return False

def verify_task_deletion(token, task_id):
    """Verify the task was deleted"""
    print(f"\nVerifying task deletion...")
    
    task_url = f"{TASK_API_URL}/tasks/{task_id}"
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(task_url, headers=headers, verify=False)
        
        if response.status_code == 404:
            print("✅ Task deletion verification successful! (404 Not Found)")
            return True
        else:
            print(f"❌ Task deletion verification failed with status code: {response.status_code}")
            print("Task should not be found after deletion.")
            return False
    except Exception as e:
        print(f"❌ Task deletion verification error: {str(e)}")
        return False

def delete_project(token, project_id):
    """Clean up by deleting the test project"""
    print(f"\nCleaning up: Deleting test project (ID: {project_id})...")
    
    project_url = f"{PROJECT_API_URL}/projects/{project_id}"
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.delete(project_url, headers=headers, verify=False)
        
        if response.status_code == 204:
            print("✅ Test project deleted successfully!")
            return True
        else:
            print(f"❌ Project deletion failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Project deletion error: {str(e)}")
        return False

def main():
    """Main function to run the test"""
    print("=== Task API Automated Test ===")
    print(f"Testing with user: {USERNAME}")
    
    # Disable insecure request warning for localhost testing
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    # Get auth token
    auth_response = login(USERNAME, PASSWORD)
    if not auth_response:
        print("❌ TEST FAILED: Could not authenticate")
        return 1

    token = auth_response["accessToken"]
    
    # Extract user ID from the token
    import base64
    import json
    
    # Parse the JWT token to get the user ID
    token_parts = token.split('.')
    if len(token_parts) != 3:
        print("❌ TEST FAILED: Invalid token format")
        return 1
        
    # Decode the payload part (second part) of the JWT
    payload = token_parts[1]
    payload += '=' * (4 - len(payload) % 4)  # Add padding if needed
    try:
        decoded_payload = base64.b64decode(payload).decode('utf-8')
        claims = json.loads(decoded_payload)
        
        # Extract user ID from claims
        user_id = claims.get('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier')
        
        if not user_id:
            print("❌ TEST FAILED: Could not extract user ID from token")
            return 1
            
        print(f"✅ Extracted user ID from token: {user_id}")
    except Exception as e:
        print(f"❌ TEST FAILED: Could not decode token: {str(e)}")
        return 1

    # Create a test project
    project = create_project(token, user_id)
    if not project:
        print("❌ TEST FAILED: Could not create test project")
        return 1
    
    project_id = project["projectId"]
    
    try:
        # Step 1: Create a task
        task = create_task(token, project_id, user_id)
        if not task:
            print("❌ TEST FAILED: Could not create task")
            return 1
        
        task_id = task["taskId"]
        
        # Step 2: Update the task
        update_success = update_task(token, task_id)
        if not update_success:
            print("❌ TEST FAILED: Could not update task")
            return 1
        
        # Verify the update
        verify_update = verify_task_update(token, task_id)
        if not verify_update:
            print("❌ TEST FAILED: Could not verify task update")
            return 1
        
        # Step 3: Update task status
        new_status = "InProgress"
        status_update_success = update_task_status(token, task_id, new_status)
        if not status_update_success:
            print("❌ TEST FAILED: Could not update task status")
            return 1
        
        # Verify the status update
        verify_status = verify_task_status(token, task_id, new_status)
        if not verify_status:
            print("❌ TEST FAILED: Could not verify task status update")
            return 1
        
        # Step 4: Delete the task
        delete_success = delete_task(token, task_id)
        if not delete_success:
            print("❌ TEST FAILED: Could not delete task")
            return 1
        
        # Verify the deletion
        verify_deletion = verify_task_deletion(token, task_id)
        if not verify_deletion:
            print("❌ TEST FAILED: Could not verify task deletion")
            return 1
        
        # Test summary
        print("\n=== Test Summary ===")
        print("✅ Authentication: Successful")
        print("✅ Task Creation: Successful")
        print("✅ Task Update: Successful")
        print("✅ Task Status Update: Successful")
        print("✅ Task Deletion: Successful")
        print("\n✅ TEST PASSED: All steps completed successfully")
        return 0
        
    finally:
        # Clean up by deleting the test project
        delete_project(token, project_id)

if __name__ == "__main__":
    sys.exit(main())