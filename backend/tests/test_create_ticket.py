def test_create_ticket(client):
    payload = {
        "customer_name": "John Doe",
        "customer_email": "john.doe@example.com",
        "subject": "System is down",
        "description": "I cannot access my account since this morning."
    }
    response = client.post("/api/v1/tickets/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["customer_name"] == payload["customer_name"]
    assert data["subject"] == payload["subject"]
    assert "ticket_id" in data
    assert data["status"] == "Open"
