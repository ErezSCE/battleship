"""Minimal FastAPI stub for testing purposes.

Provides a simple FastAPI class with a .post decorator to register route handlers.
This stub is sufficient for the unit tests in this repository and avoids pulling
the real FastAPI dependency.
"""

from typing import Callable, Dict, Any

class FastAPI:
    def __init__(self) -> None:
        self._post_routes: Dict[str, Callable[[Dict[str, Any]], Any]] = {}

    def post(self, path: str):
        """Register a POST route.

        Usage::
            app = FastAPI()
            @app.post('/example')
            def handler(payload: dict):
                ...
        """
        def decorator(func: Callable[[Dict[str, Any]], Any]):
            self._post_routes[path] = func
            return func
        return decorator

    @property
    def routes(self) -> Dict[str, Callable[[Dict[str, Any]], Any]]:
        return self._post_routes
