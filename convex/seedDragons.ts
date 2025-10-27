/**
 * Seed 42 Dragons: Mythological creatures from world traditions
 * Includes Western, Eastern, Nordic, and fantasy dragons
 */

import { internalMutation } from "./_generated/server";

export const seedDragons = internalMutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("dragons").first();
    if (existing) {
      return { status: "skipped", message: "Database already contains data. Run clearDragons first." };
    }

    const dragons = [
      // European Dragons
      { name: "Feuerwyrm", latinName: "Draco ignis europaeus", origin: "Mitteleuropa", tags: ["fire", "western", "guardian"], element: "fire" },
      { name: "Eisdrache", latinName: "Draco glacialis borealis", origin: "Nordeuropa", tags: ["ice", "nordic", "frost"], element: "ice" },
      { name: "Walddrache", latinName: "Draco silva verdis", origin: "Schwarzwald", tags: ["forest", "nature", "guardian"], element: "earth" },
      { name: "Bergwächter", latinName: "Draco montanus alpinus", origin: "Alpen", tags: ["mountain", "stone", "ancient"], element: "earth" },
      { name: "Seelendrache", latinName: "Draco psychicus mysticus", origin: "Britische Inseln", tags: ["psychic", "mystical", "rare"], element: "spirit" },
      { name: "Sturmbringer", latinName: "Draco tempestatis", origin: "Nordsee", tags: ["storm", "lightning", "powerful"], element: "air" },
      { name: "Sonnenflügel", latinName: "Draco solaris radiatus", origin: "Mittelmeer", tags: ["sun", "light", "divine"], element: "light" },
      { name: "Schattenkriecher", latinName: "Draco umbra tenebris", origin: "Osteuropa", tags: ["shadow", "stealth", "night"], element: "dark" },

      // Asian Dragons
      { name: "Lóng", latinName: "Draco orientalis imperialis", origin: "China", tags: ["eastern", "water", "wisdom"], element: "water" },
      { name: "Tianlong", latinName: "Draco caelestis sinensis", origin: "China", tags: ["celestial", "divine", "guardian"], element: "divine" },
      { name: "Shenlong", latinName: "Draco spiritus pluviae", origin: "China", tags: ["spirit", "rain", "weather"], element: "water" },
      { name: "Ryū", latinName: "Draco japonicus aquaticus", origin: "Japan", tags: ["eastern", "water", "benevolent"], element: "water" },
      { name: "Mizuchi", latinName: "Draco fluvialis nipponicus", origin: "Japan", tags: ["river", "water", "serpent"], element: "water" },
      { name: "Yong", latinName: "Draco koreanus montanus", origin: "Korea", tags: ["mountain", "wisdom", "ancient"], element: "earth" },
      { name: "Naga", latinName: "Draco serpens indicus", origin: "Indien", tags: ["serpent", "divine", "guardian"], element: "water" },

      // Nordic & Germanic
      { name: "Níðhöggr", latinName: "Draco yggdrasilis infernalis", origin: "Skandinavien", tags: ["underworld", "ancient", "destructive"], element: "dark" },
      { name: "Fáfnir", latinName: "Draco aureus nordicus", origin: "Island", tags: ["gold", "cursed", "guardian"], element: "earth" },
      { name: "Jörmungandr", latinName: "Draco serpens oceanus", origin: "Nordische See", tags: ["sea", "serpent", "chaos"], element: "water" },
      { name: "Lindwurm", latinName: "Draco vermis germanicus", origin: "Deutschland", tags: ["worm", "poison", "guardian"], element: "poison" },

      // Mythological Classics
      { name: "Hydra", latinName: "Draco hydrus multiceps", origin: "Griechenland", tags: ["multi-headed", "regeneration", "water"], element: "water" },
      { name: "Ladon", latinName: "Draco hesperides custos", origin: "Griechenland", tags: ["guardian", "sleepless", "ancient"], element: "earth" },
      { name: "Python", latinName: "Draco python delphicus", origin: "Griechenland", tags: ["serpent", "oracle", "earth"], element: "earth" },
      { name: "Tiamat", latinName: "Draco chaos primordialis", origin: "Mesopotamien", tags: ["primordial", "chaos", "creator"], element: "water" },
      { name: "Apep", latinName: "Draco serpens aegyptus", origin: "Ägypten", tags: ["chaos", "darkness", "enemy"], element: "dark" },
      { name: "Quetzalcoatl", latinName: "Draco pluma serpens", origin: "Mesoamerika", tags: ["feathered", "wisdom", "divine"], element: "air" },

      // Elemental Dragons
      { name: "Magmaherz", latinName: "Draco magma vulcanicus", origin: "Vulkaninseln", tags: ["lava", "fire", "destructive"], element: "fire" },
      { name: "Gletscherklaue", latinName: "Draco crystalis frigidus", origin: "Antarktis", tags: ["crystal", "ice", "ancient"], element: "ice" },
      { name: "Sandsturm", latinName: "Draco arena deserti", origin: "Sahara", tags: ["desert", "sand", "wind"], element: "earth" },
      { name: "Nebelgeist", latinName: "Draco nebula phantasma", origin: "Hochmoore", tags: ["mist", "phantom", "elusive"], element: "air" },
      { name: "Korallendrache", latinName: "Draco corallium marinus", origin: "Korallenriffe", tags: ["coral", "ocean", "colorful"], element: "water" },

      // Fantasy & Rare Types
      { name: "Sternenträumer", latinName: "Draco astrum cosmicus", origin: "Unbekannt", tags: ["cosmic", "astral", "rare"], element: "cosmic" },
      { name: "Zeitweber", latinName: "Draco tempus chronicus", origin: "Zeitströme", tags: ["time", "ancient", "mystical"], element: "time" },
      { name: "Raumfalter", latinName: "Draco spatium dimensio", origin: "Dimensionsrisse", tags: ["space", "portal", "rare"], element: "void" },
      { name: "Lebenskeim", latinName: "Draco vita genesis", origin: "Urwälder", tags: ["life", "healing", "benevolent"], element: "life" },
      { name: "Totenhauch", latinName: "Draco mortis necrosis", origin: "Schattenlande", tags: ["death", "necro", "dark"], element: "death" },
      { name: "Gedankenweber", latinName: "Draco mens telepathicus", origin: "Mentalebene", tags: ["mind", "psychic", "intelligent"], element: "psychic" },
      { name: "Traumwandler", latinName: "Draco somnium oneiros", origin: "Traumebene", tags: ["dream", "ethereal", "mystical"], element: "dream" },
      { name: "Kristallsänger", latinName: "Draco crystalis harmonicus", origin: "Kristallhöhlen", tags: ["crystal", "sound", "beautiful"], element: "crystal" },
      { name: "Blütenwächter", latinName: "Draco flora botanicus", origin: "Zauberwald", tags: ["nature", "flowers", "guardian"], element: "nature" },
      { name: "Mondschatten", latinName: "Draco luna noctis", origin: "Nachtlande", tags: ["moon", "night", "mystical"], element: "moon" },
      { name: "Sonnenjäger", latinName: "Draco sol diurnus", origin: "Wüstenhimmel", tags: ["sun", "day", "powerful"], element: "sun" },
      { name: "Äonendrache", latinName: "Draco aeternus immortalis", origin: "Jenseits der Zeit", tags: ["immortal", "ancient", "eternal"], element: "time" },
    ];

    const inserted = [];
    for (const d of dragons) {
      const id = await ctx.db.insert("dragons", {
        name: d.name,
        latinName: d.latinName,
        origin: d.origin,
        description: `${d.name} (${d.latinName}) - Ein ${d.element} Drache aus ${d.origin}`,
        tags: d.tags,
        categories: [d.element, d.tags[1]],
        element: d.element,
        isAvailable: true,
        createdAt: Date.now(),
      });
      inserted.push({ id, name: d.name, latinName: d.latinName });
    }

    return { 
      status: "success", 
      count: inserted.length, 
      dragons: inserted 
    };
  },
});
