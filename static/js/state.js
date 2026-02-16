export const state = {
  elements: new Map(),
  selectedId: null,
  panelState: new Map(),
  html: "",
  css: "",
  js: "",
};

let inc = 0;
export function makeId(prefix = "el") {
  inc += 1;
  return `${prefix}-${Date.now()}-${inc}`;
}
