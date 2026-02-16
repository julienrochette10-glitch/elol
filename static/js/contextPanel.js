import { getOptionsForType, totalOptionCount } from "./optionsCatalog.js";

const target = document.getElementById("contextOptions");

export function renderContextOptions(type) {
  const options = getOptionsForType(type);
  target.innerHTML = `<p>${options.length} options actives pour <strong>${type}</strong> · total catalogue ${totalOptionCount()} options</p>`;
  options.forEach((opt) => {
    const card = document.createElement("article");
    card.className = "option-card";
    card.innerHTML = `<h4>${opt.name}</h4><p>${opt.description}</p>`;
    target.appendChild(card);
  });
}
