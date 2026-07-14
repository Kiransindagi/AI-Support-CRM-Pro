def test_get_ticket(client):
    # First create a ticket
    payload = {
        "customer_name": "Jane Doe",
        "customer_email": "jane@example.com",
        "subject": "Billing issue",
        "description": "Double charged this month."
    }
    create_resp = client.post("/api/v1/tickets/", json=payload)
    assert create_resp.status_code == 201
    ticket_id = create_resp.json()["id"]

    # Now get it
    get_resp = client.get(f"/api/v1/tickets/{ticket_id}")
    assert get_resp.status_code == 200
    data = get_resp.json()
    assert data["id"] == ticket_id
    assert data["subject"] == payload["subject"]
