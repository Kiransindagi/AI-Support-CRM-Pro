def test_update_ticket_status(client):
    # First create a ticket
    payload = {
        "customer_name": "Update Test",
        "customer_email": "update@example.com",
        "subject": "Status update",
        "description": "Just testing."
    }
    create_resp = client.post("/api/v1/tickets/", json=payload)
    ticket_id = create_resp.json()["id"]

    # Update status
    update_payload = {"status": "In Progress"}
    update_resp = client.put(f"/api/v1/tickets/{ticket_id}", json=update_payload)
    assert update_resp.status_code == 200
    
    # Verify update
    data = update_resp.json()
    assert data["status"] == "In Progress"
