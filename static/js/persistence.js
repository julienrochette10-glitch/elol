import { state } from "./state.js";
import { createElement } from "./canvas.js";
import { toSerializableElement } from "./dom.js";
import { getInspectorPayload, loadInspectorPayload, syncInspectorFromCanvas } from "./inspector.js";

export async function saveProject() {
  const elements = [...state.elements.values()].map((node) => toSerializableElement(node));
  const inspector = getInspectorPayload();
  const payload = { elements, inspector };
  await fetch("/api/project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function loadProject() {
  const res = await fetch("/api/project");
  const data = await res.json();
  if (!data.project) {
    syncInspectorFromCanvas();
    return;
  }
  data.project.elements?.forEach((el) => createElement(el.type, el));
  loadInspectorPayload(data.project.inspector || {});
}
