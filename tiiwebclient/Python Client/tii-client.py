from atexit import register
from cgitb import reset
from os import access
from urllib import response
import requests
import random
import json

auth_api_port = 44309 # ehi's port
# Register user
def registerUser(username, email, firstname, lastname, password):
    headers = {
        'Content-Type': 'application/json'
    }

    newUser = {
        'Username': username,
        'Email': email,
        'FirstName': firstname,
        'LastName': lastname,
        'Password': password
    }

    register_user_url = f'https://localhost:{auth_api_port}/api/auth/register'
    # send post request to url (api server)
    resp = requests.post(register_user_url, headers=headers, json=newUser, verify=False)

    result = {}

    if(resp.status_code == 201): 
        result['success'] = True
        result['message'] = "You have been successfully registered to Tii"
    else:
        result['success'] = False
        result['message'] = "Failed to register you to Tii"

    return result

def HandleUserRegistration():
    firstname = input("First name: ")
    lastname = input("Last name:")
    username = input("Username: ")
    email = input("Email: ")
    password = input("Password: ")

    result = registerUser(username, email, firstname, lastname, password)

    if result['success']:
        print(result['message'])
    else:
        print(result['message'])


if __name__ == "__main__":
     done = False
     main_title = '\n\nWhat do you want to do? '
     tag_title = '\n\nSelect: '
     main_options = ['Register to Tii', 'Quit']
     
     while not done:
         print('\n' + '\n'.join([f'{i+1}). {main_options[i]}' for i in range(len(main_options))]))    
         main_index = int(input(main_title)) - 1

         if(main_index == 0):
             HandleUserRegistration()
         else:
             print("\n\tThank you, bye!")
             done = True