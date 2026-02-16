import { state } from "./state.js";

export const canvas = document.getElementById("canvas");

export function setSelected(id) {
  state.selectedId = id;
  document.querySelectorAll(".builder-element").forEach((node) => {
    node.classList.toggle("selected", node.dataset.id === id);
  });
}

export function toSerializableElement(node) {
  return {
    id: node.dataset.id,
    type: node.dataset.type,
    locked: node.classList.contains("locked"),
    x: parseFloat(node.style.left || "0"),
    y: parseFloat(node.style.top || "0"),
    w: parseFloat(node.style.width || `${node.offsetWidth}`),
    h: parseFloat(node.style.height || `${node.offsetHeight}`),
    html: node.innerHTML,
    cssText: node.style.cssText,
    script: node.dataset.script || "",
  };
}
