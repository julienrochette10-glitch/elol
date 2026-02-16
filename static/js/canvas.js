import { canvas, setSelected } from "./dom.js";
import { state, makeId } from "./state.js";
import { renderContextOptions } from "./contextPanel.js";

const rafDrag = { frame: 0, pending: null };

function scheduleDrag(fn) {
  rafDrag.pending = fn;
  if (rafDrag.frame) return;
  rafDrag.frame = requestAnimationFrame(() => {
    rafDrag.frame = 0;
    rafDrag.pending?.();
  });
}

function createInner(type) {
  switch (type) {
    case "text": return `<span>Texte</span>`;
    case "button": return `<button type="button">Bouton</button>`;
    case "image": return `<img alt="image" style="width:100%;height:100%;object-fit:cover;" />`;
    case "video": return `<video style="width:100%;height:100%;" controls></video>`;
    case "input": return `<input type="text" placeholder="Champ texte" style="width:100%;height:100%;"/>`;
    case "menu": return `<nav>Menu ▾</nav>`;
    case "bar": return `<progress max="100" value="30" style="width:100%;height:100%;"></progress>`;
    default: return `<div>Conteneur</div>`;
  }
}

export function createElement(type, opts = {}) {
  const id = opts.id || makeId(type);
  const node = document.createElement("div");
  node.className = "builder-element";
  node.dataset.id = id;
  node.dataset.type = type;
  node.style.left = `${opts.x ?? 50}px`;
  node.style.top = `${opts.y ?? 50}px`;
  node.style.width = `${opts.w ?? 160}px`;
  node.style.height = `${opts.h ?? 60}px`;
  node.innerHTML = opts.html || createInner(type);
  if (opts.cssText) node.style.cssText += `;${opts.cssText}`;
  if (opts.locked) node.classList.add("locked");
  if (opts.script) node.dataset.script = opts.script;

  const handle = document.createElement("div");
  handle.className = "resize-handle";
  node.appendChild(handle);

  bindElement(node, handle);
  canvas.appendChild(node);
  state.elements.set(id, node);
  return node;
}

function bindElement(node, handle) {
  node.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target === handle || node.classList.contains("locked")) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const baseX = parseFloat(node.style.left);
    const baseY = parseFloat(node.style.top);
    setSelected(node.dataset.id);
    node.setPointerCapture(event.pointerId);

    const onMove = (moveEvent) => {
      scheduleDrag(() => {
        node.style.left = `${baseX + moveEvent.clientX - startX}px`;
        node.style.top = `${baseY + moveEvent.clientY - startY}px`;
      });
    };
    const onUp = () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerup", onUp);
    };
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerup", onUp);
  });

  handle.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
    if (node.classList.contains("locked")) return;
    const startW = node.offsetWidth;
    const startH = node.offsetHeight;
    const startX = event.clientX;
    const startY = event.clientY;

    const onMove = (moveEvent) => {
      scheduleDrag(() => {
        node.style.width = `${Math.max(50, startW + moveEvent.clientX - startX)}px`;
        node.style.height = `${Math.max(30, startH + moveEvent.clientY - startY)}px`;
      });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });

  node.addEventListener("dblclick", (event) => {
    const isTextual = ["text", "button"].includes(node.dataset.type);
    if (!isTextual) return;
    event.stopPropagation();
    const target = node.querySelector("span,button") || node;
    target.contentEditable = "true";
    target.focus();
    document.execCommand("selectAll", false, null);
    const endEdit = () => {
      target.contentEditable = "false";
      target.removeEventListener("blur", endEdit);
    };
    target.addEventListener("blur", endEdit);
  });

  node.addEventListener("click", () => {
    setSelected(node.dataset.id);
    renderContextOptions(node.dataset.type);
  });
}

export function removeSelected() {
  const selected = state.elements.get(state.selectedId);
  if (!selected) return;
  selected.remove();
  state.elements.delete(state.selectedId);
  setSelected(null);
}
