def test_get_nonexistent_ticket(client):
    response = client.get("/api/v1/tickets/999999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Ticket not found"

def test_update_nonexistent_ticket(client):
    payload = {"status": "Closed"}
    response = client.put("/api/v1/tickets/999999", json=payload)
    assert response.status_code == 404
    assert response.json()["detail"] == "Ticket not found"
