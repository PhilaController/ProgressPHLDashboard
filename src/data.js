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
const tractsByRegion = new Map(
  [
    {
      key: "Center City",
      value: [
        "1",
        "2",
        "3",
        "4.01",
        "4.02",
        "5",
        "6",
        "7",
        "8.01",
        "8.03",
        "8.04",
        "9.01",
        "9.02",
        "10.01",
        "10.02",
        "11.01",
        "11.02",
        "12.01",
        "12.02",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "23",
        "24",
        "25",
        "125",
        "131",
        "132",
        "133",
        "134.01",
        "134.02",
        "135",
        "136.01",
        "136.02",
        "142",
        "366",
        "367",
        "376",
      ],
    },
    {
      key: "South",
      value: [
        "20",
        "21",
        "22",
        "27.01",
        "27.02",
        "28.01",
        "28.02",
        "29",
        "30.01",
        "30.02",
        "31",
        "32",
        "33",
        "36",
        "37.01",
        "37.02",
        "38",
        "39.01",
        "39.02",
        "40.01",
        "40.02",
        "41.01",
        "41.02",
        "42.01",
        "42.02",
        "372",
        "373",
      ],
    },
    {
      key: "Southwest",
      value: [
        "54",
        "55",
        "56",
        "60",
        "61",
        "62",
        "63",
        "64",
        "65",
        "66",
        "67",
        "69",
        "70",
        "71.01",
        "71.02",
        "72",
        "73",
        "74",
        "77",
        "78",
        "79",
        "80",
        "81.01",
        "81.02",
        "82",
        "83.01",
        "83.02",
        "84",
        "85",
        "86.01",
        "86.02",
        "87.01",
        "87.02",
        "88.01",
        "88.02",
        "369",
      ],
    },
    {
      key: "West",
      value: [
        "90",
        "91",
        "92",
        "93",
        "94",
        "95",
        "96",
        "98.01",
        "98.02",
        "100",
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "107",
        "108",
        "109",
        "110",
        "111",
        "112",
        "113",
        "114",
        "115",
        "117",
        "118",
        "119",
        "120",
        "121",
        "122.01",
        "122.03",
        "122.04",
        "375",
      ],
    },
    {
      key: "Lower North",
      value: [
        "137",
        "138",
        "139",
        "140",
        "141",
        "145",
        "146",
        "147",
        "148",
        "149",
        "151.01",
        "151.02",
        "152",
        "153",
        "165",
        "166",
        "167.01",
        "167.02",
        "168",
        "169.01",
        "169.02",
        "170",
        "171",
        "172.01",
        "172.02",
        "173",
        "174",
        "200",
        "201.01",
        "201.02",
        "202",
        "205",
        "377",
      ],
    },
    {
      key: "East",
      value: [
        "143",
        "144",
        "156",
        "157",
        "158",
        "160",
        "161",
        "162",
        "163",
        "164",
        "175",
        "176.01",
        "176.02",
        "177.01",
        "177.02",
        "178",
        "179",
        "180.01",
        "180.02",
        "188",
        "190",
        "191",
        "192",
        "195.01",
        "195.02",
        "197",
        "198",
        "199",
        "203",
        "204",
        "378",
        "379",
        "382",
        "383",
      ],
    },
    {
      key: "Lower Northeast (East)",
      value: [
        "183",
        "184",
        "292",
        "293",
        "294",
        "298",
        "299",
        "300",
        "301",
        "302",
        "315.01",
        "315.02",
        "316",
        "317",
        "318",
        "319",
        "320",
        "321",
        "323",
        "325",
        "326",
        "329",
        "330",
        "331.01",
        "331.02",
        "332",
        "380",
        "381",
      ],
    },
    {
      key: "Northwest",
      value: [
        "206",
        "207",
        "208",
        "209",
        "210",
        "211",
        "212",
        "213",
        "214",
        "215",
        "216",
        "217",
        "218",
        "219",
        "220",
        "231",
        "235",
        "236",
        "237",
        "238",
        "239",
        "240",
        "241",
        "242",
        "243",
        "244",
        "245",
        "246",
        "247",
        "248",
        "249",
        "252",
        "253",
        "254",
        "255",
        "256",
        "257",
        "384",
        "385",
        "386",
        "387",
        "388",
        "389",
      ],
    },
    {
      key: "Upper North",
      value: [
        "258",
        "259",
        "260",
        "261",
        "262",
        "263.01",
        "263.02",
        "264",
        "265",
        "266",
        "267",
        "268",
        "269",
        "270",
        "271",
        "272",
        "273",
        "274.01",
        "274.02",
        "275",
        "276",
        "277",
        "278",
        "279.01",
        "279.02",
        "280",
        "281",
        "282",
        "283",
        "284",
        "285",
        "286",
        "287",
        "288",
        "289.01",
        "289.02",
        "290",
      ],
    },
    {
      key: "Lower Northeast (West)",
      value: [
        "291",
        "305.01",
        "305.02",
        "306",
        "307",
        "308",
        "309",
        "310",
        "311.01",
        "311.02",
        "312",
        "313",
        "314.01",
        "314.02",
        "333",
        "334",
        "335",
        "336",
        "337.01",
        "337.02",
        "338",
        "339",
        "340",
        "341",
        "342",
        "390",
      ],
    },
    {
      key: "Far Northeast",
      value: [
        "344",
        "345.01",
        "345.02",
        "346",
        "347.01",
        "347.02",
        "348.01",
        "348.02",
        "348.03",
        "349",
        "351",
        "352",
        "353.01",
        "353.02",
        "355",
        "356.01",
        "356.02",
        "357.01",
        "357.02",
        "358",
        "359",
        "360",
        "361",
        "362.01",
        "362.02",
        "362.03",
        "363.01",
        "363.02",
        "363.03",
        "364",
        "365.01",
        "365.02",
      ],
    },
  ].map((d) => [d.key, d.value])
);

const tractsByNeighborhood = new Map(
  [
    {
      key: "Center City East",
      value: [
        "1",
        "2",
        "5",
        "6",
        "9.01",
        "9.02",
        "10.01",
        "10.02",
        "11.01",
        "11.02",
        "366",
      ],
    },
    {
      key: "Center City West",
      value: [
        "3",
        "4.01",
        "4.02",
        "7",
        "8.01",
        "8.03",
        "8.04",
        "12.01",
        "12.02",
      ],
    },
    {
      key: "Schuylkill-Point Breeze",
      value: ["13", "14", "19", "20", "21", "22", "31", "32"],
    },
    {
      key: "Pennsport-Queen Village",
      value: ["15", "16", "17", "18", "25", "27.01", "27.02"],
    },
    {
      key: "Southwark-Bella Vista",
      value: ["23", "24", "28.01", "28.02", "29", "30.01", "30.02"],
    },
    { key: "Grays Ferry-Passyunk", value: ["33", "36", "38", "373"] },
    {
      key: "South Broad-Girard Estates",
      value: ["37.01", "37.02", "39.01", "39.02", "40.01", "40.02"],
    },
    {
      key: "Snyder-Whitman",
      value: ["41.01", "41.02", "42.01", "42.02", "372"],
    },
    {
      key: "Eastwick-Elmwood",
      value: ["54", "55", "56", "60", "61", "62", "67"],
    },
    {
      key: "Paschall-Kingsessing",
      value: [
        "63",
        "64",
        "65",
        "66",
        "69",
        "70",
        "71.01",
        "71.02",
        "72",
        "73",
        "74",
      ],
    },
    {
      key: "University City",
      value: [
        "77",
        "78",
        "79",
        "86.01",
        "86.02",
        "87.01",
        "87.02",
        "88.01",
        "88.02",
        "90",
        "91",
        "369",
      ],
    },
    {
      key: "Cobbs Creek",
      value: ["80", "81.01", "81.02", "82", "83.01", "83.02", "84", "85"],
    },
    {
      key: "Mill Creek-Parkside",
      value: [
        "92",
        "103",
        "104",
        "105",
        "106",
        "107",
        "108",
        "109",
        "110",
        "111",
      ],
    },
    {
      key: "Haddington-Overbrook",
      value: [
        "93",
        "94",
        "95",
        "96",
        "100",
        "101",
        "102",
        "112",
        "113",
        "114",
        "115",
      ],
    },
    {
      key: "Overbrook Park-Wynnefield Heights",
      value: [
        "98.01",
        "98.02",
        "117",
        "118",
        "119",
        "120",
        "121",
        "122.01",
        "122.03",
        "122.04",
        "375",
      ],
    },
    {
      key: "Fairmount-Spring Garden",
      value: ["125", "133", "134.01", "134.02", "135", "136.01", "136.02"],
    },
    {
      key: "Poplar-Temple",
      value: ["131", "132", "141", "145", "146", "165", "166", "377"],
    },
    {
      key: "Strawberry Mansion",
      value: [
        "137",
        "149",
        "151.01",
        "151.02",
        "152",
        "168",
        "169.01",
        "169.02",
      ],
    },
    {
      key: "Sharswood-Stanton",
      value: ["138", "139", "140", "147", "148", "153", "167.01", "167.02"],
    },
    {
      key: "Northern Liberties-West Kensington",
      value: ["142", "144", "156", "157", "162", "163", "164", "367", "376"],
    },
    { key: "Lower Kensington", value: ["143", "158", "160", "161"] },
    {
      key: "Nicetown-Tioga",
      value: [
        "170",
        "171",
        "172.01",
        "172.02",
        "173",
        "200",
        "201.01",
        "201.02",
        "202",
        "203",
        "204",
        "205",
      ],
    },
    {
      key: "Hunting Park-Fairhill",
      value: [
        "174",
        "175",
        "176.01",
        "176.02",
        "195.01",
        "195.02",
        "197",
        "198",
        "199",
        "289.01",
        "383",
      ],
    },
    { key: "Upper Kensington", value: ["177.01", "177.02", "178", "179"] },
    {
      key: "Richmond-Bridesburg",
      value: ["180.01", "180.02", "183", "184", "378", "379"],
    },
    {
      key: "Juniata Park-Harrowgate",
      value: ["188", "190", "191", "192", "382"],
    },
    {
      key: "East Falls-Westside",
      value: ["206", "207", "208", "240", "243", "244"],
    },
    {
      key: "Roxborough-Manayunk",
      value: [
        "209",
        "210",
        "211",
        "212",
        "213",
        "214",
        "215",
        "216",
        "217",
        "218",
        "219",
        "220",
        "384",
      ],
    },
    {
      key: "Chestnut Hill-West Mt. Airy",
      value: [
        "231",
        "235",
        "236",
        "237",
        "239",
        "257",
        "385",
        "386",
        "387",
        "388",
      ],
    },
    {
      key: "Germantown",
      value: ["238", "241", "242", "245", "246", "247", "248", "249"],
    },
    { key: "East Mt. Airy", value: ["252", "253", "254", "255", "256", "389"] },
    {
      key: "West Oak Lane-Cedarbrook",
      value: [
        "258",
        "259",
        "260",
        "261",
        "262",
        "263.01",
        "263.02",
        "264",
        "266",
      ],
    },
    { key: "Ogontz", value: ["265", "267", "277", "278", "279.01", "279.02"] },
    {
      key: "Oak Lane - Fernrock",
      value: ["268", "269", "270", "271", "272", "276"],
    },
    {
      key: "Olney-Feltonville",
      value: [
        "273",
        "274.01",
        "274.02",
        "275",
        "285",
        "286",
        "287",
        "288",
        "289.02",
        "290",
      ],
    },
    { key: "Logan", value: ["280", "281", "282", "283", "284"] },
    {
      key: "Lawndale-Crescentville",
      value: ["291", "292", "305.01", "305.02", "306", "307", "390"],
    },
    {
      key: "Frankford",
      value: ["293", "294", "299", "300", "301", "302", "380"],
    },
    {
      key: "Wissinoming-Tacony",
      value: ["298", "319", "320", "321", "323", "325", "381"],
    },
    {
      key: "Oxford Circle",
      value: [
        "308",
        "309",
        "310",
        "311.01",
        "311.02",
        "312",
        "313",
        "314.01",
        "314.02",
      ],
    },
    {
      key: "Mayfair-Holmesburg",
      value: [
        "315.01",
        "315.02",
        "316",
        "317",
        "318",
        "326",
        "329",
        "330",
        "331.01",
        "331.02",
        "332",
        "333",
      ],
    },
    {
      key: "Rhawnhurst-Fox Chase",
      value: [
        "334",
        "335",
        "336",
        "337.01",
        "337.02",
        "338",
        "339",
        "340",
        "341",
        "342",
      ],
    },
    {
      key: "Bustleton",
      value: ["344", "345.01", "345.02", "355", "356.01", "356.02"],
    },
    {
      key: "Torresdale South-Pennypack Park",
      value: [
        "346",
        "347.01",
        "347.02",
        "348.01",
        "348.02",
        "348.03",
        "349",
        "351",
        "352",
      ],
    },
    {
      key: "Torresdale North",
      value: [
        "353.01",
        "353.02",
        "361",
        "362.01",
        "362.02",
        "362.03",
        "363.01",
        "363.02",
        "363.03",
        "364",
      ],
    },
    {
      key: "Somerton",
      value: ["357.01", "357.02", "358", "359", "360", "365.01", "365.02"],
    },
  ].map((d) => [d.key, d.value])
);

const allNeighborhoods = [
  "Bustleton",
  "Center City East",
  "Center City West",
  "Chestnut Hill-West Mt. Airy",
  "Cobbs Creek",
  "East Falls-Westside",
  "East Mt. Airy",
  "Eastwick-Elmwood",
  "Fairmount-Spring Garden",
  "Frankford",
  "Germantown",
  "Grays Ferry-Passyunk",
  "Haddington-Overbrook",
  "Hunting Park-Fairhill",
  "Juniata Park-Harrowgate",
  "Lawndale-Crescentville",
  "Logan",
  "Lower Kensington",
  "Mayfair-Holmesburg",
  "Mill Creek-Parkside",
  "Nicetown-Tioga",
  "Northern Liberties-West Kensington",
  "Oak Lane - Fernrock",
  "Ogontz",
  "Olney-Feltonville",
  "Overbrook Park-Wynnefield Heights",
  "Oxford Circle",
  "Paschall-Kingsessing",
  "Pennsport-Queen Village",
  "Poplar-Temple",
  "Rhawnhurst-Fox Chase",
  "Richmond-Bridesburg",
  "Roxborough-Manayunk",
  "Schuylkill-Point Breeze",
  "Sharswood-Stanton",
  "Snyder-Whitman",
  "Somerton",
  "South Broad-Girard Estates",
  "Southwark-Bella Vista",
  "Strawberry Mansion",
  "Torresdale North",
  "Torresdale South-Pennypack Park",
  "University City",
  "Upper Kensington",
  "West Oak Lane-Cedarbrook",
  "Wissinoming-Tacony",
];

const allCensusTracts = [
  "1",
  "2",
  "3",
  "4.01",
  "4.02",
  "5",
  "6",
  "7",
  "8.01",
  "8.03",
  "8.04",
  "9.01",
  "9.02",
  "10.01",
  "10.02",
  "11.01",
  "11.02",
  "12.01",
  "12.02",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "27.01",
  "27.02",
  "28.01",
  "28.02",
  "29",
  "30.01",
  "30.02",
  "31",
  "32",
  "33",
  "36",
  "37.01",
  "37.02",
  "38",
  "39.01",
  "39.02",
  "40.01",
  "40.02",
  "41.01",
  "41.02",
  "42.01",
  "42.02",
  "54",
  "55",
  "56",
  "60",
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "67",
  "69",
  "70",
  "71.01",
  "71.02",
  "72",
  "73",
  "74",
  "77",
  "78",
  "79",
  "80",
  "81.01",
  "81.02",
  "82",
  "83.01",
  "83.02",
  "84",
  "85",
  "86.01",
  "86.02",
  "87.01",
  "87.02",
  "88.01",
  "88.02",
  "90",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "98.01",
  "98.02",
  "100",
  "101",
  "102",
  "103",
  "104",
  "105",
  "106",
  "107",
  "108",
  "109",
  "110",
  "111",
  "112",
  "113",
  "114",
  "115",
  "117",
  "118",
  "119",
  "120",
  "121",
  "122.01",
  "122.03",
  "122.04",
  "125",
  "131",
  "132",
  "133",
  "134.01",
  "134.02",
  "135",
  "136.01",
  "136.02",
  "137",
  "138",
  "139",
  "140",
  "141",
  "142",
  "143",
  "144",
  "145",
  "146",
  "147",
  "148",
  "149",
  "151.01",
  "151.02",
  "152",
  "153",
  "156",
  "157",
  "158",
  "160",
  "161",
  "162",
  "163",
  "164",
  "165",
  "166",
  "167.01",
  "167.02",
  "168",
  "169.01",
  "169.02",
  "170",
  "171",
  "172.01",
  "172.02",
  "173",
  "174",
  "175",
  "176.01",
  "176.02",
  "177.01",
  "177.02",
  "178",
  "179",
  "180.01",
  "180.02",
  "183",
  "184",
  "188",
  "190",
  "191",
  "192",
  "195.01",
  "195.02",
  "197",
  "198",
  "199",
  "200",
  "201.01",
  "201.02",
  "202",
  "203",
  "204",
  "205",
  "206",
  "207",
  "208",
  "209",
  "210",
  "211",
  "212",
  "213",
  "214",
  "215",
  "216",
  "217",
  "218",
  "219",
  "220",
  "231",
  "235",
  "236",
  "237",
  "238",
  "239",
  "240",
  "241",
  "242",
  "243",
  "244",
  "245",
  "246",
  "247",
  "248",
  "249",
  "252",
  "253",
  "254",
  "255",
  "256",
  "257",
  "258",
  "259",
  "260",
  "261",
  "262",
  "263.01",
  "263.02",
  "264",
  "265",
  "266",
  "267",
  "268",
  "269",
  "270",
  "271",
  "272",
  "273",
  "274.01",
  "274.02",
  "275",
  "276",
  "277",
  "278",
  "279.01",
  "279.02",
  "280",
  "281",
  "282",
  "283",
  "284",
  "285",
  "286",
  "287",
  "288",
  "289.01",
  "289.02",
  "290",
  "291",
  "292",
  "293",
  "294",
  "298",
  "299",
  "300",
  "301",
  "302",
  "305.01",
  "305.02",
  "306",
  "307",
  "308",
  "309",
  "310",
  "311.01",
  "311.02",
  "312",
  "313",
  "314.01",
  "314.02",
  "315.01",
  "315.02",
  "316",
  "317",
  "318",
  "319",
  "320",
  "321",
  "323",
  "325",
  "326",
  "329",
  "330",
  "331.01",
  "331.02",
  "332",
  "333",
  "334",
  "335",
  "336",
  "337.01",
  "337.02",
  "338",
  "339",
  "340",
  "341",
  "342",
  "344",
  "345.01",
  "345.02",
  "346",
  "347.01",
  "347.02",
  "348.01",
  "348.02",
  "348.03",
  "349",
  "351",
  "352",
  "353.01",
  "353.02",
  "355",
  "356.01",
  "356.02",
  "357.01",
  "357.02",
  "358",
  "359",
  "360",
  "361",
  "362.01",
  "362.02",
  "362.03",
  "363.01",
  "363.02",
  "363.03",
  "364",
  "365.01",
  "365.02",
  "366",
  "367",
  "369",
  "372",
  "373",
  "375",
  "376",
  "377",
  "378",
  "379",
  "380",
  "381",
  "382",
  "383",
  "384",
  "385",
  "386",
  "387",
  "388",
  "389",
  "390",
];

const tractToHood = new Map([
  ["1", "Center City East"],
  ["2", "Center City East"],
  ["3", "Center City West"],
  ["4.01", "Center City West"],
  ["4.02", "Center City West"],
  ["5", "Center City East"],
  ["6", "Center City East"],
  ["7", "Center City West"],
  ["8.01", "Center City West"],
  ["8.03", "Center City West"],
  ["8.04", "Center City West"],
  ["9.01", "Center City East"],
  ["9.02", "Center City East"],
  ["10.01", "Center City East"],
  ["10.02", "Center City East"],
  ["11.01", "Center City East"],
  ["11.02", "Center City East"],
  ["12.01", "Center City West"],
  ["12.02", "Center City West"],
  ["13", "Schuylkill-Point Breeze"],
  ["14", "Schuylkill-Point Breeze"],
  ["15", "Pennsport-Queen Village"],
  ["16", "Pennsport-Queen Village"],
  ["17", "Pennsport-Queen Village"],
  ["18", "Pennsport-Queen Village"],
  ["19", "Schuylkill-Point Breeze"],
  ["20", "Schuylkill-Point Breeze"],
  ["21", "Schuylkill-Point Breeze"],
  ["22", "Schuylkill-Point Breeze"],
  ["23", "Southwark-Bella Vista"],
  ["24", "Southwark-Bella Vista"],
  ["25", "Pennsport-Queen Village"],
  ["27.01", "Pennsport-Queen Village"],
  ["27.02", "Pennsport-Queen Village"],
  ["28.01", "Southwark-Bella Vista"],
  ["28.02", "Southwark-Bella Vista"],
  ["29", "Southwark-Bella Vista"],
  ["30.01", "Southwark-Bella Vista"],
  ["30.02", "Southwark-Bella Vista"],
  ["31", "Schuylkill-Point Breeze"],
  ["32", "Schuylkill-Point Breeze"],
  ["33", "Grays Ferry-Passyunk"],
  ["36", "Grays Ferry-Passyunk"],
  ["37.01", "South Broad-Girard Estates"],
  ["37.02", "South Broad-Girard Estates"],
  ["38", "Grays Ferry-Passyunk"],
  ["39.01", "South Broad-Girard Estates"],
  ["39.02", "South Broad-Girard Estates"],
  ["40.01", "South Broad-Girard Estates"],
  ["40.02", "South Broad-Girard Estates"],
  ["41.01", "Snyder-Whitman"],
  ["41.02", "Snyder-Whitman"],
  ["42.01", "Snyder-Whitman"],
  ["42.02", "Snyder-Whitman"],
  ["50", "Airport-Navy Yard"],
  ["54", "Eastwick-Elmwood"],
  ["55", "Eastwick-Elmwood"],
  ["56", "Eastwick-Elmwood"],
  ["60", "Eastwick-Elmwood"],
  ["61", "Eastwick-Elmwood"],
  ["62", "Eastwick-Elmwood"],
  ["63", "Paschall-Kingsessing"],
  ["64", "Paschall-Kingsessing"],
  ["65", "Paschall-Kingsessing"],
  ["66", "Paschall-Kingsessing"],
  ["67", "Eastwick-Elmwood"],
  ["69", "Paschall-Kingsessing"],
  ["70", "Paschall-Kingsessing"],
  ["71.01", "Paschall-Kingsessing"],
  ["71.02", "Paschall-Kingsessing"],
  ["72", "Paschall-Kingsessing"],
  ["73", "Paschall-Kingsessing"],
  ["74", "Paschall-Kingsessing"],
  ["77", "University City"],
  ["78", "University City"],
  ["79", "University City"],
  ["80", "Cobbs Creek"],
  ["81.01", "Cobbs Creek"],
  ["81.02", "Cobbs Creek"],
  ["82", "Cobbs Creek"],
  ["83.01", "Cobbs Creek"],
  ["83.02", "Cobbs Creek"],
  ["84", "Cobbs Creek"],
  ["85", "Cobbs Creek"],
  ["86.01", "University City"],
  ["86.02", "University City"],
  ["87.01", "University City"],
  ["87.02", "University City"],
  ["88.01", "University City"],
  ["88.02", "University City"],
  ["90", "University City"],
  ["91", "University City"],
  ["92", "Mill Creek-Parkside"],
  ["93", "Haddington-Overbrook"],
  ["94", "Haddington-Overbrook"],
  ["95", "Haddington-Overbrook"],
  ["96", "Haddington-Overbrook"],
  ["98.01", "Overbrook Park-Wynnefield Heights"],
  ["98.02", "Overbrook Park-Wynnefield Heights"],
  ["100", "Haddington-Overbrook"],
  ["101", "Haddington-Overbrook"],
  ["102", "Haddington-Overbrook"],
  ["103", "Mill Creek-Parkside"],
  ["104", "Mill Creek-Parkside"],
  ["105", "Mill Creek-Parkside"],
  ["106", "Mill Creek-Parkside"],
  ["107", "Mill Creek-Parkside"],
  ["108", "Mill Creek-Parkside"],
  ["109", "Mill Creek-Parkside"],
  ["110", "Mill Creek-Parkside"],
  ["111", "Mill Creek-Parkside"],
  ["112", "Haddington-Overbrook"],
  ["113", "Haddington-Overbrook"],
  ["114", "Haddington-Overbrook"],
  ["115", "Haddington-Overbrook"],
  ["117", "Overbrook Park-Wynnefield Heights"],
  ["118", "Overbrook Park-Wynnefield Heights"],
  ["119", "Overbrook Park-Wynnefield Heights"],
  ["120", "Overbrook Park-Wynnefield Heights"],
  ["121", "Overbrook Park-Wynnefield Heights"],
  ["122.01", "Overbrook Park-Wynnefield Heights"],
  ["122.03", "Overbrook Park-Wynnefield Heights"],
  ["122.04", "Overbrook Park-Wynnefield Heights"],
  ["125", "Fairmount-Spring Garden"],
  ["131", "Poplar-Temple"],
  ["132", "Poplar-Temple"],
  ["133", "Fairmount-Spring Garden"],
  ["134.01", "Fairmount-Spring Garden"],
  ["134.02", "Fairmount-Spring Garden"],
  ["135", "Fairmount-Spring Garden"],
  ["136.01", "Fairmount-Spring Garden"],
  ["136.02", "Fairmount-Spring Garden"],
  ["137", "Strawberry Mansion"],
  ["138", "Sharswood-Stanton"],
  ["139", "Sharswood-Stanton"],
  ["140", "Sharswood-Stanton"],
  ["141", "Poplar-Temple"],
  ["142", "Northern Liberties-West Kensington"],
  ["143", "Lower Kensington"],
  ["144", "Northern Liberties-West Kensington"],
  ["145", "Poplar-Temple"],
  ["146", "Poplar-Temple"],
  ["147", "Sharswood-Stanton"],
  ["148", "Sharswood-Stanton"],
  ["149", "Strawberry Mansion"],
  ["151.01", "Strawberry Mansion"],
  ["151.02", "Strawberry Mansion"],
  ["152", "Strawberry Mansion"],
  ["153", "Sharswood-Stanton"],
  ["156", "Northern Liberties-West Kensington"],
  ["157", "Northern Liberties-West Kensington"],
  ["158", "Lower Kensington"],
  ["160", "Lower Kensington"],
  ["161", "Lower Kensington"],
  ["162", "Northern Liberties-West Kensington"],
  ["163", "Northern Liberties-West Kensington"],
  ["164", "Northern Liberties-West Kensington"],
  ["165", "Poplar-Temple"],
  ["166", "Poplar-Temple"],
  ["167.01", "Sharswood-Stanton"],
  ["167.02", "Sharswood-Stanton"],
  ["168", "Strawberry Mansion"],
  ["169.01", "Strawberry Mansion"],
  ["169.02", "Strawberry Mansion"],
  ["170", "Nicetown-Tioga"],
  ["171", "Nicetown-Tioga"],
  ["172.01", "Nicetown-Tioga"],
  ["172.02", "Nicetown-Tioga"],
  ["173", "Nicetown-Tioga"],
  ["174", "Hunting Park-Fairhill"],
  ["175", "Hunting Park-Fairhill"],
  ["176.01", "Hunting Park-Fairhill"],
  ["176.02", "Hunting Park-Fairhill"],
  ["177.01", "Upper Kensington"],
  ["177.02", "Upper Kensington"],
  ["178", "Upper Kensington"],
  ["179", "Upper Kensington"],
  ["180.01", "Richmond-Bridesburg"],
  ["180.02", "Richmond-Bridesburg"],
  ["183", "Richmond-Bridesburg"],
  ["184", "Richmond-Bridesburg"],
  ["188", "Juniata Park-Harrowgate"],
  ["190", "Juniata Park-Harrowgate"],
  ["191", "Juniata Park-Harrowgate"],
  ["192", "Juniata Park-Harrowgate"],
  ["195.01", "Hunting Park-Fairhill"],
  ["195.02", "Hunting Park-Fairhill"],
  ["197", "Hunting Park-Fairhill"],
  ["198", "Hunting Park-Fairhill"],
  ["199", "Hunting Park-Fairhill"],
  ["200", "Nicetown-Tioga"],
  ["201.01", "Nicetown-Tioga"],
  ["201.02", "Nicetown-Tioga"],
  ["202", "Nicetown-Tioga"],
  ["203", "Nicetown-Tioga"],
  ["204", "Nicetown-Tioga"],
  ["205", "Nicetown-Tioga"],
  ["206", "East Falls-Westside"],
  ["207", "East Falls-Westside"],
  ["208", "East Falls-Westside"],
  ["209", "Roxborough-Manayunk"],
  ["210", "Roxborough-Manayunk"],
  ["211", "Roxborough-Manayunk"],
  ["212", "Roxborough-Manayunk"],
  ["213", "Roxborough-Manayunk"],
  ["214", "Roxborough-Manayunk"],
  ["215", "Roxborough-Manayunk"],
  ["216", "Roxborough-Manayunk"],
  ["217", "Roxborough-Manayunk"],
  ["218", "Roxborough-Manayunk"],
  ["219", "Roxborough-Manayunk"],
  ["220", "Roxborough-Manayunk"],
  ["231", "Chestnut Hill-West Mt. Airy"],
  ["235", "Chestnut Hill-West Mt. Airy"],
  ["236", "Chestnut Hill-West Mt. Airy"],
  ["237", "Chestnut Hill-West Mt. Airy"],
  ["238", "Germantown"],
  ["239", "Chestnut Hill-West Mt. Airy"],
  ["240", "East Falls-Westside"],
  ["241", "Germantown"],
  ["242", "Germantown"],
  ["243", "East Falls-Westside"],
  ["244", "East Falls-Westside"],
  ["245", "Germantown"],
  ["246", "Germantown"],
  ["247", "Germantown"],
  ["248", "Germantown"],
  ["249", "Germantown"],
  ["252", "East Mt. Airy"],
  ["253", "East Mt. Airy"],
  ["254", "East Mt. Airy"],
  ["255", "East Mt. Airy"],
  ["256", "East Mt. Airy"],
  ["257", "Chestnut Hill-West Mt. Airy"],
  ["258", "West Oak Lane-Cedarbrook"],
  ["259", "West Oak Lane-Cedarbrook"],
  ["260", "West Oak Lane-Cedarbrook"],
  ["261", "West Oak Lane-Cedarbrook"],
  ["262", "West Oak Lane-Cedarbrook"],
  ["263.01", "West Oak Lane-Cedarbrook"],
  ["263.02", "West Oak Lane-Cedarbrook"],
  ["264", "West Oak Lane-Cedarbrook"],
  ["265", "Ogontz"],
  ["266", "West Oak Lane-Cedarbrook"],
  ["267", "Ogontz"],
  ["268", "Oak Lane - Fernrock"],
  ["269", "Oak Lane - Fernrock"],
  ["270", "Oak Lane - Fernrock"],
  ["271", "Oak Lane - Fernrock"],
  ["272", "Oak Lane - Fernrock"],
  ["273", "Olney-Feltonville"],
  ["274.01", "Olney-Feltonville"],
  ["274.02", "Olney-Feltonville"],
  ["275", "Olney-Feltonville"],
  ["276", "Oak Lane - Fernrock"],
  ["277", "Ogontz"],
  ["278", "Ogontz"],
  ["279.01", "Ogontz"],
  ["279.02", "Ogontz"],
  ["280", "Logan"],
  ["281", "Logan"],
  ["282", "Logan"],
  ["283", "Logan"],
  ["284", "Logan"],
  ["285", "Olney-Feltonville"],
  ["286", "Olney-Feltonville"],
  ["287", "Olney-Feltonville"],
  ["288", "Olney-Feltonville"],
  ["289.01", "Hunting Park-Fairhill"],
  ["289.02", "Olney-Feltonville"],
  ["290", "Olney-Feltonville"],
  ["291", "Lawndale-Crescentville"],
  ["292", "Lawndale-Crescentville"],
  ["293", "Frankford"],
  ["294", "Frankford"],
  ["298", "Wissinoming-Tacony"],
  ["299", "Frankford"],
  ["300", "Frankford"],
  ["301", "Frankford"],
  ["302", "Frankford"],
  ["305.01", "Lawndale-Crescentville"],
  ["305.02", "Lawndale-Crescentville"],
  ["306", "Lawndale-Crescentville"],
  ["307", "Lawndale-Crescentville"],
  ["308", "Oxford Circle"],
  ["309", "Oxford Circle"],
  ["310", "Oxford Circle"],
  ["311.01", "Oxford Circle"],
  ["311.02", "Oxford Circle"],
  ["312", "Oxford Circle"],
  ["313", "Oxford Circle"],
  ["314.01", "Oxford Circle"],
  ["314.02", "Oxford Circle"],
  ["315.01", "Mayfair-Holmesburg"],
  ["315.02", "Mayfair-Holmesburg"],
  ["316", "Mayfair-Holmesburg"],
  ["317", "Mayfair-Holmesburg"],
  ["318", "Mayfair-Holmesburg"],
  ["319", "Wissinoming-Tacony"],
  ["320", "Wissinoming-Tacony"],
  ["321", "Wissinoming-Tacony"],
  ["323", "Wissinoming-Tacony"],
  ["325", "Wissinoming-Tacony"],
  ["326", "Mayfair-Holmesburg"],
  ["329", "Mayfair-Holmesburg"],
  ["330", "Mayfair-Holmesburg"],
  ["331.01", "Mayfair-Holmesburg"],
  ["331.02", "Mayfair-Holmesburg"],
  ["332", "Mayfair-Holmesburg"],
  ["333", "Mayfair-Holmesburg"],
  ["334", "Rhawnhurst-Fox Chase"],
  ["335", "Rhawnhurst-Fox Chase"],
  ["336", "Rhawnhurst-Fox Chase"],
  ["337.01", "Rhawnhurst-Fox Chase"],
  ["337.02", "Rhawnhurst-Fox Chase"],
  ["338", "Rhawnhurst-Fox Chase"],
  ["339", "Rhawnhurst-Fox Chase"],
  ["340", "Rhawnhurst-Fox Chase"],
  ["341", "Rhawnhurst-Fox Chase"],
  ["342", "Rhawnhurst-Fox Chase"],
  ["344", "Bustleton"],
  ["345.01", "Bustleton"],
  ["345.02", "Bustleton"],
  ["346", "Torresdale South-Pennypack Park"],
  ["347.01", "Torresdale South-Pennypack Park"],
  ["347.02", "Torresdale South-Pennypack Park"],
  ["348.01", "Torresdale South-Pennypack Park"],
  ["348.02", "Torresdale South-Pennypack Park"],
  ["348.03", "Torresdale South-Pennypack Park"],
  ["349", "Torresdale South-Pennypack Park"],
  ["351", "Torresdale South-Pennypack Park"],
  ["352", "Torresdale South-Pennypack Park"],
  ["353.01", "Torresdale North"],
  ["353.02", "Torresdale North"],
  ["355", "Bustleton"],
  ["356.01", "Bustleton"],
  ["356.02", "Bustleton"],
  ["357.01", "Somerton"],
  ["357.02", "Somerton"],
  ["358", "Somerton"],
  ["359", "Somerton"],
  ["360", "Somerton"],
  ["361", "Torresdale North"],
  ["362.01", "Torresdale North"],
  ["362.02", "Torresdale North"],
  ["362.03", "Torresdale North"],
  ["363.01", "Torresdale North"],
  ["363.02", "Torresdale North"],
  ["363.03", "Torresdale North"],
  ["364", "Torresdale North"],
  ["365.01", "Somerton"],
  ["365.02", "Somerton"],
  ["366", "Center City East"],
  ["367", "Northern Liberties-West Kensington"],
  ["369", "University City"],
  ["372", "Snyder-Whitman"],
  ["373", "Grays Ferry-Passyunk"],
  ["375", "Overbrook Park-Wynnefield Heights"],
  ["376", "Northern Liberties-West Kensington"],
  ["377", "Poplar-Temple"],
  ["378", "Richmond-Bridesburg"],
  ["379", "Richmond-Bridesburg"],
  ["380", "Frankford"],
  ["381", "Wissinoming-Tacony"],
  ["382", "Juniata Park-Harrowgate"],
  ["383", "Hunting Park-Fairhill"],
  ["384", "Roxborough-Manayunk"],
  ["385", "Chestnut Hill-West Mt. Airy"],
  ["386", "Chestnut Hill-West Mt. Airy"],
  ["387", "Chestnut Hill-West Mt. Airy"],
  ["388", "Chestnut Hill-West Mt. Airy"],
  ["389", "East Mt. Airy"],
  ["390", "Lawndale-Crescentville"],
  ["9800", "Park"],
  ["9801", "Park"],
  ["9802", "Park"],
  ["9803", "NE Airport"],
  ["9804", "Airport-Navy Yard"],
  ["9805", "Hunting Park-Fairhill"],
  ["9806", "Airport-Navy Yard"],
  ["9807", "Airport-Navy Yard"],
  ["9808", "Overbrook Park-Wynnefield Heights"],
  ["9809", "Airport-Navy Yard"],
  ["9891", "Torresdale South-Pennypack Park"],
]);

export {
  tractsByNeighborhood,
  tractsByRegion,
  allCensusTracts,
  allNeighborhoods,
  tractToHood,
};
