import { state } from "./state.js";
import { removeSelected } from "./canvas.js";
import { setSelected } from "./dom.js";

const menu = document.getElementById("contextMenu");

const menuItems = [
  { key: "lock", label: "Verrouiller / Déverrouiller" },
  { key: "delete", label: "Supprimer" },
  { key: "css", label: "Éditer CSS" },
  { key: "script", label: "Ajouter script JavaScript" },
  { key: "effects", label: "Modifier effets" },
];

function closeMenu() {
  menu.hidden = true;
}

function applyAction(action) {
  const selected = state.elements.get(state.selectedId);
  if (!selected) return;

  switch (action) {
    case "lock":
      selected.classList.toggle("locked");
      break;
    case "delete":
      removeSelected();
      break;
    case "css": {
      const css = prompt("Nouveau CSS inline pour cet élément", selected.style.cssText) || "";
      if (css) selected.style.cssText = css;
      break;
    }
    case "script": {
      const script = prompt("JavaScript associé à l'élément", selected.dataset.script || "") || "";
      selected.dataset.script = script;
      break;
    }
    case "effects": {
      const type = selected.dataset.type;
      const effect = prompt(`Effet spécifique pour ${type}`, selected.dataset.effect || "") || "";
      selected.dataset.effect = effect;
      break;
    }
    default:
      break;
  }
}

menuItems.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item.label;
  li.addEventListener("click", () => {
    applyAction(item.key);
    closeMenu();
  });
  menu.appendChild(li);
});

window.addEventListener("click", closeMenu);

export function bindContextMenu(canvas) {
  canvas.addEventListener("contextmenu", (event) => {
    const node = event.target.closest(".builder-element");
    if (!node) return;
    event.preventDefault();
    setSelected(node.dataset.id);
    menu.hidden = false;
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;
  });
}
