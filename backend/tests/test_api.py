from fastapi.testclient import TestClient

from app.main import app


def _login(client: TestClient, email: str = "student@ailearnos.app"):
    res = client.post("/v1/auth/login", json={"email": email, "password": "LearnOS@123"})
    assert res.status_code == 200, res.text
    return res.json()["access_token"]


def test_health():
    with TestClient(app) as client:
        res = client.get("/health")
        assert res.json()["ok"] is True


def test_login_and_home():
    with TestClient(app) as client:
        token = _login(client)
        res = client.get("/v1/home", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        body = res.json()
        assert "Good" in body["greeting"]
        assert body["continueCourse"]["id"] == "c_ux"


def test_courses_and_modules():
    with TestClient(app) as client:
        token = _login(client)
        headers = {"Authorization": f"Bearer {token}"}
        res = client.get("/v1/courses", headers=headers)
        assert res.status_code == 200
        assert any(c["id"] == "c_ux" for c in res.json())
        mods = client.get("/v1/courses/c_ux/modules", headers=headers).json()
        assert mods[0]["title"] == "Introduction to UX"
        assert mods[0]["lessons"][0]["title"] == "What is UX?"


def test_ai_chat_and_course_generation():
    with TestClient(app) as client:
        token = _login(client)
        headers = {"Authorization": f"Bearer {token}"}
        chat = client.post(
            "/v1/ai/chat",
            headers=headers,
            json={
                "message": "I don't understand usability testing.",
                "course_title": "UX Design for Beginners",
            },
        )
        assert chat.status_code == 200
        assert len(chat.json()["reply"]) > 20

        admin = _login(client, "admin@ailearnos.app")
        draft = client.post(
            "/v1/admin/ai/generate-course",
            headers={"Authorization": f"Bearer {admin}"},
            json={
                "name": "UX Design for Beginners",
                "subject": "UX",
                "difficulty": "beginner",
                "audience": "New designers",
                "objectives": ["Research", "Flows"],
            },
        )
        assert draft.status_code == 200
        modules = draft.json()["modules"]
        assert modules[0]["title"] == "Introduction to UX"
        assert modules[0]["lessons"][0]["title"] == "What is UX?"


def test_admin_destructive_requires_confirmation():
    with TestClient(app) as client:
        admin = _login(client, "admin@ailearnos.app")
        res = client.post(
            "/v1/admin/ai/assist",
            headers={"Authorization": f"Bearer {admin}"},
            json={"prompt": "Delete inactive students"},
        )
        assert res.status_code == 200
        assert res.json()["requires_confirmation"] is True
        assert res.json().get("action_id")


def test_assessment_submit():
    with TestClient(app) as client:
        token = _login(client)
        headers = {"Authorization": f"Bearer {token}"}
        quizzes = client.get("/v1/assessments?course_id=c_ux", headers=headers).json()
        qid = quizzes[0]["id"]
        question_id = quizzes[0]["questions"][0]["id"]
        result = client.post(
            f"/v1/assessments/{qid}/submit",
            headers=headers,
            json={"answers": {question_id: 1}},
        )
        assert result.status_code == 200
        assert "percentage" in result.json()


def test_student_cannot_hit_admin():
    with TestClient(app) as client:
        token = _login(client)
        res = client.get("/v1/admin/dashboard", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 403
