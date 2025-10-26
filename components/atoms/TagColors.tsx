/**
 * Atom: TagColors
 * Color palette for dragon attributes and classifications
 */

export const TAG_COLORS: Record<string, string> = {
  // Special/Power traits - most vibrant
  legendary: "#FFB300",      // Bright amber-gold
  mythical: "#BA68C8",       // Purple
  ancient: "#BF8F54",        // Warm brown-gold
  primordial: "#8D6E63",     // Earth brown
  immortal: "#CE93D8",       // Light purple
  divine: "#FFD54F",         // Light gold
  sacred: "#FFB300",         // Amber
  
  // Fire/Power Dragons (warm spectrum)
  fire: "#F4511E",
  power: "#C62828",
  volcanic: "#BF360C",
  destruction: "#B71C1C",
  strength: "#FF7043",
  
  // Water/Ice Dragons (cool spectrum)
  water: "#1E88E5",
  ice: "#26C6DA",
  ocean: "#5C6BC0",
  frost: "#81D4FA",
  storm: "#3949AB",
  
  // Nature/Earth Dragons (green-brown spectrum)
  nature: "#43A047",
  earth: "#795548",
  forest: "#388E3C",
  plant: "#66BB6A",
  mountain: "#8D6E63",
  
  // Light/Holy Dragons (gold spectrum)
  light: "#FFF9C4",
  holy: "#FFB300",
  celestial: "#FFD54F",
  wisdom: "#FFE082",
  
  // Dark/Shadow Dragons (purple-dark spectrum)
  dark: "#7B1FA2",
  shadow: "#512DA8",
  void: "#455A64",
  death: "#311B92",
  nightmare: "#4A148C",
  
  // Time/Space Dragons (cosmic colors)
  time: "#7E57C2",
  space: "#5E35B1",
  cosmic: "#673AB7",
  quantum: "#7C4DFF",
  eternity: "#9575CD",
  
  // Elemental attributes
  lightning: "#FFB300",
  wind: "#64B5F6",
  thunder: "#5C6BC0",
  poison: "#7CB342",
  venom: "#9CCC65",
  
  // Behavioral traits
  guardian: "#5C6BC0",
  protector: "#7986CB",
  destroyer: "#C62828",
  trickster: "#EC407A",
  wise: "#FFB300",
  fierce: "#F4511E",
  noble: "#3949AB",
  savage: "#D32F2F",
  cunning: "#F57C00",
  benevolent: "#42A5F5",
  malevolent: "#7B1FA2",
  
  // Special attributes
  shapeshifter: "#BA68C8",
  immortality: "#9C27B0",
  regeneration: "#66BB6A",
  treasure: "#FFB300",
  greed: "#BF8F54",
  chaos: "#E53935",
  
  // Cultural
  european: "#5C6BC0",
  asian: "#E53935",
  chinese: "#F44336",
  japanese: "#FF5722",
  nordic: "#64B5F6",
  greek: "#FFB300",
  egyptian: "#FFA726",
  aztec: "#66BB6A",
  indian: "#FF7043",
  welsh: "#E53935",
  
  // Types
  wyrm: "#795548",
  drake: "#FF7043",
  wyvern: "#5C6BC0",
  hydra: "#66BB6A",
  serpent: "#9C27B0",
};

/**
 * Get color for a tag, with fallback to default gold
 */
export const getTagColor = (tag: string): string => {
  return TAG_COLORS[tag.toLowerCase()] || "#FFB300";
};

/**
 * Get primary color for a dragon based on its tags
 */
export const getPrimaryDragonColor = (tags: string[]): string => {
  if (tags.length === 0) return "#FFB300"; // Default amber-gold
  
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
