from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class LLMProvider(ABC):
    """Swap mock vs production LLM without changing callers."""

    @abstractmethod
    def complete(self, system: str, user: str, context: dict[str, Any] | None = None) -> str:
        raise NotImplementedError


class PaymentProvider(ABC):
    @abstractmethod
    def create_intent(self, user_id: str, plan_id: str, amount: float, currency: str) -> dict[str, Any]:
        raise NotImplementedError


class MockPaymentProvider(PaymentProvider):
    """Records payment intents. Replace with StripePaymentProvider using STRIPE_SECRET_KEY."""

    def create_intent(self, user_id: str, plan_id: str, amount: float, currency: str) -> dict[str, Any]:
        return {
            "provider": "mock",
            "client_secret": f"mock_secret_{user_id}_{plan_id}",
            "amount": amount,
            "currency": currency,
            "status": "requires_confirmation",
        }


class HttpLLMProvider(LLMProvider):
    """OpenAI-compatible chat completions. Requires LLM_API_KEY on the server."""

    def __init__(self, api_key: str, base_url: str, model: str) -> None:
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.model = model

    def complete(self, system: str, user: str, context: dict[str, Any] | None = None) -> str:
        import httpx

        if not self.api_key:
            raise RuntimeError("LLM_API_KEY is not configured")
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": 0.4,
        }
        headers = {"Authorization": f"Bearer {self.api_key}"}
        with httpx.Client(timeout=45.0) as client:
            response = client.post(f"{self.base_url}/chat/completions", json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
        return data["choices"][0]["message"]["content"]
