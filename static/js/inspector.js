import { canvas } from "./dom.js";

const htmlEditor = document.getElementById("htmlEditor");
const cssEditor = document.getElementById("cssEditor");
const jsEditor = document.getElementById("jsEditor");
const dynamicStyle = document.createElement("style");
document.head.appendChild(dynamicStyle);

function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function syncInspectorFromCanvas() {
  htmlEditor.value = canvas.innerHTML;
}

export function initInspector() {
  syncInspectorFromCanvas();
  htmlEditor.addEventListener("input", debounce(() => {
    canvas.innerHTML = htmlEditor.value;
  }));
  cssEditor.addEventListener("input", debounce(() => {
    dynamicStyle.textContent = cssEditor.value;
  }));
  jsEditor.addEventListener("input", debounce(() => {
    try {
      // Intentionally allow live scripting for builder behavior.
      Function(jsEditor.value)();
    } catch {
      // Ignore non-critical user script errors.
    }
  }));
}

export function getInspectorPayload() {
  return {
    html: htmlEditor.value,
    css: cssEditor.value,
    js: jsEditor.value,
  };
}

export function loadInspectorPayload(payload = {}) {
  htmlEditor.value = payload.html || "";
  cssEditor.value = payload.css || "";
  jsEditor.value = payload.js || "";
  if (payload.html) canvas.innerHTML = payload.html;
  if (payload.css) dynamicStyle.textContent = payload.css;
}
