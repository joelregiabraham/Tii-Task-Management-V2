import requests
import json
from datetime import datetime
import sys

# API URLs
AUTH_API_URL = "https://localhost:7071/api"
PROJECT_API_URL = "https://localhost:7072/api"

# Test user credentials
USERNAME = "johndoe123"
PASSWORD = "securePass123!"

# Project details
PROJECT_NAME = "Python Test Project"
PROJECT_DESCRIPTION = "Automated test using Python"
PROJECT_DATE = "2025-04-16"

def login():
    """Authenticate using the Auth API and return JWT token"""
    print("Step 1: Authenticating with Auth API...")
    
    login_url = f"{AUTH_API_URL}/auth/login"
    login_data = {
        "username": USERNAME,
        "password": PASSWORD
    }
    
    try:
        # Disable SSL verification for localhost testing
        response = requests.post(login_url, json=login_data, verify=False)
        
        if response.status_code == 200:
            token_data = response.json()
            print(" Authentication successful!")
            return token_data["accessToken"]
        else:
            print(f"? Authentication failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            sys.exit(1)
    except Exception as e:
        print(f" Authentication error: {str(e)}")
        sys.exit(1)

def create_project(token):
    """Create a project using the Project API"""
    print("\nStep 2: Creating a new project...")
    
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
        # Disable SSL verification for localhost testing
        response = requests.post(project_url, json=project_data, headers=headers, verify=False)
        
        if response.status_code == 201:
            project = response.json()
            print(" Project created successfully!")
            print(f"Project ID: {project['projectId']}")
            print(f"Project Name: {project['name']}")
            print(f"Project Description: {project['description']}")
            return project
        else:
            print(f"? Project creation failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            sys.exit(1)
    except Exception as e:
        print(f" Project creation error: {str(e)}")
        sys.exit(1)

def verify_project(token, project_id):
    """Verify the project exists by retrieving it"""
    print("\nStep 3: Verifying project creation...")
    
    project_url = f"{PROJECT_API_URL}/projects/{project_id}"
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        # Disable SSL verification for localhost testing
        response = requests.get(project_url, headers=headers, verify=False)
        
        if response.status_code == 200:
            project = response.json()
            
            # Verify project details
            if (project["name"] == PROJECT_NAME and 
                project["description"] == PROJECT_DESCRIPTION):
                print(" Project verification successful!")
                print("All project details match the expected values")
                return True
            else:
                print(" Project verification failed: details don't match")
                print(f"Expected: {PROJECT_NAME}, {PROJECT_DESCRIPTION}")
                print(f"Received: {project['name']}, {project['description']}")
                return False
        else:
            print(f" Project verification failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f" Project verification error: {str(e)}")
        return False

def main():
    """Main function to run the test"""
    print("=== Project API Automated Test ===")
    print(f"Testing with user: {USERNAME}")
    print(f"Creating project: {PROJECT_NAME}\n")
    
    # Disable insecure request warning for localhost testing
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    # Step 1: Login and get token
    token = login()
    
    # Step 2: Create a project
    project = create_project(token)
    
    # Step 3: Verify the project
    success = verify_project(token, project["projectId"])
    
    # Test summary
    print("\n=== Test Summary ===")
    print(f"Authentication: {'Successful' if token else 'Failed'}")
    print(f"Project Creation: {'Successful' if project else 'Failed'}")
    print(f"Project Verification: {'Successful' if success else 'Failed'}")
    
    # Overall test result
    if token and project and success:
        print("\n TEST PASSED: All steps completed successfully")
        return 0
    else:
        print("\n TEST FAILED: One or more steps failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())