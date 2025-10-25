/**
 * Atom: TagColors
 * Color palette for dragon attributes and classifications
 */

export const TAG_COLORS: Record<string, string> = {
  // Fire/Power Dragons (red-orange spectrum)
  fire: "#FF4500",
  power: "#DC143C",
  volcanic: "#B22222",
  destruction: "#8B0000",
  strength: "#FF6347",
  
  // Water/Ice Dragons (blue-cyan spectrum)
  water: "#1E90FF",
  ice: "#00CED1",
  ocean: "#4682B4",
  frost: "#B0E0E6",
  storm: "#4169E1",
  
  // Nature/Earth Dragons (green-brown spectrum)
  nature: "#228B22",
  earth: "#8B4513",
  forest: "#2E8B57",
  plant: "#32CD32",
  mountain: "#A0522D",
  
  // Light/Holy Dragons (white-gold spectrum)
  light: "#FFFACD",
  holy: "#FFD700",
  divine: "#FFF8DC",
  celestial: "#F0E68C",
  wisdom: "#FAFAD2",
  
  // Dark/Shadow Dragons (purple-black spectrum)
  dark: "#8B008B",
  shadow: "#483D8B",
  void: "#2F4F4F",
  death: "#191970",
  nightmare: "#4B0082",
  
  // Time/Space Dragons (cosmic colors)
  time: "#9370DB",
  space: "#663399",
  cosmic: "#6A5ACD",
  quantum: "#7B68EE",
  eternity: "#9932CC",
  
  // Elemental attributes
  lightning: "#FFD700",
  wind: "#87CEEB",
  thunder: "#4682B4",
  poison: "#9ACD32",
  venom: "#ADFF2F",
  
  // Dragon characteristics
  ancient: "#DEB887",
  primordial: "#8B7355",
  legendary: "#FFD700",
  mythical: "#DA70D6",
  immortal: "#DDA0DD",
  
  // Behavioral traits
  guardian: "#4682B4",
  protector: "#6495ED",
  destroyer: "#DC143C",
  trickster: "#FF69B4",
  wise: "#FFD700",
  fierce: "#FF4500",
  noble: "#4169E1",
  savage: "#8B0000",
  cunning: "#FF8C00",
  benevolent: "#87CEEB",
  malevolent: "#8B008B",
  
  // Special attributes
  shapeshifter: "#FF1493",
  immortality: "#BA55D3",
  regeneration: "#32CD32",
  treasure: "#FFD700",
  greed: "#B8860B",
  chaos: "#DC143C",
  
  // Cultural
  european: "#4169E1",
  asian: "#DC143C",
  chinese: "#FF0000",
  japanese: "#FF4500",
  nordic: "#87CEEB",
  greek: "#FFD700",
  egyptian: "#DAA520",
  aztec: "#32CD32",
  indian: "#FF6347",
  welsh: "#DC143C",
  
  // Types
  wyrm: "#8B4513",
  drake: "#FF6347",
  wyvern: "#4682B4",
  hydra: "#32CD32",
  serpent: "#9370DB",
};

/**
 * Get color for a tag, with fallback to default gold
 */
export const getTagColor = (tag: string): string => {
  return TAG_COLORS[tag.toLowerCase()] || "#FFD700";
};

/**
 * Get primary color for a dragon based on its tags
 */
export const getPrimaryDragonColor = (tags: string[]): string => {
  if (tags.length === 0) return "#FFD700"; // Default gold
  
  // Priority order for color selection
  const priorityTags = [
    "fire", "water", "ice", "nature", "light", "dark",
    "time", "space", "legendary", "primordial"
  ];
  
  for (const priorityTag of priorityTags) {
    if (tags.some(tag => tag.toLowerCase() === priorityTag)) {
      return getTagColor(priorityTag);
    }
  }
  
  // Use first tag if no priority match
  return getTagColor(tags[0]);
};

export default TAG_COLORS;
