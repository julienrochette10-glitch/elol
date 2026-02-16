const panels = [...document.querySelectorAll(".panel")];

function makeDraggable(panel) {
  const header = panel.querySelector(".panel-header");
  header.addEventListener("pointerdown", (event) => {
    const rect = panel.getBoundingClientRect();
    const dx = event.clientX - rect.left;
    const dy = event.clientY - rect.top;

    const onMove = (moveEvent) => {
      panel.style.left = `${moveEvent.clientX - dx}px`;
      panel.style.top = `${moveEvent.clientY - dy}px`;
      panel.style.bottom = "auto";
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });
}

export function initPanels() {
  panels.forEach((panel) => {
    makeDraggable(panel);
    panel.querySelector(".panel-close")?.addEventListener("click", () => {
      panel.classList.add("hidden");
    });
  });

  document.getElementById("restorePanelsBtn")?.addEventListener("click", () => {
    panels.forEach((panel) => panel.classList.remove("hidden"));
  });
}
