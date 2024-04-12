import pytest
from fastapi.testclient import TestClient
from main import app

import firebase_admin
from firebase_admin import credentials, firestore, exceptions

import time

client = TestClient(app)

TEST_USER_LOGIN = {
    "username": "garytest",
    "password": "password",
}

# Test registration endpoint
def test_register_user():
    response = client.post(
        "/register/",
        json= {
            "username": "test_user",
            "password": "test_password",
            "email": "test@example.com",
            "firstname": "Test",
            "lastname": "User",
            "disabled": False
        }
    )

    assert response.status_code == 200
    assert response.json()["message"] == "User successfully created"

# Test login endpoint
def test_login():
    response = client.post(
        "/token",
        data=TEST_USER_LOGIN
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def call_mask_text():
    token = get_test_user_token()

    while True:
        response = client.post(
            "/mask-text",
            json={
                "text": "Sensitive information here.",
                "mask_level": ["PERSON", "LOCATION"],
            },
            headers={
                "Authorization": f"Bearer {token}"
            }
        )

        print("response json:", response.json())

        if response.status_code == 503 and response.json()['error'] == 'Model Isotonic/deberta-v3-base_finetuned_ai4privacy_v2 is currently loading':
            time.sleep(float(response.json()['estimated_time']))
        elif response.status_code == 200:
            break
    
    return response

# Test masking text endpoint
def test_mask_text():
    response = call_mask_text()

    assert response.status_code == 200
    assert "inference_result" in response.json()
    assert "masked_input" in response.json()
    assert "masker" in response.json()
    assert "entity_mask" in response.json()

def call_manual_mask():
    token = get_test_user_token()
    mask_test_res = call_mask_text()

    response = client.post(
        "/manual-mask",
        json={
            "word": ["Sensitive"],
            "entity": ["FIRSTNAME"],
            "manual_mask_count": 1,
            "masking_instance_id": mask_test_res.json()['masking_instance_id']
        },
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    return response

# Test manual masking endpoint
def test_manual_mask():
    response = call_manual_mask()
    assert response.status_code == 200
    assert 4 == len(response.json())

# Test manual unmasking endpoint
# def test_manual_unmask():
#     token = get_test_user_token()
#     manual_mask_res = call_manual_mask()

#     # (original, unmaksed, type)
#     _, _, manual_mask_data, _ = manual_mask_res.json()['tmp_mask_dict']

#     print(manual_mask_data)

#     manual_mask_arr = [(mask_from, mask_to, mask_type) for mask_from, mask_to, mask_type in zip(manual_mask_data)]

#     response = client.post(
#         "/manual-unmask",
#         json={
#             "word": [manual_mask_arr[0][0]],
#             "entity": [manual_mask_arr[0][2]],
#             "masking_instance_id": manual_mask_res.json()['masking_instance_id']
#         },
#         headers={
#             "Authorization": f"Bearer {token}"
#         }
#     )
#     assert response.status_code == 200

# Test masking history endpoint
def test_get_mask_history():
    token = get_test_user_token()

    response = client.get(
        "/masking-history",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )
    assert response.status_code == 200
    assert len(response.json()) > 0

# Test deleting masking instance endpoint
def test_delete_masking_instance():
    token = get_test_user_token()
    response = call_mask_text()

    response = client.delete(
        f"/masking-instance/{response.json()['masking_instance_id']}",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )
    assert response.status_code == 200

# Test guarded endpoints
def test_guarded_endpoints():
    endpoints = [
        {"endpoint_url": "/mask-text", "method": "POST"}, 
        {"endpoint_url": "/manual-mask", "method": "POST"}, 
        {"endpoint_url": "/manual-unmask", "method": "POST"}, 
        {"endpoint_url": "/masking-history", "method": "GET"}, 
        {"endpoint_url": "/masking-instance/test", "method": "DELETE"}, 
        {"endpoint_url": "/run-model", "method": "POST"}
    ]

    for endpoint in endpoints:
        http_req = getattr(client, str(endpoint["method"]).lower())
            
        response = http_req(
            endpoint["endpoint_url"]
        )

        assert response.status_code == 401

def get_test_user_token():
    keys_required = ["username", "password"]

    response = client.post(
        "/token",
        data={k:v for k,v in TEST_USER_LOGIN.items() if k in keys_required}
    )
    res_data = response.json() 

    return res_data['access_token']
