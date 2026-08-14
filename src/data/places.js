// Tanach places dataset — derived from OpenBible.info Bible Geocoding
// (Creative Commons Attribution 4.0). https://www.openbible.info/geo/
// Coordinates are OpenBible's "most likely" identification per place (points are
// exact; rivers/regions use a representative centroid). `books` link to ids in
// books.js; `periods` are editorial eras derived from the books each place appears in.

// Add summary of places (what happened in each place)
// 
export const PLACE_TYPES = ['city','region','mountain','river','water'];
export const TIME_PERIODS = ["Patriarchs","Exodus & Wilderness","Conquest & Judges","United Monarchy","Kingdom Era","The Prophets","Return & Second Temple"];

export const places = [
  {
    "id": "abana",
    "name": "Abana",
    "lat": 33.51458,
    "lng": 36.29403,
    "type": "water",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Abanah"
    ]
  },
  {
    "id": "abarim",
    "name": "Abarim",
    "lat": 31.7386,
    "lng": 35.69473,
    "type": "region",
    "books": [
      "bamidbar",
      "devarim",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "abdon",
    "name": "Abdon",
    "lat": 33.04769,
    "lng": 35.16192,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "abel-beit-maakah",
    "name": "Abel-Beit-Maakah",
    "lat": 33.25805,
    "lng": 35.58101,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "melajima",
      "melajimb",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": [
      "Abel Beth Maakah",
      "Abel of Beth Maacah",
      "Abel Beth Maachah",
      "Abel"
    ]
  },
  {
    "id": "abel-keramim",
    "name": "Abel-Keramim",
    "lat": 31.86756,
    "lng": 35.82938,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "abel-meholah",
    "name": "Abel-Meholah",
    "lat": 32.3743,
    "lng": 35.56089,
    "type": "city",
    "books": [
      "melajima",
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "abel-mizraim",
    "name": "Abel-Mizraim",
    "lat": 31.91489,
    "lng": 35.53045,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "abel-shitim",
    "name": "Abel-Shitim",
    "lat": 31.84018,
    "lng": 35.67368,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Acacia Meadow",
      "Abel Acacia Grove"
    ]
  },
  {
    "id": "abiezer",
    "name": "Abiezer",
    "lat": 32.60786,
    "lng": 35.29,
    "type": "region",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Abi-ezer"
    ]
  },
  {
    "id": "abronah",
    "name": "Abronah",
    "lat": 29.67291,
    "lng": 35.01392,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Ebronah"
    ]
  },
  {
    "id": "akkad",
    "name": "Akkad",
    "lat": 33.09979,
    "lng": 44.29833,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Akkad"
    ]
  },
  {
    "id": "akko",
    "name": "Akko",
    "lat": 32.92111,
    "lng": 35.08833,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Akko",
      "Accho"
    ]
  },
  {
    "id": "achshaf",
    "name": "Achshaf",
    "lat": 32.87276,
    "lng": 35.15133,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Akshaph",
      "Acshaph"
    ]
  },
  {
    "id": "achzib-1",
    "name": "Achzib 1",
    "lat": 31.64207,
    "lng": 34.95302,
    "type": "city",
    "books": [
      "mija",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "The Prophets"
    ],
    "aliases": [
      "Akzib",
      "Aczib"
    ]
  },
  {
    "id": "achzib-2",
    "name": "Achzib 2",
    "lat": 33.04828,
    "lng": 35.10265,
    "type": "city",
    "books": [
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Akzib",
      "Aczib"
    ]
  },
  {
    "id": "adadah",
    "name": "Adadah",
    "lat": 31.15214,
    "lng": 34.97907,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "adam",
    "name": "Adam",
    "lat": 32.10393,
    "lng": 35.54679,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "adamah",
    "name": "Adamah",
    "lat": 32.79972,
    "lng": 35.45972,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "adami-nekeb",
    "name": "Adami-Nekeb",
    "lat": 32.74917,
    "lng": 35.45917,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Nekeb"
    ]
  },
  {
    "id": "adar",
    "name": "Adar",
    "lat": 30.64979,
    "lng": 34.42222,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Adar"
    ]
  },
  {
    "id": "aditaim",
    "name": "Aditaim",
    "lat": 31.96332,
    "lng": 34.95176,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "admah",
    "name": "Admah",
    "lat": 31.15214,
    "lng": 35.42979,
    "type": "region",
    "books": [
      "bereshit",
      "devarim",
      "hoshea"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "adoraim",
    "name": "Adoraim",
    "lat": 31.50506,
    "lng": 35.0275,
    "type": "city",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "adulam",
    "name": "Adulam",
    "lat": 31.65167,
    "lng": 35.00167,
    "type": "city",
    "books": [
      "bereshit",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "mija",
      "nehemia",
      "shmuela",
      "shmuelb",
      "yehoshua"
    ],
    "periods": [
      "Patriarchs",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "adumim",
    "name": "Adumim",
    "lat": 31.8247,
    "lng": 35.37872,
    "type": "river",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Pass of Adummim",
      "Ascent of Adummim"
    ]
  },
  {
    "id": "ahava",
    "name": "Ahava",
    "lat": 32.56634,
    "lng": 44.42222,
    "type": "water",
    "books": [
      "ezra"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Ahava Canal",
      "Ahava River"
    ]
  },
  {
    "id": "ahlab",
    "name": "Ahlab",
    "lat": 33.3178,
    "lng": 35.24337,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ai-1",
    "name": "Ai 1",
    "lat": 31.91694,
    "lng": 35.26111,
    "type": "city",
    "books": [
      "bereshit",
      "yehoshua"
    ],
    "periods": [
      "Patriarchs",
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ai-2",
    "name": "Ai 2",
    "lat": 31.42602,
    "lng": 35.91095,
    "type": "region",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "ai-3",
    "name": "Ai 3",
    "lat": 31.91694,
    "lng": 35.26111,
    "type": "city",
    "books": [
      "ezra",
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "aiat",
    "name": "Aiat",
    "lat": 31.91694,
    "lng": 35.26111,
    "type": "city",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "aiya",
    "name": "Aiya",
    "lat": 31.91694,
    "lng": 35.26111,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "aiyalon-1",
    "name": "Aiyalon 1",
    "lat": 31.84111,
    "lng": 35.02361,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "shmuela",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "aiyalon-2",
    "name": "Aiyalon 2",
    "lat": 32.7689,
    "lng": 35.2733,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ain-1",
    "name": "Ain 1",
    "lat": 32.71865,
    "lng": 35.66791,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "ain-2",
    "name": "Ain 2",
    "lat": 31.37124,
    "lng": 34.86489,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "ain-3",
    "name": "Ain 3",
    "lat": 31.28137,
    "lng": 34.7974,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "akrabim",
    "name": "Akrabim",
    "lat": 30.90674,
    "lng": 35.13165,
    "type": "river",
    "books": [
      "bamidbar",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": [
      "Scorpion Pass",
      "Scorpion Ascent",
      "Scorpions’ Ascent",
      "Ascent of Akrabbim"
    ]
  },
  {
    "id": "alemet",
    "name": "Alemet",
    "lat": 31.8249,
    "lng": 35.2735,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Allemeth"
    ]
  },
  {
    "id": "alamelech",
    "name": "Alamelech",
    "lat": 32.77177,
    "lng": 35.15567,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Allammelek",
      "Alammelech",
      "Allamelech"
    ]
  },
  {
    "id": "alon",
    "name": "Alon",
    "lat": 32.72113,
    "lng": 35.41064,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "alon-bakut",
    "name": "Alon-Bakut",
    "lat": 31.92292,
    "lng": 35.24139,
    "type": "region",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Allon Bakuth",
      "Oak of Weeping",
      "Allon Bachuth"
    ]
  },
  {
    "id": "almon",
    "name": "Almon",
    "lat": 31.8249,
    "lng": 35.2735,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "almon-diblataim",
    "name": "Almon-Diblataim",
    "lat": 31.63873,
    "lng": 35.82658,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Almon-Diblatayim"
    ]
  },
  {
    "id": "alush",
    "name": "Alush",
    "lat": 28.82529,
    "lng": 33.77218,
    "type": "river",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "amad",
    "name": "Amad",
    "lat": 32.67395,
    "lng": 35.02333,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "amalek",
    "name": "Amalek",
    "lat": 30.9824,
    "lng": 34.5693,
    "type": "region",
    "books": [
      "bamidbar",
      "devarim",
      "divre-hayamim-a",
      "shemot",
      "shmuela",
      "shmuelb",
      "shoftim",
      "tehilim"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "amam",
    "name": "Amam",
    "lat": 31.2185,
    "lng": 34.90684,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "amana",
    "name": "Amana",
    "lat": 33.67251,
    "lng": 36.02519,
    "type": "region",
    "books": [
      "shir-hashirim"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Mount Amana"
    ]
  },
  {
    "id": "amaw",
    "name": "Amaw",
    "lat": 36.40924,
    "lng": 38.01869,
    "type": "region",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "amah",
    "name": "Amah",
    "lat": 31.8315,
    "lng": 35.27931,
    "type": "region",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "ammon",
    "name": "Ammon",
    "lat": 31.96355,
    "lng": 35.96883,
    "type": "region",
    "books": [
      "amosh",
      "bamidbar",
      "bereshit",
      "daniel",
      "devarim",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "melajimb",
      "nehemia",
      "shmuela",
      "shmuelb",
      "shoftim",
      "tehilim",
      "tzefania",
      "yehoshua",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "anab",
    "name": "Anab",
    "lat": 31.4121,
    "lng": 34.9549,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "anaharat",
    "name": "Anaharat",
    "lat": 32.65345,
    "lng": 35.46614,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ananiah",
    "name": "Ananiah",
    "lat": 31.77166,
    "lng": 35.2559,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "anatot",
    "name": "Anatot",
    "lat": 31.80752,
    "lng": 35.25758,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "ezra",
      "melajima",
      "nehemia",
      "shmuelb",
      "yehoshua",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "anem",
    "name": "Anem",
    "lat": 32.46079,
    "lng": 35.29875,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "aner",
    "name": "Aner",
    "lat": 32.52153,
    "lng": 35.21912,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "angle",
    "name": "Angle",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "nehemia"
    ],
    "periods": [
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "anim",
    "name": "Anim",
    "lat": 31.3536,
    "lng": 35.06352,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "afek-1",
    "name": "Afek 1",
    "lat": 32.8461,
    "lng": 35.1119,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "afek-2",
    "name": "Afek 2",
    "lat": 32.105,
    "lng": 34.93042,
    "type": "city",
    "books": [
      "shmuela",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "afek-3",
    "name": "Afek 3",
    "lat": 32.76667,
    "lng": 35.7,
    "type": "city",
    "books": [
      "melajima",
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "afek-4",
    "name": "Afek 4",
    "lat": 34.06917,
    "lng": 35.88611,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "afekah",
    "name": "Afekah",
    "lat": 31.4555,
    "lng": 34.9975,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "afik",
    "name": "Afik",
    "lat": 32.8461,
    "lng": 35.1119,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Aphek"
    ]
  },
  {
    "id": "ar",
    "name": "Ar",
    "lat": 31.28086,
    "lng": 35.75953,
    "type": "city",
    "books": [
      "bamidbar",
      "devarim",
      "yeshayahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "arab",
    "name": "Arab",
    "lat": 31.43188,
    "lng": 35.02957,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "arabah",
    "name": "Arabah",
    "lat": 31.09823,
    "lng": 35.34523,
    "type": "region",
    "books": [
      "devarim",
      "divre-hayamim-a",
      "melajimb",
      "shmuela",
      "shmuelb",
      "yehoshua",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Jordan Valley"
    ]
  },
  {
    "id": "arabia-1",
    "name": "Arabia 1",
    "lat": 23.56638,
    "lng": 48.69829,
    "type": "region",
    "books": [
      "divre-hayamim-b",
      "melajima",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "arad-1",
    "name": "Arad 1",
    "lat": 31.2172,
    "lng": 35.0258,
    "type": "city",
    "books": [
      "bamidbar",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "arad-2",
    "name": "Arad 2",
    "lat": 31.28083,
    "lng": 35.125,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "aram",
    "name": "Aram",
    "lat": 33.28859,
    "lng": 36.51849,
    "type": "region",
    "books": [
      "bamidbar",
      "divre-hayamim-a",
      "hoshea",
      "melajimb",
      "shmuelb",
      "shoftim",
      "zejaria"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Syria"
    ]
  },
  {
    "id": "aram-naharaim",
    "name": "Aram-Naharaim",
    "lat": 36.45589,
    "lng": 39.46389,
    "type": "region",
    "books": [
      "tehilim"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Mesopotamia"
    ]
  },
  {
    "id": "argob",
    "name": "Argob",
    "lat": 32.91278,
    "lng": 36.0145,
    "type": "region",
    "books": [
      "devarim",
      "melajima"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "ariel",
    "name": "Ariel",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "arnon",
    "name": "Arnon",
    "lat": 31.44818,
    "lng": 35.69688,
    "type": "water",
    "books": [
      "bamidbar",
      "shoftim",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "The Prophets"
    ],
    "aliases": [
      "Arnon River"
    ]
  },
  {
    "id": "aroer-1",
    "name": "Aroer 1",
    "lat": 31.4708,
    "lng": 35.81939,
    "type": "city",
    "books": [
      "bamidbar",
      "devarim",
      "divre-hayamim-a",
      "melajimb",
      "shmuelb",
      "shoftim",
      "yehoshua",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "aroer-2",
    "name": "Aroer 2",
    "lat": 31.92457,
    "lng": 35.92509,
    "type": "city",
    "books": [
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "aroer-3",
    "name": "Aroer 3",
    "lat": 31.15214,
    "lng": 34.97907,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "aroer-4",
    "name": "Aroer 4",
    "lat": 31.15214,
    "lng": 34.97907,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "arpad",
    "name": "Arpad",
    "lat": 36.4725,
    "lng": 37.09472,
    "type": "city",
    "books": [
      "melajimb",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "arubot",
    "name": "Arubot",
    "lat": 32.40731,
    "lng": 35.13355,
    "type": "city",
    "books": [
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Arubbot",
      "Aruboth"
    ]
  },
  {
    "id": "arumah",
    "name": "Arumah",
    "lat": 32.14756,
    "lng": 35.32158,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "arvad",
    "name": "Arvad",
    "lat": 34.85611,
    "lng": 35.85833,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Arvan"
    ]
  },
  {
    "id": "ashan",
    "name": "Ashan",
    "lat": 31.28137,
    "lng": 34.7974,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "ashdod",
    "name": "Ashdod",
    "lat": 31.7572,
    "lng": 34.6578,
    "type": "city",
    "books": [
      "amosh",
      "divre-hayamim-b",
      "nehemia",
      "shmuela",
      "tzefania",
      "yehoshua",
      "yeshayahu",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "ashkelon",
    "name": "Ashkelon",
    "lat": 31.66389,
    "lng": 34.54583,
    "type": "city",
    "books": [
      "amosh",
      "shmuela",
      "shmuelb",
      "shoftim",
      "tzefania",
      "yehoshua",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "ashkenaz",
    "name": "Ashkenaz",
    "lat": 42.64275,
    "lng": 53.84851,
    "type": "region",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Ashchenaz"
    ]
  },
  {
    "id": "ashnah-1",
    "name": "Ashnah 1",
    "lat": 31.78471,
    "lng": 35.0063,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ashnah-2",
    "name": "Ashnah 2",
    "lat": 31.55861,
    "lng": 34.97611,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ashtarot",
    "name": "Ashtarot",
    "lat": 32.80417,
    "lng": 36.01583,
    "type": "city",
    "books": [
      "devarim",
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "ashterot-karnaim",
    "name": "Ashterot-Karnaim",
    "lat": 32.80417,
    "lng": 36.01583,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "ashur",
    "name": "Ashur",
    "lat": 35.45667,
    "lng": 43.2625,
    "type": "city",
    "books": [
      "bamidbar",
      "tehilim",
      "yejezkel"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Ashur",
      "Assyria"
    ]
  },
  {
    "id": "assyria",
    "name": "Assyria",
    "lat": 35.94409,
    "lng": 42.64395,
    "type": "region",
    "books": [
      "bereshit",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "eja",
      "ezra",
      "hoshea",
      "melajimb",
      "mija",
      "nahum",
      "nehemia",
      "tzefania",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "atad",
    "name": "Atad",
    "lat": 30.92684,
    "lng": 33.98033,
    "type": "water",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "atarot-1",
    "name": "Atarot 1",
    "lat": 31.5753,
    "lng": 35.66594,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "atarot-2",
    "name": "Atarot 2",
    "lat": 31.88514,
    "lng": 35.21642,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "atarot-3",
    "name": "Atarot 3",
    "lat": 32.13993,
    "lng": 35.48497,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "atarot-adar",
    "name": "Atarot-Adar",
    "lat": 31.88514,
    "lng": 35.21642,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "atach",
    "name": "Atach",
    "lat": 31.61593,
    "lng": 34.8783,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Athak"
    ]
  },
  {
    "id": "atarim",
    "name": "Atarim",
    "lat": 31.00408,
    "lng": 34.87507,
    "type": "river",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "atrot-beit-yoab",
    "name": "Atrot-Beit-Yoab",
    "lat": 31.70504,
    "lng": 35.20764,
    "type": "region",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Ataroth-Beth-Joab",
      "Ataroth"
    ]
  },
  {
    "id": "atrot-shofan",
    "name": "Atrot-Shofan",
    "lat": 31.59131,
    "lng": 35.68742,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Atroth"
    ]
  },
  {
    "id": "aven",
    "name": "Aven",
    "lat": 31.92278,
    "lng": 35.24139,
    "type": "city",
    "books": [
      "hoshea"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "avit",
    "name": "Avit",
    "lat": 30.206,
    "lng": 35.60192,
    "type": "city",
    "books": [
      "bereshit",
      "divre-hayamim-a"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "ava",
    "name": "Ava",
    "lat": 34.68472,
    "lng": 36.69056,
    "type": "city",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Ava",
      "Arva"
    ]
  },
  {
    "id": "avim",
    "name": "Avim",
    "lat": 31.91694,
    "lng": 35.26111,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Avim"
    ]
  },
  {
    "id": "ayyah",
    "name": "Ayyah",
    "lat": 31.91694,
    "lng": 35.26111,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Aija",
      "Gaza"
    ]
  },
  {
    "id": "azal",
    "name": "Azal",
    "lat": 31.76155,
    "lng": 35.23421,
    "type": "water",
    "books": [
      "zejaria"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Azel"
    ]
  },
  {
    "id": "azekah",
    "name": "Azekah",
    "lat": 31.70023,
    "lng": 34.9357,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "nehemia",
      "shmuela",
      "yehoshua",
      "yirmiyahu"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "azmavet",
    "name": "Azmavet",
    "lat": 31.835,
    "lng": 35.26194,
    "type": "city",
    "books": [
      "ezra",
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Beth-azmaveth"
    ]
  },
  {
    "id": "azmon",
    "name": "Azmon",
    "lat": 30.6875,
    "lng": 34.33333,
    "type": "city",
    "books": [
      "bamidbar",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "aznot-tabor",
    "name": "Aznot-Tabor",
    "lat": 32.72722,
    "lng": 35.38444,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "baal-gad",
    "name": "Baal-Gad",
    "lat": 33.38333,
    "lng": 35.68333,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "baal-hamon",
    "name": "Baal-Hamon",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "shir-hashirim"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "baal-hazor",
    "name": "Baal-Hazor",
    "lat": 31.97861,
    "lng": 35.28611,
    "type": "city",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "baal-hermon",
    "name": "Baal-Hermon",
    "lat": 33.4,
    "lng": 35.85,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "baal-meon",
    "name": "Baal-Meon",
    "lat": 31.6795,
    "lng": 35.73532,
    "type": "city",
    "books": [
      "bamidbar",
      "divre-hayamim-a",
      "yehoshua",
      "yejezkel"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "baal-peor",
    "name": "Baal-Peor",
    "lat": 31.77702,
    "lng": 35.7385,
    "type": "city",
    "books": [
      "devarim",
      "hoshea"
    ],
    "periods": [
      "Exodus & Wilderness",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "baal-perazim",
    "name": "Baal-Perazim",
    "lat": 31.78522,
    "lng": 35.20473,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "baal-shalishah",
    "name": "Baal-Shalishah",
    "lat": 32.1525,
    "lng": 35.04417,
    "type": "city",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Baal Shalisha"
    ]
  },
  {
    "id": "baal-tamar",
    "name": "Baal-Tamar",
    "lat": 31.82457,
    "lng": 35.23072,
    "type": "region",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "baal-zefon",
    "name": "Baal-Zefon",
    "lat": 30.86056,
    "lng": 32.17139,
    "type": "city",
    "books": [
      "bamidbar",
      "shemot"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "baalah-1",
    "name": "Baalah 1",
    "lat": 31.14205,
    "lng": 34.91217,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "baalah-2",
    "name": "Baalah 2",
    "lat": 31.80896,
    "lng": 35.10378,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "baalat-1",
    "name": "Baalat 1",
    "lat": 31.83851,
    "lng": 34.78225,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "baalat-2",
    "name": "Baalat 2",
    "lat": 31.80896,
    "lng": 35.10378,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "baalat-beer",
    "name": "Baalat-Beer",
    "lat": 31.14205,
    "lng": 34.91217,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Baalath",
      "Baal"
    ]
  },
  {
    "id": "baale-yudah",
    "name": "Baale-Yudah",
    "lat": 31.80896,
    "lng": 35.10378,
    "type": "city",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Baalah in Judah",
      "Baalah of Judah",
      "Baale of Judah"
    ]
  },
  {
    "id": "bavel",
    "name": "Bavel",
    "lat": 32.54333,
    "lng": 44.42222,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Babylon"
    ]
  },
  {
    "id": "bavel-1",
    "name": "Bavel 1",
    "lat": 32.54333,
    "lng": 44.42222,
    "type": "city",
    "books": [
      "daniel",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "ester",
      "ezra",
      "melajimb",
      "mija",
      "nehemia",
      "tehilim",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "babylonia",
    "name": "Babylonia",
    "lat": 32.49942,
    "lng": 45.01038,
    "type": "region",
    "books": [
      "ezra",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Babylon"
    ]
  },
  {
    "id": "bahurim",
    "name": "Bahurim",
    "lat": 31.7912,
    "lng": 35.25694,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "melajima",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "balah",
    "name": "Balah",
    "lat": 31.14205,
    "lng": 34.91217,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "bamot",
    "name": "Bamot",
    "lat": 31.73179,
    "lng": 35.74089,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "bamot-baal",
    "name": "Bamot-Baal",
    "lat": 31.73179,
    "lng": 35.74089,
    "type": "city",
    "books": [
      "bamidbar",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "bashan",
    "name": "Bashan",
    "lat": 33.0514,
    "lng": 36.10612,
    "type": "region",
    "books": [
      "amosh",
      "bamidbar",
      "devarim",
      "divre-hayamim-a",
      "melajima",
      "melajimb",
      "mija",
      "nahum",
      "nehemia",
      "tehilim",
      "yehoshua",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "bat-rabim",
    "name": "Bat-Rabim",
    "lat": 31.80081,
    "lng": 35.80906,
    "type": "city",
    "books": [
      "shir-hashirim"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Beth Rabbim"
    ]
  },
  {
    "id": "bealot-1",
    "name": "Bealot 1",
    "lat": 31.78126,
    "lng": 35.05111,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "bealot-2",
    "name": "Bealot 2",
    "lat": 31.80896,
    "lng": 35.10378,
    "type": "city",
    "books": [
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Aloth"
    ]
  },
  {
    "id": "beer-1",
    "name": "Beer 1",
    "lat": 31.60254,
    "lng": 35.93442,
    "type": "river",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "beer-2",
    "name": "Beer 2",
    "lat": 32.60823,
    "lng": 35.50415,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beer-elim",
    "name": "Beer-Elim",
    "lat": 31.60254,
    "lng": 35.93442,
    "type": "river",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "beer-lahai-roi",
    "name": "Beer-Lahai-Roi",
    "lat": 30.6875,
    "lng": 34.33333,
    "type": "water",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Lahai-roi"
    ]
  },
  {
    "id": "beerot",
    "name": "Beerot",
    "lat": 31.90514,
    "lng": 35.21496,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "ezra",
      "nehemia",
      "shmuelb",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "beerot-bene-yaakan",
    "name": "Beerot Bene-Yaakan",
    "lat": 30.79176,
    "lng": 34.47252,
    "type": "city",
    "books": [
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "beersheba-1",
    "name": "Beersheba 1",
    "lat": 31.24472,
    "lng": 34.84083,
    "type": "city",
    "books": [
      "amosh",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "melajimb",
      "nehemia",
      "shmuela",
      "shmuelb",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Beer-sheba"
    ]
  },
  {
    "id": "beersheba-2",
    "name": "Beersheba 2",
    "lat": 31.24472,
    "lng": 34.84083,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Beer-sheba"
    ]
  },
  {
    "id": "beeshterah",
    "name": "Beeshterah",
    "lat": 32.80417,
    "lng": 36.01583,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Be Eshterah",
      "Beeshtarah",
      "Eshtarah",
      "Beesh-terah"
    ]
  },
  {
    "id": "bene-berak",
    "name": "Bene-Berak",
    "lat": 32.03668,
    "lng": 34.82767,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "bene-yaakan",
    "name": "Bene-Yaakan",
    "lat": 30.79176,
    "lng": 34.47252,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "benyamin-gate",
    "name": "Benyamin Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Gate of Benjamin"
    ]
  },
  {
    "id": "beon",
    "name": "Beon",
    "lat": 31.6795,
    "lng": 35.73532,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "bered",
    "name": "Bered",
    "lat": 31.097,
    "lng": 34.652,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "berotah",
    "name": "Berotah",
    "lat": 33.93528,
    "lng": 36.15083,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Berothath"
    ]
  },
  {
    "id": "berotai",
    "name": "Berotai",
    "lat": 33.93528,
    "lng": 36.15083,
    "type": "city",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "besor",
    "name": "Besor",
    "lat": 31.17713,
    "lng": 34.57404,
    "type": "water",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Besor Valley",
      "Wadi Besor",
      "Brook Besor"
    ]
  },
  {
    "id": "beten",
    "name": "Beten",
    "lat": 32.76408,
    "lng": 35.10658,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-anat",
    "name": "Beit-Anat",
    "lat": 33.20028,
    "lng": 35.43306,
    "type": "city",
    "books": [
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-anot",
    "name": "Beit-Anot",
    "lat": 31.56209,
    "lng": 35.12622,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-arabah",
    "name": "Beit-Arabah",
    "lat": 31.84578,
    "lng": 35.50172,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-arbel",
    "name": "Beit-Arbel",
    "lat": 32.55866,
    "lng": 35.84759,
    "type": "city",
    "books": [
      "hoshea"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "beit-ashbea",
    "name": "Beit-Ashbea",
    "lat": 31.4558,
    "lng": 34.9098,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Ashbea"
    ]
  },
  {
    "id": "beit-aven-1",
    "name": "Beit-Aven 1",
    "lat": 31.86921,
    "lng": 35.26807,
    "type": "city",
    "books": [
      "shmuela",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "beit-aven-2",
    "name": "Beit-Aven 2",
    "lat": 31.92278,
    "lng": 35.24139,
    "type": "city",
    "books": [
      "hoshea"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "beit-barah",
    "name": "Beit-Barah",
    "lat": 32.14099,
    "lng": 35.49156,
    "type": "water",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-biri",
    "name": "Beit-Biri",
    "lat": 31.00669,
    "lng": 34.49181,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Beth-birei"
    ]
  },
  {
    "id": "beit-kar",
    "name": "Beit-Kar",
    "lat": 31.895,
    "lng": 35.08361,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Beth Kar"
    ]
  },
  {
    "id": "beit-dagon-1",
    "name": "Beit-Dagon 1",
    "lat": 31.98358,
    "lng": 34.80862,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-dagon-2",
    "name": "Beit-Dagon 2",
    "lat": 32.75885,
    "lng": 35.09027,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-diblataim",
    "name": "Beit-Diblataim",
    "lat": 31.63873,
    "lng": 35.82658,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "beit-eden",
    "name": "Beit-Eden",
    "lat": 36.2748,
    "lng": 38.82961,
    "type": "region",
    "books": [
      "amosh"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Eden"
    ]
  },
  {
    "id": "beit-eked",
    "name": "Beit-Eked",
    "lat": 32.4697,
    "lng": 35.3563,
    "type": "city",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "beit-emek",
    "name": "Beit-Emek",
    "lat": 32.96583,
    "lng": 35.15194,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Beth Emeck"
    ]
  },
  {
    "id": "beit-ezel",
    "name": "Beit-Ezel",
    "lat": 31.46854,
    "lng": 34.93806,
    "type": "city",
    "books": [
      "mija"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Beth-ha-Ezel"
    ]
  },
  {
    "id": "beit-gader",
    "name": "Beit-Gader",
    "lat": 31.3821,
    "lng": 34.6065,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "beit-gamul",
    "name": "Beit-Gamul",
    "lat": 31.4835,
    "lng": 35.89991,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "beit-gilgal",
    "name": "Beit-Gilgal",
    "lat": 31.88188,
    "lng": 35.45997,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Gilgal"
    ]
  },
  {
    "id": "beit-hacherem",
    "name": "Beit-Hacherem",
    "lat": 31.7399,
    "lng": 35.2169,
    "type": "city",
    "books": [
      "nehemia",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Beth Hakkerem",
      "Beth Haccerem"
    ]
  },
  {
    "id": "beit-hagan",
    "name": "Beit-Hagan",
    "lat": 32.46079,
    "lng": 35.29875,
    "type": "city",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Beth-Haggen"
    ]
  },
  {
    "id": "beit-haram",
    "name": "Beit-Haram",
    "lat": 31.81926,
    "lng": 35.67188,
    "type": "city",
    "books": [
      "bamidbar",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": [
      "Beth Haran",
      "Beth-aram"
    ]
  },
  {
    "id": "beit-hoglah",
    "name": "Beit-Hoglah",
    "lat": 31.82038,
    "lng": 35.50116,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-horon",
    "name": "Beit-Horon",
    "lat": 31.895,
    "lng": 35.08361,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "shmuela",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "beit-yeshimot",
    "name": "Beit-Yeshimot",
    "lat": 31.78255,
    "lng": 35.62125,
    "type": "city",
    "books": [
      "bamidbar",
      "yehoshua",
      "yejezkel"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "beit-le-afrah",
    "name": "Beit-Le-Afrah",
    "lat": 31.55659,
    "lng": 35.03355,
    "type": "city",
    "books": [
      "mija"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Beth Ophrah",
      "Beth-leaphrah",
      "Beth Aphrah",
      "Aphrah"
    ]
  },
  {
    "id": "beit-lebaot",
    "name": "Beit-Lebaot",
    "lat": 31.00669,
    "lng": 34.49181,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-markabot",
    "name": "Beit-Markabot",
    "lat": 31.35027,
    "lng": 34.92858,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Beth Markaboth"
    ]
  },
  {
    "id": "beit-meon",
    "name": "Beit-Meon",
    "lat": 31.6795,
    "lng": 35.73532,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "beit-milo",
    "name": "Beit-Milo",
    "lat": 32.21361,
    "lng": 35.28194,
    "type": "city",
    "books": [
      "melajimb",
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Millo"
    ]
  },
  {
    "id": "beit-nimrah",
    "name": "Beit-Nimrah",
    "lat": 31.90911,
    "lng": 35.63872,
    "type": "city",
    "books": [
      "bamidbar",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-pazez",
    "name": "Beit-Pazez",
    "lat": 32.6804,
    "lng": 35.4863,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-pelet",
    "name": "Beit-Pelet",
    "lat": 31.30992,
    "lng": 34.9078,
    "type": "city",
    "books": [
      "nehemia",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Return & Second Temple"
    ],
    "aliases": [
      "Beth-phelet"
    ]
  },
  {
    "id": "beit-peor",
    "name": "Beit-Peor",
    "lat": 31.77702,
    "lng": 35.7385,
    "type": "city",
    "books": [
      "devarim",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-rehob",
    "name": "Beit-Rehob",
    "lat": 33.88951,
    "lng": 36.04811,
    "type": "region",
    "books": [
      "shmuelb",
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "beit-shan",
    "name": "Beit-Shan",
    "lat": 32.50361,
    "lng": 35.50306,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "melajima",
      "shmuela",
      "shmuelb",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": [
      "Beth-shean"
    ]
  },
  {
    "id": "beit-shemesh-1",
    "name": "Beit-Shemesh 1",
    "lat": 31.75062,
    "lng": 34.97474,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "melajimb",
      "shmuela",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "beit-shemesh-2",
    "name": "Beit-Shemesh 2",
    "lat": 32.68776,
    "lng": 35.52524,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-shemesh-3",
    "name": "Beit-Shemesh 3",
    "lat": 33.04128,
    "lng": 35.33275,
    "type": "city",
    "books": [
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-shitah",
    "name": "Beit-Shitah",
    "lat": 32.32307,
    "lng": 35.59329,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Acacia House",
      "Beth Acacia"
    ]
  },
  {
    "id": "beit-tapuah",
    "name": "Beit-Tapuah",
    "lat": 31.53856,
    "lng": 35.04622,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beit-togarmah",
    "name": "Beit-Togarmah",
    "lat": 38.7225,
    "lng": 37.2775,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Togarmah"
    ]
  },
  {
    "id": "beit-zur",
    "name": "Beit-Zur",
    "lat": 31.58938,
    "lng": 35.09416,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "nehemia",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "beit-el-1",
    "name": "Beit-El 1",
    "lat": 31.92278,
    "lng": 35.24139,
    "type": "city",
    "books": [
      "amosh",
      "bereshit",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "ezra",
      "hoshea",
      "melajima",
      "melajimb",
      "nehemia",
      "shmuela",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Patriarchs",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Beth-el"
    ]
  },
  {
    "id": "beit-el-2",
    "name": "Beit-El 2",
    "lat": 31.34495,
    "lng": 35.12438,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Beth-el"
    ]
  },
  {
    "id": "beit-el-3",
    "name": "Beit-El 3",
    "lat": 31.92278,
    "lng": 35.24139,
    "type": "city",
    "books": [
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Beth-el"
    ]
  },
  {
    "id": "beter-1",
    "name": "Beter 1",
    "lat": 31.73073,
    "lng": 35.13556,
    "type": "region",
    "books": [
      "shir-hashirim"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "beit-lechem-1",
    "name": "Beit-Lechem 1",
    "lat": 31.70431,
    "lng": 35.20764,
    "type": "city",
    "books": [
      "bereshit",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "ezra",
      "mija",
      "nehemia",
      "rut",
      "shmuela",
      "shmuelb",
      "shoftim",
      "yirmiyahu"
    ],
    "periods": [
      "Patriarchs",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Beth-lehem"
    ]
  },
  {
    "id": "beit-lechem-2",
    "name": "Beit-Lechem 2",
    "lat": 32.73481,
    "lng": 35.18556,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Beth-lehem"
    ]
  },
  {
    "id": "beit-lechem-3",
    "name": "Beit-Lechem 3",
    "lat": 32.73481,
    "lng": 35.18556,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Beth-lehem"
    ]
  },
  {
    "id": "betuel",
    "name": "Betuel",
    "lat": 31.58938,
    "lng": 35.09416,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "betul",
    "name": "Betul",
    "lat": 31.58938,
    "lng": 35.09416,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "betonim",
    "name": "Betonim",
    "lat": 32.01057,
    "lng": 35.71074,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "beyond-the-river",
    "name": "Beyond the River",
    "lat": 33.34803,
    "lng": 36.17321,
    "type": "region",
    "books": [
      "ezra",
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Trans-Euphrates"
    ]
  },
  {
    "id": "bezek-1",
    "name": "Bezek 1",
    "lat": 32.36884,
    "lng": 35.39736,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "bezek-2",
    "name": "Bezek 2",
    "lat": 32.36884,
    "lng": 35.39736,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "bezer",
    "name": "Bezer",
    "lat": 31.78603,
    "lng": 35.90168,
    "type": "city",
    "books": [
      "devarim",
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "bileam",
    "name": "Bileam",
    "lat": 32.4462,
    "lng": 35.292,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "bilhah",
    "name": "Bilhah",
    "lat": 31.14205,
    "lng": 34.91217,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "bochim",
    "name": "Bochim",
    "lat": 31.92278,
    "lng": 35.24139,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Bokim"
    ]
  },
  {
    "id": "bor-ashan",
    "name": "Bor-Ashan",
    "lat": 31.28137,
    "lng": 34.7974,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Chorashan",
      "Chor-ashan"
    ]
  },
  {
    "id": "bozez",
    "name": "Bozez",
    "lat": 31.85716,
    "lng": 35.28715,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "bozkat",
    "name": "Bozkat",
    "lat": 31.53687,
    "lng": 34.91318,
    "type": "city",
    "books": [
      "melajimb",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "bozrah-1",
    "name": "Bozrah 1",
    "lat": 30.74584,
    "lng": 35.60392,
    "type": "city",
    "books": [
      "amosh",
      "bereshit",
      "divre-hayamim-a",
      "mija",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "bozrah-2",
    "name": "Bozrah 2",
    "lat": 31.78603,
    "lng": 35.90168,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "broad-wall",
    "name": "Broad Wall",
    "lat": 31.77608,
    "lng": 35.23189,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "brook-of-mitzrayim",
    "name": "Brook of Mitzrayim",
    "lat": 30.92684,
    "lng": 33.98033,
    "type": "water",
    "books": [
      "bamidbar",
      "divre-hayamim-b",
      "melajima",
      "melajimb",
      "yehoshua",
      "yejezkel",
      "yeshayahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Wadi of Egypt",
      "Stream of Egypt",
      "Egypt"
    ]
  },
  {
    "id": "brook-of-the-arabah",
    "name": "Brook of the Arabah",
    "lat": 30.95569,
    "lng": 35.7095,
    "type": "water",
    "books": [
      "amosh"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Wadi Arabah",
      "Arabah Valley",
      "Valley of the Arabah"
    ]
  },
  {
    "id": "brook-of-the-willows",
    "name": "Brook of the Willows",
    "lat": 30.95569,
    "lng": 35.7095,
    "type": "water",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Ravine of the Poplars",
      "Wadi of the Willows",
      "Stream of the Poplars",
      "Ravine of Willows"
    ]
  },
  {
    "id": "buz",
    "name": "Buz",
    "lat": 27.9113,
    "lng": 38.1171,
    "type": "region",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "kabon",
    "name": "Kabon",
    "lat": 31.35027,
    "lng": 34.92858,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Kabbon"
    ]
  },
  {
    "id": "kabul-1",
    "name": "Kabul 1",
    "lat": 32.86833,
    "lng": 35.21139,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Kabul"
    ]
  },
  {
    "id": "kalah",
    "name": "Kalah",
    "lat": 36.09806,
    "lng": 43.32889,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "kaleb-efratah",
    "name": "Kaleb Efratah",
    "lat": 31.70431,
    "lng": 35.20764,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Caleb-ephratah"
    ]
  },
  {
    "id": "kalneh-1",
    "name": "Kalneh 1",
    "lat": 32.12611,
    "lng": 45.23083,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Kalneh"
    ]
  },
  {
    "id": "kalneh-2",
    "name": "Kalneh 2",
    "lat": 36.29257,
    "lng": 37.20553,
    "type": "city",
    "books": [
      "amosh",
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Kalno"
    ]
  },
  {
    "id": "canaan",
    "name": "Canaan",
    "lat": 32.37061,
    "lng": 35.26975,
    "type": "region",
    "books": [
      "bamidbar",
      "bereshit",
      "daniel",
      "devarim",
      "divre-hayamim-a",
      "ovadia",
      "shemot",
      "shoftim",
      "tehilim",
      "tzefania",
      "vaikra",
      "yehoshua",
      "yejezkel",
      "yeshayahu"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "kaneh",
    "name": "Kaneh",
    "lat": 36.29257,
    "lng": 37.20553,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Kanneh"
    ]
  },
  {
    "id": "kaftor",
    "name": "Kaftor",
    "lat": 35.30051,
    "lng": 24.87574,
    "type": "region",
    "books": [
      "amosh",
      "bereshit",
      "devarim",
      "divre-hayamim-a",
      "yirmiyahu"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Crete"
    ]
  },
  {
    "id": "karchemish",
    "name": "Karchemish",
    "lat": 36.82972,
    "lng": 38.015,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "karmel-1",
    "name": "Karmel 1",
    "lat": 31.42288,
    "lng": 35.13295,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "shmuela",
      "shmuelb",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "kasifia",
    "name": "Kasifia",
    "lat": 32.49942,
    "lng": 45.01038,
    "type": "region",
    "books": [
      "ezra"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Kasiphia"
    ]
  },
  {
    "id": "chaldea",
    "name": "Chaldea",
    "lat": 31.38143,
    "lng": 46.36117,
    "type": "region",
    "books": [
      "bereshit",
      "daniel",
      "divre-hayamim-b",
      "habakuk",
      "iyov",
      "melajimb",
      "nehemia",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Babylonia"
    ]
  },
  {
    "id": "chebar",
    "name": "Chebar",
    "lat": 31.98376,
    "lng": 45.18437,
    "type": "water",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Kebar River",
      "Chebar Canal",
      "River Chebar"
    ]
  },
  {
    "id": "chefar-amoni",
    "name": "Chefar-Amoni",
    "lat": 31.96609,
    "lng": 35.24758,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Kephar Ammoni",
      "Chephar Haammoni",
      "Chephar-haammonai"
    ]
  },
  {
    "id": "chefirah",
    "name": "Chefirah",
    "lat": 31.8309,
    "lng": 35.10677,
    "type": "city",
    "books": [
      "ezra",
      "nehemia",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Return & Second Temple"
    ],
    "aliases": [
      "Kephirah"
    ]
  },
  {
    "id": "cherit",
    "name": "Cherit",
    "lat": 32.39919,
    "lng": 35.66923,
    "type": "water",
    "books": [
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Kerith Ravine",
      "Wadi Cherith",
      "Kerith Valley",
      "Kerith Brook",
      "Brook Cherith",
      "Wadi Kerith"
    ]
  },
  {
    "id": "chesalon",
    "name": "Chesalon",
    "lat": 31.78111,
    "lng": 35.05111,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Kesalon"
    ]
  },
  {
    "id": "chesil",
    "name": "Chesil",
    "lat": 31.58938,
    "lng": 35.09416,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Kesil"
    ]
  },
  {
    "id": "chesulot",
    "name": "Chesulot",
    "lat": 32.68337,
    "lng": 35.32419,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Kesulloth"
    ]
  },
  {
    "id": "chezib",
    "name": "Chezib",
    "lat": 31.64207,
    "lng": 34.95302,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Kezib"
    ]
  },
  {
    "id": "chilmad",
    "name": "Chilmad",
    "lat": 34.50728,
    "lng": 49.10749,
    "type": "region",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Kilmad"
    ]
  },
  {
    "id": "chineret",
    "name": "Chineret",
    "lat": 32.86944,
    "lng": 35.53833,
    "type": "city",
    "books": [
      "devarim",
      "melajima",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Kinnereth"
    ]
  },
  {
    "id": "chislot-tabor",
    "name": "Chislot-Tabor",
    "lat": 32.68337,
    "lng": 35.32419,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Kisloth Tabor",
      "Kislot-Tabor"
    ]
  },
  {
    "id": "chitlish",
    "name": "Chitlish",
    "lat": 31.511,
    "lng": 34.79914,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Kitlish",
      "Kithlish"
    ]
  },
  {
    "id": "city-of-david",
    "name": "City of David",
    "lat": 31.77361,
    "lng": 35.23556,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "melajimb",
      "nehemia",
      "shmuelb",
      "yeshayahu"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "city-of-destruction",
    "name": "City of Destruction",
    "lat": 30.12944,
    "lng": 31.3075,
    "type": "city",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "City of the Sun"
    ]
  },
  {
    "id": "city-of-palms-1",
    "name": "City of Palms 1",
    "lat": 31.87172,
    "lng": 35.44456,
    "type": "city",
    "books": [
      "devarim",
      "divre-hayamim-b",
      "shoftim"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "city-of-palms-2",
    "name": "City of Palms 2",
    "lat": 31.87172,
    "lng": 35.44456,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "city-of-salt",
    "name": "City of Salt",
    "lat": 31.74083,
    "lng": 35.45861,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "corner-gate",
    "name": "Corner Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "melajimb",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "kozeba",
    "name": "Kozeba",
    "lat": 31.64207,
    "lng": 34.95302,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Kozeba",
      "Chozeba"
    ]
  },
  {
    "id": "crete",
    "name": "Crete",
    "lat": 35.30051,
    "lng": 24.87574,
    "type": "region",
    "books": [
      "tzefania"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "kun",
    "name": "Kun",
    "lat": 34.25972,
    "lng": 36.42361,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Kun",
      "Chun"
    ]
  },
  {
    "id": "kut",
    "name": "Kut",
    "lat": 32.76003,
    "lng": 44.61286,
    "type": "city",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Kuthah",
      "Cuthah",
      "Cush"
    ]
  },
  {
    "id": "cyprus",
    "name": "Cyprus",
    "lat": 35.06963,
    "lng": 33.28405,
    "type": "region",
    "books": [
      "yejezkel",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "dabeshet",
    "name": "Dabeshet",
    "lat": 32.67028,
    "lng": 35.155,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Dabbasheth"
    ]
  },
  {
    "id": "daberat",
    "name": "Daberat",
    "lat": 32.69728,
    "lng": 35.37753,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "dameseq",
    "name": "Dameseq",
    "lat": 33.51111,
    "lng": 36.30639,
    "type": "city",
    "books": [
      "amosh",
      "bereshit",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "melajimb",
      "shir-hashirim",
      "shmuelb",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Patriarchs",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "dan",
    "name": "Dan",
    "lat": 33.249,
    "lng": 35.652,
    "type": "city",
    "books": [
      "daniel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "danah",
    "name": "Danah",
    "lat": 31.55861,
    "lng": 34.97611,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "debir-1",
    "name": "Debir 1",
    "lat": 31.43209,
    "lng": 35.01485,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "debir-2",
    "name": "Debir 2",
    "lat": 31.81154,
    "lng": 35.34878,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "debir-3",
    "name": "Debir 3",
    "lat": 32.56576,
    "lng": 35.61221,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Lo-debar"
    ]
  },
  {
    "id": "dedan",
    "name": "Dedan",
    "lat": 26.65,
    "lng": 37.91667,
    "type": "city",
    "books": [
      "yejezkel",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "dibon-1",
    "name": "Dibon 1",
    "lat": 31.50224,
    "lng": 35.77657,
    "type": "city",
    "books": [
      "bamidbar",
      "yehoshua",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "dibon-2",
    "name": "Dibon 2",
    "lat": 31.29606,
    "lng": 35.1562,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "dibon-3",
    "name": "Dibon 3",
    "lat": 31.50224,
    "lng": 35.77657,
    "type": "city",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Dimon"
    ]
  },
  {
    "id": "dilean",
    "name": "Dilean",
    "lat": 31.50259,
    "lng": 34.7583,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Dilan"
    ]
  },
  {
    "id": "dimnah",
    "name": "Dimnah",
    "lat": 32.78806,
    "lng": 35.31056,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "dimonah",
    "name": "Dimonah",
    "lat": 31.50224,
    "lng": 35.77657,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "dinhabah",
    "name": "Dinhabah",
    "lat": 31.79846,
    "lng": 35.72238,
    "type": "city",
    "books": [
      "bereshit",
      "divre-hayamim-a"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "diviners-oak",
    "name": "Diviners’ Oak",
    "lat": 32.21364,
    "lng": 35.28194,
    "type": "region",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Elon-meonenim",
      "Oak Tree of the Diviners",
      "Diviners’ Terebinth Tree",
      "Meonenim"
    ]
  },
  {
    "id": "dizahab",
    "name": "Dizahab",
    "lat": 31.8066,
    "lng": 36.05075,
    "type": "city",
    "books": [
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Di-zahab"
    ]
  },
  {
    "id": "dofkah",
    "name": "Dofkah",
    "lat": 29.03673,
    "lng": 33.45941,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "dor",
    "name": "Dor",
    "lat": 32.61743,
    "lng": 34.91636,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "dotan",
    "name": "Dotan",
    "lat": 32.41353,
    "lng": 35.23986,
    "type": "city",
    "books": [
      "bereshit",
      "melajimb"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "dragon-spring",
    "name": "Dragon Spring",
    "lat": 31.7672,
    "lng": 35.23598,
    "type": "water",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Jackal Well",
      "Dragon’s Spring",
      "Well of the Dragons",
      "Jackal’s Well",
      "Serpent’s Well",
      "Serpent Well"
    ]
  },
  {
    "id": "dumah-1",
    "name": "Dumah 1",
    "lat": 31.4306,
    "lng": 34.9861,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "dumah-2",
    "name": "Dumah 2",
    "lat": 30.53954,
    "lng": 35.35415,
    "type": "region",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Edom"
    ]
  },
  {
    "id": "dung-gate",
    "name": "Dung Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Refuse Gate"
    ]
  },
  {
    "id": "dura",
    "name": "Dura",
    "lat": 32.34197,
    "lng": 44.42779,
    "type": "region",
    "books": [
      "daniel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "east",
    "name": "East",
    "lat": 31.89458,
    "lng": 36.20398,
    "type": "region",
    "books": [
      "bamidbar",
      "bereshit",
      "iyov",
      "melajima",
      "shoftim",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "east-gate",
    "name": "East Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "nehemia",
      "yejezkel"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "east-square",
    "name": "East Square",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "ebenezer-1",
    "name": "Ebenezer 1",
    "lat": 32.1046,
    "lng": 34.9645,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Eben-ezer"
    ]
  },
  {
    "id": "ebenezer-2",
    "name": "Ebenezer 2",
    "lat": 31.93192,
    "lng": 35.22565,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Eben-ezer"
    ]
  },
  {
    "id": "ebez",
    "name": "Ebez",
    "lat": 32.65806,
    "lng": 35.50583,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Abez"
    ]
  },
  {
    "id": "ebron",
    "name": "Ebron",
    "lat": 33.04769,
    "lng": 35.16192,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Abdon",
      "Hebron"
    ]
  },
  {
    "id": "ekbatana",
    "name": "Ekbatana",
    "lat": 34.8065,
    "lng": 48.51625,
    "type": "city",
    "books": [
      "ezra"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Achmetha"
    ]
  },
  {
    "id": "eden-1",
    "name": "Eden 1",
    "lat": 32.49942,
    "lng": 45.01038,
    "type": "region",
    "books": [
      "bereshit",
      "yejezkel",
      "yeshayahu",
      "yoel"
    ],
    "periods": [
      "Patriarchs",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "eder-1",
    "name": "Eder 1",
    "lat": 31.70731,
    "lng": 35.23011,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Migdal Eder",
      "Tower of Eder",
      "Edar"
    ]
  },
  {
    "id": "eder-2",
    "name": "Eder 2",
    "lat": 31.28083,
    "lng": 35.125,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "edom",
    "name": "Edom",
    "lat": 30.53954,
    "lng": 35.35415,
    "type": "region",
    "books": [
      "amosh",
      "bamidbar",
      "bereshit",
      "daniel",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "eja",
      "malaji",
      "melajima",
      "melajimb",
      "ovadia",
      "shemot",
      "shmuela",
      "shmuelb",
      "shoftim",
      "tehilim",
      "yehoshua",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "yoel"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "edrei-1",
    "name": "Edrei 1",
    "lat": 32.62528,
    "lng": 36.10611,
    "type": "city",
    "books": [
      "bamidbar",
      "devarim",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "edrei-2",
    "name": "Edrei 2",
    "lat": 33.07583,
    "lng": 35.52833,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "eglaim",
    "name": "Eglaim",
    "lat": 31.18085,
    "lng": 35.71263,
    "type": "city",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "eglat-shelishiyah",
    "name": "Eglat-Shelishiyah",
    "lat": 31.20994,
    "lng": 35.44922,
    "type": "region",
    "books": [
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "eglon",
    "name": "Eglon",
    "lat": 31.49181,
    "lng": 34.92806,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "mitzrayim",
    "name": "Mitzrayim",
    "lat": 28.47113,
    "lng": 32.04806,
    "type": "region",
    "books": [
      "amosh",
      "bamidbar",
      "bereshit",
      "daniel",
      "devarim",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "eja",
      "hoshea",
      "jagai",
      "melajima",
      "melajimb",
      "mija",
      "mishle",
      "nahum",
      "nehemia",
      "shemot",
      "shmuela",
      "shmuelb",
      "shoftim",
      "tehilim",
      "vaikra",
      "yehoshua",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "yoel",
      "zejaria"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "ekron",
    "name": "Ekron",
    "lat": 31.7775,
    "lng": 34.85194,
    "type": "city",
    "books": [
      "amosh",
      "melajimb",
      "shmuela",
      "shoftim",
      "tzefania",
      "yehoshua",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "el-beit-el",
    "name": "El-Beit-El",
    "lat": 31.92278,
    "lng": 35.24139,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "El-beth-el"
    ]
  },
  {
    "id": "el-paran",
    "name": "El-Paran",
    "lat": 29.53068,
    "lng": 35,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "elam",
    "name": "Elam",
    "lat": 32.09161,
    "lng": 48.47269,
    "type": "region",
    "books": [
      "bereshit",
      "daniel",
      "ezra",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Patriarchs",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "elat",
    "name": "Elat",
    "lat": 29.53068,
    "lng": 35,
    "type": "city",
    "books": [
      "devarim",
      "divre-hayamim-b",
      "melajima",
      "melajimb"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Kingdom Era"
    ],
    "aliases": [
      "Elat"
    ]
  },
  {
    "id": "elealeh",
    "name": "Elealeh",
    "lat": 31.81931,
    "lng": 35.82832,
    "type": "city",
    "books": [
      "bamidbar",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "elim",
    "name": "Elim",
    "lat": 29.31318,
    "lng": 33.01011,
    "type": "river",
    "books": [
      "bamidbar",
      "shemot"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "elishah",
    "name": "Elishah",
    "lat": 35.06963,
    "lng": 33.28405,
    "type": "region",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Cyprus"
    ]
  },
  {
    "id": "elkosh",
    "name": "Elkosh",
    "lat": 31.59296,
    "lng": 34.89824,
    "type": "city",
    "books": [
      "nahum"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "elasar",
    "name": "Elasar",
    "lat": 37.71472,
    "lng": 41.41306,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "elon",
    "name": "Elon",
    "lat": 31.84111,
    "lng": 35.02361,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "elonbet-hanan",
    "name": "Elonbet-Hanan",
    "lat": 31.84111,
    "lng": 35.02361,
    "type": "city",
    "books": [
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Elon Bethhanan",
      "Elon-beth-hanan",
      "Elon of Beth-Hanan"
    ]
  },
  {
    "id": "eltekeh",
    "name": "Eltekeh",
    "lat": 31.8925,
    "lng": 34.76778,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "eltekon",
    "name": "Eltekon",
    "lat": 31.69031,
    "lng": 35.10148,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "eltolad",
    "name": "Eltolad",
    "lat": 31.09135,
    "lng": 34.92296,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "emek-keziz",
    "name": "Emek-Keziz",
    "lat": 31.87245,
    "lng": 35.44456,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Keziz"
    ]
  },
  {
    "id": "ein-dor",
    "name": "Ein-Dor",
    "lat": 32.64361,
    "lng": 35.39022,
    "type": "city",
    "books": [
      "shmuela",
      "tehilim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": [
      "Endor"
    ]
  },
  {
    "id": "ein-ganim-1",
    "name": "Ein-Ganim 1",
    "lat": 31.74761,
    "lng": 34.96378,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ein-ganim-2",
    "name": "Ein-Ganim 2",
    "lat": 32.46079,
    "lng": 35.29875,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ein-hadah",
    "name": "Ein-Hadah",
    "lat": 32.6804,
    "lng": 35.4863,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ein-hakore",
    "name": "Ein-Hakore",
    "lat": 31.74894,
    "lng": 35.00101,
    "type": "water",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "The Spring of the One Who Cried Out",
      "Hakkore Spring",
      "The Spring of Ha-Qore"
    ]
  },
  {
    "id": "ein-hazor",
    "name": "Ein-Hazor",
    "lat": 33.04194,
    "lng": 35.31179,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ein-rimon",
    "name": "Ein-Rimon",
    "lat": 31.37124,
    "lng": 34.86489,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "ein-rogel",
    "name": "Ein-Rogel",
    "lat": 31.7672,
    "lng": 35.23598,
    "type": "water",
    "books": [
      "melajima",
      "shmuelb",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "ein-shemesh",
    "name": "Ein-Shemesh",
    "lat": 31.77406,
    "lng": 35.27013,
    "type": "water",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ein-tapuah",
    "name": "Ein-Tapuah",
    "lat": 32.10444,
    "lng": 35.23007,
    "type": "water",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "spring of Tappuah"
    ]
  },
  {
    "id": "einayim",
    "name": "Einayim",
    "lat": 31.68768,
    "lng": 35.01237,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Eynayim"
    ]
  },
  {
    "id": "einam",
    "name": "Einam",
    "lat": 31.67615,
    "lng": 34.99802,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ein-eglaim",
    "name": "Ein-Eglaim",
    "lat": 31.71444,
    "lng": 35.45333,
    "type": "water",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "En Eglaim"
    ]
  },
  {
    "id": "ein-gedi",
    "name": "Ein-Gedi",
    "lat": 31.45839,
    "lng": 35.36908,
    "type": "region",
    "books": [
      "divre-hayamim-b",
      "shir-hashirim",
      "shmuela",
      "yehoshua",
      "yejezkel"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "En Gedi"
    ]
  },
  {
    "id": "efes-damim",
    "name": "Efes-Damim",
    "lat": 31.68449,
    "lng": 35.05224,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shmuela",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": [
      "Pas Dammim",
      "Pasdammim"
    ]
  },
  {
    "id": "efraim-1",
    "name": "Efraim 1",
    "lat": 31.95444,
    "lng": 35.30028,
    "type": "city",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "efraim-gate",
    "name": "Efraim Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "melajimb",
      "nehemia"
    ],
    "periods": [
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": [
      "Gate of Ephraim"
    ]
  },
  {
    "id": "efrat",
    "name": "Efrat",
    "lat": 31.70431,
    "lng": 35.20764,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "efratah",
    "name": "Efratah",
    "lat": 31.70431,
    "lng": 35.20764,
    "type": "city",
    "books": [
      "rut",
      "tehilim"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Ephratah"
    ]
  },
  {
    "id": "efron-1",
    "name": "Efron 1",
    "lat": 31.95444,
    "lng": 35.30028,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "efron-2",
    "name": "Efron 2",
    "lat": 31.95444,
    "lng": 35.30028,
    "type": "city",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Ephrain"
    ]
  },
  {
    "id": "erech",
    "name": "Erech",
    "lat": 31.32222,
    "lng": 45.63611,
    "type": "city",
    "books": [
      "bereshit",
      "ezra"
    ],
    "periods": [
      "Patriarchs",
      "Return & Second Temple"
    ],
    "aliases": [
      "Uruk"
    ]
  },
  {
    "id": "esek",
    "name": "Esek",
    "lat": 31.29949,
    "lng": 34.68692,
    "type": "water",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "eshan",
    "name": "Eshan",
    "lat": 31.43329,
    "lng": 34.97771,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Eshean"
    ]
  },
  {
    "id": "eshtaol",
    "name": "Eshtaol",
    "lat": 31.7811,
    "lng": 35.0101,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "eshtemoa",
    "name": "Eshtemoa",
    "lat": 31.40079,
    "lng": 35.06708,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shmuela",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "etam-1",
    "name": "Etam 1",
    "lat": 31.76372,
    "lng": 35.02579,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "etam-2",
    "name": "Etam 2",
    "lat": 31.68478,
    "lng": 35.17884,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "etam-3",
    "name": "Etam 3",
    "lat": 31.68478,
    "lng": 35.17884,
    "type": "city",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Etah"
    ]
  },
  {
    "id": "et-kazin",
    "name": "Et-Kazin",
    "lat": 32.74647,
    "lng": 35.33921,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Ittah-kazin"
    ]
  },
  {
    "id": "etam",
    "name": "Etam",
    "lat": 30.5475,
    "lng": 31.96361,
    "type": "city",
    "books": [
      "bamidbar",
      "shemot"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "eter-1",
    "name": "Eter 1",
    "lat": 31.61593,
    "lng": 34.8783,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "eter-2",
    "name": "Eter 2",
    "lat": 31.61593,
    "lng": 34.8783,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ethiopia",
    "name": "Ethiopia",
    "lat": 20.57731,
    "lng": 32.53081,
    "type": "region",
    "books": [
      "amosh",
      "ester",
      "iyov",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Cush"
    ]
  },
  {
    "id": "eufrates",
    "name": "Eufrates",
    "lat": 35.79538,
    "lng": 41.29119,
    "type": "water",
    "books": [
      "bereshit",
      "devarim",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "ezra",
      "melajima",
      "melajimb",
      "mija",
      "shemot",
      "shmuelb",
      "tehilim",
      "yehoshua",
      "yeshayahu",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Euphrates River",
      "River"
    ]
  },
  {
    "id": "ezel",
    "name": "Ezel",
    "lat": 31.82326,
    "lng": 35.23072,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "ezem",
    "name": "Ezem",
    "lat": 31.08057,
    "lng": 34.94081,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Azem"
    ]
  },
  {
    "id": "ezion-geber",
    "name": "Ezion-Geber",
    "lat": 29.54718,
    "lng": 34.98026,
    "type": "city",
    "books": [
      "bamidbar",
      "devarim",
      "divre-hayamim-b",
      "melajima"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "fish-gate",
    "name": "Fish Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "nehemia",
      "tzefania"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "fountain-gate",
    "name": "Fountain Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "gaash",
    "name": "Gaash",
    "lat": 32.00951,
    "lng": 35.10729,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "shmuelb",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": [
      "Nahale-gaash"
    ]
  },
  {
    "id": "galil-1",
    "name": "Galil 1",
    "lat": 32.8519,
    "lng": 35.38103,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "melajima",
      "melajimb",
      "yehoshua",
      "yeshayahu"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "galil-2",
    "name": "Galil 2",
    "lat": 32.8519,
    "lng": 35.38103,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Gilgal"
    ]
  },
  {
    "id": "galim",
    "name": "Galim",
    "lat": 31.81544,
    "lng": 35.25078,
    "type": "city",
    "books": [
      "shmuela",
      "yeshayahu"
    ],
    "periods": [
      "United Monarchy",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "gamad",
    "name": "Gamad",
    "lat": 33.62384,
    "lng": 35.82104,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Gammad"
    ]
  },
  {
    "id": "gareb",
    "name": "Gareb",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Hill of Gareb"
    ]
  },
  {
    "id": "gate-of-the-foundation",
    "name": "Gate of the Foundation",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Foundation Gate"
    ]
  },
  {
    "id": "gate-of-the-guard",
    "name": "Gate of the Guard",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Guard Gate",
      "Gate of the Prison"
    ]
  },
  {
    "id": "gate-of-yeshanah",
    "name": "Gate of Yeshanah",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Jeshanah Gate",
      "Ancient Gate",
      "Old Gate",
      "Old City Gate"
    ]
  },
  {
    "id": "gat-1",
    "name": "Gat 1",
    "lat": 31.69972,
    "lng": 34.84694,
    "type": "city",
    "books": [
      "amosh",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "melajimb",
      "mija",
      "shmuela",
      "shmuelb",
      "tehilim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "gat-2",
    "name": "Gat 2",
    "lat": 31.69972,
    "lng": 34.84694,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gat-3",
    "name": "Gat 3",
    "lat": 31.69972,
    "lng": 34.84694,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gat-hefer",
    "name": "Gat-Hefer",
    "lat": 32.73806,
    "lng": 35.31972,
    "type": "city",
    "books": [
      "melajimb",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gat-rimon-1",
    "name": "Gat-Rimon 1",
    "lat": 32.0917,
    "lng": 34.8075,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gat-rimon-2",
    "name": "Gat-Rimon 2",
    "lat": 32.4462,
    "lng": 35.292,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "gaza",
    "name": "Gaza",
    "lat": 31.504,
    "lng": 34.4644,
    "type": "city",
    "books": [
      "amosh",
      "bereshit",
      "devarim",
      "melajima",
      "melajimb",
      "shmuela",
      "shoftim",
      "tzefania",
      "yehoshua",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "ge-harashim",
    "name": "Ge-Harashim",
    "lat": 31.95073,
    "lng": 34.9,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "nehemia"
    ],
    "periods": [
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": [
      "Valley of the Craftsmen",
      "Valley of Craftsmen",
      "Craftsmen’s Valley"
    ]
  },
  {
    "id": "geba-1",
    "name": "Geba 1",
    "lat": 31.8575,
    "lng": 35.26111,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "ezra",
      "melajima",
      "nehemia",
      "shmuela",
      "yehoshua",
      "yeshayahu"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "geba-2",
    "name": "Geba 2",
    "lat": 31.84745,
    "lng": 35.18335,
    "type": "city",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Gibeon"
    ]
  },
  {
    "id": "geba-3",
    "name": "Geba 3",
    "lat": 31.8575,
    "lng": 35.26111,
    "type": "city",
    "books": [
      "melajimb",
      "zejaria"
    ],
    "periods": [
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "geba-4",
    "name": "Geba 4",
    "lat": 31.8575,
    "lng": 35.26111,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Gaba"
    ]
  },
  {
    "id": "gebal-1",
    "name": "Gebal 1",
    "lat": 34.11917,
    "lng": 35.64583,
    "type": "city",
    "books": [
      "melajima",
      "yehoshua",
      "yejezkel"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Byblos"
    ]
  },
  {
    "id": "gebal-2",
    "name": "Gebal 2",
    "lat": 30.74162,
    "lng": 35.59793,
    "type": "region",
    "books": [
      "tehilim"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Byblos"
    ]
  },
  {
    "id": "gebim",
    "name": "Gebim",
    "lat": 31.80796,
    "lng": 35.25758,
    "type": "region",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "geder",
    "name": "Geder",
    "lat": 31.63263,
    "lng": 35.09215,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gederah-1",
    "name": "Gederah 1",
    "lat": 31.6889,
    "lng": 34.99612,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "gederah-2",
    "name": "Gederah 2",
    "lat": 31.85794,
    "lng": 35.19727,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gederah-3",
    "name": "Gederah 3",
    "lat": 31.6889,
    "lng": 34.99612,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gederot",
    "name": "Gederot",
    "lat": 31.82294,
    "lng": 34.77774,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gederotaim",
    "name": "Gederotaim",
    "lat": 31.6889,
    "lng": 34.99612,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "gedor-1",
    "name": "Gedor 1",
    "lat": 31.63263,
    "lng": 35.09215,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gedor-2",
    "name": "Gedor 2",
    "lat": 31.3821,
    "lng": 34.6065,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Gerar"
    ]
  },
  {
    "id": "gedor-3",
    "name": "Gedor 3",
    "lat": 31.63263,
    "lng": 35.09215,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gedor-4",
    "name": "Gedor 4",
    "lat": 31.63263,
    "lng": 35.09215,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gelilot",
    "name": "Gelilot",
    "lat": 31.79052,
    "lng": 35.32262,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "gerar",
    "name": "Gerar",
    "lat": 31.3821,
    "lng": 34.6065,
    "type": "city",
    "books": [
      "bereshit",
      "divre-hayamim-b"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gerut-chimham",
    "name": "Gerut Chimham",
    "lat": 31.70504,
    "lng": 35.20764,
    "type": "region",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Geruth Kimham",
      "Chimham"
    ]
  },
  {
    "id": "geshur",
    "name": "Geshur",
    "lat": 32.89142,
    "lng": 35.7762,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "shmuelb",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gezer",
    "name": "Gezer",
    "lat": 31.85917,
    "lng": 34.91917,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "melajima",
      "shmuelb",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "giah",
    "name": "Giah",
    "lat": 31.8425,
    "lng": 35.27954,
    "type": "region",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "gibar",
    "name": "Gibar",
    "lat": 31.84745,
    "lng": 35.18335,
    "type": "city",
    "books": [
      "ezra"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "gibeton",
    "name": "Gibeton",
    "lat": 31.85639,
    "lng": 34.86556,
    "type": "city",
    "books": [
      "melajima",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gibea",
    "name": "Gibea",
    "lat": 31.46579,
    "lng": 35.08195,
    "type": "region",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gibeah-1",
    "name": "Gibeah 1",
    "lat": 31.82311,
    "lng": 35.23072,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "hoshea",
      "shmuela",
      "shmuelb",
      "shoftim",
      "yeshayahu"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "gibeah-2",
    "name": "Gibeah 2",
    "lat": 31.46579,
    "lng": 35.08195,
    "type": "region",
    "books": [
      "divre-hayamim-b",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gibeah-3",
    "name": "Gibeah 3",
    "lat": 31.99722,
    "lng": 35.16111,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "gibeah-4",
    "name": "Gibeah 4",
    "lat": 31.82311,
    "lng": 35.23072,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Gibeath"
    ]
  },
  {
    "id": "gibeat-elohim",
    "name": "Gibeat-Elohim",
    "lat": 31.82311,
    "lng": 35.23072,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Gibeah of God"
    ]
  },
  {
    "id": "gibeat-haaralot",
    "name": "Gibeat-Haaralot",
    "lat": 31.88261,
    "lng": 35.45997,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Hill of the Foreskins"
    ]
  },
  {
    "id": "gibeon",
    "name": "Gibeon",
    "lat": 31.84745,
    "lng": 35.18335,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "nehemia",
      "shmuelb",
      "yehoshua",
      "yirmiyahu"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "gidom",
    "name": "Gidom",
    "lat": 31.93117,
    "lng": 35.29889,
    "type": "region",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "gihon-1",
    "name": "Gihon 1",
    "lat": 23.06582,
    "lng": 31.82804,
    "type": "water",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "gihon-2",
    "name": "Gihon 2",
    "lat": 31.77292,
    "lng": 35.23638,
    "type": "water",
    "books": [
      "divre-hayamim-b",
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Gihon Spring"
    ]
  },
  {
    "id": "gilead-2",
    "name": "Gilead 2",
    "lat": 32.24724,
    "lng": 35.78279,
    "type": "region",
    "books": [
      "hoshea"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "gilgal-1",
    "name": "Gilgal 1",
    "lat": 31.88188,
    "lng": 35.45997,
    "type": "city",
    "books": [
      "amosh",
      "hoshea",
      "mija",
      "shmuela",
      "shmuelb",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "gilgal-2",
    "name": "Gilgal 2",
    "lat": 32.03056,
    "lng": 35.225,
    "type": "city",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gilgal-3",
    "name": "Gilgal 3",
    "lat": 31.79052,
    "lng": 35.32262,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "gilgal-4",
    "name": "Gilgal 4",
    "lat": 31.88188,
    "lng": 35.45997,
    "type": "city",
    "books": [
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "giloh",
    "name": "Giloh",
    "lat": 31.43297,
    "lng": 35.01485,
    "type": "region",
    "books": [
      "shmuelb",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "gimzo",
    "name": "Gimzo",
    "lat": 31.9297,
    "lng": 34.94681,
    "type": "city",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gitaim",
    "name": "Gitaim",
    "lat": 31.90302,
    "lng": 34.88994,
    "type": "city",
    "books": [
      "nehemia",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "goah",
    "name": "Goah",
    "lat": 31.77783,
    "lng": 35.23417,
    "type": "region",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Goath"
    ]
  },
  {
    "id": "gob",
    "name": "Gob",
    "lat": 31.85917,
    "lng": 34.91917,
    "type": "city",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "goiim-1",
    "name": "Goiim 1",
    "lat": 33.28859,
    "lng": 36.51849,
    "type": "region",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Goyim"
    ]
  },
  {
    "id": "goiim-2",
    "name": "Goiim 2",
    "lat": 32.8519,
    "lng": 35.38103,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Goyim"
    ]
  },
  {
    "id": "golan",
    "name": "Golan",
    "lat": 32.78111,
    "lng": 35.93472,
    "type": "city",
    "books": [
      "devarim",
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "gomer",
    "name": "Gomer",
    "lat": 39.3886,
    "lng": 33.1265,
    "type": "region",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "gomorah",
    "name": "Gomorah",
    "lat": 31.15214,
    "lng": 35.42979,
    "type": "region",
    "books": [
      "amosh",
      "bereshit",
      "devarim",
      "tzefania",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "goshen-2",
    "name": "Goshen 2",
    "lat": 31.41049,
    "lng": 34.9723,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "goshen-3",
    "name": "Goshen 3",
    "lat": 31.40762,
    "lng": 34.9723,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "gozan",
    "name": "Gozan",
    "lat": 36.82679,
    "lng": 40.03967,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "melajimb",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "great-sea",
    "name": "Great Sea",
    "lat": 37.03847,
    "lng": 16.71489,
    "type": "water",
    "books": [
      "bamidbar",
      "daniel",
      "devarim",
      "divre-hayamim-b",
      "ezra",
      "melajima",
      "shemot",
      "tehilim",
      "yehoshua",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "yoel",
      "zejaria"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Mediterranean Sea"
    ]
  },
  {
    "id": "greece",
    "name": "Greece",
    "lat": 38.21109,
    "lng": 21.85807,
    "type": "region",
    "books": [
      "daniel",
      "zejaria"
    ],
    "periods": [
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Javan",
      "Grecia"
    ]
  },
  {
    "id": "gulot-mayim",
    "name": "Gulot-Mayim",
    "lat": 31.43282,
    "lng": 35.01485,
    "type": "water",
    "books": [
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "gur",
    "name": "Gur",
    "lat": 32.49148,
    "lng": 35.2182,
    "type": "region",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Ascent of Gur",
      "Gur Pass"
    ]
  },
  {
    "id": "gurbaal",
    "name": "Gurbaal",
    "lat": 30.53954,
    "lng": 35.35415,
    "type": "region",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Gur Baal",
      "Gur"
    ]
  },
  {
    "id": "habor",
    "name": "Habor",
    "lat": 36.36047,
    "lng": 40.37867,
    "type": "water",
    "books": [
      "divre-hayamim-a",
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Habor River"
    ]
  },
  {
    "id": "hachilah",
    "name": "Hachilah",
    "lat": 31.4703,
    "lng": 35.2228,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Hakilah"
    ]
  },
  {
    "id": "hadad-rimon",
    "name": "Hadad-Rimon",
    "lat": 32.5863,
    "lng": 35.18444,
    "type": "region",
    "books": [
      "zejaria"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Hadadrimmon"
    ]
  },
  {
    "id": "hadashah",
    "name": "Hadashah",
    "lat": 31.60976,
    "lng": 34.81971,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "hadid",
    "name": "Hadid",
    "lat": 31.96332,
    "lng": 34.95176,
    "type": "city",
    "books": [
      "ezra",
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "hadrach",
    "name": "Hadrach",
    "lat": 35.905,
    "lng": 36.79861,
    "type": "city",
    "books": [
      "zejaria"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Hadrak",
      "Aram"
    ]
  },
  {
    "id": "haelef",
    "name": "Haelef",
    "lat": 31.80253,
    "lng": 35.20964,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Eleph"
    ]
  },
  {
    "id": "hakefirim",
    "name": "Hakefirim",
    "lat": 32.02867,
    "lng": 34.86806,
    "type": "region",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Chephirim",
      "Kephirim"
    ]
  },
  {
    "id": "halah",
    "name": "Halah",
    "lat": 36.43965,
    "lng": 43.19459,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "melajimb",
      "ovadia"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "halhul",
    "name": "Halhul",
    "lat": 31.57741,
    "lng": 35.10725,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "hali",
    "name": "Hali",
    "lat": 32.77177,
    "lng": 35.15567,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "hall-of-judgment",
    "name": "Hall of Judgment",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Hall of Justice"
    ]
  },
  {
    "id": "hall-of-pillars",
    "name": "Hall of Pillars",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "hall-of-the-throne",
    "name": "Hall of the Throne",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "ham-1",
    "name": "Ham 1",
    "lat": 32.51421,
    "lng": 35.81238,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "hamat-1",
    "name": "Hamat 1",
    "lat": 35.1365,
    "lng": 36.75,
    "type": "city",
    "books": [
      "amosh",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajimb",
      "shmuelb",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "hamat-2",
    "name": "Hamat 2",
    "lat": 35.1365,
    "lng": 36.75,
    "type": "city",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "hamat-tzobah",
    "name": "Hamat-Tzobah",
    "lat": 35.1365,
    "lng": 36.75,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Zobah",
      "Zobah-Hamath"
    ]
  },
  {
    "id": "hammat-1",
    "name": "Hammat 1",
    "lat": 32.76637,
    "lng": 35.55055,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "hammat-2",
    "name": "Hammat 2",
    "lat": 32.76637,
    "lng": 35.55055,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Hemath"
    ]
  },
  {
    "id": "hamon-1",
    "name": "Hamon 1",
    "lat": 33.12811,
    "lng": 35.15202,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "hamon-2",
    "name": "Hamon 2",
    "lat": 32.76637,
    "lng": 35.55055,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "hamot-dor",
    "name": "Hamot-Dor",
    "lat": 32.76637,
    "lng": 35.55055,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "hamonah",
    "name": "Hamonah",
    "lat": 31.7386,
    "lng": 35.69473,
    "type": "region",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "hanes",
    "name": "Hanes",
    "lat": 29.08556,
    "lng": 30.93444,
    "type": "city",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "hanaton",
    "name": "Hanaton",
    "lat": 32.78556,
    "lng": 35.25694,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "hafaraim",
    "name": "Hafaraim",
    "lat": 32.60385,
    "lng": 35.44661,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Haphraim"
    ]
  },
  {
    "id": "hara",
    "name": "Hara",
    "lat": 36.83351,
    "lng": 40.03967,
    "type": "region",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "haradah",
    "name": "Haradah",
    "lat": 30.4775,
    "lng": 34.44141,
    "type": "river",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "haran",
    "name": "Haran",
    "lat": 36.86444,
    "lng": 39.03278,
    "type": "city",
    "books": [
      "bereshit",
      "melajimb",
      "yejezkel",
      "yeshayahu"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Harran"
    ]
  },
  {
    "id": "harim",
    "name": "Harim",
    "lat": 31.64683,
    "lng": 34.94573,
    "type": "city",
    "books": [
      "ezra",
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "harmon",
    "name": "Harmon",
    "lat": 33.4,
    "lng": 35.85,
    "type": "city",
    "books": [
      "amosh"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "harod-1",
    "name": "Harod 1",
    "lat": 32.54861,
    "lng": 35.35583,
    "type": "water",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "harod-2",
    "name": "Harod 2",
    "lat": 31.73333,
    "lng": 35.2721,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "haroshet-hagoyim",
    "name": "Haroshet-Hagoyim",
    "lat": 32.72806,
    "lng": 35.09667,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Harosheth Haggoyim",
      "Harosheth-ha-goiim",
      "Harosheth of the Nations",
      "Harosheth of the Gentiles"
    ]
  },
  {
    "id": "hashmonah",
    "name": "Hashmonah",
    "lat": 31.24896,
    "lng": 34.84083,
    "type": "region",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "hauran",
    "name": "Hauran",
    "lat": 32.89709,
    "lng": 36.42721,
    "type": "region",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "havilah-1",
    "name": "Havilah 1",
    "lat": 32.49942,
    "lng": 45.01038,
    "type": "region",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "havilah-2",
    "name": "Havilah 2",
    "lat": 23.56638,
    "lng": 48.69829,
    "type": "region",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "havilah-3",
    "name": "Havilah 3",
    "lat": 23.56638,
    "lng": 48.69829,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "havot-yair",
    "name": "Havot-Yair",
    "lat": 32.67256,
    "lng": 35.81313,
    "type": "region",
    "books": [
      "bamidbar",
      "devarim",
      "divre-hayamim-a",
      "melajima",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Towns of Jair",
      "Jair’s Villages",
      "Havoth Jair"
    ]
  },
  {
    "id": "hazar-adar",
    "name": "Hazar-Adar",
    "lat": 30.58338,
    "lng": 34.48408,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Hazaraddar"
    ]
  },
  {
    "id": "hazar-enan",
    "name": "Hazar-Enan",
    "lat": 34.22944,
    "lng": 37.24056,
    "type": "city",
    "books": [
      "bamidbar",
      "yejezkel"
    ],
    "periods": [
      "Exodus & Wilderness",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "hazar-gadah",
    "name": "Hazar-Gadah",
    "lat": 31.25157,
    "lng": 34.84083,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "hazar-shual",
    "name": "Hazar-Shual",
    "lat": 31.24617,
    "lng": 34.84083,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "nehemia",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "hazar-susah",
    "name": "Hazar-Susah",
    "lat": 31.3445,
    "lng": 34.9014,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Hazar Susim"
    ]
  },
  {
    "id": "hazazon-tamar-1",
    "name": "Hazazon-Tamar 1",
    "lat": 30.8087,
    "lng": 35.2459,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Hazezon Tamar"
    ]
  },
  {
    "id": "hazazon-tamar-2",
    "name": "Hazazon-Tamar 2",
    "lat": 31.45839,
    "lng": 35.36908,
    "type": "region",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Hazezon Tamar"
    ]
  },
  {
    "id": "hazer-hatikon",
    "name": "Hazer-Hatikon",
    "lat": 34.22944,
    "lng": 37.24056,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Hazer Hattikon",
      "Hazar Hatticon"
    ]
  },
  {
    "id": "hazerot",
    "name": "Hazerot",
    "lat": 28.89694,
    "lng": 34.42167,
    "type": "city",
    "books": [
      "bamidbar",
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "hazor-1",
    "name": "Hazor 1",
    "lat": 33.01833,
    "lng": 35.56917,
    "type": "city",
    "books": [
      "melajima",
      "melajimb",
      "shmuela",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "hazor-2",
    "name": "Hazor 2",
    "lat": 30.72278,
    "lng": 34.64522,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "hazor-3",
    "name": "Hazor 3",
    "lat": 31.34495,
    "lng": 35.12438,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "hazor-4",
    "name": "Hazor 4",
    "lat": 31.83218,
    "lng": 35.19546,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "hazor-5",
    "name": "Hazor 5",
    "lat": 29.82417,
    "lng": 39.86831,
    "type": "region",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "hazor-hadatah",
    "name": "Hazor-Hadatah",
    "lat": 31.37333,
    "lng": 35.23361,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Hazor"
    ]
  },
  {
    "id": "hebron",
    "name": "Hebron",
    "lat": 31.52509,
    "lng": 35.10222,
    "type": "city",
    "books": [
      "bamidbar",
      "bereshit",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "nehemia",
      "shmuela",
      "shmuelb",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "helam",
    "name": "Helam",
    "lat": 32.75,
    "lng": 36.24083,
    "type": "city",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "helbah",
    "name": "Helbah",
    "lat": 33.3178,
    "lng": 35.24337,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "helbon",
    "name": "Helbon",
    "lat": 33.6667,
    "lng": 36.25,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "helech",
    "name": "Helech",
    "lat": 36.8222,
    "lng": 33.92948,
    "type": "region",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Helek"
    ]
  },
  {
    "id": "helef",
    "name": "Helef",
    "lat": 32.72474,
    "lng": 35.41385,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "heliopolis",
    "name": "Heliopolis",
    "lat": 30.12944,
    "lng": 31.3075,
    "type": "city",
    "books": [
      "bereshit",
      "yejezkel",
      "yirmiyahu"
    ],
    "periods": [
      "Patriarchs",
      "The Prophets"
    ],
    "aliases": [
      "On"
    ]
  },
  {
    "id": "helkat",
    "name": "Helkat",
    "lat": 32.75885,
    "lng": 35.09027,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "helkat-hazurim",
    "name": "Helkat-Hazurim",
    "lat": 31.84752,
    "lng": 35.18335,
    "type": "region",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Field of Flints",
      "Field of Swords",
      "Field of Blades",
      "Field of Sharp Swords"
    ]
  },
  {
    "id": "hena",
    "name": "Hena",
    "lat": 35.14618,
    "lng": 36.75,
    "type": "region",
    "books": [
      "melajimb",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "hefer",
    "name": "Hefer",
    "lat": 32.44285,
    "lng": 35.21767,
    "type": "city",
    "books": [
      "melajima",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "heres",
    "name": "Heres",
    "lat": 31.89458,
    "lng": 36.20398,
    "type": "region",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Pass of Heres",
      "Heres Pass",
      "Ascent of Heres"
    ]
  },
  {
    "id": "heret",
    "name": "Heret",
    "lat": 31.61411,
    "lng": 35.04313,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Hareth"
    ]
  },
  {
    "id": "heshbon",
    "name": "Heshbon",
    "lat": 31.80081,
    "lng": 35.80906,
    "type": "city",
    "books": [
      "bamidbar",
      "devarim",
      "divre-hayamim-a",
      "nehemia",
      "shir-hashirim",
      "shoftim",
      "yehoshua",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "heshmon",
    "name": "Heshmon",
    "lat": 31.24896,
    "lng": 34.84083,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Heshbon"
    ]
  },
  {
    "id": "hetlon",
    "name": "Hetlon",
    "lat": 34.60306,
    "lng": 36.13361,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "hezron",
    "name": "Hezron",
    "lat": 30.64979,
    "lng": 34.42222,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "hobah",
    "name": "Hobah",
    "lat": 33.39374,
    "lng": 36.41663,
    "type": "region",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "holon-1",
    "name": "Holon 1",
    "lat": 31.66215,
    "lng": 35.0305,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "holon-2",
    "name": "Holon 2",
    "lat": 31.42602,
    "lng": 35.91095,
    "type": "region",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "holy-place-2",
    "name": "Holy Place 2",
    "lat": 31.77778,
    "lng": 35.23556,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "tehilim",
      "yejezkel"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "hor-hagidgad",
    "name": "Hor-Hagidgad",
    "lat": 30.22232,
    "lng": 34.81225,
    "type": "river",
    "books": [
      "bamidbar",
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Hor Hagidgad"
    ]
  },
  {
    "id": "horem",
    "name": "Horem",
    "lat": 33.09014,
    "lng": 35.41667,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "horesh",
    "name": "Horesh",
    "lat": 31.45026,
    "lng": 35.12738,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "hormah",
    "name": "Hormah",
    "lat": 31.21229,
    "lng": 34.95828,
    "type": "city",
    "books": [
      "bamidbar",
      "devarim",
      "divre-hayamim-a",
      "shmuela",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "horonaim-1",
    "name": "Horonaim 1",
    "lat": 31.09001,
    "lng": 35.64193,
    "type": "city",
    "books": [
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "horonaim-2",
    "name": "Horonaim 2",
    "lat": 31.895,
    "lng": 35.08361,
    "type": "city",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "horse-gate",
    "name": "Horse Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "nehemia",
      "yirmiyahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "hosah",
    "name": "Hosah",
    "lat": 33.23674,
    "lng": 35.21519,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "house-of-the-forest-of-lebanon",
    "name": "House of the Forest of Lebanon",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "melajima",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Palace of the Forest of Lebanon",
      "Palace of the Lebanon Forest"
    ]
  },
  {
    "id": "hukkok",
    "name": "Hukkok",
    "lat": 32.8847,
    "lng": 35.4789,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Hukok"
    ]
  },
  {
    "id": "hukok",
    "name": "Hukok",
    "lat": 32.75885,
    "lng": 35.09027,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "humtah",
    "name": "Humtah",
    "lat": 31.52711,
    "lng": 35.10222,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "hushah",
    "name": "Hushah",
    "lat": 31.71181,
    "lng": 35.13242,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "ibleam",
    "name": "Ibleam",
    "lat": 32.4462,
    "lng": 35.292,
    "type": "city",
    "books": [
      "melajimb",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "idalah",
    "name": "Idalah",
    "lat": 32.72579,
    "lng": 35.18343,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "iim",
    "name": "Iim",
    "lat": 31.36475,
    "lng": 34.92061,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Iyim",
      "Ijim"
    ]
  },
  {
    "id": "iyon",
    "name": "Iyon",
    "lat": 33.34528,
    "lng": 35.59,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "melajima",
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "india",
    "name": "India",
    "lat": 28.78781,
    "lng": 67.89564,
    "type": "region",
    "books": [
      "ester"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "iftah",
    "name": "Iftah",
    "lat": 31.57459,
    "lng": 35.01244,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Jiphtah",
      "Jephthah"
    ]
  },
  {
    "id": "ir-moab",
    "name": "Ir-Moab",
    "lat": 31.35991,
    "lng": 35.78276,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "ir-nahash",
    "name": "Ir-Nahash",
    "lat": 30.68056,
    "lng": 35.43611,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Irnahash",
      "Nahash"
    ]
  },
  {
    "id": "ir-shemesh",
    "name": "Ir-Shemesh",
    "lat": 31.75062,
    "lng": 34.97474,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "irpeel",
    "name": "Irpeel",
    "lat": 31.87056,
    "lng": 35.19222,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "itlah",
    "name": "Itlah",
    "lat": 31.84256,
    "lng": 35.02361,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Jethlah"
    ]
  },
  {
    "id": "itnan",
    "name": "Itnan",
    "lat": 30.72278,
    "lng": 34.64522,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ivah",
    "name": "Ivah",
    "lat": 34.68472,
    "lng": 36.69056,
    "type": "city",
    "books": [
      "melajimb",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Ivah"
    ]
  },
  {
    "id": "iye-abarim",
    "name": "Iye-Abarim",
    "lat": 30.956,
    "lng": 35.77948,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Ije Abarim"
    ]
  },
  {
    "id": "yaar",
    "name": "Yaar",
    "lat": 31.80896,
    "lng": 35.10378,
    "type": "city",
    "books": [
      "tehilim"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "yabok",
    "name": "Yabok",
    "lat": 32.15805,
    "lng": 35.83856,
    "type": "water",
    "books": [
      "bamidbar",
      "bereshit",
      "devarim",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": [
      "Jabbok River"
    ]
  },
  {
    "id": "yabesh-gilead",
    "name": "Yabesh-Gilead",
    "lat": 32.40237,
    "lng": 35.6823,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shmuela",
      "shmuelb",
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": [
      "Jabesh"
    ]
  },
  {
    "id": "yabez",
    "name": "Yabez",
    "lat": 31.70504,
    "lng": 35.20764,
    "type": "region",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "yabneel-1",
    "name": "Yabneel 1",
    "lat": 31.866,
    "lng": 34.7463,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "yabneel-2",
    "name": "Yabneel 2",
    "lat": 32.71333,
    "lng": 35.5125,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "yagur",
    "name": "Yagur",
    "lat": 31.2328,
    "lng": 34.9867,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "yahaz",
    "name": "Yahaz",
    "lat": 31.58835,
    "lng": 35.90793,
    "type": "city",
    "books": [
      "bamidbar",
      "devarim",
      "divre-hayamim-a",
      "shoftim",
      "yehoshua",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "yanim",
    "name": "Yanim",
    "lat": 31.51591,
    "lng": 35.16416,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Janum"
    ]
  },
  {
    "id": "yanoah-1",
    "name": "Yanoah 1",
    "lat": 32.15798,
    "lng": 35.36133,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Janohah"
    ]
  },
  {
    "id": "yanoah-2",
    "name": "Yanoah 2",
    "lat": 33.26025,
    "lng": 35.30259,
    "type": "city",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "yafia",
    "name": "Yafia",
    "lat": 32.68702,
    "lng": 35.27535,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "yarmut-1",
    "name": "Yarmut 1",
    "lat": 31.7083,
    "lng": 34.975,
    "type": "city",
    "books": [
      "nehemia",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "yarmut-2",
    "name": "Yarmut 2",
    "lat": 32.59556,
    "lng": 35.52139,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "yatir",
    "name": "Yatir",
    "lat": 31.3525,
    "lng": 35.01611,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shmuela",
      "shmuelb",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "yavan",
    "name": "Yavan",
    "lat": 38.02813,
    "lng": 26.77524,
    "type": "region",
    "books": [
      "yejezkel",
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Greece"
    ]
  },
  {
    "id": "yazer",
    "name": "Yazer",
    "lat": 32.0064,
    "lng": 35.73498,
    "type": "city",
    "books": [
      "bamidbar",
      "divre-hayamim-a",
      "shmuelb",
      "yehoshua",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "yebus",
    "name": "Yebus",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "yehud",
    "name": "Yehud",
    "lat": 32.03083,
    "lng": 34.89028,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "yericho-1",
    "name": "Yericho 1",
    "lat": 31.87172,
    "lng": 35.44456,
    "type": "city",
    "books": [
      "bamidbar",
      "devarim",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "ezra",
      "melajima",
      "melajimb",
      "nehemia",
      "shmuelb",
      "shoftim",
      "yehoshua",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "yeruel",
    "name": "Yeruel",
    "lat": 31.54941,
    "lng": 35.29068,
    "type": "region",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Desert of Jeruel",
      "Wilderness of Jeruel"
    ]
  },
  {
    "id": "yerushalayim",
    "name": "Yerushalayim",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "amosh",
      "daniel",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "eja",
      "ester",
      "ezra",
      "kohelet",
      "malaji",
      "melajima",
      "melajimb",
      "mija",
      "nehemia",
      "ovadia",
      "shir-hashirim",
      "shmuela",
      "shmuelb",
      "shoftim",
      "tehilim",
      "tzefania",
      "yehoshua",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "yoel",
      "zejaria"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "yeshanah",
    "name": "Yeshanah",
    "lat": 31.99855,
    "lng": 35.26029,
    "type": "city",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "yeshimon",
    "name": "Yeshimon",
    "lat": 31.47763,
    "lng": 35.28146,
    "type": "region",
    "books": [
      "bamidbar",
      "shmuela"
    ],
    "periods": [
      "Exodus & Wilderness",
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "yeshua",
    "name": "Yeshua",
    "lat": 31.27639,
    "lng": 34.99028,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "yizreel-1",
    "name": "Yizreel 1",
    "lat": 31.4488,
    "lng": 35.09,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "yizreel-2",
    "name": "Yizreel 2",
    "lat": 32.55785,
    "lng": 35.32795,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "hoshea",
      "melajima",
      "melajimb",
      "shmuela",
      "shmuelb",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "yizreel-3",
    "name": "Yizreel 3",
    "lat": 31.4488,
    "lng": 35.09,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "shmuela",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "yogbehah",
    "name": "Yogbehah",
    "lat": 32.01353,
    "lng": 35.85575,
    "type": "city",
    "books": [
      "bamidbar",
      "shoftim"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "yokdeam",
    "name": "Yokdeam",
    "lat": 31.46197,
    "lng": 35.11849,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "yokmeam-1",
    "name": "Yokmeam 1",
    "lat": 32.6641,
    "lng": 35.10827,
    "type": "city",
    "books": [
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Jokneam"
    ]
  },
  {
    "id": "yokmeam-2",
    "name": "Yokmeam 2",
    "lat": 32.13993,
    "lng": 35.48497,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "yokneam",
    "name": "Yokneam",
    "lat": 32.6641,
    "lng": 35.10827,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "yokteel-1",
    "name": "Yokteel 1",
    "lat": 31.56883,
    "lng": 34.84917,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Jokthe-el"
    ]
  },
  {
    "id": "yafo",
    "name": "Yafo",
    "lat": 32.05448,
    "lng": 34.75304,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "ezra",
      "yehoshua",
      "yona"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "yarden-1",
    "name": "Yarden 1",
    "lat": 32.35572,
    "lng": 35.56198,
    "type": "water",
    "books": [
      "bamidbar",
      "bereshit",
      "devarim",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "iyov",
      "melajima",
      "melajimb",
      "shmuela",
      "shmuelb",
      "shoftim",
      "tehilim",
      "yehoshua",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Jordan River"
    ]
  },
  {
    "id": "yarden-2",
    "name": "Yarden 2",
    "lat": 32.35572,
    "lng": 35.56198,
    "type": "water",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "yarden-valley",
    "name": "Yarden Valley",
    "lat": 32.13548,
    "lng": 35.53455,
    "type": "region",
    "books": [
      "bereshit",
      "shmuelb"
    ],
    "periods": [
      "Patriarchs",
      "United Monarchy"
    ],
    "aliases": [
      "Jordan",
      "Plain"
    ]
  },
  {
    "id": "yorkeam",
    "name": "Yorkeam",
    "lat": 31.46197,
    "lng": 35.11849,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Jorkoam"
    ]
  },
  {
    "id": "yotbah",
    "name": "Yotbah",
    "lat": 32.83194,
    "lng": 35.27814,
    "type": "city",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "yotbatah",
    "name": "Yotbatah",
    "lat": 29.49247,
    "lng": 34.89688,
    "type": "city",
    "books": [
      "bamidbar",
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "yutah",
    "name": "Yutah",
    "lat": 31.44778,
    "lng": 35.09,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "kabzeel",
    "name": "Kabzeel",
    "lat": 31.28619,
    "lng": 34.93235,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "nehemia",
      "shmuelb",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "kadesh-2",
    "name": "Kadesh 2",
    "lat": 34.55781,
    "lng": 36.5196,
    "type": "city",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Tahtim Hodshi"
    ]
  },
  {
    "id": "kadesh-barnea",
    "name": "Kadesh-Barnea",
    "lat": 30.64833,
    "lng": 34.42222,
    "type": "city",
    "books": [
      "bamidbar",
      "bereshit",
      "devarim",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": [
      "Kadesh"
    ]
  },
  {
    "id": "kain",
    "name": "Kain",
    "lat": 31.49627,
    "lng": 35.15154,
    "type": "city",
    "books": [
      "bamidbar",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": [
      "Cain"
    ]
  },
  {
    "id": "kamon",
    "name": "Kamon",
    "lat": 32.5876,
    "lng": 35.7256,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Camon"
    ]
  },
  {
    "id": "kanah-1",
    "name": "Kanah 1",
    "lat": 32.14131,
    "lng": 35.00898,
    "type": "water",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Kanah Ravine",
      "Wadi Kanah",
      "Valley of Kanah",
      "Brook of Kanah",
      "Brook Kanah"
    ]
  },
  {
    "id": "kanah-2",
    "name": "Kanah 2",
    "lat": 33.20917,
    "lng": 35.29917,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "karka",
    "name": "Karka",
    "lat": 30.66667,
    "lng": 34.36667,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Karkaa"
    ]
  },
  {
    "id": "karkor",
    "name": "Karkor",
    "lat": 31.36306,
    "lng": 37.54278,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "karnaim",
    "name": "Karnaim",
    "lat": 32.83583,
    "lng": 36.035,
    "type": "city",
    "books": [
      "amosh"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "kartah",
    "name": "Kartah",
    "lat": 32.68722,
    "lng": 34.93833,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "kartan",
    "name": "Kartan",
    "lat": 33.11194,
    "lng": 35.4625,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "katat",
    "name": "Katat",
    "lat": 32.77111,
    "lng": 35.10472,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Kattah"
    ]
  },
  {
    "id": "kedar",
    "name": "Kedar",
    "lat": 30.78512,
    "lng": 38.82226,
    "type": "region",
    "books": [
      "shir-hashirim",
      "tehilim",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "kedemot",
    "name": "Kedemot",
    "lat": 31.61555,
    "lng": 35.87159,
    "type": "city",
    "books": [
      "devarim",
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "kedesh-1",
    "name": "Kedesh 1",
    "lat": 33.11164,
    "lng": 35.52952,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "melajimb",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "kedesh-2",
    "name": "Kedesh 2",
    "lat": 30.64833,
    "lng": 34.42222,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "kedesh-3",
    "name": "Kedesh 3",
    "lat": 32.66139,
    "lng": 35.39306,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "kedesh-4",
    "name": "Kedesh 4",
    "lat": 33.11164,
    "lng": 35.52952,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "kedesh-5",
    "name": "Kedesh 5",
    "lat": 33.11164,
    "lng": 35.52952,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "kedesh-naftali",
    "name": "Kedesh-Naftali",
    "lat": 32.735,
    "lng": 35.55555,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Kedesh in Naphtali"
    ]
  },
  {
    "id": "kehelatah",
    "name": "Kehelatah",
    "lat": 30.19306,
    "lng": 34.42111,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "keilah",
    "name": "Keilah",
    "lat": 31.6137,
    "lng": 35.0036,
    "type": "city",
    "books": [
      "nehemia",
      "shmuela",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "kenat",
    "name": "Kenat",
    "lat": 32.75616,
    "lng": 36.61899,
    "type": "city",
    "books": [
      "bamidbar",
      "divre-hayamim-a"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "keriot",
    "name": "Keriot",
    "lat": 31.54056,
    "lng": 35.68611,
    "type": "city",
    "books": [
      "amosh",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "keriot-hezron",
    "name": "Keriot-Hezron",
    "lat": 31.34495,
    "lng": 35.12438,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Hezron"
    ]
  },
  {
    "id": "kibrot-hataavah",
    "name": "Kibrot-Hataavah",
    "lat": 28.78867,
    "lng": 34.27544,
    "type": "city",
    "books": [
      "bamidbar",
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "kibzaim",
    "name": "Kibzaim",
    "lat": 32.6641,
    "lng": 35.10827,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "kidron",
    "name": "Kidron",
    "lat": 31.71279,
    "lng": 35.33433,
    "type": "water",
    "books": [
      "divre-hayamim-b",
      "melajima",
      "melajimb",
      "nehemia",
      "shmuelb",
      "yirmiyahu"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Kidron Valley",
      "Wadi Kidron",
      "Brook Kidron"
    ]
  },
  {
    "id": "kinah",
    "name": "Kinah",
    "lat": 31.20078,
    "lng": 35.17711,
    "type": "river",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "king-s-highway",
    "name": "King’s Highway",
    "lat": 31.69593,
    "lng": 35.82402,
    "type": "river",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "king-s-valley",
    "name": "King’s Valley",
    "lat": 31.76922,
    "lng": 35.23567,
    "type": "region",
    "books": [
      "bereshit",
      "shmuelb"
    ],
    "periods": [
      "Patriarchs",
      "United Monarchy"
    ],
    "aliases": [
      "Valley of the King"
    ]
  },
  {
    "id": "kir-1",
    "name": "Kir 1",
    "lat": 33.12361,
    "lng": 45.93139,
    "type": "city",
    "books": [
      "amosh",
      "melajimb",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "kir-2",
    "name": "Kir 2",
    "lat": 31.18056,
    "lng": 35.70139,
    "type": "city",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "kir-hareset",
    "name": "Kir-Hareset",
    "lat": 31.18056,
    "lng": 35.70139,
    "type": "city",
    "books": [
      "melajimb",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Kir-heres"
    ]
  },
  {
    "id": "kiryat-huzot",
    "name": "Kiryat-Huzot",
    "lat": 31.50369,
    "lng": 35.77657,
    "type": "region",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Kirjath Huzoth"
    ]
  },
  {
    "id": "kiryat-yearim",
    "name": "Kiryat-Yearim",
    "lat": 31.80896,
    "lng": 35.10378,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "ezra",
      "nehemia",
      "shmuela",
      "shoftim",
      "yehoshua",
      "yirmiyahu"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Kirjath Jearim"
    ]
  },
  {
    "id": "kiryatayim-1",
    "name": "Kiryatayim 1",
    "lat": 31.54056,
    "lng": 35.68611,
    "type": "city",
    "books": [
      "bamidbar",
      "yehoshua",
      "yejezkel",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "The Prophets"
    ],
    "aliases": [
      "Kirjathaim"
    ]
  },
  {
    "id": "kiryatayim-2",
    "name": "Kiryatayim 2",
    "lat": 33.11194,
    "lng": 35.4625,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Kirjathaim"
    ]
  },
  {
    "id": "kishion",
    "name": "Kishion",
    "lat": 32.66139,
    "lng": 35.39306,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "kishon",
    "name": "Kishon",
    "lat": 32.65581,
    "lng": 35.1657,
    "type": "water",
    "books": [
      "melajima",
      "shoftim",
      "tehilim"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Wadi Kishon",
      "Kishon River"
    ]
  },
  {
    "id": "kitron",
    "name": "Kitron",
    "lat": 32.77111,
    "lng": 35.10472,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "kitim",
    "name": "Kitim",
    "lat": 35.06963,
    "lng": 33.28405,
    "type": "region",
    "books": [
      "bamidbar",
      "daniel"
    ],
    "periods": [
      "Exodus & Wilderness",
      "The Prophets"
    ],
    "aliases": [
      "Cyprus",
      "Chittim"
    ]
  },
  {
    "id": "laban",
    "name": "Laban",
    "lat": 29.89996,
    "lng": 34.73955,
    "type": "river",
    "books": [
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "lachish",
    "name": "Lachish",
    "lat": 31.56528,
    "lng": 34.84917,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "melajimb",
      "mija",
      "nehemia",
      "yehoshua",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "lahmam",
    "name": "Lahmam",
    "lat": 31.57183,
    "lng": 34.896,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Lahmas",
      "Lahma"
    ]
  },
  {
    "id": "laishah",
    "name": "Laishah",
    "lat": 31.79861,
    "lng": 35.24833,
    "type": "city",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Laish"
    ]
  },
  {
    "id": "lakum",
    "name": "Lakum",
    "lat": 32.69827,
    "lng": 35.55186,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Lakum"
    ]
  },
  {
    "id": "lasha",
    "name": "Lasha",
    "lat": 31.597,
    "lng": 35.55931,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "lasharon",
    "name": "Lasharon",
    "lat": 32.2843,
    "lng": 34.91195,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "lebanon",
    "name": "Lebanon",
    "lat": 33.85717,
    "lng": 35.80443,
    "type": "region",
    "books": [
      "devarim",
      "divre-hayamim-b",
      "ezra",
      "habakuk",
      "hoshea",
      "melajima",
      "melajimb",
      "nahum",
      "shir-hashirim",
      "shoftim",
      "tehilim",
      "yehoshua",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "lebaot",
    "name": "Lebaot",
    "lat": 31.00669,
    "lng": 34.49181,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "lebo-hamat",
    "name": "Lebo-Hamat",
    "lat": 34.19491,
    "lng": 36.34956,
    "type": "city",
    "books": [
      "amosh",
      "bamidbar",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "melajimb",
      "shoftim",
      "yehoshua",
      "yejezkel"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Hamath"
    ]
  },
  {
    "id": "lebonah",
    "name": "Lebonah",
    "lat": 32.05906,
    "lng": 35.24979,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "lehem",
    "name": "Lehem",
    "lat": 31.70431,
    "lng": 35.20764,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Jashubi-lehem"
    ]
  },
  {
    "id": "lehi",
    "name": "Lehi",
    "lat": 31.7488,
    "lng": 35.00101,
    "type": "city",
    "books": [
      "shmuelb",
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "libnah-1",
    "name": "Libnah 1",
    "lat": 31.6299,
    "lng": 34.87347,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajimb",
      "yehoshua",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "libnah-2",
    "name": "Libnah 2",
    "lat": 31.23194,
    "lng": 34.10667,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "libya",
    "name": "Libya",
    "lat": 31.46211,
    "lng": 21.8085,
    "type": "region",
    "books": [
      "nahum",
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "lo-debar",
    "name": "Lo-Debar",
    "lat": 32.56576,
    "lng": 35.61221,
    "type": "city",
    "books": [
      "amosh",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "lod",
    "name": "Lod",
    "lat": 31.95,
    "lng": 34.9,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "ezra",
      "nehemia"
    ],
    "periods": [
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "lower-beit-horon",
    "name": "Lower Beit-Horon",
    "lat": 31.895,
    "lng": 35.08361,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Lower"
    ]
  },
  {
    "id": "lower-gulot",
    "name": "Lower Gulot",
    "lat": 31.43282,
    "lng": 35.01485,
    "type": "water",
    "books": [
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "lower-pool",
    "name": "Lower Pool",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "water",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "lud-1",
    "name": "Lud 1",
    "lat": 38.65368,
    "lng": 28.8049,
    "type": "region",
    "books": [
      "yejezkel",
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Lydia"
    ]
  },
  {
    "id": "lud-2",
    "name": "Lud 2",
    "lat": 38.65368,
    "lng": 28.8049,
    "type": "region",
    "books": [
      "yejezkel",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Lydia"
    ]
  },
  {
    "id": "luhit",
    "name": "Luhit",
    "lat": 31.13788,
    "lng": 35.62223,
    "type": "city",
    "books": [
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Ascent of Luhith"
    ]
  },
  {
    "id": "luz-1",
    "name": "Luz 1",
    "lat": 31.92278,
    "lng": 35.24139,
    "type": "city",
    "books": [
      "bereshit",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Patriarchs",
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "luz-2",
    "name": "Luz 2",
    "lat": 33.46028,
    "lng": 35.53556,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "maakah",
    "name": "Maakah",
    "lat": 33.20614,
    "lng": 35.79035,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "shmuelb",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": [
      "Maakah"
    ]
  },
  {
    "id": "maarat",
    "name": "Maarat",
    "lat": 31.62071,
    "lng": 35.11352,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "maareh-geba",
    "name": "Maareh-Geba",
    "lat": 31.82341,
    "lng": 35.23072,
    "type": "region",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "machbenah",
    "name": "Machbenah",
    "lat": 31.55415,
    "lng": 34.8968,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Makbenah",
      "Machbena",
      "Macbenah"
    ]
  },
  {
    "id": "machpelah",
    "name": "Machpelah",
    "lat": 31.52467,
    "lng": 35.11076,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "madmanah",
    "name": "Madmanah",
    "lat": 31.35027,
    "lng": 34.92858,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "madmen",
    "name": "Madmen",
    "lat": 31.29182,
    "lng": 35.70481,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "madmenah",
    "name": "Madmenah",
    "lat": 31.82014,
    "lng": 35.22322,
    "type": "city",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "madon",
    "name": "Madon",
    "lat": 32.79972,
    "lng": 35.45972,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "magbish",
    "name": "Magbish",
    "lat": 31.63816,
    "lng": 34.95317,
    "type": "city",
    "books": [
      "ezra"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "magog",
    "name": "Magog",
    "lat": 38.65368,
    "lng": 28.8049,
    "type": "region",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "mahalab",
    "name": "Mahalab",
    "lat": 33.3178,
    "lng": 35.24337,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Hebel",
      "Mehebel"
    ]
  },
  {
    "id": "mahanaim",
    "name": "Mahanaim",
    "lat": 32.18575,
    "lng": 35.68667,
    "type": "city",
    "books": [
      "bereshit",
      "divre-hayamim-a",
      "melajima",
      "shir-hashirim",
      "shmuelb",
      "yehoshua"
    ],
    "periods": [
      "Patriarchs",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "mahaneh-dan-1",
    "name": "Mahaneh-Dan 1",
    "lat": 31.77913,
    "lng": 34.99353,
    "type": "region",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Camp of Dan"
    ]
  },
  {
    "id": "mahaneh-dan-2",
    "name": "Mahaneh-Dan 2",
    "lat": 31.77913,
    "lng": 34.99353,
    "type": "region",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Camp of Dan"
    ]
  },
  {
    "id": "makaz",
    "name": "Makaz",
    "lat": 31.80314,
    "lng": 34.81118,
    "type": "city",
    "books": [
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "makhelot",
    "name": "Makhelot",
    "lat": 30.19306,
    "lng": 34.42111,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "makedah",
    "name": "Makedah",
    "lat": 31.53472,
    "lng": 34.96656,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "mamre",
    "name": "Mamre",
    "lat": 31.55654,
    "lng": 35.10534,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "manahat",
    "name": "Manahat",
    "lat": 31.75367,
    "lng": 35.18901,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "maon",
    "name": "Maon",
    "lat": 31.40945,
    "lng": 35.13384,
    "type": "city",
    "books": [
      "shmuela",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "marah",
    "name": "Marah",
    "lat": 29.34604,
    "lng": 32.94284,
    "type": "water",
    "books": [
      "bamidbar",
      "shemot"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "mareal",
    "name": "Mareal",
    "lat": 32.65426,
    "lng": 35.16869,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Maralah"
    ]
  },
  {
    "id": "mareshah",
    "name": "Mareshah",
    "lat": 31.59296,
    "lng": 34.89824,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "mija",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "marot",
    "name": "Marot",
    "lat": 31.62071,
    "lng": 35.11352,
    "type": "city",
    "books": [
      "mija"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "masrekah",
    "name": "Masrekah",
    "lat": 29.94768,
    "lng": 35.46361,
    "type": "region",
    "books": [
      "bereshit",
      "divre-hayamim-a"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "masah",
    "name": "Masah",
    "lat": 28.62313,
    "lng": 33.88028,
    "type": "region",
    "books": [
      "devarim",
      "shemot",
      "tehilim"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "matanah",
    "name": "Matanah",
    "lat": 31.58835,
    "lng": 35.90793,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "me-yarkon",
    "name": "Me-Yarkon",
    "lat": 32.11527,
    "lng": 34.86941,
    "type": "water",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "mearah",
    "name": "Mearah",
    "lat": 33.54,
    "lng": 35.58361,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Arah"
    ]
  },
  {
    "id": "mekonah",
    "name": "Mekonah",
    "lat": 31.35027,
    "lng": 34.92858,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Mekonah"
    ]
  },
  {
    "id": "medeba",
    "name": "Medeba",
    "lat": 31.71611,
    "lng": 35.79548,
    "type": "city",
    "books": [
      "bamidbar",
      "divre-hayamim-a",
      "yehoshua",
      "yeshayahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "media",
    "name": "Media",
    "lat": 34.50728,
    "lng": 49.10749,
    "type": "region",
    "books": [
      "daniel",
      "ester",
      "ezra",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "megido",
    "name": "Megido",
    "lat": 32.58528,
    "lng": 35.18444,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "melajimb",
      "shoftim",
      "yehoshua",
      "zejaria"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "memfis",
    "name": "Memfis",
    "lat": 29.8488,
    "lng": 31.253,
    "type": "city",
    "books": [
      "hoshea",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Noph"
    ]
  },
  {
    "id": "mefaat",
    "name": "Mefaat",
    "lat": 31.85747,
    "lng": 35.93161,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua",
      "yirmiyahu"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "merataim",
    "name": "Merataim",
    "lat": 32.54333,
    "lng": 44.42222,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "meribah-1",
    "name": "Meribah 1",
    "lat": 30.64833,
    "lng": 34.42222,
    "type": "city",
    "books": [
      "bamidbar",
      "devarim",
      "tehilim",
      "yejezkel"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Waters of Meribah"
    ]
  },
  {
    "id": "meribah-2",
    "name": "Meribah 2",
    "lat": 28.62313,
    "lng": 33.88028,
    "type": "region",
    "books": [
      "devarim",
      "shemot",
      "tehilim"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "meronot",
    "name": "Meronot",
    "lat": 31.88601,
    "lng": 35.21642,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "nehemia"
    ],
    "periods": [
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "meroz",
    "name": "Meroz",
    "lat": 33.0322,
    "lng": 35.52987,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "mesha",
    "name": "Mesha",
    "lat": 29.40821,
    "lng": 40.38819,
    "type": "region",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "meshech",
    "name": "Meshech",
    "lat": 39.67298,
    "lng": 31.99417,
    "type": "region",
    "books": [
      "tehilim",
      "yejezkel",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Meshek"
    ]
  },
  {
    "id": "meteg-amah",
    "name": "Meteg-Amah",
    "lat": 31.69972,
    "lng": 34.84694,
    "type": "city",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Gath"
    ]
  },
  {
    "id": "mezahab",
    "name": "Mezahab",
    "lat": 31.8066,
    "lng": 36.05075,
    "type": "city",
    "books": [
      "bereshit",
      "divre-hayamim-a"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era"
    ],
    "aliases": [
      "Me-Zahab"
    ]
  },
  {
    "id": "michmash",
    "name": "Michmash",
    "lat": 31.87282,
    "lng": 35.27686,
    "type": "city",
    "books": [
      "ezra",
      "nehemia",
      "shmuela",
      "yeshayahu"
    ],
    "periods": [
      "United Monarchy",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Mikmash",
      "Micmash"
    ]
  },
  {
    "id": "michmetat",
    "name": "Michmetat",
    "lat": 32.19836,
    "lng": 35.30698,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Mikmethath",
      "Micmethath",
      "Michmethah"
    ]
  },
  {
    "id": "midin",
    "name": "Midin",
    "lat": 31.74153,
    "lng": 35.40589,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "middle-gate",
    "name": "Middle Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "midian",
    "name": "Midian",
    "lat": 28.85281,
    "lng": 35.10486,
    "type": "region",
    "books": [
      "bamidbar",
      "bereshit",
      "divre-hayamim-a",
      "habakuk",
      "melajima",
      "shemot",
      "shoftim",
      "tehilim",
      "yehoshua",
      "yeshayahu"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "migdal-el",
    "name": "Migdal-El",
    "lat": 33.08619,
    "lng": 35.41667,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "migdal-gad",
    "name": "Migdal-Gad",
    "lat": 31.53721,
    "lng": 34.90191,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "migdol-1",
    "name": "Migdol 1",
    "lat": 30.96478,
    "lng": 32.49286,
    "type": "city",
    "books": [
      "bamidbar",
      "shemot"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "migdol-2",
    "name": "Migdol 2",
    "lat": 30.96478,
    "lng": 32.49286,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "migdol-3",
    "name": "Migdol 3",
    "lat": 30.96478,
    "lng": 32.49286,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "migron-1",
    "name": "Migron 1",
    "lat": 31.86921,
    "lng": 35.26807,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "migron-2",
    "name": "Migron 2",
    "lat": 31.86921,
    "lng": 35.26807,
    "type": "city",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "milo",
    "name": "Milo",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "mini",
    "name": "Mini",
    "lat": 36.5866,
    "lng": 46.27528,
    "type": "region",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "minit",
    "name": "Minit",
    "lat": 31.82021,
    "lng": 35.87468,
    "type": "city",
    "books": [
      "shoftim",
      "yejezkel"
    ],
    "periods": [
      "Conquest & Judges",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "mishal",
    "name": "Mishal",
    "lat": 32.87276,
    "lng": 35.15133,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "misrefot-maim",
    "name": "Misrefot-Maim",
    "lat": 33.08508,
    "lng": 35.10623,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Brook Misrephoth"
    ]
  },
  {
    "id": "mitkah",
    "name": "Mitkah",
    "lat": 31.25157,
    "lng": 34.84083,
    "type": "region",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Mithcah"
    ]
  },
  {
    "id": "mizpah-1",
    "name": "Mizpah 1",
    "lat": 32.11851,
    "lng": 35.77702,
    "type": "city",
    "books": [
      "hoshea",
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges",
      "The Prophets"
    ],
    "aliases": [
      "Mizpeh"
    ]
  },
  {
    "id": "mizpah-2",
    "name": "Mizpah 2",
    "lat": 33.40422,
    "lng": 35.85,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Mizpeh"
    ]
  },
  {
    "id": "mizpah-3",
    "name": "Mizpah 3",
    "lat": 31.88514,
    "lng": 35.21642,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "melajima",
      "melajimb",
      "nehemia",
      "shmuela",
      "shoftim",
      "yirmiyahu"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "mizpah-4",
    "name": "Mizpah 4",
    "lat": 32.11851,
    "lng": 35.77702,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Galeed"
    ]
  },
  {
    "id": "mizpeh-1",
    "name": "Mizpeh 1",
    "lat": 31.88514,
    "lng": 35.21642,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Mizpah"
    ]
  },
  {
    "id": "mizpeh-2",
    "name": "Mizpeh 2",
    "lat": 31.50259,
    "lng": 34.7583,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Mizpah"
    ]
  },
  {
    "id": "mizpeh-3",
    "name": "Mizpeh 3",
    "lat": 31.42602,
    "lng": 35.91095,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Mizpah"
    ]
  },
  {
    "id": "moladah",
    "name": "Moladah",
    "lat": 31.2573,
    "lng": 34.92141,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "nehemia",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "moreh-1",
    "name": "Moreh 1",
    "lat": 32.21376,
    "lng": 35.28194,
    "type": "region",
    "books": [
      "bereshit",
      "devarim"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "moreh-2",
    "name": "Moreh 2",
    "lat": 32.61764,
    "lng": 35.34873,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "moreshet-gat",
    "name": "Moreshet-Gat",
    "lat": 31.63336,
    "lng": 34.91661,
    "type": "city",
    "books": [
      "mija",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Moresheth"
    ]
  },
  {
    "id": "moriah",
    "name": "Moriah",
    "lat": 31.77807,
    "lng": 35.23556,
    "type": "region",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "mortar",
    "name": "Mortar",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "tzefania"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Hollow",
      "Maktesh"
    ]
  },
  {
    "id": "moserot",
    "name": "Moserot",
    "lat": 30.83891,
    "lng": 35.05687,
    "type": "region",
    "books": [
      "bamidbar",
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Moserah"
    ]
  },
  {
    "id": "most-holy-place-2",
    "name": "Most Holy Place 2",
    "lat": 31.77778,
    "lng": 35.23556,
    "type": "city",
    "books": [
      "daniel",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "tehilim",
      "yejezkel"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Holy of Holies"
    ]
  },
  {
    "id": "mount-baal-hermon",
    "name": "Mount Baal-Hermon",
    "lat": 33.4,
    "lng": 35.85,
    "type": "mountain",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Baal-hermon"
    ]
  },
  {
    "id": "mount-baalah",
    "name": "Mount Baalah",
    "lat": 31.84139,
    "lng": 34.78583,
    "type": "mountain",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Baalah"
    ]
  },
  {
    "id": "mount-bashan",
    "name": "Mount Bashan",
    "lat": 33.4,
    "lng": 35.85,
    "type": "mountain",
    "books": [
      "tehilim"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "mount-karmel",
    "name": "Mount Karmel",
    "lat": 32.6725,
    "lng": 35.02333,
    "type": "mountain",
    "books": [
      "amosh",
      "melajima",
      "melajimb",
      "mija",
      "nahum",
      "shir-hashirim",
      "yehoshua",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Carmel"
    ]
  },
  {
    "id": "mount-ebal",
    "name": "Mount Ebal",
    "lat": 32.234,
    "lng": 35.2733,
    "type": "mountain",
    "books": [
      "devarim",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": [
      "Ebal"
    ]
  },
  {
    "id": "mount-efraim",
    "name": "Mount Efraim",
    "lat": 32.08378,
    "lng": 35.19721,
    "type": "mountain",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Ephraim"
    ]
  },
  {
    "id": "mount-efron",
    "name": "Mount Efron",
    "lat": 31.79694,
    "lng": 35.14417,
    "type": "mountain",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Ephron"
    ]
  },
  {
    "id": "mount-esav",
    "name": "Mount Esav",
    "lat": 30.35796,
    "lng": 35.42955,
    "type": "mountain",
    "books": [
      "ovadia"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Esau"
    ]
  },
  {
    "id": "mount-gerizim",
    "name": "Mount Gerizim",
    "lat": 32.19944,
    "lng": 35.27278,
    "type": "mountain",
    "books": [
      "devarim",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": [
      "Gerizim"
    ]
  },
  {
    "id": "mount-gilboa",
    "name": "Mount Gilboa",
    "lat": 32.43389,
    "lng": 35.41444,
    "type": "mountain",
    "books": [
      "divre-hayamim-a",
      "shmuela",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": [
      "Gilboa"
    ]
  },
  {
    "id": "mount-gilead",
    "name": "Mount Gilead",
    "lat": 32.43389,
    "lng": 35.41444,
    "type": "mountain",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Mount of Gilead",
      "Gilead"
    ]
  },
  {
    "id": "mount-halak",
    "name": "Mount Halak",
    "lat": 30.9144,
    "lng": 34.8287,
    "type": "mountain",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Halak"
    ]
  },
  {
    "id": "mount-heres",
    "name": "Mount Heres",
    "lat": 31.75062,
    "lng": 34.97474,
    "type": "mountain",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Har-heres",
      "Heres"
    ]
  },
  {
    "id": "mount-hermon",
    "name": "Mount Hermon",
    "lat": 33.4,
    "lng": 35.85,
    "type": "mountain",
    "books": [
      "devarim",
      "divre-hayamim-a",
      "shir-hashirim",
      "tehilim",
      "yehoshua",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Hermon"
    ]
  },
  {
    "id": "mount-hor-1",
    "name": "Mount Hor 1",
    "lat": 30.83206,
    "lng": 35.05687,
    "type": "mountain",
    "books": [
      "bamidbar",
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Hor"
    ]
  },
  {
    "id": "mount-hor-2",
    "name": "Mount Hor 2",
    "lat": 33.4,
    "lng": 35.85,
    "type": "mountain",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Hor"
    ]
  },
  {
    "id": "mount-horeb",
    "name": "Mount Horeb",
    "lat": 28.53972,
    "lng": 33.97333,
    "type": "mountain",
    "books": [
      "devarim",
      "divre-hayamim-b",
      "malaji",
      "melajima",
      "shemot",
      "tehilim"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": [
      "Horeb",
      "Mount Sinai"
    ]
  },
  {
    "id": "mount-yearim",
    "name": "Mount Yearim",
    "lat": 31.78126,
    "lng": 35.05111,
    "type": "mountain",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Jearim"
    ]
  },
  {
    "id": "mount-lebanon",
    "name": "Mount Lebanon",
    "lat": 33.87633,
    "lng": 35.78178,
    "type": "mountain",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Lebanon"
    ]
  },
  {
    "id": "mount-mizar",
    "name": "Mount Mizar",
    "lat": 33.40422,
    "lng": 35.85,
    "type": "mountain",
    "books": [
      "tehilim"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Hill Mizar",
      "Mizar"
    ]
  },
  {
    "id": "mount-moriah",
    "name": "Mount Moriah",
    "lat": 31.77778,
    "lng": 35.23556,
    "type": "mountain",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Moriah"
    ]
  },
  {
    "id": "mount-nebo",
    "name": "Mount Nebo",
    "lat": 31.76667,
    "lng": 35.75,
    "type": "mountain",
    "books": [
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Nebo"
    ]
  },
  {
    "id": "mount-of-olives",
    "name": "Mount of Olives",
    "lat": 31.77795,
    "lng": 35.24569,
    "type": "mountain",
    "books": [
      "melajima",
      "melajimb",
      "shmuelb",
      "zejaria"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": [
      "Olivet"
    ]
  },
  {
    "id": "mount-paran",
    "name": "Mount Paran",
    "lat": 28.53972,
    "lng": 33.97333,
    "type": "mountain",
    "books": [
      "devarim",
      "habakuk"
    ],
    "periods": [
      "Exodus & Wilderness",
      "The Prophets"
    ],
    "aliases": [
      "Paran"
    ]
  },
  {
    "id": "mount-perazim",
    "name": "Mount Perazim",
    "lat": 31.78525,
    "lng": 35.20474,
    "type": "mountain",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Perazim"
    ]
  },
  {
    "id": "mount-seir-1",
    "name": "Mount Seir 1",
    "lat": 30.35796,
    "lng": 35.42955,
    "type": "mountain",
    "books": [
      "bamidbar",
      "bereshit",
      "devarim",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "shoftim",
      "yehoshua",
      "yejezkel",
      "yeshayahu"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Seir"
    ]
  },
  {
    "id": "mount-seir-2",
    "name": "Mount Seir 2",
    "lat": 31.7966,
    "lng": 35.0653,
    "type": "mountain",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Seir"
    ]
  },
  {
    "id": "mount-shefer",
    "name": "Mount Shefer",
    "lat": 30.51348,
    "lng": 34.30356,
    "type": "mountain",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Mount Shapher",
      "Shapher"
    ]
  },
  {
    "id": "mount-sinai",
    "name": "Mount Sinai",
    "lat": 28.53972,
    "lng": 33.97333,
    "type": "mountain",
    "books": [
      "bamidbar",
      "devarim",
      "nehemia",
      "shemot",
      "shoftim",
      "tehilim",
      "vaikra"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": [
      "Sinai"
    ]
  },
  {
    "id": "mount-tabor",
    "name": "Mount Tabor",
    "lat": 32.68625,
    "lng": 35.39292,
    "type": "mountain",
    "books": [
      "hoshea",
      "shoftim",
      "tehilim",
      "yehoshua",
      "yirmiyahu"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Tabor"
    ]
  },
  {
    "id": "mount-tzalmon",
    "name": "Mount Tzalmon",
    "lat": 32.234,
    "lng": 35.2733,
    "type": "mountain",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Zalmon"
    ]
  },
  {
    "id": "mount-zemaraim",
    "name": "Mount Zemaraim",
    "lat": 31.94157,
    "lng": 35.29566,
    "type": "mountain",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Zemaraim"
    ]
  },
  {
    "id": "mount-tzion",
    "name": "Mount Tzion",
    "lat": 31.77167,
    "lng": 35.22861,
    "type": "mountain",
    "books": [
      "eja",
      "melajimb",
      "mija",
      "ovadia",
      "tehilim",
      "yeshayahu",
      "yirmiyahu",
      "yoel"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Zion"
    ]
  },
  {
    "id": "mozah",
    "name": "Mozah",
    "lat": 31.79289,
    "lng": 35.16419,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "muster-gate",
    "name": "Muster Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Inspection Gate",
      "Miphkad Gate",
      "Enrollment Gate",
      "Miphkad"
    ]
  },
  {
    "id": "naamah-1",
    "name": "Naamah 1",
    "lat": 31.56951,
    "lng": 34.84917,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "naamah-2",
    "name": "Naamah 2",
    "lat": 27.8825,
    "lng": 36.8975,
    "type": "city",
    "books": [
      "iyov"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "naarah",
    "name": "Naarah",
    "lat": 31.89347,
    "lng": 35.42475,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Naarath"
    ]
  },
  {
    "id": "naaran",
    "name": "Naaran",
    "lat": 31.89347,
    "lng": 35.42475,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "nahalal",
    "name": "Nahalal",
    "lat": 32.7988,
    "lng": 35.07006,
    "type": "city",
    "books": [
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "nahaliel",
    "name": "Nahaliel",
    "lat": 31.60825,
    "lng": 35.61504,
    "type": "river",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "nahor",
    "name": "Nahor",
    "lat": 36.88198,
    "lng": 39.03278,
    "type": "region",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "naiot",
    "name": "Naiot",
    "lat": 31.85463,
    "lng": 35.23161,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "nafot-dor",
    "name": "Nafot-Dor",
    "lat": 32.61743,
    "lng": 34.91636,
    "type": "city",
    "books": [
      "melajima",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Naphath-dor",
      "Napheth",
      "Naphat of Dor"
    ]
  },
  {
    "id": "neah",
    "name": "Neah",
    "lat": 32.8042,
    "lng": 35.42346,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "nebalat",
    "name": "Nebalat",
    "lat": 31.98644,
    "lng": 34.9589,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "nebo-1",
    "name": "Nebo 1",
    "lat": 31.74913,
    "lng": 35.74386,
    "type": "city",
    "books": [
      "bamidbar",
      "divre-hayamim-a",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "nebo-2",
    "name": "Nebo 2",
    "lat": 31.60721,
    "lng": 35.03673,
    "type": "city",
    "books": [
      "ezra",
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "nebo-3",
    "name": "Nebo 3",
    "lat": 31.60721,
    "lng": 35.03673,
    "type": "city",
    "books": [
      "ezra"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "negeb",
    "name": "Negeb",
    "lat": 31.12727,
    "lng": 34.77464,
    "type": "region",
    "books": [
      "bamidbar",
      "bereshit",
      "devarim",
      "divre-hayamim-b",
      "ovadia",
      "shmuela",
      "shmuelb",
      "shoftim",
      "tehilim",
      "yehoshua",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Negev",
      "South"
    ]
  },
  {
    "id": "nehelam",
    "name": "Nehelam",
    "lat": 32.75,
    "lng": 36.24083,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "neiel",
    "name": "Neiel",
    "lat": 32.8926,
    "lng": 35.2219,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "neftoah",
    "name": "Neftoah",
    "lat": 31.79439,
    "lng": 35.19661,
    "type": "water",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Waters of Nephtoah"
    ]
  },
  {
    "id": "netaim",
    "name": "Netaim",
    "lat": 31.6788,
    "lng": 34.93393,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "netofah",
    "name": "Netofah",
    "lat": 31.66765,
    "lng": 35.22103,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "ezra",
      "nehemia",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "new-gate",
    "name": "New Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "nezib",
    "name": "Nezib",
    "lat": 31.58586,
    "lng": 35.00979,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "nibshan",
    "name": "Nibshan",
    "lat": 31.69945,
    "lng": 35.38143,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "nile",
    "name": "Nile",
    "lat": 23.06582,
    "lng": 31.82804,
    "type": "water",
    "books": [
      "amosh",
      "bereshit",
      "nahum",
      "shemot",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "River",
      "Sihor"
    ]
  },
  {
    "id": "nimrah",
    "name": "Nimrah",
    "lat": 31.90911,
    "lng": 35.63872,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "nimrim",
    "name": "Nimrim",
    "lat": 31.09044,
    "lng": 35.60515,
    "type": "water",
    "books": [
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Waters of Nimrim"
    ]
  },
  {
    "id": "nineveh",
    "name": "Nineveh",
    "lat": 36.3594,
    "lng": 43.1528,
    "type": "city",
    "books": [
      "bereshit",
      "melajimb",
      "nahum",
      "tzefania",
      "yeshayahu",
      "yona"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "nob",
    "name": "Nob",
    "lat": 31.7925,
    "lng": 35.24417,
    "type": "city",
    "books": [
      "nehemia",
      "shmuela",
      "shmuelb",
      "yeshayahu"
    ],
    "periods": [
      "United Monarchy",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "nobah-1",
    "name": "Nobah 1",
    "lat": 32.75616,
    "lng": 36.61899,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "nobah-2",
    "name": "Nobah 2",
    "lat": 32.75616,
    "lng": 36.61899,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "nofah",
    "name": "Nofah",
    "lat": 31.42602,
    "lng": 35.91095,
    "type": "region",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "north",
    "name": "North",
    "lat": 35.89288,
    "lng": 35.69525,
    "type": "region",
    "books": [
      "daniel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "north-gate",
    "name": "North Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "obot",
    "name": "Obot",
    "lat": 30.61667,
    "lng": 35.19,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "old-pool",
    "name": "Old Pool",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "water",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "ono",
    "name": "Ono",
    "lat": 32.02722,
    "lng": 34.86806,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "ezra",
      "nehemia"
    ],
    "periods": [
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "ofel",
    "name": "Ofel",
    "lat": 31.77533,
    "lng": 35.23622,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "nehemia"
    ],
    "periods": [
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "ofir",
    "name": "Ofir",
    "lat": 22.59888,
    "lng": 39.82413,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "iyov",
      "melajima",
      "tehilim",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "ofni",
    "name": "Ofni",
    "lat": 31.96194,
    "lng": 35.21556,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ofrah-1",
    "name": "Ofrah 1",
    "lat": 31.95444,
    "lng": 35.30028,
    "type": "city",
    "books": [
      "shmuela",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "ofrah-2",
    "name": "Ofrah 2",
    "lat": 32.6057,
    "lng": 35.29,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "padan-aram",
    "name": "Padan-Aram",
    "lat": 36.45589,
    "lng": 39.46389,
    "type": "region",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Padan Aram"
    ]
  },
  {
    "id": "parah",
    "name": "Parah",
    "lat": 31.8348,
    "lng": 35.31048,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "paran",
    "name": "Paran",
    "lat": 30.29397,
    "lng": 34.39822,
    "type": "region",
    "books": [
      "bamidbar",
      "bereshit",
      "devarim",
      "melajima",
      "shmuela"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": [
      "Desert of Paran",
      "Wilderness of Paran"
    ]
  },
  {
    "id": "parbar",
    "name": "Parbar",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "parvaim",
    "name": "Parvaim",
    "lat": 16.87194,
    "lng": 43.71139,
    "type": "city",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "patros",
    "name": "Patros",
    "lat": 26.80062,
    "lng": 31.85909,
    "type": "region",
    "books": [
      "yejezkel",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Upper Egypt"
    ]
  },
  {
    "id": "pau",
    "name": "Pau",
    "lat": 31.06929,
    "lng": 35.13574,
    "type": "river",
    "books": [
      "bereshit",
      "divre-hayamim-a"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "pekod",
    "name": "Pekod",
    "lat": 31.04913,
    "lng": 48.36271,
    "type": "region",
    "books": [
      "yejezkel",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "pelusium",
    "name": "Pelusium",
    "lat": 31.04251,
    "lng": 32.54614,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Sin"
    ]
  },
  {
    "id": "penuel",
    "name": "Penuel",
    "lat": 32.18702,
    "lng": 35.69211,
    "type": "city",
    "books": [
      "bereshit",
      "melajima",
      "shoftim"
    ],
    "periods": [
      "Patriarchs",
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Peniel"
    ]
  },
  {
    "id": "people-s-gate",
    "name": "People’s Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Gate of the People"
    ]
  },
  {
    "id": "peor",
    "name": "Peor",
    "lat": 31.77717,
    "lng": 35.7385,
    "type": "region",
    "books": [
      "bamidbar",
      "devarim",
      "tehilim",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "perez-uzah",
    "name": "Perez-Uzah",
    "lat": 31.77681,
    "lng": 35.23417,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": [
      "Outburst Against Uzzah",
      "Perez Uzza"
    ]
  },
  {
    "id": "persia",
    "name": "Persia",
    "lat": 35.33727,
    "lng": 37.91772,
    "type": "region",
    "books": [
      "daniel",
      "divre-hayamim-b",
      "ester",
      "ezra",
      "yejezkel"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "petor",
    "name": "Petor",
    "lat": 36.7014,
    "lng": 38.0865,
    "type": "city",
    "books": [
      "bamidbar",
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "farpar",
    "name": "Farpar",
    "lat": 33.35525,
    "lng": 36.19487,
    "type": "water",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "philistia",
    "name": "Philistia",
    "lat": 31.42598,
    "lng": 34.39746,
    "type": "region",
    "books": [
      "amosh",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "ovadia",
      "shemot",
      "shmuela",
      "shmuelb",
      "shoftim",
      "tehilim",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "yoel",
      "zejaria"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "pi-beset",
    "name": "Pi-Beset",
    "lat": 30.57278,
    "lng": 31.51,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Bubastis"
    ]
  },
  {
    "id": "pi-hahirot",
    "name": "Pi-Hahirot",
    "lat": 30.22987,
    "lng": 32.438,
    "type": "region",
    "books": [
      "bamidbar",
      "shemot"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "piraton",
    "name": "Piraton",
    "lat": 32.19056,
    "lng": 35.16583,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shmuelb",
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "pisgah",
    "name": "Pisgah",
    "lat": 31.76778,
    "lng": 35.72556,
    "type": "city",
    "books": [
      "bamidbar",
      "devarim",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "pishon",
    "name": "Pishon",
    "lat": 27.16878,
    "lng": 44.15785,
    "type": "water",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Pison"
    ]
  },
  {
    "id": "pitom",
    "name": "Pitom",
    "lat": 30.5475,
    "lng": 31.96361,
    "type": "city",
    "books": [
      "shemot"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "potsherd-gate",
    "name": "Potsherd Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Gate of Broken Pots",
      "Gate of the Potsherd"
    ]
  },
  {
    "id": "punon",
    "name": "Punon",
    "lat": 30.62775,
    "lng": 35.49365,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "put",
    "name": "Put",
    "lat": 31.46211,
    "lng": 21.8085,
    "type": "region",
    "books": [
      "nahum",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Libya"
    ]
  },
  {
    "id": "raamah",
    "name": "Raamah",
    "lat": 17.47727,
    "lng": 44.17937,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "rabah-1",
    "name": "Rabah 1",
    "lat": 31.9547,
    "lng": 35.9343,
    "type": "city",
    "books": [
      "amosh",
      "devarim",
      "divre-hayamim-a",
      "shmuelb",
      "yehoshua",
      "yejezkel",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "rabah-2",
    "name": "Rabah 2",
    "lat": 31.82704,
    "lng": 34.98761,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "rabit",
    "name": "Rabit",
    "lat": 32.69728,
    "lng": 35.37753,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "rakal",
    "name": "Rakal",
    "lat": 31.42288,
    "lng": 35.13295,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Rakal",
      "Rachal"
    ]
  },
  {
    "id": "rakat",
    "name": "Rakat",
    "lat": 32.80639,
    "lng": 35.52583,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "rakon",
    "name": "Rakon",
    "lat": 32.13083,
    "lng": 34.78726,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ramah-1",
    "name": "Ramah 1",
    "lat": 31.85434,
    "lng": 35.23161,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "ezra",
      "hoshea",
      "melajima",
      "nehemia",
      "shoftim",
      "yehoshua",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "ramah-2",
    "name": "Ramah 2",
    "lat": 33.1108,
    "lng": 35.3106,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ramah-3",
    "name": "Ramah 3",
    "lat": 32.93925,
    "lng": 35.36711,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "ramah-4",
    "name": "Ramah 4",
    "lat": 31.85434,
    "lng": 35.23161,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "ramah-5",
    "name": "Ramah 5",
    "lat": 32.49985,
    "lng": 36.01499,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Ramoth",
      "Ramoth-gilead"
    ]
  },
  {
    "id": "ramah-6",
    "name": "Ramah 6",
    "lat": 31.80896,
    "lng": 35.10378,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Ramath"
    ]
  },
  {
    "id": "ramah-7",
    "name": "Ramah 7",
    "lat": 31.85434,
    "lng": 35.23161,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "ramah-8",
    "name": "Ramah 8",
    "lat": 31.82326,
    "lng": 35.23072,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "ramah-9",
    "name": "Ramah 9",
    "lat": 31.85434,
    "lng": 35.23161,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "ramat-lehi",
    "name": "Ramat-Lehi",
    "lat": 31.7488,
    "lng": 35.00101,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Jawbone Hill"
    ]
  },
  {
    "id": "ramat-mizpeh",
    "name": "Ramat-Mizpeh",
    "lat": 32.11851,
    "lng": 35.77702,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Ramath Mizpah",
      "Ramah-Mizpeh"
    ]
  },
  {
    "id": "ramataim-tzofim",
    "name": "Ramataim-Tzofim",
    "lat": 31.85434,
    "lng": 35.23161,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Ramathaim",
      "Ramah"
    ]
  },
  {
    "id": "rameses",
    "name": "Rameses",
    "lat": 30.79937,
    "lng": 31.83422,
    "type": "city",
    "books": [
      "bamidbar",
      "bereshit",
      "shemot"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "ramot-1",
    "name": "Ramot 1",
    "lat": 32.59556,
    "lng": 35.52139,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "ramot-2",
    "name": "Ramot 2",
    "lat": 31.80896,
    "lng": 35.10378,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "ramot-3",
    "name": "Ramot 3",
    "lat": 32.49985,
    "lng": 36.01499,
    "type": "city",
    "books": [
      "devarim",
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "ramot-gilead",
    "name": "Ramot-Gilead",
    "lat": 32.49985,
    "lng": 36.01499,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "melajima",
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "rekah",
    "name": "Rekah",
    "lat": 31.70504,
    "lng": 35.20764,
    "type": "region",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Rekah",
      "Rechah"
    ]
  },
  {
    "id": "red-sea-1",
    "name": "Red Sea 1",
    "lat": 30.29271,
    "lng": 32.44787,
    "type": "water",
    "books": [
      "bamidbar",
      "devarim",
      "nehemia",
      "shemot",
      "tehilim",
      "yehoshua",
      "yeshayahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "red-sea-2",
    "name": "Red Sea 2",
    "lat": 28.67659,
    "lng": 34.69125,
    "type": "water",
    "books": [
      "divre-hayamim-b",
      "melajima",
      "shemot",
      "shoftim",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "red-sea-3",
    "name": "Red Sea 3",
    "lat": 28.60738,
    "lng": 33.18069,
    "type": "water",
    "books": [
      "bamidbar",
      "shemot"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "rehob-1",
    "name": "Rehob 1",
    "lat": 33.88951,
    "lng": 36.04811,
    "type": "region",
    "books": [
      "bamidbar",
      "shmuelb"
    ],
    "periods": [
      "Exodus & Wilderness",
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "rehob-2",
    "name": "Rehob 2",
    "lat": 32.90139,
    "lng": 35.16944,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "rehob-3",
    "name": "Rehob 3",
    "lat": 32.90139,
    "lng": 35.16944,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "rehobot-1",
    "name": "Rehobot 1",
    "lat": 31.03111,
    "lng": 34.56583,
    "type": "water",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "rehobot-2",
    "name": "Rehobot 2",
    "lat": 30.93318,
    "lng": 35.61089,
    "type": "city",
    "books": [
      "bereshit",
      "divre-hayamim-a"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "rehobot-ir",
    "name": "Rehobot-Ir",
    "lat": 36.3594,
    "lng": 43.1528,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Rehoboth"
    ]
  },
  {
    "id": "rekem",
    "name": "Rekem",
    "lat": 31.87129,
    "lng": 35.19222,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "remet",
    "name": "Remet",
    "lat": 32.59556,
    "lng": 35.52139,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "refidim",
    "name": "Refidim",
    "lat": 28.60859,
    "lng": 33.86027,
    "type": "river",
    "books": [
      "bamidbar",
      "shemot"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "resen",
    "name": "Resen",
    "lat": 36.15806,
    "lng": 43.25944,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "rezef",
    "name": "Rezef",
    "lat": 35.62778,
    "lng": 38.75639,
    "type": "city",
    "books": [
      "melajimb",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "rhodes-2",
    "name": "Rhodes 2",
    "lat": 36.16874,
    "lng": 27.97349,
    "type": "region",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Dedan"
    ]
  },
  {
    "id": "riblah-1",
    "name": "Riblah 1",
    "lat": 34.45955,
    "lng": 36.57262,
    "type": "city",
    "books": [
      "melajimb",
      "yejezkel",
      "yirmiyahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "riblah-2",
    "name": "Riblah 2",
    "lat": 34.39674,
    "lng": 36.38715,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "rimon-1",
    "name": "Rimon 1",
    "lat": 31.92972,
    "lng": 35.29889,
    "type": "city",
    "books": [
      "shoftim",
      "yeshayahu"
    ],
    "periods": [
      "Conquest & Judges",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "rimon-2",
    "name": "Rimon 2",
    "lat": 31.37124,
    "lng": 34.86489,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "yehoshua",
      "zejaria"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "rimon-3",
    "name": "Rimon 3",
    "lat": 32.78806,
    "lng": 35.31056,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Remmon-methoar"
    ]
  },
  {
    "id": "rimon-perez",
    "name": "Rimon-Perez",
    "lat": 29.50359,
    "lng": 34.68636,
    "type": "river",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Rimmon-parez"
    ]
  },
  {
    "id": "rimono",
    "name": "Rimono",
    "lat": 32.78806,
    "lng": 35.31056,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Rimmon"
    ]
  },
  {
    "id": "risah",
    "name": "Risah",
    "lat": 30.00296,
    "lng": 34.68193,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "ritmah",
    "name": "Ritmah",
    "lat": 29.04156,
    "lng": 34.04568,
    "type": "river",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "river-2",
    "name": "River 2",
    "lat": 35.79538,
    "lng": 41.29119,
    "type": "water",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Euphrates River",
      "Euphrates"
    ]
  },
  {
    "id": "river-3",
    "name": "River 3",
    "lat": 30.95569,
    "lng": 35.7095,
    "type": "water",
    "books": [
      "bereshit",
      "divre-hayamim-a"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era"
    ],
    "aliases": [
      "Euphrates",
      "Euphrates River"
    ]
  },
  {
    "id": "rock-of-escape",
    "name": "Rock of Escape",
    "lat": 31.45678,
    "lng": 35.23172,
    "type": "river",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Sela Hammahlekoth",
      "Rock of Division",
      "Rock of Separation"
    ]
  },
  {
    "id": "rogelim",
    "name": "Rogelim",
    "lat": 32.52789,
    "lng": 35.78063,
    "type": "city",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "rumah",
    "name": "Rumah",
    "lat": 32.78892,
    "lng": 35.29321,
    "type": "city",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "sahar",
    "name": "Sahar",
    "lat": 33.55083,
    "lng": 36.13972,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Zahar"
    ]
  },
  {
    "id": "salekah",
    "name": "Salekah",
    "lat": 32.4939,
    "lng": 36.7105,
    "type": "city",
    "books": [
      "devarim",
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Salekah",
      "Salcah"
    ]
  },
  {
    "id": "salem",
    "name": "Salem",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "bereshit",
      "tehilim"
    ],
    "periods": [
      "Patriarchs",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "salt-sea",
    "name": "Salt Sea",
    "lat": 31.40948,
    "lng": 35.47327,
    "type": "water",
    "books": [
      "bamidbar",
      "bereshit",
      "devarim",
      "divre-hayamim-b",
      "melajimb",
      "yehoshua",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "yoel",
      "zejaria"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Dead Sea"
    ]
  },
  {
    "id": "samaria-1",
    "name": "Samaria 1",
    "lat": 32.27611,
    "lng": 35.195,
    "type": "city",
    "books": [
      "amosh",
      "divre-hayamim-b",
      "ezra",
      "hoshea",
      "melajima",
      "melajimb",
      "mija",
      "nehemia",
      "ovadia",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "sansanah",
    "name": "Sansanah",
    "lat": 31.3445,
    "lng": 34.9014,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "sarid",
    "name": "Sarid",
    "lat": 32.66036,
    "lng": 35.2342,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "sea-of-mitzrayim",
    "name": "Sea of Mitzrayim",
    "lat": 30.29271,
    "lng": 32.44787,
    "type": "water",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Egyptian Sea",
      "Red Sea",
      "Gulf of Suez"
    ]
  },
  {
    "id": "sea-of-galil",
    "name": "Sea of Galil",
    "lat": 32.81208,
    "lng": 35.58595,
    "type": "water",
    "books": [
      "bamidbar",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges"
    ],
    "aliases": [
      "Chinneroth"
    ]
  },
  {
    "id": "sea-of-yazer",
    "name": "Sea of Yazer",
    "lat": 32.0064,
    "lng": 35.73498,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Jazer"
    ]
  },
  {
    "id": "sekakah",
    "name": "Sekakah",
    "lat": 31.71684,
    "lng": 35.39159,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Sekakah"
    ]
  },
  {
    "id": "second-quarter",
    "name": "Second Quarter",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "melajimb",
      "nehemia",
      "tzefania"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "New Quarter",
      "Second District"
    ]
  },
  {
    "id": "seku",
    "name": "Seku",
    "lat": 31.93738,
    "lng": 35.14474,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Seku",
      "Sechu"
    ]
  },
  {
    "id": "seirah",
    "name": "Seirah",
    "lat": 31.99644,
    "lng": 35.35356,
    "type": "region",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Seirath"
    ]
  },
  {
    "id": "sela-1",
    "name": "Sela 1",
    "lat": 30.91084,
    "lng": 35.13126,
    "type": "region",
    "books": [
      "divre-hayamim-b",
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "sela-2",
    "name": "Sela 2",
    "lat": 30.32675,
    "lng": 35.434,
    "type": "city",
    "books": [
      "melajimb",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Joktheel"
    ]
  },
  {
    "id": "sela-3",
    "name": "Sela 3",
    "lat": 30.32675,
    "lng": 35.434,
    "type": "city",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "senaah",
    "name": "Senaah",
    "lat": 31.9472,
    "lng": 35.39974,
    "type": "city",
    "books": [
      "ezra",
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "seneh",
    "name": "Seneh",
    "lat": 31.85309,
    "lng": 35.28617,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "senir",
    "name": "Senir",
    "lat": 33.4,
    "lng": 35.85,
    "type": "city",
    "books": [
      "devarim",
      "divre-hayamim-a",
      "shir-hashirim",
      "yejezkel"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "sefar",
    "name": "Sefar",
    "lat": 14.2139,
    "lng": 44.40287,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "sefarad",
    "name": "Sefarad",
    "lat": 38.48833,
    "lng": 28.04028,
    "type": "city",
    "books": [
      "ovadia"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "sefarvaim",
    "name": "Sefarvaim",
    "lat": 34.1846,
    "lng": 36.67144,
    "type": "region",
    "books": [
      "melajimb",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "serpent-s-stone",
    "name": "Serpent’s Stone",
    "lat": 31.76721,
    "lng": 35.23599,
    "type": "region",
    "books": [
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Stone of Zoheleth",
      "Zoheleth"
    ]
  },
  {
    "id": "shaalbim",
    "name": "Shaalbim",
    "lat": 31.86981,
    "lng": 34.98714,
    "type": "city",
    "books": [
      "melajima",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "shaalbon",
    "name": "Shaalbon",
    "lat": 31.86981,
    "lng": 34.98714,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "shaalim",
    "name": "Shaalim",
    "lat": 31.87126,
    "lng": 34.98714,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Shalim"
    ]
  },
  {
    "id": "shaaraim-1",
    "name": "Shaaraim 1",
    "lat": 31.7355,
    "lng": 35.02757,
    "type": "city",
    "books": [
      "shmuela",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "shaaraim-2",
    "name": "Shaaraim 2",
    "lat": 31.467,
    "lng": 34.4041,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "shahazumah",
    "name": "Shahazumah",
    "lat": 32.54175,
    "lng": 35.3666,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Shahazimah"
    ]
  },
  {
    "id": "shalishah",
    "name": "Shalishah",
    "lat": 32.15466,
    "lng": 35.04417,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Shalisha"
    ]
  },
  {
    "id": "shalechet",
    "name": "Shalechet",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Shalleketh Gate",
      "Shalleketh",
      "Shallecheth Gate"
    ]
  },
  {
    "id": "shamir-1",
    "name": "Shamir 1",
    "lat": 31.4355,
    "lng": 34.9265,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "shamir-2",
    "name": "Shamir 2",
    "lat": 32.27611,
    "lng": 35.195,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "shafir",
    "name": "Shafir",
    "lat": 31.53472,
    "lng": 34.96656,
    "type": "city",
    "books": [
      "mija"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Saphir"
    ]
  },
  {
    "id": "sharon-1",
    "name": "Sharon 1",
    "lat": 32.2843,
    "lng": 34.91195,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "shir-hashirim",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "sharon-2",
    "name": "Sharon 2",
    "lat": 31.89458,
    "lng": 36.20398,
    "type": "region",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "sharuhen",
    "name": "Sharuhen",
    "lat": 31.467,
    "lng": 34.4041,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "shaveh-kiryatayim",
    "name": "Shaveh-Kiryatayim",
    "lat": 31.5407,
    "lng": 35.68611,
    "type": "region",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "sheba-1",
    "name": "Sheba 1",
    "lat": 15.34915,
    "lng": 45.51743,
    "type": "region",
    "books": [
      "divre-hayamim-b",
      "iyov",
      "melajima",
      "tehilim",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "yoel"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "sheba-2",
    "name": "Sheba 2",
    "lat": 31.27639,
    "lng": 34.99028,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "shebarim",
    "name": "Shebarim",
    "lat": 31.91724,
    "lng": 35.26111,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "shechem",
    "name": "Shechem",
    "lat": 32.21361,
    "lng": 35.28194,
    "type": "city",
    "books": [
      "bereshit",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "hoshea",
      "melajima",
      "shoftim",
      "tehilim",
      "yehoshua",
      "yirmiyahu"
    ],
    "periods": [
      "Patriarchs",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "sheep-gate",
    "name": "Sheep Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "shema",
    "name": "Shema",
    "lat": 31.24472,
    "lng": 34.84083,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "shen",
    "name": "Shen",
    "lat": 31.99855,
    "lng": 35.26029,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Jeshanah"
    ]
  },
  {
    "id": "shefam",
    "name": "Shefam",
    "lat": 34.47191,
    "lng": 36.57262,
    "type": "region",
    "books": [
      "bamidbar",
      "divre-hayamim-a"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "shefelah",
    "name": "Shefelah",
    "lat": 31.66883,
    "lng": 34.89409,
    "type": "region",
    "books": [
      "devarim",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajima",
      "ovadia",
      "shoftim",
      "yehoshua",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Lowland"
    ]
  },
  {
    "id": "sheshach",
    "name": "Sheshach",
    "lat": 32.54333,
    "lng": 44.42222,
    "type": "city",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Babylon",
      "Sheshak"
    ]
  },
  {
    "id": "shihor-1",
    "name": "Shihor 1",
    "lat": 30.54509,
    "lng": 31.76557,
    "type": "water",
    "books": [
      "divre-hayamim-a",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Shihor River"
    ]
  },
  {
    "id": "shihor-2",
    "name": "Shihor 2",
    "lat": 30.92684,
    "lng": 33.98033,
    "type": "water",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "River",
      "Egypt",
      "Sihor"
    ]
  },
  {
    "id": "shihor-libnat",
    "name": "Shihor-Libnat",
    "lat": 32.5446,
    "lng": 34.97086,
    "type": "water",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Brook Shihor Libnath",
      "Shihor-Libnat"
    ]
  },
  {
    "id": "shikeron",
    "name": "Shikeron",
    "lat": 31.82148,
    "lng": 34.812,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Shicron"
    ]
  },
  {
    "id": "shilhim",
    "name": "Shilhim",
    "lat": 31.467,
    "lng": 34.4041,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "shiloah",
    "name": "Shiloah",
    "lat": 31.77056,
    "lng": 35.235,
    "type": "water",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "shiloh",
    "name": "Shiloh",
    "lat": 32.0557,
    "lng": 35.28954,
    "type": "city",
    "books": [
      "bereshit",
      "divre-hayamim-b",
      "melajima",
      "shmuela",
      "shoftim",
      "tehilim",
      "yehoshua",
      "yirmiyahu"
    ],
    "periods": [
      "Patriarchs",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "shimron",
    "name": "Shimron",
    "lat": 32.70389,
    "lng": 35.21333,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "shimron-meron",
    "name": "Shimron-Meron",
    "lat": 32.70389,
    "lng": 35.21333,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "shion",
    "name": "Shion",
    "lat": 32.65417,
    "lng": 35.50694,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "shitim",
    "name": "Shitim",
    "lat": 31.84018,
    "lng": 35.67368,
    "type": "city",
    "books": [
      "bamidbar",
      "hoshea",
      "mija",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "The Prophets"
    ],
    "aliases": [
      "Acacia Grove"
    ]
  },
  {
    "id": "shoa",
    "name": "Shoa",
    "lat": 31.01696,
    "lng": 47.4421,
    "type": "region",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "shual",
    "name": "Shual",
    "lat": 31.9559,
    "lng": 35.30028,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "shunem",
    "name": "Shunem",
    "lat": 32.60563,
    "lng": 35.33431,
    "type": "city",
    "books": [
      "melajima",
      "melajimb",
      "shmuela",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "shur",
    "name": "Shur",
    "lat": 30.6271,
    "lng": 33.0527,
    "type": "region",
    "books": [
      "bereshit",
      "shemot",
      "shmuela"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "sibmah",
    "name": "Sibmah",
    "lat": 31.78236,
    "lng": 35.76131,
    "type": "city",
    "books": [
      "bamidbar",
      "yehoshua",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "sibraim",
    "name": "Sibraim",
    "lat": 34.1846,
    "lng": 36.67144,
    "type": "region",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "sidon",
    "name": "Sidon",
    "lat": 33.56099,
    "lng": 35.37194,
    "type": "city",
    "books": [
      "bereshit",
      "divre-hayamim-a",
      "ezra",
      "melajima",
      "shmuelb",
      "shoftim",
      "yehoshua",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "yoel",
      "zejaria"
    ],
    "periods": [
      "Patriarchs",
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Zidon"
    ]
  },
  {
    "id": "sila",
    "name": "Sila",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "siloam",
    "name": "Siloam",
    "lat": 31.77056,
    "lng": 35.235,
    "type": "water",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "sin",
    "name": "Sin",
    "lat": 29.05667,
    "lng": 33.50279,
    "type": "region",
    "books": [
      "bamidbar",
      "shemot"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Desert of Sin",
      "Wilderness of Sin"
    ]
  },
  {
    "id": "sifmot",
    "name": "Sifmot",
    "lat": 31.40502,
    "lng": 35.06708,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "sirah",
    "name": "Sirah",
    "lat": 31.54192,
    "lng": 35.09882,
    "type": "water",
    "books": [
      "shmuelb"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Bor Hasirah"
    ]
  },
  {
    "id": "sitnah",
    "name": "Sitnah",
    "lat": 31.38426,
    "lng": 34.6065,
    "type": "water",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": []
  },
  {
    "id": "sokoh-1",
    "name": "Sokoh 1",
    "lat": 31.6822,
    "lng": 34.9749,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "shmuela",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": [
      "Soko",
      "Sochoh"
    ]
  },
  {
    "id": "sokoh-2",
    "name": "Sokoh 2",
    "lat": 31.40087,
    "lng": 35.00614,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Sokoh",
      "Sochoh"
    ]
  },
  {
    "id": "sokoh-3",
    "name": "Sokoh 3",
    "lat": 32.3421,
    "lng": 35.03202,
    "type": "city",
    "books": [
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Sokoh",
      "Sochoh"
    ]
  },
  {
    "id": "sodom",
    "name": "Sodom",
    "lat": 31.15214,
    "lng": 35.42979,
    "type": "region",
    "books": [
      "amosh",
      "bereshit",
      "devarim",
      "eja",
      "tzefania",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "south-3",
    "name": "South 3",
    "lat": 30.52624,
    "lng": 29.09278,
    "type": "region",
    "books": [
      "daniel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "south-gate",
    "name": "South Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "sukot-1",
    "name": "Sukot 1",
    "lat": 32.1966,
    "lng": 35.62118,
    "type": "city",
    "books": [
      "bereshit",
      "divre-hayamim-b",
      "melajima",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Patriarchs",
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Sukkoth"
    ]
  },
  {
    "id": "sukot-2",
    "name": "Sukot 2",
    "lat": 30.5527,
    "lng": 32.099,
    "type": "city",
    "books": [
      "bamidbar",
      "shemot"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Sukkoth"
    ]
  },
  {
    "id": "suf",
    "name": "Suf",
    "lat": 28.67659,
    "lng": 34.69125,
    "type": "water",
    "books": [
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "sufah",
    "name": "Sufah",
    "lat": 31.66561,
    "lng": 35.81749,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "sur",
    "name": "Sur",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Sur Gate",
      "Foundation Gate"
    ]
  },
  {
    "id": "susa",
    "name": "Susa",
    "lat": 32.18922,
    "lng": 48.25778,
    "type": "city",
    "books": [
      "daniel",
      "ester",
      "ezra",
      "nehemia"
    ],
    "periods": [
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Shushan"
    ]
  },
  {
    "id": "syene",
    "name": "Syene",
    "lat": 24.08892,
    "lng": 32.89973,
    "type": "city",
    "books": [
      "yejezkel",
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Aswan"
    ]
  },
  {
    "id": "taanach",
    "name": "Taanach",
    "lat": 32.52153,
    "lng": 35.21912,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "melajima",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "taanat-shiloh",
    "name": "Taanat-Shiloh",
    "lat": 32.17635,
    "lng": 35.37093,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "tabat",
    "name": "Tabat",
    "lat": 32.28684,
    "lng": 35.61893,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "tabur-erez",
    "name": "Tabur-Erez",
    "lat": 32.19944,
    "lng": 35.27278,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "taberah",
    "name": "Taberah",
    "lat": 28.79556,
    "lng": 34.27544,
    "type": "region",
    "books": [
      "bamidbar",
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "tabor-2",
    "name": "Tabor 2",
    "lat": 32.68337,
    "lng": 35.32419,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "tabor-3",
    "name": "Tabor 3",
    "lat": 31.92307,
    "lng": 35.24139,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "tadmor",
    "name": "Tadmor",
    "lat": 34.547,
    "lng": 38.274,
    "type": "city",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "tahat",
    "name": "Tahat",
    "lat": 31.25157,
    "lng": 34.84083,
    "type": "region",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "tahpanhes",
    "name": "Tahpanhes",
    "lat": 30.86056,
    "lng": 32.17139,
    "type": "city",
    "books": [
      "yejezkel",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "tamar-1",
    "name": "Tamar 1",
    "lat": 30.8087,
    "lng": 35.2459,
    "type": "city",
    "books": [
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Tadmor"
    ]
  },
  {
    "id": "tamar-2",
    "name": "Tamar 2",
    "lat": 30.8087,
    "lng": 35.2459,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "tapuah-1",
    "name": "Tapuah 1",
    "lat": 32.10415,
    "lng": 35.23007,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "tapuah-2",
    "name": "Tapuah 2",
    "lat": 31.69553,
    "lng": 34.996,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "taralah",
    "name": "Taralah",
    "lat": 31.84746,
    "lng": 35.236,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "tarshish-1",
    "name": "Tarshish 1",
    "lat": 37.27194,
    "lng": -6.94417,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "tehilim",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "yona"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "tarshish-2",
    "name": "Tarshish 2",
    "lat": 37.27194,
    "lng": -6.94417,
    "type": "city",
    "books": [
      "melajima",
      "tehilim",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "tekoa",
    "name": "Tekoa",
    "lat": 31.63247,
    "lng": 35.21048,
    "type": "city",
    "books": [
      "amosh",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "nehemia",
      "shmuelb",
      "yirmiyahu"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "tel-abib",
    "name": "Tel-Abib",
    "lat": 32.13294,
    "lng": 45.23083,
    "type": "region",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Tel Aviv"
    ]
  },
  {
    "id": "tel-harsha",
    "name": "Tel-Harsha",
    "lat": 32.13294,
    "lng": 45.23083,
    "type": "region",
    "books": [
      "ezra",
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Tel-haresha"
    ]
  },
  {
    "id": "tel-melah",
    "name": "Tel-Melah",
    "lat": 32.13294,
    "lng": 45.23083,
    "type": "region",
    "books": [
      "ezra",
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "telasar",
    "name": "Telasar",
    "lat": 36.7014,
    "lng": 38.0865,
    "type": "city",
    "books": [
      "melajimb",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Tel Assar"
    ]
  },
  {
    "id": "telem",
    "name": "Telem",
    "lat": 30.98982,
    "lng": 34.96526,
    "type": "city",
    "books": [
      "shmuela",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "tema",
    "name": "Tema",
    "lat": 27.6297,
    "lng": 38.55163,
    "type": "city",
    "books": [
      "iyov",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "teman",
    "name": "Teman",
    "lat": 30.33099,
    "lng": 35.48485,
    "type": "city",
    "books": [
      "amosh",
      "habakuk",
      "ovadia",
      "yejezkel",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "terah",
    "name": "Terah",
    "lat": 31.25157,
    "lng": 34.84083,
    "type": "region",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Tarah"
    ]
  },
  {
    "id": "the-lord-is-there",
    "name": "The Lord Is There",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Yahweh Is There"
    ]
  },
  {
    "id": "the-lord-will-provide",
    "name": "The Lord Will Provide",
    "lat": 31.77778,
    "lng": 35.23556,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Yahweh-Yireh",
      "Mount",
      "Jehovah-jireh"
    ]
  },
  {
    "id": "tebes",
    "name": "Tebes",
    "lat": 25.72056,
    "lng": 32.61028,
    "type": "city",
    "books": [
      "nahum",
      "yejezkel",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "No"
    ]
  },
  {
    "id": "tebez",
    "name": "Tebez",
    "lat": 32.32222,
    "lng": 35.36861,
    "type": "city",
    "books": [
      "shmuelb",
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "tibhat",
    "name": "Tibhat",
    "lat": 33.88951,
    "lng": 36.04811,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "shmuelb"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": [
      "Tebah"
    ]
  },
  {
    "id": "tigris",
    "name": "Tigris",
    "lat": 34.63893,
    "lng": 43.86669,
    "type": "water",
    "books": [
      "bereshit",
      "daniel"
    ],
    "periods": [
      "Patriarchs",
      "The Prophets"
    ],
    "aliases": [
      "Hiddekel"
    ]
  },
  {
    "id": "timnah-1",
    "name": "Timnah 1",
    "lat": 31.78483,
    "lng": 34.9103,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Timnath"
    ]
  },
  {
    "id": "timnah-2",
    "name": "Timnah 2",
    "lat": 31.41161,
    "lng": 35.13384,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "timnah-3",
    "name": "Timnah 3",
    "lat": 31.78483,
    "lng": 34.9103,
    "type": "city",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Timnath"
    ]
  },
  {
    "id": "timnat-heres",
    "name": "Timnat-Heres",
    "lat": 32.00806,
    "lng": 35.10729,
    "type": "city",
    "books": [
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Timnath-serah"
    ]
  },
  {
    "id": "tifsah-1",
    "name": "Tifsah 1",
    "lat": 35.95,
    "lng": 38.16667,
    "type": "city",
    "books": [
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "tifsah-2",
    "name": "Tifsah 2",
    "lat": 32.10415,
    "lng": 35.23007,
    "type": "city",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Tappuah"
    ]
  },
  {
    "id": "tirzah",
    "name": "Tirzah",
    "lat": 32.2874,
    "lng": 35.3378,
    "type": "city",
    "books": [
      "melajima",
      "melajimb",
      "shir-hashirim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "tishbe",
    "name": "Tishbe",
    "lat": 33.06447,
    "lng": 35.53145,
    "type": "region",
    "books": [
      "melajima",
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "tob",
    "name": "Tob",
    "lat": 32.56333,
    "lng": 36.24389,
    "type": "city",
    "books": [
      "shmuelb",
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "tochen",
    "name": "Tochen",
    "lat": 31.61593,
    "lng": 34.8783,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Token"
    ]
  },
  {
    "id": "tofel",
    "name": "Tofel",
    "lat": 30.8375,
    "lng": 35.60417,
    "type": "city",
    "books": [
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "tofet",
    "name": "Tofet",
    "lat": 31.77004,
    "lng": 35.22669,
    "type": "region",
    "books": [
      "melajimb",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Tophet"
    ]
  },
  {
    "id": "tower-of-hananel",
    "name": "Tower of Hananel",
    "lat": 31.78009,
    "lng": 35.2343,
    "type": "city",
    "books": [
      "nehemia",
      "yirmiyahu",
      "zejaria"
    ],
    "periods": [
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "tower-of-shechem",
    "name": "Tower of Shechem",
    "lat": 32.21361,
    "lng": 35.28194,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "tower-of-the-hundred",
    "name": "Tower of the Hundred",
    "lat": 31.78017,
    "lng": 35.2343,
    "type": "region",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "tower-of-the-ovens",
    "name": "Tower of the Ovens",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Tower of Furnaces"
    ]
  },
  {
    "id": "tyre",
    "name": "Tyre",
    "lat": 33.27083,
    "lng": 35.19611,
    "type": "city",
    "books": [
      "amosh",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "ezra",
      "hoshea",
      "melajima",
      "nehemia",
      "shmuelb",
      "tehilim",
      "yehoshua",
      "yejezkel",
      "yeshayahu",
      "yirmiyahu",
      "yoel",
      "zejaria"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "ulai",
    "name": "Ulai",
    "lat": 32.27554,
    "lng": 48.43386,
    "type": "water",
    "books": [
      "daniel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Ulai River"
    ]
  },
  {
    "id": "umah",
    "name": "Umah",
    "lat": 32.92111,
    "lng": 35.08833,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Umah"
    ]
  },
  {
    "id": "ufaz",
    "name": "Ufaz",
    "lat": 22.59888,
    "lng": 39.82413,
    "type": "region",
    "books": [
      "daniel",
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Ufaz"
    ]
  },
  {
    "id": "upper-beit-horon",
    "name": "Upper Beit-Horon",
    "lat": 31.88583,
    "lng": 35.11417,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "upper-gulot",
    "name": "Upper Gulot",
    "lat": 31.43282,
    "lng": 35.01485,
    "type": "water",
    "books": [
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "upper-pool",
    "name": "Upper Pool",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "water",
    "books": [
      "melajimb",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "ur-1",
    "name": "Ur 1",
    "lat": 30.96222,
    "lng": 46.10444,
    "type": "city",
    "books": [
      "bereshit",
      "nehemia"
    ],
    "periods": [
      "Patriarchs",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "uz",
    "name": "Uz",
    "lat": 30.53954,
    "lng": 35.35415,
    "type": "region",
    "books": [
      "eja",
      "iyov",
      "yirmiyahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "uzal",
    "name": "Uzal",
    "lat": 15.3551,
    "lng": 44.2145,
    "type": "city",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Izal"
    ]
  },
  {
    "id": "uza",
    "name": "Uza",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "uzen-sheerah",
    "name": "Uzen-Sheerah",
    "lat": 31.89573,
    "lng": 35.08361,
    "type": "region",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Uzzen-sherah"
    ]
  },
  {
    "id": "valley-gate",
    "name": "Valley Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "nehemia"
    ],
    "periods": [
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "valley-of-achor",
    "name": "Valley of Achor",
    "lat": 31.73264,
    "lng": 35.38864,
    "type": "region",
    "books": [
      "hoshea",
      "yehoshua",
      "yeshayahu"
    ],
    "periods": [
      "Conquest & Judges",
      "The Prophets"
    ],
    "aliases": [
      "Valley of Trouble"
    ]
  },
  {
    "id": "valley-of-aven",
    "name": "Valley of Aven",
    "lat": 34.00935,
    "lng": 36.2044,
    "type": "region",
    "books": [
      "amosh"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Wicked Valley",
      "Aven"
    ]
  },
  {
    "id": "valley-of-baka",
    "name": "Valley of Baka",
    "lat": 31.77953,
    "lng": 35.23417,
    "type": "region",
    "books": [
      "tehilim"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Valley of Baka",
      "Baca Valley",
      "Valley of Weeping"
    ]
  },
  {
    "id": "valley-of-berakah",
    "name": "Valley of Berakah",
    "lat": 31.54251,
    "lng": 35.257,
    "type": "river",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Valley of Berakah",
      "Valley of Berachah",
      "Valley of Blessing",
      "Berachah"
    ]
  },
  {
    "id": "valley-of-decision",
    "name": "Valley of Decision",
    "lat": 31.7793,
    "lng": 35.23855,
    "type": "region",
    "books": [
      "yoel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "valley-of-elah",
    "name": "Valley of Elah",
    "lat": 31.68437,
    "lng": 34.98012,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "valley-of-eshkol",
    "name": "Valley of Eshkol",
    "lat": 31.52582,
    "lng": 35.10222,
    "type": "region",
    "books": [
      "bamidbar",
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Valley of Eshkol",
      "Wadi Eshcol",
      "Eshcol Valley",
      "Eshcol"
    ]
  },
  {
    "id": "valley-of-gerar",
    "name": "Valley of Gerar",
    "lat": 31.38254,
    "lng": 34.6065,
    "type": "region",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Gerar Valley"
    ]
  },
  {
    "id": "valley-of-gibeon",
    "name": "Valley of Gibeon",
    "lat": 31.85146,
    "lng": 35.18466,
    "type": "region",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Gibeon"
    ]
  },
  {
    "id": "valley-of-hamon-gog",
    "name": "Valley of Hamon-Gog",
    "lat": 31.89458,
    "lng": 36.20398,
    "type": "region",
    "books": [
      "yejezkel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Valley of Gog’s Hordes",
      "Hordes of Gog Valley",
      "Hamon-gog"
    ]
  },
  {
    "id": "valley-of-hebron",
    "name": "Valley of Hebron",
    "lat": 31.54223,
    "lng": 35.10518,
    "type": "region",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Hebron Valley",
      "Hebron"
    ]
  },
  {
    "id": "valley-of-hinom",
    "name": "Valley of Hinom",
    "lat": 31.77004,
    "lng": 35.22669,
    "type": "region",
    "books": [
      "divre-hayamim-b",
      "melajimb",
      "nehemia",
      "yehoshua",
      "yirmiyahu"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Valley of the Son of Hinnom",
      "Valley of Ben Hinnom",
      "Valley of Slaughter",
      "Ben Hinnom Valley"
    ]
  },
  {
    "id": "valley-of-iftahel",
    "name": "Valley of Iftahel",
    "lat": 32.76238,
    "lng": 35.18467,
    "type": "river",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Valley of Iphtah El",
      "Iphtah-el Valley",
      "Valley of Jiphthah El",
      "Jiphthah-el"
    ]
  },
  {
    "id": "valley-of-yehoshafat",
    "name": "Valley of Yehoshafat",
    "lat": 31.7793,
    "lng": 35.23855,
    "type": "region",
    "books": [
      "yoel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "valley-of-yericho",
    "name": "Valley of Yericho",
    "lat": 31.82972,
    "lng": 35.56608,
    "type": "region",
    "books": [
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Plain",
      "Jordan Valley"
    ]
  },
  {
    "id": "valley-of-yizreel",
    "name": "Valley of Yizreel",
    "lat": 32.58391,
    "lng": 35.29462,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "hoshea",
      "shmuela",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Jezreel Valley"
    ]
  },
  {
    "id": "valley-of-lebanon",
    "name": "Valley of Lebanon",
    "lat": 33.88951,
    "lng": 36.04811,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Lebanon Valley"
    ]
  },
  {
    "id": "valley-of-mizpeh",
    "name": "Valley of Mizpeh",
    "lat": 33.40422,
    "lng": 35.85,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Valley of Mizpah",
      "Mizpah Valley"
    ]
  },
  {
    "id": "valley-of-refaim",
    "name": "Valley of Refaim",
    "lat": 31.76616,
    "lng": 35.1536,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "shmuelb",
      "yehoshua",
      "yeshayahu"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Rephaim Valley"
    ]
  },
  {
    "id": "valley-of-salt",
    "name": "Valley of Salt",
    "lat": 31.21981,
    "lng": 35.0688,
    "type": "river",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "melajimb",
      "shmuelb",
      "tehilim"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": [
      "Salt Valley"
    ]
  },
  {
    "id": "valley-of-shaveh",
    "name": "Valley of Shaveh",
    "lat": 31.71279,
    "lng": 35.33433,
    "type": "river",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Shaveh Valley"
    ]
  },
  {
    "id": "valley-of-shitim",
    "name": "Valley of Shitim",
    "lat": 31.70173,
    "lng": 35.35664,
    "type": "water",
    "books": [
      "yoel"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Wadi Shittim",
      "Valley of Acacia Trees",
      "Valley of Acacias",
      "Shittim"
    ]
  },
  {
    "id": "valley-of-sidim",
    "name": "Valley of Sidim",
    "lat": 31.15214,
    "lng": 35.42979,
    "type": "region",
    "books": [
      "bereshit"
    ],
    "periods": [
      "Patriarchs"
    ],
    "aliases": [
      "Siddim Valley",
      "Siddim"
    ]
  },
  {
    "id": "valley-of-sorek",
    "name": "Valley of Sorek",
    "lat": 31.80064,
    "lng": 34.96572,
    "type": "river",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Sorek Valley"
    ]
  },
  {
    "id": "valley-of-sukot",
    "name": "Valley of Sukot",
    "lat": 32.1765,
    "lng": 35.60621,
    "type": "region",
    "books": [
      "tehilim"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Valley of Sukkoth",
      "Vale of Succoth"
    ]
  },
  {
    "id": "valley-of-the-arnon",
    "name": "Valley of the Arnon",
    "lat": 31.44818,
    "lng": 35.69688,
    "type": "river",
    "books": [
      "devarim",
      "melajimb",
      "yehoshua"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Arnon Gorge",
      "Valley of Arnon",
      "Wadi Arnon",
      "Arnon Valley",
      "River Arnon",
      "Arnon"
    ]
  },
  {
    "id": "valley-of-tzeboim",
    "name": "Valley of Tzeboim",
    "lat": 31.82779,
    "lng": 35.36096,
    "type": "river",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Valley of Zeboyim",
      "Zeboim Valley"
    ]
  },
  {
    "id": "valley-of-tzefatah",
    "name": "Valley of Tzefatah",
    "lat": 31.65156,
    "lng": 34.81366,
    "type": "river",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Zephathah Valley"
    ]
  },
  {
    "id": "valley-of-zered",
    "name": "Valley of Zered",
    "lat": 30.95569,
    "lng": 35.7095,
    "type": "river",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Zered Valley",
      "Wadi Zered"
    ]
  },
  {
    "id": "waheb",
    "name": "Waheb",
    "lat": 28.7569,
    "lng": 34.75,
    "type": "region",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Zahab"
    ]
  },
  {
    "id": "washer-s-field",
    "name": "Washer’s Field",
    "lat": 31.76727,
    "lng": 35.23599,
    "type": "region",
    "books": [
      "melajimb",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": [
      "Launderer’s Field",
      "Fuller’s Field"
    ]
  },
  {
    "id": "water-gate",
    "name": "Water Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "waters-of-yericho",
    "name": "Waters of Yericho",
    "lat": 31.87049,
    "lng": 35.44476,
    "type": "water",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "waters-of-merom",
    "name": "Waters of Merom",
    "lat": 32.97889,
    "lng": 35.43778,
    "type": "water",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "way-of-holiness",
    "name": "Way of Holiness",
    "lat": 31.77812,
    "lng": 35.23417,
    "type": "region",
    "books": [
      "yeshayahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": [
      "Highway of Holiness",
      "Holy Way"
    ]
  },
  {
    "id": "way-of-the-red-sea",
    "name": "Way of the Red Sea",
    "lat": 30.21358,
    "lng": 35.15754,
    "type": "river",
    "books": [
      "bamidbar",
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Red Sea"
    ]
  },
  {
    "id": "west-gate",
    "name": "West Gate",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "divre-hayamim-a"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "wilderness-of-maon",
    "name": "Wilderness of Maon",
    "lat": 31.38914,
    "lng": 35.21247,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Desert of Maon"
    ]
  },
  {
    "id": "wilderness-of-sinai",
    "name": "Wilderness of Sinai",
    "lat": 28.54662,
    "lng": 33.97333,
    "type": "region",
    "books": [
      "bamidbar",
      "shemot",
      "vaikra"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Desert of Sinai"
    ]
  },
  {
    "id": "wilderness-of-zif",
    "name": "Wilderness of Zif",
    "lat": 31.48873,
    "lng": 35.18264,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Desert of Ziph",
      "Ziph"
    ]
  },
  {
    "id": "wildgoats-rocks",
    "name": "Wildgoats’ Rocks",
    "lat": 31.45059,
    "lng": 35.38333,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": [
      "Crags of the Wild Goats",
      "Rocks of the Mountain Goats",
      "Rocks of the Wild Goats"
    ]
  },
  {
    "id": "yiron",
    "name": "Yiron",
    "lat": 33.08333,
    "lng": 35.41667,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Iron"
    ]
  },
  {
    "id": "tzaanan",
    "name": "Tzaanan",
    "lat": 31.56702,
    "lng": 34.84917,
    "type": "region",
    "books": [
      "mija"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "tzaananim",
    "name": "Tzaananim",
    "lat": 32.72113,
    "lng": 35.41064,
    "type": "city",
    "books": [
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "zair",
    "name": "Zair",
    "lat": 31.15214,
    "lng": 35.42979,
    "type": "region",
    "books": [
      "melajimb"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "tzalmon",
    "name": "Tzalmon",
    "lat": 32.66667,
    "lng": 36.73333,
    "type": "city",
    "books": [
      "tehilim"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Mount Zalmon",
      "Salmon"
    ]
  },
  {
    "id": "tzalmonah",
    "name": "Tzalmonah",
    "lat": 30.77812,
    "lng": 35.42483,
    "type": "river",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "zanoah-1",
    "name": "Zanoah 1",
    "lat": 31.71944,
    "lng": 35.00129,
    "type": "city",
    "books": [
      "nehemia",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "zanoah-2",
    "name": "Zanoah 2",
    "lat": 31.45015,
    "lng": 35.05353,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "tzafon-1",
    "name": "Tzafon 1",
    "lat": 32.26769,
    "lng": 35.57724,
    "type": "city",
    "books": [
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "tzafon-2",
    "name": "Tzafon 2",
    "lat": 35.9525,
    "lng": 35.96931,
    "type": "city",
    "books": [
      "iyov",
      "tehilim",
      "yeshayahu"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "tzarfat",
    "name": "Tzarfat",
    "lat": 33.46423,
    "lng": 35.29514,
    "type": "city",
    "books": [
      "melajima",
      "ovadia"
    ],
    "periods": [
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "tzartan",
    "name": "Tzartan",
    "lat": 32.26769,
    "lng": 35.57724,
    "type": "city",
    "books": [
      "melajima",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era"
    ],
    "aliases": [
      "Zaretan"
    ]
  },
  {
    "id": "tzeboiim",
    "name": "Tzeboiim",
    "lat": 31.15214,
    "lng": 35.42979,
    "type": "region",
    "books": [
      "bereshit",
      "devarim",
      "hoshea"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "The Prophets"
    ],
    "aliases": [
      "Zeboyim",
      "Zeboim"
    ]
  },
  {
    "id": "tzeboim",
    "name": "Tzeboim",
    "lat": 32.00295,
    "lng": 34.8955,
    "type": "city",
    "books": [
      "nehemia"
    ],
    "periods": [
      "Return & Second Temple"
    ],
    "aliases": [
      "Zeboyim"
    ]
  },
  {
    "id": "tzedad",
    "name": "Tzedad",
    "lat": 34.31346,
    "lng": 36.92419,
    "type": "city",
    "books": [
      "bamidbar",
      "yejezkel"
    ],
    "periods": [
      "Exodus & Wilderness",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "zela",
    "name": "Zela",
    "lat": 31.80253,
    "lng": 35.20964,
    "type": "city",
    "books": [
      "shmuelb",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy"
    ],
    "aliases": [
      "Zelah"
    ]
  },
  {
    "id": "zelzah",
    "name": "Zelzah",
    "lat": 31.80253,
    "lng": 35.20964,
    "type": "city",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  },
  {
    "id": "zemaraim",
    "name": "Zemaraim",
    "lat": 31.94084,
    "lng": 35.29566,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "zenan",
    "name": "Zenan",
    "lat": 31.56702,
    "lng": 34.84917,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "tzefat",
    "name": "Tzefat",
    "lat": 31.21229,
    "lng": 34.95828,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "zer",
    "name": "Zer",
    "lat": 32.79972,
    "lng": 35.45972,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "zered",
    "name": "Zered",
    "lat": 30.95569,
    "lng": 35.7095,
    "type": "water",
    "books": [
      "devarim"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Zered Valley",
      "Wadi Zered",
      "Zered Brook",
      "Valley of the Zered"
    ]
  },
  {
    "id": "zeredah-1",
    "name": "Zeredah 1",
    "lat": 32.04638,
    "lng": 35.09719,
    "type": "city",
    "books": [
      "melajima"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Zereda"
    ]
  },
  {
    "id": "zeredah-2",
    "name": "Zeredah 2",
    "lat": 32.26769,
    "lng": 35.57724,
    "type": "city",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Zarethan",
      "Zeredathah"
    ]
  },
  {
    "id": "zererah",
    "name": "Zererah",
    "lat": 32.26769,
    "lng": 35.57724,
    "type": "city",
    "books": [
      "shoftim"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Zererath"
    ]
  },
  {
    "id": "zeret-shahar",
    "name": "Zeret-Shahar",
    "lat": 31.597,
    "lng": 35.55931,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": [
      "Zareth-shahar"
    ]
  },
  {
    "id": "zidim",
    "name": "Zidim",
    "lat": 32.80758,
    "lng": 35.45382,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "tziklag",
    "name": "Tziklag",
    "lat": 31.3912,
    "lng": 34.6816,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "nehemia",
      "shmuela",
      "shmuelb",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "zimri",
    "name": "Zimri",
    "lat": 32.19261,
    "lng": 48.25778,
    "type": "region",
    "books": [
      "yirmiyahu"
    ],
    "periods": [
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "tzion",
    "name": "Tzion",
    "lat": 31.77667,
    "lng": 35.23417,
    "type": "city",
    "books": [
      "amosh",
      "divre-hayamim-a",
      "divre-hayamim-b",
      "eja",
      "melajima",
      "melajimb",
      "mija",
      "shir-hashirim",
      "shmuelb",
      "tehilim",
      "tzefania",
      "yeshayahu",
      "yirmiyahu",
      "yoel",
      "zejaria"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era",
      "The Prophets",
      "Return & Second Temple"
    ],
    "aliases": [
      "Jerusalem"
    ]
  },
  {
    "id": "zior",
    "name": "Zior",
    "lat": 31.52654,
    "lng": 35.10222,
    "type": "region",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "zif-1",
    "name": "Zif 1",
    "lat": 31.47475,
    "lng": 35.13514,
    "type": "city",
    "books": [
      "divre-hayamim-b",
      "shmuela",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "zif-2",
    "name": "Zif 2",
    "lat": 30.99677,
    "lng": 34.98188,
    "type": "city",
    "books": [
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges"
    ],
    "aliases": []
  },
  {
    "id": "zifron",
    "name": "Zifron",
    "lat": 34.26667,
    "lng": 37.06667,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": []
  },
  {
    "id": "ziz",
    "name": "Ziz",
    "lat": 31.55145,
    "lng": 35.33269,
    "type": "water",
    "books": [
      "divre-hayamim-b"
    ],
    "periods": [
      "Kingdom Era"
    ],
    "aliases": [
      "Pass of Ziz",
      "Ascent of Ziz"
    ]
  },
  {
    "id": "tzoan",
    "name": "Tzoan",
    "lat": 30.97694,
    "lng": 31.88,
    "type": "city",
    "books": [
      "bamidbar",
      "tehilim",
      "yejezkel",
      "yeshayahu"
    ],
    "periods": [
      "Exodus & Wilderness",
      "Kingdom Era",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "tzoar",
    "name": "Tzoar",
    "lat": 31.15214,
    "lng": 35.42979,
    "type": "region",
    "books": [
      "bereshit",
      "devarim",
      "yeshayahu",
      "yirmiyahu"
    ],
    "periods": [
      "Patriarchs",
      "Exodus & Wilderness",
      "The Prophets"
    ],
    "aliases": []
  },
  {
    "id": "tzobah",
    "name": "Tzobah",
    "lat": 34.09372,
    "lng": 36.22548,
    "type": "region",
    "books": [
      "divre-hayamim-a",
      "melajima",
      "shmuela",
      "shmuelb",
      "tehilim"
    ],
    "periods": [
      "United Monarchy",
      "Kingdom Era"
    ],
    "aliases": []
  },
  {
    "id": "tzofim",
    "name": "Tzofim",
    "lat": 31.76778,
    "lng": 35.72556,
    "type": "city",
    "books": [
      "bamidbar"
    ],
    "periods": [
      "Exodus & Wilderness"
    ],
    "aliases": [
      "Lookout Field"
    ]
  },
  {
    "id": "tzorah",
    "name": "Tzorah",
    "lat": 31.77399,
    "lng": 34.98529,
    "type": "city",
    "books": [
      "divre-hayamim-a",
      "divre-hayamim-b",
      "nehemia",
      "shoftim",
      "yehoshua"
    ],
    "periods": [
      "Conquest & Judges",
      "Kingdom Era",
      "Return & Second Temple"
    ],
    "aliases": []
  },
  {
    "id": "tzuf",
    "name": "Tzuf",
    "lat": 31.85579,
    "lng": 35.23161,
    "type": "region",
    "books": [
      "shmuela"
    ],
    "periods": [
      "United Monarchy"
    ],
    "aliases": []
  }
];
