def test_invalid_email_validation(client):
    payload = {
        "customer_name": "Bad Email",
        "customer_email": "not-an-email",
        "subject": "Email issue",
        "description": "This should fail validation."
    }
    response = client.post("/api/v1/tickets/", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data
    assert data["detail"][0]["loc"] == ["body", "customer_email"]
