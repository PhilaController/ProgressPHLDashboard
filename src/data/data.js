export const hoodsToRegions = {
  Bustleton: ["Far Northeast"],
  "Center City East": ["Greater Center City"],
  "Center City West": ["Greater Center City"],
  "Chestnut Hill-West Mt. Airy": ["Northwest"],
  "Cobbs Creek": ["Southwest"],
  "East Falls-Westside": ["Northwest"],
  "East Mt. Airy": ["Northwest"],
  "Eastwick-Elmwood": ["Southwest"],
  "Fairmount-Spring Garden": ["Greater Center City"],
  Frankford: ["Lower Northeast (East)"],
  Germantown: ["Northwest"],
  "Grays Ferry-Passyunk": ["South"],
  "Haddington-Overbrook": ["West"],
  "Hunting Park-Fairhill": ["Upper North", "Lower North", "East"],
  "Juniata Park-Harrowgate": ["East"],
  "Lawndale-Crescentville": [
    "Lower Northeast (West)",
    "Lower Northeast (East)",
  ],
  Logan: ["Upper North"],
  "Lower Kensington": ["East"],
  "Mayfair-Holmesburg": ["Lower Northeast (West)", "Lower Northeast (East)"],
  "Mill Creek-Parkside": ["West"],
  "Nicetown-Tioga": ["Lower North", "East"],
  "Northern Liberties-West Kensington": ["Greater Center City", "East"],
  "Oak Lane-Fernrock": ["Upper North"],
  Ogontz: ["Upper North"],
  "Olney-Feltonville": ["Upper North"],
  "Overbrook Park-Wynnefield Heights": ["West"],
  "Oxford Circle": ["Lower Northeast (West)"],
  "Paschall-Kingsessing": ["Southwest"],
  "Pennsport-Queen Village": ["Greater Center City", "South"],
  "Poplar-Temple": ["Greater Center City", "Lower North"],
  "Rhawnhurst-Fox Chase": ["Lower Northeast (West)"],
  "Richmond-Bridesburg": ["Lower Northeast (East)", "East"],
  "Roxborough-Manayunk": ["Northwest"],
  "Schuylkill-Point Breeze": ["Greater Center City", "South"],
  "Sharswood-Stanton": ["Lower North"],
  "Snyder-Whitman": ["South"],
  Somerton: ["Far Northeast"],
  "South Broad-Girard Estates": ["South"],
  "Southwark-Bella Vista": ["Greater Center City", "South"],
  "Strawberry Mansion": ["Lower North"],
  "Torresdale North": ["Far Northeast"],
  "Torresdale South-Pennypack Park": ["Far Northeast"],
  "University City": ["West", "Southwest"],
  "Upper Kensington": ["East"],
  "West Oak Lane-Cedarbrook": ["Upper North"],
  "Wissinoming-Tacony": ["Lower Northeast (East)"],
};

export const regionsToHoods = {
  East: {
    All: ["Juniata Park-Harrowgate", "Lower Kensington", "Upper Kensington"],
    Most: ["Hunting Park-Fairhill", "Richmond-Bridesburg"],
    Some: ["Nicetown-Tioga", "Northern Liberties-West Kensington"],
  },
  "Far Northeast": {
    All: [
      "Bustleton",
      "Somerton",
      "Torresdale North",
      "Torresdale South-Pennypack Park",
    ],
    Most: [],
    Some: [],
  },
  "Greater Center City": {
    All: ["Center City East", "Center City West", "Fairmount-Spring Garden"],
    Most: ["Pennsport-Queen Village"],
    Some: [
      "Northern Liberties-West Kensington",
      "Poplar-Temple",
      "Schuylkill-Point Breeze",
      "Southwark-Bella Vista",
    ],
  },
  "Lower North": {
    All: ["Sharswood-Stanton", "Strawberry Mansion"],
    Most: ["Nicetown-Tioga", "Poplar-Temple"],
    Some: ["Hunting Park-Fairhill"],
  },
  "Lower Northeast (East)": {
    All: ["Frankford", "Wissinoming-Tacony"],
    Most: ["Mayfair-Holmesburg"],
    Some: ["Lawndale-Crescentville", "Richmond-Bridesburg"],
  },
  "Lower Northeast (West)": {
    All: ["Oxford Circle", "Rhawnhurst-Fox Chase"],
    Most: ["Lawndale-Crescentville"],
    Some: ["Mayfair-Holmesburg"],
  },
  Northwest: {
    All: [
      "Chestnut Hill-West Mt. Airy",
      "East Falls-Westside",
      "East Mt. Airy",
      "Germantown",
      "Roxborough-Manayunk",
    ],
    Most: [],
    Some: [],
  },
  South: {
    All: [
      "Grays Ferry-Passyunk",
      "Snyder-Whitman",
      "South Broad-Girard Estates",
    ],
    Most: ["Southwark-Bella Vista"],
    Some: ["Pennsport-Queen Village", "Schuylkill-Point Breeze"],
  },
  Southwest: {
    All: ["Cobbs Creek", "Eastwick-Elmwood", "Paschall-Kingsessing"],
    Most: ["University City"],
    Some: [],
  },
  "Upper North": {
    All: [
      "Logan",
      "Oak Lane-Fernrock",
      "Ogontz",
      "Olney-Feltonville",
      "West Oak Lane-Cedarbrook",
    ],
    Some: ["Hunting Park-Fairhill"],
    Most: [],
  },
  West: {
    All: [
      "Haddington-Overbrook",
      "Mill Creek-Parkside",
      "Overbrook Park-Wynnefield Heights",
    ],
    Some: ["University City"],
    Most: [],
  },
};
