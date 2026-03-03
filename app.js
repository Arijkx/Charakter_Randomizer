(function () {
  "use strict";

  const FACTION = ["Horde", "Allianz"];
  const RACES_BY_FACTION = {
    Allianz: [
      "Mensch", "Zwerg", "Nachtelf", "Gnom", "Draenei", "Worgen",
      "Lichtgeschmiedeter Draenei", "Voidelf", "Schwarzfelszwerg", "Kul Tiraner", "Mechagnom"
    ],
    Horde: [
      "Orc", "Untoter", "Taure", "Troll", "Blutelf", "Goblin", "Pandaren (Horde)",
      "Hochberg-Taure", "Nachtgeborener", "Mag'har-Orc", "Zandalari-Troll", "Vulpera"
    ]
  };
  const CLASSES = [
    "Krieger", "Paladin", "Jäger", "Schurke", "Priester", "Schamane",
    "Magier", "Hexenmeister", "Mönch", "Druide", "Dämonenjäger", "Todesritter", "Evoker"
  ];
  const HAIR_COLORS = [
    "Schwarz", "Dunkelbraun", "Braun", "Hellbraun", "Blond", "Weiß / Grau",
    "Silber", "Rot", "Kupfer / Orange", "Grün", "Blau", "Lila / Violett", "Pink / Magenta", "Türkis"
  ];
  const GENDERS = ["Männlich", "Weiblich"];
  const ARMOR_TYPES = ["Stoff", "Leder", "Kette", "Platte"];
  const POSES = [
    "Stehend, neutral", "Stehend, kampfbereit", "Kniend", "Sitzend",
    "Laufend / in Bewegung", "Springend", "Siegespose (Waffe erhoben)",
    "Nachdenklich / nach unten blickend", "Drohend / angriffsbereit",
    "Verletzt / ermattet", "Zauber wirkend (Arme erhoben)", "Schild hochgehalten", "Bogen gespannt"
  ];
  const BACKGROUNDS = [
    "Sturmwind", "Eisenschmiede", "Darnassus (zerstört)", "Gnomeregan", "Exodar", "Gilneas (Ruinen)",
    "Orgrimmar", "Unterstadt (zerstört)", "Donnerfels", "Silbermond", "Beutebucht",
    "Schattenmond-Tal (Draenei)", "Dalaran", "Shattrath", "Oribos", "Valdrakken",
    "Elwynnwald", "Westfall", "Rotkammgebirge", "Dunkelhain", "Durotar", "Brachland",
    "Teldrassil (zerstört)", "Ashenvale", "Tanaris", "Un'Goro-Krater", "Schattenhochland",
    "Frostfeuergrat", "Nagrand", "Schattenmond", "Zangarmarschen", "Die Scherbenwelt",
    "Nordend", "Pandaria", "Zandalar", "Kul Tiras", "Schattenlande", "Die Dracheninseln",
    "Taverne", "Arena", "Dungeon", "Schlachtfeld", "Raid", "Burg / Festung", "Tempel",
    "Ruinen", "Wald", "Wüste", "Strand / Küste", "Berg / Gipfel", "Schlucht", "Höhle",
    "Bibliothek", "Marktplatz", "Hafen", "Brücke", "Friedhof", "Verlies"
  ];
  const BACKGROUNDS_SIMPEL = [
    "Farbverlauf", "Farbe", "leichte Textur", "einfarbig", "abstrakt", "minimal",
    "Körnung", "weicher Fokus", "Schatten", "Lichtfleck", "Vignette"
  ];
  const MOODS = [
    "Bedrohlich", "Episch", "Traurig", "Siegesicher / triumphierend", "Mysteriös", "Düster",
    "Heroisch", "Friedlich", "Kampfbereit", "Nachdenklich", "Melancholisch", "Grimmig",
    "Stolz", "Verzweifelt", "Hoffnungsvoll", "Ruhig / meditativ", "Wild / ungebändigt", "Magisch / geheimnisvoll"
  ];

  const WEAPONS_MELEE = [
    "Einhändiges Schwert", "Zweihand-Schwert", "Einhändige Axt", "Zweihand-Axt",
    "Einhändiger Streitkolben", "Zweihand-Streitkolben", "Streithammer", "Dolch",
    "Faustwaffe", "Stab (Nahkampf)", "Wurfwaffe", "Faustwaffe (Paar)"
  ];
  const WEAPONS_RANGED = ["Bogen", "Armbrust", "Gewehr"];
  const WEAPONS_CASTER = ["Zauberstab", "Stab (Magie)", "Zauberbuch", "Fokus", "Peitsche (Hexenmeister)"];

  const OFFHAND_SHIELD = ["Schild"];
  const OFFHAND_PARRY = ["Parierwaffe (Dolch, Schwert, etc.)"];
  const OFFHAND_CASTER = ["Fokus", "Zauberbuch", "Kerze / Relikt"];
  const OFFHAND_DUAL = ["Zweite Waffe (Dual Wield)"];
  const OFFHAND_NONE = ["Keine (Zweihand-Waffe)"];

  const CLASS_ARMOR = {
    Krieger: "Platte", Paladin: "Platte", Jäger: "Kette", Schurke: "Leder",
    Priester: "Stoff", Schamane: "Kette", Magier: "Stoff", Hexenmeister: "Stoff",
    Mönch: "Leder", Druide: "Leder", Dämonenjäger: "Leder", Todesritter: "Platte", Evoker: "Stoff"
  };

  const CLASS_WEAPON_POOL = {
    Krieger: WEAPONS_MELEE,
    Paladin: WEAPONS_MELEE,
    Jäger: [...WEAPONS_RANGED, "Dolch", "Faustwaffe", "Stab (Nahkampf)"],
    Schurke: ["Einhändiges Schwert", "Einhändige Axt", "Dolch", "Faustwaffe", "Faustwaffe (Paar)"],
    Priester: WEAPONS_CASTER,
    Schamane: [...WEAPONS_MELEE.filter(w => !w.startsWith("Zweihand")), "Stab (Magie)"],
    Magier: WEAPONS_CASTER,
    Hexenmeister: WEAPONS_CASTER,
    Mönch: ["Einhändiger Streitkolben", "Streithammer", "Dolch", "Faustwaffe", "Faustwaffe (Paar)", "Stab (Nahkampf)"],
    Druide: ["Einhändiger Streitkolben", "Streithammer", "Dolch", "Stab (Magie)", "Stab (Nahkampf)"],
    Dämonenjäger: ["Einhändiges Schwert", "Einhändige Axt", "Faustwaffe (Paar)"],
    Todesritter: WEAPONS_MELEE,
    Evoker: ["Zauberstab", "Stab (Magie)", "Fokus"]
  };

  const ALL_WEAPONS = [...new Set(Object.values(CLASS_WEAPON_POOL).flat())].sort();
  const ALL_OFFHANDS = [
    "Schild", "Parierwaffe (Dolch, Schwert, etc.)", "Fokus", "Zauberbuch", "Kerze / Relikt",
    "Zweite Waffe (Dual Wield)", "Keine (Zweihand-Waffe)"
  ];

  /** WoW-Logik: Welche Klasse kann welche Rasse spielen (laut offiziellen Kombinationen) */
  const RACE_CLASSES = {
    Mensch: ["Krieger", "Paladin", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Todesritter"],
    Zwerg: ["Krieger", "Paladin", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Schamane", "Todesritter"],
    Nachtelf: ["Krieger", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Druide", "Dämonenjäger", "Todesritter"],
    Gnom: ["Krieger", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Todesritter"],
    Draenei: ["Krieger", "Paladin", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Schamane", "Todesritter"],
    Worgen: ["Krieger", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Druide", "Todesritter"],
    "Lichtgeschmiedeter Draenei": ["Krieger", "Paladin", "Jäger", "Schurke", "Priester", "Magier", "Mönch", "Todesritter"],
    Voidelf: ["Krieger", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Todesritter"],
    Schwarzfelszwerg: ["Krieger", "Paladin", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Schamane", "Todesritter"],
    "Kul Tiraner": ["Krieger", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Druide", "Todesritter"],
    Mechagnom: ["Krieger", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Todesritter"],
    Orc: ["Krieger", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Schamane", "Todesritter"],
    Untoter: ["Krieger", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Todesritter"],
    Taure: ["Krieger", "Paladin", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Schamane", "Druide", "Todesritter"],
    Troll: ["Krieger", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Schamane", "Druide", "Todesritter"],
    Blutelf: ["Krieger", "Paladin", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Dämonenjäger", "Todesritter"],
    Goblin: ["Krieger", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Todesritter"],
    "Pandaren (Horde)": ["Krieger", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Schamane", "Todesritter"],
    "Hochberg-Taure": ["Krieger", "Paladin", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Schamane", "Druide", "Todesritter"],
    Nachtgeborener: ["Krieger", "Paladin", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Todesritter"],
    "Mag'har-Orc": ["Krieger", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Schamane", "Todesritter"],
    "Zandalari-Troll": ["Krieger", "Paladin", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Schamane", "Druide", "Todesritter"],
    Vulpera: ["Krieger", "Jäger", "Schurke", "Priester", "Magier", "Hexenmeister", "Mönch", "Todesritter"]
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
      weapon.startsWith("Zweihand") ||
      weapon === "Streithammer" ||
      weapon === "Stab (Magie)" ||
      weapon === "Stab (Nahkampf)"
    );
    if (twoHand) return OFFHAND_NONE;
    switch (klasse) {
      case "Krieger":
      case "Paladin":
      case "Todesritter":
        return [...OFFHAND_SHIELD, ...OFFHAND_PARRY, ...OFFHAND_DUAL];
      case "Schurke":
      case "Mönch":
      case "Dämonenjäger":
        return OFFHAND_DUAL;
      case "Priester":
      case "Magier":
      case "Hexenmeister":
      case "Evoker":
        return OFFHAND_CASTER;
      case "Schamane":
        return [...OFFHAND_SHIELD, ...OFFHAND_CASTER];
      case "Jäger":
        return ["Keine (Zweihand-Waffe)"];
      case "Druide":
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
    set("Fraktion", get("select-fraktion"));
    set("Rasse", get("select-rasse"));
    set("Klasse", get("select-klasse"));
    set("Haarfarbe", get("select-haarfarbe"));
    set("Geschlecht", get("select-geschlecht"));
    set("Waffe", get("select-waffe"));
    set("Nebenhand", get("select-nebenhand"));
    set("Rüstung", get("select-ruestung"));
    set("Level", get("select-level", true));
    set("Pose", get("select-pose"));
    set("Hintergrund Komplex", get("select-hintergrund"));
    set("Hintergrund Simpel", get("select-hintergrund-simpel"));
    set("Stimmung", get("select-stimmung"));
    return o;
  }

  const EXCLUSION_KEYS = [
    "Fraktion", "Rasse", "Klasse", "Haarfarbe", "Geschlecht", "Waffe", "Nebenhand",
    "Rüstung", "Level", "Pose", "Hintergrund Komplex", "Hintergrund Simpel", "Stimmung"
  ];
  const EXCLUSION_SELECT_ID = {
    Fraktion: "exclude-fraktion", Rasse: "exclude-rasse", Klasse: "exclude-klasse",
    Haarfarbe: "exclude-haarfarbe", Geschlecht: "exclude-geschlecht", Waffe: "exclude-waffe",
    Nebenhand: "exclude-nebenhand", Rüstung: "exclude-ruestung", Level: "exclude-level",
    Pose: "exclude-pose", "Hintergrund Komplex": "exclude-hintergrund", "Hintergrund Simpel": "exclude-hintergrund-simpel", Stimmung: "exclude-stimmung"
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
    let faction = overrides.Fraktion;
    if (!faction && overrides.Rasse) {
      for (const f of FACTION) {
        if (RACES_BY_FACTION[f].includes(overrides.Rasse)) { faction = f; break; }
      }
    }
    faction = faction || pick(filterPool(FACTION, excl.Fraktion));
    let racePool = filterPool(RACES_BY_FACTION[faction], excl.Rasse);
    if (overrides.Klasse) {
      const racesForClass = getRacesForClass(overrides.Klasse);
      racePool = racePool.filter(r => racesForClass.includes(r));
      if (racePool.length === 0) racePool = RACES_BY_FACTION[faction];
    }
    const race = overrides.Rasse && racePool.includes(overrides.Rasse)
      ? overrides.Rasse
      : pick(racePool);
    const classPool = filterPool(getClassesForRace(race), excl.Klasse);
    let klasse = overrides.Klasse;
    if (klasse && !classPool.includes(klasse)) klasse = null;
    if (!klasse && overrides.Waffe) {
      const classesForWeapon = getClassesForWeapon(overrides.Waffe);
      const valid = classesForWeapon.filter(c => classPool.includes(c));
      klasse = valid.length ? pick(valid) : pick(classPool);
    }
    klasse = klasse || pick(classPool);
    const armor = overrides.Rüstung && ARMOR_TYPES.includes(overrides.Rüstung)
      ? overrides.Rüstung
      : CLASS_ARMOR[klasse];
    const weaponPool = filterPool(CLASS_WEAPON_POOL[klasse] || WEAPONS_MELEE, excl.Waffe);
    const weapon = overrides.Waffe && weaponPool.includes(overrides.Waffe)
      ? overrides.Waffe
      : pick(weaponPool);
    const offhandPool = filterPool(getOffhandPool(klasse, weapon), excl.Nebenhand);
    const offhand = overrides.Nebenhand && offhandPool.includes(overrides.Nebenhand)
      ? overrides.Nebenhand
      : pick(offhandPool);
    const levelPool = filterPool(Array.from({ length: 70 }, (_, i) => i + 1), excl.Level);
    const level = overrides.Level >= 1 && overrides.Level <= 70 ? overrides.Level : pick(levelPool);
    return {
      Fraktion: faction,
      Klasse: klasse,
      Rasse: race,
      Haarfarbe: overrides.Haarfarbe && HAIR_COLORS.includes(overrides.Haarfarbe) ? overrides.Haarfarbe : pick(filterPool(HAIR_COLORS, excl.Haarfarbe)),
      Geschlecht: overrides.Geschlecht && GENDERS.includes(overrides.Geschlecht) ? overrides.Geschlecht : pick(filterPool(GENDERS, excl.Geschlecht)),
      Waffe: weapon,
      Nebenhand: offhand,
      Rüstung: armor,
      Level: level,
      Pose: overrides.Pose && POSES.includes(overrides.Pose) ? overrides.Pose : pick(filterPool(POSES, excl.Pose)),
      ...pickOneBackground(overrides, excl),
      Stimmung: overrides.Stimmung && MOODS.includes(overrides.Stimmung) ? overrides.Stimmung : pick(filterPool(MOODS, excl.Stimmung))
    };
  }

  function pickOneBackground(overrides, excl) {
    const useKomplex = overrides["Hintergrund Komplex"] && BACKGROUNDS.includes(overrides["Hintergrund Komplex"]);
    const useSimpel = overrides["Hintergrund Simpel"] && BACKGROUNDS_SIMPEL.includes(overrides["Hintergrund Simpel"]);
    if (useKomplex) {
      return { "Hintergrund Komplex": overrides["Hintergrund Komplex"] };
    }
    if (useSimpel) {
      return { "Hintergrund Simpel": overrides["Hintergrund Simpel"] };
    }
    const type = pick(["Komplex", "Simpel"]);
    if (type === "Komplex") {
      return { "Hintergrund Komplex": pick(filterPool(BACKGROUNDS, excl["Hintergrund Komplex"])) };
    }
    return { "Hintergrund Simpel": pick(filterPool(BACKGROUNDS_SIMPEL, excl["Hintergrund Simpel"])) };
  }

  function fillSelect(id, options) {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = "";
    const first = document.createElement("option");
    first.value = "";
    first.textContent = "— Zufällig —";
    sel.appendChild(first);
    (options || []).forEach(val => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = val;
      sel.appendChild(opt);
    });
  }

  function getExclusionOptionsForKey(key) {
    const allRaces = [...RACES_BY_FACTION.Allianz, ...RACES_BY_FACTION.Horde];
    switch (key) {
      case "Fraktion": return FACTION;
      case "Rasse": return allRaces;
      case "Klasse": return CLASSES_PLAYABLE;
      case "Haarfarbe": return HAIR_COLORS;
      case "Geschlecht": return GENDERS;
      case "Waffe": return ALL_WEAPONS;
      case "Nebenhand": return ALL_OFFHANDS;
      case "Rüstung": return ARMOR_TYPES;
      case "Level": return Array.from({ length: 70 }, (_, i) => String(i + 1));
      case "Pose": return POSES;
      case "Hintergrund Komplex": return BACKGROUNDS;
      case "Hintergrund Simpel": return BACKGROUNDS_SIMPEL;
      case "Stimmung": return MOODS;
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
    first.textContent = "— Ausschließen wählen —";
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
    removeBtn.setAttribute("aria-label", "Entfernen");
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
      Fraktion: "Fraktion", Rasse: "Rasse", Klasse: "Klasse", Haarfarbe: "Haarfarbe",
      Geschlecht: "Geschlecht", Waffe: "Waffe", Nebenhand: "Nebenhand", Rüstung: "Rüstung",
      Level: "Level", Pose: "Pose", "Hintergrund Komplex": "Hintergrund Komplex", "Hintergrund Simpel": "Hintergrund Simpel", Stimmung: "Stimmung"
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
    fillSelect("select-pose", POSES);
    fillSelect("select-hintergrund", BACKGROUNDS);
    fillSelect("select-hintergrund-simpel", BACKGROUNDS_SIMPEL);
    fillSelect("select-stimmung", MOODS);
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
      : [...RACES_BY_FACTION.Allianz, ...RACES_BY_FACTION.Horde];
    if (klasse) {
      const racesForClass = getRacesForClass(klasse);
      options = options.filter(r => racesForClass.includes(r));
      if (options.length === 0) options = faction ? RACES_BY_FACTION[faction] : options;
    }
    raceSel.innerHTML = "";
    const first = document.createElement("option");
    first.value = "";
    first.textContent = "— Zufällig —";
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
    first.textContent = "— Zufällig —";
    classSel.appendChild(first);
    options.forEach(val => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = val;
      classSel.appendChild(opt);
    });
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
      .map(([key, value]) => `<dt>${key}</dt><dd>${value}</dd>`)
      .join("");
    if (btnSave) btnSave.hidden = false;
  }

  function renderPreviewModal(char) {
    const sheet = document.getElementById("preview-char-sheet");
    if (!sheet) return;
    sheet.innerHTML = char
      ? Object.entries(char).map(([key, value]) => `<dt>${key}</dt><dd>${value}</dd>`).join("")
      : "";
  }

  function openPreviewModal(char) {
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
  }

  const STORAGE_KEY = "wow-random-characters";
  const STORAGE_KEY_SETTINGS = "wow-random-settings";

  const PRESET_SELECT_ID = {
    Fraktion: "select-fraktion", Rasse: "select-rasse", Klasse: "select-klasse",
    Haarfarbe: "select-haarfarbe", Geschlecht: "select-geschlecht", Waffe: "select-waffe",
    Nebenhand: "select-nebenhand", Rüstung: "select-ruestung", Level: "select-level",
    Pose: "select-pose", "Hintergrund Komplex": "select-hintergrund", "Hintergrund Simpel": "select-hintergrund-simpel", Stimmung: "select-stimmung"
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

  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.presets) {
        EXCLUSION_KEYS.forEach(key => {
          const id = PRESET_SELECT_ID[key];
          const el = document.getElementById(id);
          const val = data.presets[key];
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
          const vals = data.exclusions[key];
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
        const title = [c.Rasse, c.Klasse, "Stufe " + c.Level].filter(Boolean).join(" · ");
        const meta = [c.Fraktion, c["Hintergrund Komplex"] || c["Hintergrund Simpel"]].filter(Boolean).join(" · ");
        return `
          <li>
            <div class="char-title">${title}</div>
            <div class="char-meta">${meta}</div>
            <button type="button" data-load="${i}">Anzeigen</button>
            <button type="button" data-delete="${i}">Löschen</button>
          </li>
        `;
      })
      .join("");
    ul.querySelectorAll("[data-load]").forEach(btn => {
      btn.addEventListener("click", function () {
        const idx = parseInt(this.getAttribute("data-load"), 10);
        const entry = list[idx];
        const c = entry.Level !== undefined ? entry : entry.char;
        openPreviewModal(c);
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
  document.getElementById("btn-settings").addEventListener("click", function () {
    settingsModal.classList.add("is-open");
    settingsModal.setAttribute("aria-hidden", "false");
  });
  function closeSettingsModal() {
    settingsModal.classList.remove("is-open");
    settingsModal.setAttribute("aria-hidden", "true");
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
