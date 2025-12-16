# server-python/test_analyze.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_js_eval_warning():
    # Send a small JS snippet that uses eval
    payload = {
        "language": "javascript",
        "content": 'const x = eval("2+2");'
    }
    r = client.post("/analyze", json=payload)
    assert r.status_code == 200

    data = r.json()
    issues = data.get("issues", [])

    # <-- This is the assertion you asked about:
    assert any("eval" in i["message"].lower() for i in issues), (
        f"Expected an eval-related warning, got: {issues}"
    )
