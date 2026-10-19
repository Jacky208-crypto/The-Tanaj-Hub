// Shared clean-up for Sefaria's Spanish Tanaj (trans. Rav Yehuda Ribco, 2026).
// Used by the chapter reader and by Tanaj Search so both show the same text.

// ---- Verse fixes ------------------------------------------------------------
// Sefaria's Spanish text has some verses that are out of place: a verse holds
// the text of a different verse (e.g. Zejaria 4:13 has the text of 11:7), or a
// block of verses is shifted. These were found by checking every verse of the
// Tanaj against the Hebrew and the JPS English. Where Sefaria's own Spanish for
// the right verse exists elsewhere, we reuse it; otherwise it's a new
// translation from the Hebrew in the same style.
// Key: `${sefariaBookName} ${chapter}:${verse}`
export const SPANISH_FIXES = {
  // Melajim Alef 6:23 (had the text of 6:31)
  'I Kings 6:23': 'En el santuario interior hizo dos querubines de madera de olivo, cada uno de 10 codos de alto.',

  // Melajim Bet 4:44 (had the text of 4:40)
  'II Kings 4:44': 'Se lo sirvió, comieron, y sobró, tal como Hashem lo había dicho.',

  // Melajim Bet 5:1–13 (verses 1–4 repeated 4:41–44 and everything was shifted by 4)
  'II Kings 5:1': 'Naamán, comandante del ejército del rey de Aram, era un hombre muy importante ante su señor y muy estimado, porque por medio de él Hashem había dado la victoria a Aram. Era un guerrero valiente, pero estaba enfermo de lepra.',
  'II Kings 5:2': 'Los de Aram habían salido en incursiones y habían traído cautiva de la tierra de Israel a una jovencita, que pasó a servir a la esposa de Naamán.',
  'II Kings 5:3': 'Ella le dijo a su señora: —Ojalá mi señor fuera a ver al profeta que está en Shomrón; él lo curaría de su lepra.',
  'II Kings 5:4': 'Naamán fue y se lo comunicó a su señor, diciendo: —Así y así ha dicho la joven que es de la tierra de Israel.',
  'II Kings 5:5': 'El rey de Aram le dijo: —Ve, y yo enviaré una carta al rey de Israel. Partió, llevando consigo diez talentos de plata, seis mil siclos de oro y diez mudas de ropa nueva.',
  'II Kings 5:6': 'Llevaba también la carta para el rey de Israel, que decía: «Ahora, cuando llegue a ti esta carta, sabrás que te he enviado a mi sirviente Naamán para que lo cures de su lepra.»',
  'II Kings 5:7': 'Cuando el rey de Israel leyó la carta, rasgó sus ropas y dijo: —¿Acaso soy yo Elohim para dar muerte o vida, para que este me envíe a un hombre para que lo cure de la lepra? ¡Fíjense bien, vean cómo busca un pretexto contra mí!',
  'II Kings 5:8': 'Sucedió que cuando Elishá, el hombre de Elohim, se enteró de que el rey de Israel había rasgado sus ropas, le mandó decir: —¿Por qué has rasgado tus ropas? Que venga a mí, y sabrá que hay profeta en Israel.',
  'II Kings 5:9': 'Naamán llegó con sus caballos y su carro, y se detuvo a la puerta de la casa de Elishá.',
  'II Kings 5:10': 'Elishá le envió un mensajero que le dijo: —Ve y lávate siete veces en el Iardén, y tu carne se te restaurará y quedarás limpio.',
  'II Kings 5:11': 'Pero Naamán se enojó y se fue, diciendo: —Yo pensaba que seguramente saldría a verme, se pondría de pie, invocaría el nombre de Hashem su Elohim, movería su mano sobre el lugar y así curaría la lepra.',
  'II Kings 5:12': '¿No son el Amaná y el Parpar, los ríos de Daméseq, mejores que todas las aguas de Israel? ¿No podría lavarme en ellos y quedar limpio? Y se dio la vuelta y se fue enojado.',
  'II Kings 5:13': 'Pero sus sirvientes se acercaron y le dijeron: —Padre mío, si el profeta te hubiera mandado hacer algo difícil, ¿no lo habrías hecho? ¡Cuánto más si solo te dice: «Lávate y quedarás limpio»!',

  // Zejaria 4:13 (had the text of 11:7)
  'Zechariah 4:13': 'Y me dijo: –¿No sabes qué son estas cosas? Yo le dije: –No, señor mío.',

  // Tehilim 33:1–5 (shifted by one; verse 1 was missing)
  'Psalms 33:1': 'Canten con alegría a Hashem, oh justos; a los rectos les queda bien la alabanza.',
  'Psalms 33:2': 'Den gracias a Hashem con lira; cántenle con arpa de diez cuerdas.',
  'Psalms 33:3': 'Cántenle un Mizmor nuevo; háganlo con júbilo.',
  'Psalms 33:4': 'Porque recta es la palabra de Hashem, y toda su obra es verdad.',
  'Psalms 33:5': 'Él ama la justicia y el derecho; de la misericordia de Hashem está llena la tierra.',

  // Tehilim 68:32–33 (32 had the text of 33, and 33 the text of 35)
  'Psalms 68:32': 'Vendrán príncipes desde Egipto; Kush se apresurará a extender sus manos hacia Elohim.',
  'Psalms 68:33': 'Reinos de la tierra, canten a Elohim; ¡canten a Hashem! Selah',

  // Tehilim 71:12–19 (mixed up with 16 and 22–24)
  'Psalms 71:12': 'Oh Elohim, no te alejes de mí; Elohim mío, apresúrate a ayudarme.',
  'Psalms 71:13': 'Que sean avergonzados y acabados los que acusan mi alma; que se cubran de vergüenza y deshonra los que buscan mi mal.',
  'Psalms 71:14': 'Pero yo siempre tendré esperanza, y te alabaré más y más.',
  'Psalms 71:17': 'Oh Elohim, me enseñaste desde que era joven, y hasta hoy sigo hablando de tus maravillas.',
  'Psalms 71:18': 'Y ahora que estoy viejo, no me abandones, oh Elohim, hasta que le cuente a la nueva generación lo poderoso que has hecho,',
  'Psalms 71:19': 'y tu justicia, oh Elohim, llega hasta lo alto. Tú has hecho grandes cosas; oh Elohim, ¿quién es como tú?',

  // Iyov 3:7, 3:9, 3:10 (7 and 9 were swapped; 10 repeated 8)
  'Job 3:7': '¡He aquí, sea aquella noche estéril! Que no entren en ella los cantos de alegría.',
  'Job 3:9': 'Oscurézcanse sus estrellas matutinas. Espere la luz, pero no llegue a ella, ni vea los destellos de la aurora.',
  'Job 3:10': 'porque no cerró las puertas del vientre de mi madre, ni escondió el sufrimiento de mis ojos.',

  // Kohelet 2:1 (had the text of 2:20)
  'Ecclesiastes 2:1': 'Dije en mi corazón: «Ven ahora, te probaré con la alegría; disfruta de lo bueno». Pero también esto era vanidad.',
};

// Replace Sefaria's verse with our fix when there is one.
export function applySpanishFixes(sefariaBook, chapter, verses) {
  return verses.map((v, i) => SPANISH_FIXES[`${sefariaBook} ${chapter}:${i + 1}`] ?? v);
}

// ---- Name clean-up ----------------------------------------------------------
// Whole words only (so "Setar" stays "Setar", "Acabaré" stays "Acabaré", etc.).
const NAME_SWAPS = [
  ['Jehov[áa]', 'Hashem', 'i'],
  ['JAH', 'Hashem', 'i'],
  ['Ezequiel', 'Yejezkel'],
  ['Adán', 'Adam'],
  ['Eva', 'Javá'],
  ['Abel', 'Hebel'],
  ['Enoc', 'Janoj'],
  ['Enos', 'Enosh'],
  ['Lamec', 'Lemej'],
  ['Set', 'Shet'],
  ['Noé', 'Noaj'],
  ['Isaac', 'Itzjak'],
  ['Jacob', 'Yaakov'],
  ['José', 'Yosef'],
  ['Gosén', 'Goshen'],
  ['Moisés', 'Moshe'],
  ['Josué', 'Yehoshua'],
  ['Aod', 'Ehud'],
  ['Isaías', 'Yeshayahu'],
  ['Jeremías', 'Yirmiyahu'],
  ['Oseas', 'Hoshea'],
  ['Abdías', 'Ovadiá'],
  ['Miqueas', 'Mija'],
  ['Sofonías', 'Tzefania'],
  ['Hageo', 'Jagai'],
  ['Zacarías', 'Zejaria'],
  ['Malaquías', 'Malaji'],
  ['Judá', 'Yehuda'],
  ['Jerusalén', 'Yerushalaim'],
  ['Baasa', 'Baasha'],
  ['Acab', 'Ajab'],
  ['Samaria', 'Shomron'],
  ['Sansón', 'Shimshon'],
  ['Elohim', 'Dios'],     // the One G-d (capital E)
  ['elohim', 'dioses'],   // "otros elohim" = other gods (lower-case e)
].map(([from, to, flags = '']) => [
  new RegExp(`(?<![\\p{L}])${from}(?![\\p{L}])`, `gu${flags}`),
  to,
]);

export function cleanSpanishNames(text) {
  let out = text;
  for (const [re, to] of NAME_SWAPS) out = out.replace(re, to);
  return out;
}

// Ribco puts some whole verses (e.g. Ester 1:14, Tehilim headings) inside
// [ ]. Keep the words, drop only the brackets.
export function unwrapSpanishBrackets(text) {
  return text.replace(/\[([^\]]*)\]/g, '$1');
}
