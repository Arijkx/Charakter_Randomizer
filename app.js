(function () {
  "use strict";

  const FACTION = ["Horde", "Alliance"];
  const RACES_BY_FACTION = {
    Alliance: [
      "Human", "Dwarf", "Night Elf", "Gnome", "Draenei", "Worgen",
      "Lightforged Draenei", "Void Elf", "Dark Iron Dwarf", "Kul Tiran", "Mechagnome"
    ],
    Horde: [
      "Orc", "Undead", "Tauren", "Troll", "Blood Elf", "Goblin", "Pandaren (Horde)",
      "Highmountain Tauren", "Nightborne", "Mag'har Orc", "Zandalari Troll", "Vulpera"
    ]
  };
  const CLASSES = [
    "Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Shaman",
    "Mage", "Warlock", "Monk", "Druid", "Demon Hunter", "Death Knight", "Evoker"
  ];
  const HAIR_COLORS = [
    "Black", "Dark Brown", "Brown", "Light Brown", "Blonde", "White / Gray",
    "Silver", "Red", "Copper / Orange", "Green", "Blue", "Purple / Violet", "Pink / Magenta", "Turquoise"
  ];
  const GENDERS = ["Male", "Female"];
  const ARMOR_TYPES = ["Cloth", "Leather", "Mail", "Plate"];

  /** WoW logic: armor tier by minimum level. Level and equipment are tied. */
  const ARMOR_TIER_OPTIONS = [
    { name: "Starter", minLevel: 1 },
    { name: "Leveling", minLevel: 10 },
    { name: "Dungeon Set 1", minLevel: 20 },
    { name: "Dungeon Set 2", minLevel: 30 },
    { name: "Tier 1", minLevel: 40 },
    { name: "Tier 2", minLevel: 50 },
    { name: "Tier 3", minLevel: 58 },
    { name: "Tier 4", minLevel: 60 },
    { name: "Tier 5", minLevel: 65 },
    { name: "Tier 6", minLevel: 70 }
  ];
  const ALL_ARMOR_TIERS = ARMOR_TIER_OPTIONS.map(o => o.name);

  function getArmorTiersForLevel(level) {
    if (level == null || level < 1) return ALL_ARMOR_TIERS;
    return ARMOR_TIER_OPTIONS.filter(t => t.minLevel <= level).map(t => t.name);
  }

  const POSES = [
    "Standing, neutral", "Standing, combat ready", "Kneeling", "Sitting",
    "Running / in motion", "Jumping", "Victory pose (weapon raised)",
    "Thoughtful / looking down", "Threatening / attack ready",
    "Injured / weary", "Casting spell (arms raised)", "Shield raised", "Bow drawn"
  ];
  const BACKGROUNDS = [
    "Stormwind", "Ironforge", "Darnassus (destroyed)", "Gnomeregan", "Exodar", "Gilneas (Ruins)",
    "Orgrimmar", "Undercity (destroyed)", "Thunder Bluff", "Silvermoon", "Booty Bay",
    "Shadowmoon Valley (Draenei)", "Dalaran", "Shattrath", "Oribos", "Valdrakken",
    "Elwynn Forest", "Westfall", "Redridge Mountains", "Duskwood", "Durotar", "The Barrens",
    "Teldrassil (destroyed)", "Ashenvale", "Tanaris", "Un'Goro Crater", "Shadow Highlands",
    "Frostfire Ridge", "Nagrand", "Shadowmoon", "Zangarmarsh", "Outland",
    "Northrend", "Pandaria", "Zandalar", "Kul Tiras", "Shadowlands", "Dragon Isles",
    "Tavern", "Arena", "Dungeon", "Battleground", "Raid", "Castle / Fortress", "Temple",
    "Ruins", "Forest", "Desert", "Beach / Coast", "Mountain / Peak", "Canyon", "Cave",
    "Library", "Marketplace", "Harbor", "Bridge", "Cemetery", "Prison"
  ];
  const BACKGROUNDS_SIMPEL = [
    "Gradient", "Color", "light texture", "solid color", "abstract", "minimal",
    "Grain", "soft focus", "Shadow", "light spot", "Vignette"
  ];
  const MOODS = [
    "Threatening", "Epic", "Sad", "Triumphant", "Mysterious", "Dark",
    "Heroic", "Peaceful", "Combat ready", "Thoughtful", "Melancholic", "Grim",
    "Proud", "Desperate", "Hopeful", "Calm / meditative", "Wild / untamed", "Magical / mysterious"
  ];

  const FRAMING_OPTIONS = [
    { value: "Bust Shot", desc: "Head down to chest. Classic portrait." },
    { value: "Medium Shot", desc: "Head to waist. Person and a bit of the scene." },
    { value: "Medium Full Shot", desc: "Person to the hips. You can see body language." },
    { value: "American Shot", desc: "Person to the knees. Classic Western framing." },
    { value: "Three-Quarter Shot", desc: "Person cut off between hip and knee." },
    { value: "Full Shot", desc: "Whole person visible. Background matters more." }
  ];
  const FRAMING_VALUES = FRAMING_OPTIONS.map(o => o.value);
  const FRAMING_DESCRIPTIONS = Object.fromEntries(FRAMING_OPTIONS.map(o => [o.value, o.desc]));

  const WEAPONS_MELEE = [
    "One-handed Sword", "Two-handed Sword", "One-handed Axe", "Two-handed Axe",
    "One-handed Mace", "Two-handed Mace", "Warhammer", "Dagger",
    "Fist weapon", "Staff (melee)", "Throwing weapon", "Fist weapon (pair)"
  ];
  const WEAPONS_RANGED = ["Bow", "Crossbow", "Gun"];
  const WEAPONS_CASTER = ["Wand", "Staff (magic)", "Spellbook", "Focus", "Warlock whip"];

  const OFFHAND_SHIELD = ["Shield"];
  const OFFHAND_PARRY = ["Parry weapon (dagger, sword, etc.)"];
  const OFFHAND_CASTER = ["Focus", "Spellbook", "Candle / Relic"];
  const OFFHAND_DUAL = ["Off-hand weapon (Dual Wield)"];
  const OFFHAND_NONE = ["None (two-handed weapon)"];

  const CLASS_ARMOR = {
    Warrior: "Plate", Paladin: "Plate", Hunter: "Mail", Rogue: "Leather",
    Priest: "Cloth", Shaman: "Mail", Mage: "Cloth", Warlock: "Cloth",
    Monk: "Leather", Druid: "Leather", "Demon Hunter": "Leather", "Death Knight": "Plate", Evoker: "Cloth"
  };

  const CLASS_WEAPON_POOL = {
    Warrior: WEAPONS_MELEE,
    Paladin: WEAPONS_MELEE,
    Hunter: [...WEAPONS_RANGED, "Dagger", "Fist weapon", "Staff (melee)"],
    Rogue: ["One-handed Sword", "One-handed Axe", "Dagger", "Fist weapon", "Fist weapon (pair)"],
    Priest: WEAPONS_CASTER,
    Shaman: [...WEAPONS_MELEE.filter(w => !w.startsWith("Two-handed")), "Staff (magic)"],
    Mage: WEAPONS_CASTER,
    Warlock: WEAPONS_CASTER,
    Monk: ["One-handed Mace", "Warhammer", "Dagger", "Fist weapon", "Fist weapon (pair)", "Staff (melee)"],
    Druid: ["One-handed Mace", "Warhammer", "Dagger", "Staff (magic)", "Staff (melee)"],
    "Demon Hunter": ["One-handed Sword", "One-handed Axe", "Fist weapon (pair)"],
    "Death Knight": WEAPONS_MELEE,
    Evoker: ["Wand", "Staff (magic)", "Focus"]
  };

  const ALL_WEAPONS = [...new Set(Object.values(CLASS_WEAPON_POOL).flat())].sort();
  const ALL_OFFHANDS = [
    "Shield", "Parry weapon (dagger, sword, etc.)", "Focus", "Spellbook", "Candle / Relic",
    "Off-hand weapon (Dual Wield)", "None (two-handed weapon)"
  ];

  const RACE_CLASSES = {
    Human: ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Death Knight"],
    Dwarf: ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Shaman", "Death Knight"],
    "Night Elf": ["Warrior", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Druid", "Demon Hunter", "Death Knight"],
    Gnome: ["Warrior", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Death Knight"],
    Draenei: ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Shaman", "Death Knight"],
    Worgen: ["Warrior", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Druid", "Death Knight"],
    "Lightforged Draenei": ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Mage", "Monk", "Death Knight"],
    "Void Elf": ["Warrior", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Death Knight"],
    "Dark Iron Dwarf": ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Shaman", "Death Knight"],
    "Kul Tiran": ["Warrior", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Druid", "Death Knight"],
    Mechagnome: ["Warrior", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Death Knight"],
    Orc: ["Warrior", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Shaman", "Death Knight"],
    Undead: ["Warrior", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Death Knight"],
    Tauren: ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Shaman", "Druid", "Death Knight"],
    Troll: ["Warrior", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Shaman", "Druid", "Death Knight"],
    "Blood Elf": ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Demon Hunter", "Death Knight"],
    Goblin: ["Warrior", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Death Knight"],
    "Pandaren (Horde)": ["Warrior", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Shaman", "Death Knight"],
    "Highmountain Tauren": ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Shaman", "Druid", "Death Knight"],
    Nightborne: ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Death Knight"],
    "Mag'har Orc": ["Warrior", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Shaman", "Death Knight"],
    "Zandalari Troll": ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Shaman", "Druid", "Death Knight"],
    Vulpera: ["Warrior", "Hunter", "Rogue", "Priest", "Mage", "Warlock", "Monk", "Death Knight"]
  };

  function getClassesForRace(race) {
    return RACE_CLASSES[race] || CLASSES;
  }

  function getRacesForClass(klasse) {
    return Object.keys(RACE_CLASSES).filter(r => (RACE_CLASSES[r] || []).includes(klasse));
  }

  /** Klassen, die von mindestens einer Rasse spielbar sind (Evoker fehlt, da keine Dracthyr in der Liste) */
  const CLASSES_PLAYABLE = [...new Set(Object.values(RACE_CLASSES).flat())].sort();

  function getOffhandPool(klasse, weapon) {
    const twoHand = weapon && (
      weapon.startsWith("Two-handed") ||
      weapon === "Warhammer" ||
      weapon === "Staff (magic)" ||
      weapon === "Staff (melee)"
    );
    if (twoHand) return OFFHAND_NONE;
    switch (klasse) {
      case "Warrior":
      case "Paladin":
      case "Death Knight":
        return [...OFFHAND_SHIELD, ...OFFHAND_PARRY, ...OFFHAND_DUAL];
      case "Rogue":
      case "Monk":
      case "Demon Hunter":
        return OFFHAND_DUAL;
      case "Priest":
      case "Mage":
      case "Warlock":
      case "Evoker":
        return OFFHAND_CASTER;
      case "Shaman":
        return [...OFFHAND_SHIELD, ...OFFHAND_CASTER];
      case "Hunter":
        return ["None (two-handed weapon)"];
      case "Druid":
        return OFFHAND_CASTER;
      default:
        return [...OFFHAND_SHIELD, ...OFFHAND_PARRY, ...OFFHAND_CASTER, ...OFFHAND_DUAL];
    }
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomLevel() {
    return Math.floor(Math.random() * 70) + 1;
  }

  function getOverrides() {
    const o = {};
    const get = (id, asNumber) => {
      const el = document.getElementById(id);
      const v = el && el.value ? el.value.trim() : "";
      if (!v) return undefined;
      return asNumber ? parseInt(v, 10) : v;
    };
    const set = (key, val) => { if (val !== undefined) o[key] = val; };
    set("Faction", get("select-fraktion"));
    set("Race", get("select-rasse"));
    set("Class", get("select-klasse"));
    set("Hair color", get("select-haarfarbe"));
    set("Gender", get("select-geschlecht"));
    set("Weapon", get("select-waffe"));
    set("Off-hand", get("select-nebenhand"));
    set("Armor", get("select-ruestung"));
    set("Level", get("select-level", true));
    set("Armor Tier", get("select-armor-tier"));
    set("Pose", get("select-pose"));
    set("Background (complex)", get("select-hintergrund"));
    set("Background (simple)", get("select-hintergrund-simpel"));
    set("Mood", get("select-stimmung"));
    set("Framing", get("select-framing"));
    return o;
  }

  const EXCLUSION_KEYS = [
    "Faction", "Race", "Class", "Hair color", "Gender", "Weapon", "Off-hand",
    "Armor", "Level", "Armor Tier", "Pose", "Background (complex)", "Background (simple)", "Mood", "Framing"
  ];
  const EXCLUSION_SELECT_ID = {
    Faction: "exclude-fraktion", Race: "exclude-rasse", Class: "exclude-klasse",
    "Hair color": "exclude-haarfarbe", Gender: "exclude-geschlecht", Weapon: "exclude-waffe",
    "Off-hand": "exclude-nebenhand", Armor: "exclude-ruestung", Level: "exclude-level",
    "Armor Tier": "exclude-armor-tier", Pose: "exclude-pose", "Background (complex)": "exclude-hintergrund", "Background (simple)": "exclude-hintergrund-simpel", Mood: "exclude-stimmung", Framing: "exclude-framing"
  };

  function getExclusions() {
    const o = {};
    EXCLUSION_KEYS.forEach(key => {
      const container = document.getElementById("exclusion-badges-" + EXCLUSION_SELECT_ID[key].replace("exclude-", ""));
      if (!container) { o[key] = []; return; }
      const values = Array.from(container.querySelectorAll(".exclusion-badge")).map(b => b.getAttribute("data-value"));
      o[key] = key === "Level" ? values.map(v => parseInt(v, 10)) : values;
    });
    return o;
  }

  function filterPool(pool, excluded) {
    if (!excluded || excluded.length === 0) return pool;
    const filtered = pool.filter(v => !excluded.includes(v));
    return filtered.length > 0 ? filtered : pool;
  }

  function getClassesForWeapon(weapon) {
    return CLASSES.filter(k => (CLASS_WEAPON_POOL[k] || []).includes(weapon));
  }

  function generate(overrides) {
    overrides = overrides || {};
    const excl = getExclusions();
    let faction = overrides.Faction;
    if (!faction && overrides.Race) {
      for (const f of FACTION) {
        if (RACES_BY_FACTION[f].includes(overrides.Race)) { faction = f; break; }
      }
    }
    faction = faction || pick(filterPool(FACTION, excl.Faction));
    let racePool = filterPool(RACES_BY_FACTION[faction], excl.Race);
    if (overrides.Class) {
      const racesForClass = getRacesForClass(overrides.Class);
      racePool = racePool.filter(r => racesForClass.includes(r));
      if (racePool.length === 0) racePool = RACES_BY_FACTION[faction];
    }
    const race = overrides.Race && racePool.includes(overrides.Race)
      ? overrides.Race
      : pick(racePool);
    const classPool = filterPool(getClassesForRace(race), excl.Class);
    let klasse = overrides.Class;
    if (klasse && !classPool.includes(klasse)) klasse = null;
    if (!klasse && overrides.Weapon) {
      const classesForWeapon = getClassesForWeapon(overrides.Weapon);
      const valid = classesForWeapon.filter(c => classPool.includes(c));
      klasse = valid.length ? pick(valid) : pick(classPool);
    }
    klasse = klasse || pick(classPool);
    const armor = overrides.Armor && ARMOR_TYPES.includes(overrides.Armor)
      ? overrides.Armor
      : CLASS_ARMOR[klasse];
    const weaponPool = filterPool(CLASS_WEAPON_POOL[klasse] || WEAPONS_MELEE, excl.Weapon);
    const weapon = overrides.Weapon && weaponPool.includes(overrides.Weapon)
      ? overrides.Weapon
      : pick(weaponPool);
    const offhandPool = filterPool(getOffhandPool(klasse, weapon), excl["Off-hand"]);
    const offhand = overrides["Off-hand"] && offhandPool.includes(overrides["Off-hand"])
      ? overrides["Off-hand"]
      : pick(offhandPool);
    let levelPool = filterPool(Array.from({ length: 70 }, (_, i) => i + 1), excl.Level);
    if (overrides["Armor Tier"] && !overrides.Level) {
      const tierOpt = ARMOR_TIER_OPTIONS.find(t => t.name === overrides["Armor Tier"]);
      if (tierOpt) levelPool = levelPool.filter(l => l >= tierOpt.minLevel);
      if (levelPool.length === 0) levelPool = Array.from({ length: 70 }, (_, i) => i + 1);
    }
    const level = overrides.Level >= 1 && overrides.Level <= 70 ? overrides.Level : pick(levelPool);
    const armorTierPool = filterPool(getArmorTiersForLevel(level), excl["Armor Tier"]);
    const armorTier = overrides["Armor Tier"] && armorTierPool.includes(overrides["Armor Tier"])
      ? overrides["Armor Tier"]
      : pick(armorTierPool);
    return {
      Faction: faction,
      Class: klasse,
      Race: race,
      "Hair color": overrides["Hair color"] && HAIR_COLORS.includes(overrides["Hair color"]) ? overrides["Hair color"] : pick(filterPool(HAIR_COLORS, excl["Hair color"])),
      Gender: overrides.Gender && GENDERS.includes(overrides.Gender) ? overrides.Gender : pick(filterPool(GENDERS, excl.Gender)),
      Weapon: weapon,
      "Off-hand": offhand,
      Armor: armor,
      "Armor Tier": armorTier,
      Level: level,
      Pose: overrides.Pose && POSES.includes(overrides.Pose) ? overrides.Pose : pick(filterPool(POSES, excl.Pose)),
      ...pickOneBackground(overrides, excl),
      Mood: overrides.Mood && MOODS.includes(overrides.Mood) ? overrides.Mood : pick(filterPool(MOODS, excl.Mood)),
      Framing: overrides.Framing && FRAMING_VALUES.includes(overrides.Framing) ? overrides.Framing : pick(filterPool(FRAMING_VALUES, excl.Framing))
    };
  }

  function pickOneBackground(overrides, excl) {
    const useKomplex = overrides["Background (complex)"] && BACKGROUNDS.includes(overrides["Background (complex)"]);
    const useSimpel = overrides["Background (simple)"] && BACKGROUNDS_SIMPEL.includes(overrides["Background (simple)"]);
    if (useKomplex) {
      return { "Background (complex)": overrides["Background (complex)"] };
    }
    if (useSimpel) {
      return { "Background (simple)": overrides["Background (simple)"] };
    }
    const type = pick(["complex", "simple"]);
    if (type === "complex") {
      return { "Background (complex)": pick(filterPool(BACKGROUNDS, excl["Background (complex)"])) };
    }
    return { "Background (simple)": pick(filterPool(BACKGROUNDS_SIMPEL, excl["Background (simple)"])) };
  }

  function fillSelect(id, options) {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = "";
    const first = document.createElement("option");
    first.value = "";
    first.textContent = "— Random —";
    sel.appendChild(first);
    (options || []).forEach(val => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = val;
      sel.appendChild(opt);
    });
  }

  function getExclusionOptionsForKey(key) {
    const allRaces = [...RACES_BY_FACTION.Alliance, ...RACES_BY_FACTION.Horde];
    switch (key) {
      case "Faction": return FACTION;
      case "Race": return allRaces;
      case "Class": return CLASSES_PLAYABLE;
      case "Hair color": return HAIR_COLORS;
      case "Gender": return GENDERS;
      case "Weapon": return ALL_WEAPONS;
      case "Off-hand": return ALL_OFFHANDS;
      case "Armor": return ARMOR_TYPES;
      case "Level": return Array.from({ length: 70 }, (_, i) => String(i + 1));
      case "Armor Tier": return ALL_ARMOR_TIERS;
      case "Pose": return POSES;
      case "Background (complex)": return BACKGROUNDS;
      case "Background (simple)": return BACKGROUNDS_SIMPEL;
      case "Mood": return MOODS;
      case "Framing": return FRAMING_VALUES;
      default: return [];
    }
  }

  function refreshExclusionSelect(key) {
    const selectId = EXCLUSION_SELECT_ID[key];
    const sel = document.getElementById(selectId);
    const badgesContainer = document.getElementById("exclusion-badges-" + selectId.replace("exclude-", ""));
    if (!sel || !badgesContainer) return;
    const excluded = Array.from(badgesContainer.querySelectorAll(".exclusion-badge")).map(b => b.getAttribute("data-value"));
    const allOptions = getExclusionOptionsForKey(key);
    const options = allOptions.filter(v => !excluded.includes(v));
    sel.innerHTML = "";
    const first = document.createElement("option");
    first.value = "";
    first.textContent = "— Choose to exclude —";
    sel.appendChild(first);
    options.forEach(val => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = val;
      sel.appendChild(opt);
    });
  }

  function addExclusionBadge(key, value, skipSave) {
    const badgesContainer = document.getElementById("exclusion-badges-" + EXCLUSION_SELECT_ID[key].replace("exclude-", ""));
    if (!badgesContainer || !value) return;
    const already = Array.from(badgesContainer.querySelectorAll(".exclusion-badge")).some(b => b.getAttribute("data-value") === value);
    if (already) return;
    const badge = document.createElement("span");
    badge.className = "exclusion-badge";
    badge.setAttribute("data-value", value);
    badge.appendChild(document.createTextNode(value));
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.setAttribute("aria-label", "Remove");
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", function () {
      badge.remove();
      refreshExclusionSelect(key);
      saveSettings();
    });
    badge.appendChild(removeBtn);
    badgesContainer.appendChild(badge);
    refreshExclusionSelect(key);
    if (!skipSave) saveSettings();
  }

  function initExclusionOptions() {
    const grid = document.getElementById("exclusions-grid");
    if (!grid) return;
    grid.innerHTML = "";
    const labelMap = {
      Faction: "Faction", Race: "Race", Class: "Class", "Hair color": "Hair color",
      Gender: "Gender", Weapon: "Weapon", "Off-hand": "Off-hand", Armor: "Armor",
      Level: "Level", "Armor Tier": "Armor Tier", Pose: "Pose", "Background (complex)": "Background (complex)", "Background (simple)": "Background (simple)", Mood: "Mood", Framing: "Framing"
    };
    EXCLUSION_KEYS.forEach(key => {
      const rowLabel = document.createElement("label");
      rowLabel.className = "exclusion-label";
      rowLabel.textContent = labelMap[key];
      const cell = document.createElement("div");
      cell.className = "exclusion-cell";
      const select = document.createElement("select");
      select.id = EXCLUSION_SELECT_ID[key];
      const badgesContainer = document.createElement("div");
      badgesContainer.className = "exclusion-badges";
      badgesContainer.id = "exclusion-badges-" + EXCLUSION_SELECT_ID[key].replace("exclude-", "");
      cell.appendChild(select);
      cell.appendChild(badgesContainer);
      grid.appendChild(rowLabel);
      grid.appendChild(cell);
      refreshExclusionSelect(key);
      select.addEventListener("change", function () {
        const val = this.value;
        if (val) {
          addExclusionBadge(key, val);
          this.value = "";
        }
      });
    });
  }

  function initOptions() {
    fillSelect("select-fraktion", FACTION);
    fillSelect("select-haarfarbe", HAIR_COLORS);
    fillSelect("select-geschlecht", GENDERS);
    fillSelect("select-waffe", ALL_WEAPONS);
    fillSelect("select-nebenhand", ALL_OFFHANDS);
    fillSelect("select-ruestung", ARMOR_TYPES);
    fillSelect("select-level", Array.from({ length: 70 }, (_, i) => String(i + 1)));
    fillSelect("select-armor-tier", ALL_ARMOR_TIERS);
    fillSelect("select-pose", POSES);
    fillSelect("select-hintergrund", BACKGROUNDS);
    fillSelect("select-hintergrund-simpel", BACKGROUNDS_SIMPEL);
    fillSelect("select-stimmung", MOODS);
    fillSelect("select-framing", FRAMING_VALUES);
    updateRasseOptions();
    updateKlasseOptions();
    initExclusionOptions();
  }

  function updateRasseOptions() {
    const factionSel = document.getElementById("select-fraktion");
    const classSel = document.getElementById("select-klasse");
    const raceSel = document.getElementById("select-rasse");
    if (!raceSel) return;
    const faction = factionSel && factionSel.value ? factionSel.value : null;
    const klasse = classSel && classSel.value ? classSel.value : null;
    let options = faction
      ? RACES_BY_FACTION[faction]
      : [...RACES_BY_FACTION.Alliance, ...RACES_BY_FACTION.Horde];
    if (klasse) {
      const racesForClass = getRacesForClass(klasse);
      options = options.filter(r => racesForClass.includes(r));
      if (options.length === 0) options = faction ? RACES_BY_FACTION[faction] : options;
    }
    raceSel.innerHTML = "";
    const first = document.createElement("option");
    first.value = "";
    first.textContent = "— Random —";
    raceSel.appendChild(first);
    options.forEach(val => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = val;
      raceSel.appendChild(opt);
    });
  }

  function updateKlasseOptions() {
    const raceSel = document.getElementById("select-rasse");
    const classSel = document.getElementById("select-klasse");
    if (!classSel) return;
    const race = raceSel && raceSel.value ? raceSel.value : null;
    const options = race ? getClassesForRace(race) : CLASSES_PLAYABLE;
    classSel.innerHTML = "";
    const first = document.createElement("option");
    first.value = "";
    first.textContent = "— Random —";
    classSel.appendChild(first);
    options.forEach(val => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = val;
      classSel.appendChild(opt);
    });
  }

  function rerollKey(key) {
    if (!currentChar) return;
    const overrides = { ...currentChar };
    delete overrides[key];
    if (key === "Background (complex)" || key === "Background (simple)") {
      delete overrides["Background (complex)"];
      delete overrides["Background (simple)"];
    }
    currentChar = generate(overrides);
    render(currentChar);
  }

  function render(char) {
    const sheet = document.getElementById("char-sheet");
    const placeholder = document.getElementById("placeholder");
    const btnSave = document.getElementById("btn-save");
    if (!char) {
      placeholder.hidden = false;
      sheet.hidden = true;
      if (btnSave) btnSave.hidden = true;
      return;
    }
    placeholder.hidden = true;
    sheet.hidden = false;
    sheet.innerHTML = Object.entries(char)
      .map(([key, value]) => {
        const keyEsc = key.replace(/"/g, "&quot;");
        const valueEsc = String(value).replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const rerollBtn = key === "Faction"
          ? ""
          : `<button type="button" class="btn-reroll" data-key="${keyEsc}" aria-label="Roll ${keyEsc} again">Roll again</button>`;
        const desc = key === "Framing" && FRAMING_DESCRIPTIONS[value];
        const descEsc = desc ? desc.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
        const infoBtn = desc
          ? `<button type="button" class="char-sheet-info-btn" aria-label="Show description" title="Show description">ℹ</button>`
          : "";
        const valueContent = `${valueEsc} ${infoBtn}`.trim();
        const descriptionBlock = desc
          ? `<div class="char-sheet-row-description" hidden>${descEsc}</div>`
          : "";
        return `<div class="char-sheet-row">
          <span class="char-sheet-label">${keyEsc}</span>
          <span class="char-sheet-value">${valueContent}</span>
          ${rerollBtn}
          ${descriptionBlock}
        </div>`;
      })
      .join("");
    sheet.querySelectorAll(".btn-reroll").forEach(btn => {
      btn.addEventListener("click", function () {
        rerollKey(this.getAttribute("data-key"));
      });
    });
    sheet.querySelectorAll(".char-sheet-info-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const row = this.closest(".char-sheet-row");
        const descEl = row && row.querySelector(".char-sheet-row-description");
        if (!descEl) return;
        const isOpen = !descEl.hidden;
        descEl.hidden = isOpen;
        this.setAttribute("aria-label", isOpen ? "Show description" : "Hide description");
        this.setAttribute("aria-expanded", String(!isOpen));
      });
    });
    if (btnSave) btnSave.hidden = false;
  }

  const DISPLAY_KEY_MAP = {
    Fraktion: "Faction", Rasse: "Race", Klasse: "Class", Haarfarbe: "Hair color", Geschlecht: "Gender",
    Waffe: "Weapon", Nebenhand: "Off-hand", Rüstung: "Armor", Level: "Level", Tierrüstung: "Armor Tier", Pose: "Pose",
    "Hintergrund Komplex": "Background (complex)", "Hintergrund Simpel": "Background (simple)", Stimmung: "Mood", Bildauschnitt: "Framing"
  };

  function normalizeCharForDisplay(c) {
    if (!c || c.Faction !== undefined) return c;
    const out = {};
    for (const [k, v] of Object.entries(c)) {
      if (k === "savedAt") continue;
      out[DISPLAY_KEY_MAP[k] || k] = v;
    }
    return out;
  }

  function renderPreviewModal(char) {
    const sheet = document.getElementById("preview-char-sheet");
    if (!sheet) return;
    const normalized = normalizeCharForDisplay(char);
    sheet.innerHTML = normalized && Object.keys(normalized).length
      ? Object.entries(normalized).map(([key, value]) => `<dt>${key}</dt><dd>${value}</dd>`).join("")
      : "";
  }

  let previewModalTrigger = null;

  function openPreviewModal(char) {
    previewModalTrigger = document.activeElement;
    renderPreviewModal(char);
    const modal = document.getElementById("preview-modal");
    if (modal) {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    }
  }

  function closePreviewModal() {
    const modal = document.getElementById("preview-modal");
    if (modal) {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }
    if (previewModalTrigger && typeof previewModalTrigger.focus === "function") {
      previewModalTrigger.focus();
      previewModalTrigger = null;
    }
  }

  const STORAGE_KEY = "wow-random-characters";
  const STORAGE_KEY_SETTINGS = "wow-random-settings";

  const PRESET_SELECT_ID = {
    Faction: "select-fraktion", Race: "select-rasse", Class: "select-klasse",
    "Hair color": "select-haarfarbe", Gender: "select-geschlecht", Weapon: "select-waffe",
    "Off-hand": "select-nebenhand", Armor: "select-ruestung", Level: "select-level",
    "Armor Tier": "select-armor-tier", Pose: "select-pose", "Background (complex)": "select-hintergrund", "Background (simple)": "select-hintergrund-simpel", Mood: "select-stimmung", Framing: "select-framing"
  };

  function getPresetsForStorage() {
    const o = {};
    EXCLUSION_KEYS.forEach(key => {
      const id = PRESET_SELECT_ID[key];
      const el = document.getElementById(id);
      o[key] = el && el.value ? el.value : "";
    });
    return o;
  }

  function saveSettings() {
    try {
      const data = { presets: getPresetsForStorage(), exclusions: getExclusions() };
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(data));
    } catch (_) {}
  }

  const LEGACY_SETTINGS_KEYS = {
    Faction: "Fraktion", Race: "Rasse", Class: "Klasse", "Hair color": "Haarfarbe", Gender: "Geschlecht",
    Weapon: "Waffe", "Off-hand": "Nebenhand", Armor: "Rüstung", Level: "Level", "Armor Tier": "Tierrüstung", Pose: "Pose",
    "Background (complex)": "Hintergrund Komplex", "Background (simple)": "Hintergrund Simpel", Mood: "Stimmung", Framing: "Bildauschnitt"
  };

  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.presets) {
        EXCLUSION_KEYS.forEach(key => {
          const id = PRESET_SELECT_ID[key];
          const el = document.getElementById(id);
          const val = data.presets[key] ?? (LEGACY_SETTINGS_KEYS[key] && data.presets[LEGACY_SETTINGS_KEYS[key]]);
          if (el && val !== undefined && val !== null) el.value = val;
        });
        updateRasseOptions();
        updateKlasseOptions();
      }
      if (data.exclusions) {
        EXCLUSION_KEYS.forEach(key => {
          const container = document.getElementById("exclusion-badges-" + EXCLUSION_SELECT_ID[key].replace("exclude-", ""));
          if (!container) return;
          container.innerHTML = "";
          const vals = data.exclusions[key] ?? (LEGACY_SETTINGS_KEYS[key] && data.exclusions[LEGACY_SETTINGS_KEYS[key]]);
          if (Array.isArray(vals))
            vals.forEach(v => addExclusionBadge(key, key === "Level" ? String(v) : v, true));
          refreshExclusionSelect(key);
        });
      }
    } catch (_) {}
  }

  function clearAllExclusionBadges() {
    EXCLUSION_KEYS.forEach(key => {
      const container = document.getElementById("exclusion-badges-" + EXCLUSION_SELECT_ID[key].replace("exclude-", ""));
      if (container) container.innerHTML = "";
      refreshExclusionSelect(key);
    });
  }

  function resetSettings() {
    EXCLUSION_KEYS.forEach(key => {
      const el = document.getElementById(PRESET_SELECT_ID[key]);
      if (el) el.value = "";
    });
    updateRasseOptions();
    updateKlasseOptions();
    clearAllExclusionBadges();
    saveSettings();
  }

  function loadSaved() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveCharacter(char) {
    const list = loadSaved();
    list.unshift({ ...char, savedAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
  }

  function deleteSaved(index) {
    const list = loadSaved();
    list.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    renderSavedList();
  }

  function switchTab(panelId) {
    const tabId = "tab-" + panelId.replace("panel-", "");
    document.querySelectorAll(".tab").forEach(t => {
      const active = t.id === tabId;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", active);
    });
    document.querySelectorAll(".tab-panel").forEach(p => {
      p.classList.toggle("active", p.id === panelId);
    });
  }

  function renderSavedList() {
    const list = loadSaved();
    const ul = document.getElementById("saved-list");
    const emptyEl = document.getElementById("saved-empty");
    if (list.length === 0) {
      emptyEl.classList.remove("hidden");
      ul.innerHTML = "";
      return;
    }
    emptyEl.classList.add("hidden");
    ul.innerHTML = list
      .map((entry, i) => {
        const c = entry.Level !== undefined ? entry : entry.char;
        const race = c.Race || c.Rasse;
        const cls = c.Class || c.Klasse;
        const lvl = c.Level;
        const title = [race, cls, lvl != null ? "Level " + lvl : ""].filter(Boolean).join(" · ");
        const meta = [c.Faction || c.Fraktion, c["Background (complex)"] || c["Hintergrund Komplex"] || c["Background (simple)"] || c["Hintergrund Simpel"]].filter(Boolean).join(" · ");
        return `
          <li>
            <div class="char-title">${title}</div>
            <div class="char-meta">${meta}</div>
            <button type="button" data-load="${i}">Preview</button>
            <button type="button" data-delete="${i}">Delete</button>
          </li>
        `;
      })
      .join("");
    ul.querySelectorAll("[data-load]").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = parseInt(this.getAttribute("data-load"), 10);
        const entry = list[idx];
        const c = entry.Level !== undefined ? entry : entry.char;
        openPreviewModal(normalizeCharForDisplay(c));
      });
    });
    ul.querySelectorAll("[data-delete]").forEach(btn => {
      btn.addEventListener("click", function () {
        deleteSaved(parseInt(this.getAttribute("data-delete"), 10));
      });
    });
  }

  let currentChar = null;

  document.getElementById("btn-generate").addEventListener("click", function () {
    currentChar = generate(getOverrides());
    render(currentChar);
    renderSavedList();
  });

  document.getElementById("select-fraktion").addEventListener("change", function () {
    updateRasseOptions();
    updateKlasseOptions();
    document.getElementById("select-rasse").value = "";
    document.getElementById("select-klasse").value = "";
  });
  document.getElementById("select-rasse").addEventListener("change", function () {
    updateKlasseOptions();
    const race = document.getElementById("select-rasse").value;
    const klasse = document.getElementById("select-klasse").value;
    if (race && klasse && !getClassesForRace(race).includes(klasse)) {
      document.getElementById("select-klasse").value = "";
    }
  });
  document.getElementById("select-klasse").addEventListener("change", function () {
    updateRasseOptions();
    const faction = document.getElementById("select-fraktion").value;
    const klasse = document.getElementById("select-klasse").value;
    const race = document.getElementById("select-rasse").value;
    if (faction && klasse && race && !getRacesForClass(klasse).includes(race)) {
      document.getElementById("select-rasse").value = "";
    }
  });

  document.getElementById("btn-save").addEventListener("click", function () {
    if (!currentChar) return;
    saveCharacter(currentChar);
    renderSavedList();
  });

  const settingsModal = document.getElementById("settings-modal");
  const btnSettings = document.getElementById("btn-settings");
  document.getElementById("btn-settings").addEventListener("click", function () {
    settingsModal.classList.add("is-open");
    settingsModal.setAttribute("aria-hidden", "false");
  });
  function closeSettingsModal() {
    settingsModal.classList.remove("is-open");
    settingsModal.setAttribute("aria-hidden", "true");
    if (btnSettings) btnSettings.focus();
  }
  document.getElementById("modal-close").addEventListener("click", closeSettingsModal);
  settingsModal.addEventListener("click", function (e) {
    if (e.target === settingsModal) closeSettingsModal();
  });

  const previewModal = document.getElementById("preview-modal");
  document.getElementById("preview-modal-close").addEventListener("click", closePreviewModal);
  if (previewModal) {
    previewModal.addEventListener("click", function (e) {
      if (e.target === previewModal) closePreviewModal();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (previewModal && previewModal.classList.contains("is-open")) closePreviewModal();
    else if (settingsModal.classList.contains("is-open")) closeSettingsModal();
  });

  function switchModalTab(panelId) {
    const tabId = "modal-tab-" + panelId.replace("modal-panel-", "");
    document.querySelectorAll(".modal-tab").forEach(t => {
      const active = t.id === tabId;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", active);
    });
    document.querySelectorAll(".modal-panel").forEach(p => {
      p.classList.toggle("active", p.id === panelId);
    });
  }
  document.getElementById("modal-tab-vorgaben").addEventListener("click", function () {
    switchModalTab("modal-panel-vorgaben");
  });
  document.getElementById("modal-tab-exclusions").addEventListener("click", function () {
    switchModalTab("modal-panel-exclusions");
  });

  document.getElementById("tab-generator").addEventListener("click", function () {
    switchTab("panel-generator");
  });
  document.getElementById("tab-saved").addEventListener("click", function () {
    switchTab("panel-saved");
    renderSavedList();
  });

  initOptions();
  loadSettings();
  renderSavedList();

  Object.values(PRESET_SELECT_ID).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", saveSettings);
  });
  document.getElementById("btn-reset-settings").addEventListener("click", function () {
    resetSettings();
  });
})();
