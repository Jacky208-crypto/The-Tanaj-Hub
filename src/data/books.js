// Torah
export const torahBooks = [
  { id: 'bereshit',  label: 'Bereshit',  sefaria: 'Genesis',      chapters: 50 },
  { id: 'shemot',   label: 'Shemot',    sefaria: 'Exodus',       chapters: 40 },
  { id: 'vaikra',   label: 'Vaikra',    sefaria: 'Leviticus',    chapters: 27 },
  { id: 'bamidbar', label: 'Bamidbar',  sefaria: 'Numbers',      chapters: 36 },
  { id: 'devarim',  label: 'Devarim',   sefaria: 'Deuteronomy',  chapters: 34 },
];

// Neviim Rishonim
export const neviimRishonimBooks = [
  { id: 'yehoshua',   label: 'Yehoshua',    sefaria: 'Joshua',          chapters: 24 },
  { id: 'shoftim',    label: 'Shoftim',     sefaria: 'Judges',          chapters: 21 },
  { id: 'shmuela',    label: 'Shmuel Alef', sefaria: 'I Samuel',        chapters: 31 },
  { id: 'shmuelb',    label: 'Shmuel Bet',  sefaria: 'II Samuel',       chapters: 24 },
  { id: 'melajima',   label: 'Melajim Alef',sefaria: 'I Kings',         chapters: 22 },
  { id: 'melajimb',   label: 'Melajim Bet', sefaria: 'II Kings',        chapters: 25 },
];

// Neviim Ajaronim
export const neviimAjaranimBooks = [
  { id: 'yeshayahu', label: 'Yeshayahu', sefaria: 'Isaiah',     chapters: 66 },
  { id: 'yirmiyahu', label: 'Yirmiyahu', sefaria: 'Jeremiah',   chapters: 52 },
  { id: 'yejezkel',  label: 'Yejezkel',  sefaria: 'Ezekiel',    chapters: 48 },
  { id: 'hoshea',    label: 'Hoshea',    sefaria: 'Hosea',      chapters: 14 },
  { id: 'yoel',      label: 'Yoel',      sefaria: 'Joel',       chapters: 4  },
  { id: 'amosh',     label: 'Amos',      sefaria: 'Amos',       chapters: 9  },
  { id: 'ovadia',    label: 'Ovadia',    sefaria: 'Obadiah',    chapters: 1  },
  { id: 'yona',      label: 'Yona',      sefaria: 'Jonah',      chapters: 4  },
  { id: 'mija',      label: 'Mija',      sefaria: 'Micah',      chapters: 7  },
  { id: 'nahum',     label: 'Nahum',     sefaria: 'Nahum',      chapters: 3  },
  { id: 'habakuk',   label: 'Habakuk',   sefaria: 'Habakkuk',   chapters: 3  },
  { id: 'tzefania',  label: 'Tzefania',  sefaria: 'Zephaniah',  chapters: 3  },
  { id: 'jagai',     label: 'Jagai',     sefaria: 'Haggai',     chapters: 2  },
  { id: 'zejaria',   label: 'Zejaria',   sefaria: 'Zechariah',  chapters: 14 },
  { id: 'malaji',    label: 'Malaji',    sefaria: 'Malachi',    chapters: 3  },
];

// Ketuvim
export const ketuvimBooks = [
  { id: 'tehilim',          label: 'Tehilim',           sefaria: 'Psalms',              chapters: 150 },
  { id: 'mishle',           label: 'Mishle',            sefaria: 'Proverbs',            chapters: 31  },
  { id: 'iyov',             label: 'Iyov',              sefaria: 'Job',                 chapters: 42  },
  { id: 'shir-hashirim',    label: 'Shir Hashirim',     sefaria: 'Song of Songs',       chapters: 8   },
  { id: 'rut',              label: 'Rut',               sefaria: 'Ruth',                chapters: 4   },
  { id: 'eja',              label: 'Eja',               sefaria: 'Lamentations',        chapters: 5   },
  { id: 'kohelet',          label: 'Kohelet',           sefaria: 'Ecclesiastes',        chapters: 12  },
  { id: 'ester',            label: 'Ester',             sefaria: 'Esther',              chapters: 10  },
  { id: 'daniel',           label: 'Daniel',            sefaria: 'Daniel',              chapters: 12  },
  { id: 'ezra',             label: 'Ezra',              sefaria: 'Ezra',                chapters: 10  },
  { id: 'nehemia',          label: 'Nehemia',           sefaria: 'Nehemiah',            chapters: 13  },
  { id: 'divre-hayamim-a',  label: 'Divre Hayamim Alef',sefaria: 'I Chronicles',        chapters: 29  },
  { id: 'divre-hayamim-b',  label: 'Divre Hayamim Bet', sefaria: 'II Chronicles',       chapters: 36  },
];

export const allBooks = [...torahBooks, ...neviimRishonimBooks, ...neviimAjaranimBooks, ...ketuvimBooks];

export function getBookById(id) {
  return allBooks.find(b => b.id === id);
}
