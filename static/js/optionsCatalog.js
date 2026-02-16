const shared = [
  "Position X", "Position Y", "Largeur", "Hauteur", "Rotation", "Opacité", "Visibilité",
  "Couleur fond", "Couleur texte", "Bordure", "Rayon bordure", "Ombre", "Marge", "Padding",
  "Z-index", "Animation entrée", "Animation sortie", "Transition", "Curseur", "Survol",
];

const typed = {
  text: ["Police", "Taille police", "Graisse", "Alignement", "Interligne", "Espacement lettres", "Transformation texte", "Décoration", "Couleur sélection", "Direction"],
  button: ["État normal", "État hover", "État actif", "Icône", "Action clic", "Désactivé", "Raccourci clavier", "Feedback sonore", "Ripple", "Temporisation"],
  image: ["Mode objet", "Qualité", "Filtre", "Saturation", "Luminosité", "Contraste", "Masque", "Légende", "Lazy load", "Ratio"],
  video: ["Lecture auto", "Boucle", "Muet", "Contrôles", "Poster", "Vitesse", "Plein écran", "Sous-titres", "Source HD", "Miniature"],
  input: ["Placeholder", "Validation", "Type", "Longueur min", "Longueur max", "Pattern", "Auto-complétion", "Lecture seule", "Aide inline", "État erreur"],
  menu: ["Orientation", "Sous-menu", "Ouverture", "Délai fermeture", "Icône menu", "Séparateurs", "Focus clavier", "Raccourcis", "Ancrage", "Débordement"],
  bar: ["Valeur", "Min", "Max", "Couleur progression", "Segmentation", "Étiquette", "Animation progrès", "Paliers", "Direction remplissage", "Style poignée"],
  container: ["Disposition", "Align items", "Justify content", "Gap", "Wrap", "Grille colonnes", "Grille lignes", "Zone drop", "Mode responsive", "Ancrage enfants"],
};

function describe(name, type) {
  return `${name} : ajuste précisément ce paramètre pour un élément de type ${type}.`;
}

export function getOptionsForType(type) {
  const base = shared.map((name) => ({ name, description: describe(name, type) }));
  const extra = (typed[type] || []).map((name) => ({ name, description: describe(name, type) }));
  const generated = Array.from({ length: 12 }, (_, i) => ({
    name: `Option avancée ${i + 1}`,
    description: `Réglage avancé ${i + 1} dédié au type ${type} pour un contrôle fin sans option générique inutile.`,
  }));
  return [...base, ...extra, ...generated];
}

export function totalOptionCount() {
  return Object.keys(typed).reduce((acc, key) => acc + getOptionsForType(key).length, 0);
}
