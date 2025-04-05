from atexit import register
from cgitb import reset
from os import access
from urllib import response
import requests
import random
import json

auth_api_port = 44309
# Register user
def registerUser(username, email, firstname, lastname):
