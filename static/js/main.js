import { createElement } from "./canvas.js";
import { canvas, setSelected } from "./dom.js";
import { bindContextMenu } from "./contextMenu.js";
import { initPanels } from "./panels.js";
import { initInspector, syncInspectorFromCanvas } from "./inspector.js";
import { loadProject, saveProject } from "./persistence.js";
import { renderContextOptions } from "./contextPanel.js";

const toolbar = document.getElementById("toolbar");
const filePicker = document.getElementById("filePicker");

const types = [
  ["text", "Texte"], ["button", "Bouton"], ["image", "Image"], ["video", "Vidéo"],
  ["input", "Champ"], ["menu", "Menu"], ["bar", "Barre"], ["container", "Conteneur"],
];

let pendingMediaType = null;

function makeTool(type, label) {
  const btn = document.createElement("button");
  btn.textContent = `+ ${label}`;
  btn.addEventListener("click", () => {
    if (["image", "video"].includes(type)) {
      pendingMediaType = type;
      filePicker.accept = type === "image" ? "image/*" : "video/*";
      filePicker.click();
      return;
    }
    createElement(type);
    syncInspectorFromCanvas();
  });
  return btn;
}

types.forEach(([type, label]) => toolbar.appendChild(makeTool(type, label)));

filePicker.addEventListener("change", () => {
  const file = filePicker.files?.[0];
  if (!file || !pendingMediaType) return;
  const url = URL.createObjectURL(file);
  const node = createElement(pendingMediaType, { w: 240, h: 140 });
  const media = node.querySelector(pendingMediaType);
  media.src = url;
  if (pendingMediaType === "video") media.controls = true;
  pendingMediaType = null;
  syncInspectorFromCanvas();
  filePicker.value = "";
});

canvas.addEventListener("click", (event) => {
  if (event.target === canvas) setSelected(null);
});

bindContextMenu(canvas);
initPanels();
initInspector();
await loadProject();
renderContextOptions("container");

document.getElementById("saveProjectBtn")?.addEventListener("click", saveProject);
