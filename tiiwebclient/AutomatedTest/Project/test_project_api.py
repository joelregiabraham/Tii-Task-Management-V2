import requests
import json
from datetime import datetime
import sys
import time

# API URLs
AUTH_API_URL = "https://localhost:7071/api"
PROJECT_API_URL = "https://localhost:7072/api"

# Test user credentials
USERNAME = "johndoe123"
PASSWORD = "securePass123!"

# Project details
PROJECT_NAME = "Python Test Project"
PROJECT_DESCRIPTION = "Automated test using Python"
UPDATED_PROJECT_NAME = "Updated Python Test Project"
UPDATED_PROJECT_DESCRIPTION = "Updated description via automated test"

# Team member to add
TEAM_MEMBER_USERNAME = "Tester1"
TEAM_MEMBER_ROLE_ID = 2  # TeamMember role

def login(username, password):
    """Authenticate using the Auth API and return JWT token"""
    print(f"Authenticating with user: {username}...")
    
    login_url = f"{AUTH_API_URL}/auth/login"
    login_data = {
        "username": username,
        "password": password
    }
    
    try:
        # Disable SSL verification for localhost testing
        response = requests.post(login_url, json=login_data, verify=False)
        
        if response.status_code == 200:
            token_data = response.json()
            print("✅ Authentication successful!")
            return token_data["accessToken"]
        else:
            print(f"❌ Authentication failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Authentication error: {str(e)}")
        return None

def create_project(token):
    """Create a project using the Project API"""
    print("\nStep 1: Creating a new project...")
    
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
            print("✅ Project created successfully!")
            print(f"Project ID: {project['projectId']}")
            print(f"Project Name: {project['name']}")
            print(f"Project Description: {project['description']}")
            return project
        else:
            print(f"❌ Project creation failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Project creation error: {str(e)}")
        return None

def update_project(token, project_id):
    """Update the project using the Project API"""
    print(f"\nStep 2: Updating project (ID: {project_id})...")
    
    project_url = f"{PROJECT_API_URL}/projects/{project_id}"
    project_data = {
        "projectId": project_id,
        "name": UPDATED_PROJECT_NAME,
        "description": UPDATED_PROJECT_DESCRIPTION
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        # Disable SSL verification for localhost testing
        response = requests.put(project_url, json=project_data, headers=headers, verify=False)
        
        if response.status_code == 204:
            print("✅ Project updated successfully!")
            return True
        else:
            print(f"❌ Project update failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Project update error: {str(e)}")
        return False

def get_user_id_by_username(token, username):
    """Get a user's ID by username"""
    print(f"\nFinding user ID for username: {username}...")
    
    user_url = f"{AUTH_API_URL}/users/by-username/{username}/id"
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        # Disable SSL verification for localhost testing
        response = requests.get(user_url, headers=headers, verify=False)
        
        if response.status_code == 200:
            user_id = response.text.strip('"')  # Remove quotes from response
            print(f"✅ Found user ID: {user_id}")
            return user_id
        else:
            print(f"❌ Failed to find user with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error finding user ID: {str(e)}")
        return None

def add_project_member(token, project_id, username, role_id):
    """Add a member to the project"""
    print(f"\nStep 3: Adding member '{username}' to project with role ID {role_id}...")
    
    # First try to get the user ID
    member_url = f"{PROJECT_API_URL}/projects/{project_id}/members/by-username"
    
    member_data = {
        "username": username,
        "roleId": role_id
    }
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        # Disable SSL verification for localhost testing
        response = requests.post(member_url, json=member_data, headers=headers, verify=False)
        
        if response.status_code == 204:
            print(f"✅ Successfully added {username} as a project member!")
            return True
        else:
            print(f"❌ Failed to add project member with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error adding project member: {str(e)}")
        return False

def verify_project_member(token, project_id, username):
    """Verify the member was added to the project"""
    print(f"\nStep 4: Verifying member '{username}' was added to project...")
    
    members_url = f"{PROJECT_API_URL}/projects/{project_id}/members"
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        # Disable SSL verification for localhost testing
        response = requests.get(members_url, headers=headers, verify=False)
        
        if response.status_code == 200:
            members = response.json()
            # Check if the username exists in the members list
            for member in members:
                if member["username"].lower() == username.lower():
                    print(f"✅ Successfully verified {username} is a project member!")
                    print(f"Role: {member['roleName']}")
                    return True
            
            print(f"❌ Could not find {username} in project members list")
            return False
        else:
            print(f"❌ Failed to get project members with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error verifying project member: {str(e)}")
        return False

def verify_project_update(token, project_id):
    """Verify the project was updated correctly"""
    print(f"\nVerifying project update for project ID: {project_id}...")
    
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
            if (project["name"] == UPDATED_PROJECT_NAME and 
                project["description"] == UPDATED_PROJECT_DESCRIPTION):
                print("✅ Project update verification successful!")
                return True
            else:
                print("❌ Project update verification failed: details don't match")
                print(f"Expected: {UPDATED_PROJECT_NAME}, {UPDATED_PROJECT_DESCRIPTION}")
                print(f"Received: {project['name']}, {project['description']}")
                return False
        else:
            print(f"❌ Project verification failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Project verification error: {str(e)}")
        return False

def delete_project(token, project_id):
    """Delete the project"""
    print(f"\nStep 5: Deleting project (ID: {project_id})...")
    
    project_url = f"{PROJECT_API_URL}/projects/{project_id}"
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        # Disable SSL verification for localhost testing
        response = requests.delete(project_url, headers=headers, verify=False)
        
        if response.status_code == 204:
            print("✅ Project deleted successfully!")
            return True
        else:
            print(f"❌ Project deletion failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Project deletion error: {str(e)}")
        return False

def verify_project_deletion(token, project_id):
    """Verify the project was deleted"""
    print(f"\nVerifying project deletion for project ID: {project_id}...")
    
    project_url = f"{PROJECT_API_URL}/projects/{project_id}"
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        # Disable SSL verification for localhost testing
        response = requests.get(project_url, headers=headers, verify=False)
        
        if response.status_code == 404:
            print("✅ Project deletion verification successful! (404 Not Found)")
            return True
        else:
            print(f"❌ Project deletion verification failed with status code: {response.status_code}")
            print(f"Project should not be found after deletion.")
            return False
    except Exception as e:
        print(f"❌ Project deletion verification error: {str(e)}")
        return False

def main():
    """Main function to run the test"""
    print("=== Project API Automated Test ===")
    print(f"Testing with user: {USERNAME}")
    
    # Disable insecure request warning for localhost testing
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    # Get auth token
    token = login(USERNAME, PASSWORD)
    if not token:
        print("❌ TEST FAILED: Could not authenticate")
        return 1
    
    # Step 1: Create a project
    project = create_project(token)
    if not project:
        print("❌ TEST FAILED: Could not create project")
        return 1
    
    project_id = project["projectId"]
    
    # Step 2: Update the project
    update_success = update_project(token, project_id)
    if not update_success:
        print("❌ TEST FAILED: Could not update project")
        return 1
    
    # Verify the update
    verify_update = verify_project_update(token, project_id)
    if not verify_update:
        print("❌ TEST FAILED: Could not verify project update")
        return 1
    
    # Step 3: Add a team member
    add_member_success = add_project_member(token, project_id, TEAM_MEMBER_USERNAME, TEAM_MEMBER_ROLE_ID)
    if not add_member_success:
        print("❌ TEST FAILED: Could not add project member")
        return 1
    
    # Step 4: Verify the team member was added
    verify_member = verify_project_member(token, project_id, TEAM_MEMBER_USERNAME)
    if not verify_member:
        print("❌ TEST FAILED: Could not verify project member")
        return 1
    
    # Step 5: Delete the project
    delete_success = delete_project(token, project_id)
    if not delete_success:
        print("❌ TEST FAILED: Could not delete project")
        return 1
    
    # Verify the deletion
    verify_deletion = verify_project_deletion(token, project_id)
    if not verify_deletion:
        print("❌ TEST FAILED: Could not verify project deletion")
        return 1
    
    # Test summary
    print("\n=== Test Summary ===")
    print("✅ Authentication: Successful")
    print("✅ Project Creation: Successful")
    print("✅ Project Update: Successful")
    print("✅ Adding Team Member: Successful")
    print("✅ Project Deletion: Successful")
    print("\n✅ TEST PASSED: All steps completed successfully")
    return 0

if __name__ == "__main__":
    sys.exit(main())