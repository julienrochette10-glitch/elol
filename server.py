#!/usr/bin/env python3
"""Lightweight modular web-builder server."""
from __future__ import annotations

import json
import logging
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
STATIC_DIR = ROOT / "static"
DATA_DIR = ROOT / "data"
PROJECT_FILE = DATA_DIR / "project.json"

logging.basicConfig(level=logging.ERROR, format="[%(levelname)s] %(message)s")


class BuilderHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def log_message(self, format: str, *args) -> None:  # noqa: A003
        # Silence standard request logs; keep only critical logs.
        return

    def do_GET(self) -> None:  # noqa: N802
        if self.path == "/api/project":
            self._send_project()
            return
        super().do_GET()

    def do_POST(self) -> None:  # noqa: N802
        if self.path == "/api/project":
            self._save_project()
            return
        self.send_error(HTTPStatus.NOT_FOUND)

    def _send_json(self, payload: dict, status: int = HTTPStatus.OK) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json_body(self) -> dict:
        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length) if length else b"{}"
            data = json.loads(raw.decode("utf-8") or "{}")
            return data if isinstance(data, dict) else {}
        except Exception as exc:  # noqa: BLE001
            logging.error("Invalid request payload: %s", exc)
            return {}

    def _send_project(self) -> None:
        if not PROJECT_FILE.exists():
            self._send_json({"ok": True, "project": None})
            return
        try:
            payload = json.loads(PROJECT_FILE.read_text(encoding="utf-8"))
        except Exception as exc:  # noqa: BLE001
            logging.error("Failed to read project: %s", exc)
            payload = None
        self._send_json({"ok": True, "project": payload})

    def _save_project(self) -> None:
        DATA_DIR.mkdir(exist_ok=True)
        payload = self._read_json_body()
        try:
            PROJECT_FILE.write_text(
                json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
            )
            self._send_json({"ok": True})
        except Exception as exc:  # noqa: BLE001
            logging.critical("Failed to save project: %s", exc)
            self._send_json({"ok": False, "error": "save_failed"}, status=500)


def run(port: int = 8000) -> None:
    server = ThreadingHTTPServer(("0.0.0.0", port), BuilderHandler)
    print(f"Builder server running on http://localhost:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    run()
