import { useState } from 'react';
import styles from './Notes.module.css';

const NOTES = [
  {
    topic: "Important Dates",
    topicSp: "Fechas Importantes",
    entries: [
      {
        title: "First Month (Nisan)",
        titleSp: "Primer Mes (Nisan)",
        summary: `Events without a specific date:
        - Hashem says the laws of Pesach Sheni (Numbers 9)
        - Lots are cast to determine when the Jews will be exterminated in the 12th year of Ajashverosh
        - Artajshasta speaks with Nehemiah and gives him permission to go to Jerusalem, in the 20th year of Artajshasta\n\nMonth 1 Day 1 - Ezra begins his journey from Babylon to Jerusalem (Ezra 7), the matter of the foreign women is resolved (Ezra 10), the waters of the Mabul dry up\n\nMonth 1 Day 2 - The leaders and the people gather to listen to the Torah, read by Ezra (Nehemiah 8)\n\nMonth 1 Day 10 - The day the Passover sacrifice is offered (Exodus 12), they cross the Jordan (Joshua 4)\n\nMonth 1 Day 13 - The scribes write Haman's edict\n\nMonth 1 Day 14 - The day the Passover sacrifice is offered (Exodus), Passover in the desert (Numbers 9), they celebrate Passover at Gilgal (Joshua), Passover in Ezra\n\nMonth 1 Day 15 - Yetziat Mitzraim, Israel leaves Ramses\n\nMonth 1 Day 21 - Last day of Passover\n\nMonth 1 Day 24 - Daniel next to the Hidekel river`,
        summarySp: `Eventos que no dice día exacto:
        - H' dice leyes de Pesaj Sheni(Bamidbar 9)
        - Echan suertes para ver cuando exterminan a los judios en el año 12 de Ajashverosh
        - Artajshasta habla con Nehemia y le da permiso de ir a Yerushalaim, año 20 de Artajshasta
        
        Mes 1 Día 1 - Ezra comienza a subir de Babel a Yerushalaim(Ezra 7), terminan el asunto de mujeres extranjeras(Ezra 10), se secan las aguas del mabul
        Mes 1 Día 2 - Se reunen los jefes y el pueblo para prestar atencion a la Tora, leida por Ezra (Nehemia 8)
        Mes 1 Día 10 - Día en que se hace el Korban Pesaj(Shemot 12), Cruzan el Yarden (Yehoshua 4)
        Mes 1 Día 13 - Los escribas escriben el edicto de Haman
        Mes 1 Día 14 - Día en que se ofrece Korban Pesaj(Shemot), Pesaj en el desierto(Bamidbar 9), Hacen Pesaj en Gilgal (Yehoshua), Pesaj en Ezra
        Mes 1 Día 15 - Yetziat Mitzraim, salen de Ramses
        Mes 1 Día 21 - Ultimo dia de Pesaj
        Mes 1 Día 24 - Daniel junto al Hidekel`
      },
      {
        title: "Second Month (Iyar/Ziv)",
        titleSp: "Segundo Mes (Iyar/Ziv)",
        summary: `Events without a specific date:
        - Shlomo begins building the Temple in the year 480 from Yetziat Mitzraim, in Shlomo's fourth year of his reign.
        - Yehoshua, Zerubbabel, and the people begin building the Temple in their second year after arriving in Jerusalem.\n\nMonth 2 Day 14 - Pesach Sheni (Numbers 9)\n\nMonth 2 Day 15 - Israel arrives at Midbar Sinai from Elim\n\nMonth 2 Day 17 - The flood begins, year 600 of Noah\n\nMonth 2 Day 20 - Israel begins walking from Midbar Sin to Midbar Paran\n\nMonth 2 Day 27 - Year 601 of Noaj, the land dries up after the flood`
        ,summarySp: `Eventos que no dice día exacto:
        - Shlomo empieza a construir el Bet Hamikdash, en el año 480 desde Yetziat Mitzraim, en el 4to año de Shlomo
        - Yeshua, Zerubabel y el pueblo empiezan a construir el Bet Hamikdash, en su segundo año de la llegada a Yerushalaim
        
        Mes 2 Día 14 - Pesaj Sheni (Bamidbar 9)
        Mes 2 Día 15 - Llegan a Midbar Sinai, desde Elim
        Mes 2 Día 17 - Comienza el diluvio, año 600 de Noaj
        Mes 2 Día 20 - Comienzan a caminar desde Midbar Sin hasta Midbar Paran
        Mes 2 Día 27 - Año 601, se seca la tierra del diluvio`
    },
      {
        title: "Third Month (Sivan)",
        titleSp: "Tercer Mes (Sivan)",
        summary: `Events without a specific date:
        - In the 15th year of Asa, he gathers all of Israel in Jerusalem and they make a covenant with Hashem.
        - The Israelites arrive at Mount Sinai. \n\n Month 3 Day 23 - The scribes write Mordechai's edict to the Jews (to defend themselves)`
        ,summarySp: `Eventos que no dice día exacto:
        - Año 15 de Asa, reune a todo Israel en Yerushalaim y hacen pacto con H'
        - Israel llegan a Har Sinai
        
        Mes 3 Día 23 - Los escribas escriben el edicto de Mordejai a los judios (que se defiendan)`
    },
      {
        title: "Fourth Month (Tamuz)",
        titleSp: "Cuarto Mes (Tamuz)",
        summary: `Month 4, Day 5 - Yejezkel by the Kvar River in the 5th year of Jehoiachin's captivity sees the Merkava. \n\n Month 4, Day 9 - Famine is severe in Jerusalem because of Nebuchadnezzar.`
        ,summarySp: `
        Mes 4 día 5 - Yejzkel junto al rio Kvar en el 5to año del cautiverio de Yehoyajin ve la Merkava
        Mes 4 dia 9 - el hambre es agudo en Yerushalaim por Nebujadnetzar`
    },
      {
        title: "Fifth Month (Av)",
        titleSp: "Quinto Mes (Av)",
        summary: `Events without a specific date:
        - Yirmiyahu prophesies until the exile of Yerushalaim in the 5th month
        - The incident of Janania ben Azur, in the 4th year of Tzidkiyahu \n\n Month 5 Day 1 - Aaron dies in the 40th year of Yetziat Mitzraim(Bamidbar 33), Ezra arrives in Jerusalem in the 7th year of Artajshasta(Ezra 7).
        Month 5 Day 7 - Nebuzaradan destroys the Temple in the 19th year of Nebuchadnezzar.`
        ,summarySp: `Eventos que no dice día exacto:
        - Yirmiyahu profetiza hasta el exilio de Yerushalaim en el mes 5to
        - 4to año de Tzidkiyahu, pasa lo de Janania e Yirmiyahu
        
        Mes 5 Día 1 - Muere Aharon al año 40 de Yetziat Mitzraim, Ezra llega a Yerushalaim en el año 7 de artajshasta
        Mes 5 día 7 - Nevuzaradan destruye el Bet Hamikdash en el año 19 de Nevujadnetzar`
    },
      {
        title: "Sixth Month (Elul)",
        titleSp: "Sexto Mes (Elul)",
        summary: `Month 6, Day 1 - 2nd year of Daryavesh, first prophecy of Haggai
        Month 6, Day 24 - Yehoshua and Zerubbabel work in the Temple (Times of Haggai)
        Month 6, Day 25 - Nehemiah finishes the walls; they took 52 days to build`
        ,summarySp: `Mes 6 día 1 - 2do año de Daryavesh, primera profecia de Jagai
        Mes 6 día 24 - Yehoshua y Zerubabel trabajan en el BH(Tiempos de Jagai)
        Mes 6 día 25 - Nehemia termina las murallas, duraron 52 dias`
      },
      {
        title: "Seventh Month (Tishrei/Etanim)",
        titleSp: "Septimo Mes (Tishre/Etanim)",
        summary: `Events without a specific date:
        - All the men gather with Shlomo to celebrate and bring the Aron.
        - Janania son of Azur dies in the 4th year of Tzidkiyahu.
        - Ishmael and his men eat with Gedaliah and murder him.
        - The Israelites were already living in their cities during the time of Ezra. \n\nMonth 7, Day 1 - Rosh Hashanah(Vayikra 24), Ezra brings the Torah to the people (Nehemiah 8), the reunited captives of Yehuda began to offer sacrifices, and the foundation of the Blessed Sacrament was not yet in place (Ezra 3)
        Month 7, Day 10 - Yom Kippur
        Month 7, Day 15 - Sukkot
        Month 7, Day 17 - Noah's ark rests on Ararat
        Month 7, Day 21 - Prophecy of Haggai
        Month 7, Day 24 - Israel assembles and turns from its sins, and the eight Levites offer prayer (Nehemiah 9)`
        ,summarySp: `Eventos que no dice día exacto:
        - Todos los hombres se reunen ante Shlomo para festejar y traer el Aron
        - Muere Janania ben Azur, en el 4to año de Tzidkiyahu
        - Ishmael y sus hombres comen con Guedalia y lo matan
        - Israel ya moraban en sus ciudades, tiempo de Ezra
        
        Mes 7 día 1 - Rosh Hashana, Ezra trae la Tora ante el pueblo(Nehemia 8), comenzaron a ofrecer korbanot al pueblo y el basamento del BH no estaba colocado(Ezra 3)
        Mes 7 día 10 - Yom Kipur
        Mes 7 día 15 - Sucot
        Mes 7 día 17 - Teva se posa en Ararat
        Mes 7 día 21 - Profecía de Jagai
        Mes 7 día 24 - Se reune Israel y se aparta de sus pecados y 8 leviim plegaria(Nehemia 9)`
    },
      {
        title: "Eighth Month (Jeshvan/Bul)",
        titleSp: "Octavo Mes (Jeshvan/Bul)",
        summary: `Events without a specific date:
        - Shlomo completes the construction of the Temple in the 11th year of his reign.
        - In the 2nd year of Daryavesh, Zechariah begins prophesying. \n\n Month 8 Day 15 - Date of the invented holiday by Yerobaam ben Nvat`
       , summarySp: `Eventos que no dice día exacto:
        - Shlomo termina la construccion del Bet Hamikdash en el 11vo año de su reinado
        - 2do año de Daryavesh, Zejaria comienza profetizando
        
        Mes 8 Día 15 - Fiesta inventada de Yerobaam ben Nvat`
    },
      {
        title: "Ninth Month (Kislev)",
        titleSp: "Noveno Mes (Kislev)",
        summary: `Events without a specific date:
        - In the 20th year of Artajshasta, Nehemiah learns of the situation in Jerusalem and prays to Hashem. \n\n 9th month, day 4 - 4th year of Daryavesh; Bethel sends Shaaretzer and Regem Melech to see if she should continue weeping; Zechariah prophesies.
        9th month, day 20 - The reunited captives of Yehuda congregate to analyze the sin of marrying foreign women(Ezra 9)
        9th month, day 24 - Haggai prophesies; from that day the foundations of the Blessed Sacrament were laid, 2nd year of Daryavesh.`
        ,summarySp: `Eventos que no dice día exacto:
        - Año 20 de Artajshasta, Nehemia se entera de la situacion de Yerushalaim y reza a H'
        
        Mes 9 día 4 - 4to año de Daryavesh; Bet-El envia a Shaaretzer y Reguem Melej para ver si tenia que seguir llorando; Zejaria profetiza
        Mes 9 día 20 - Se reunen en Ezra por el asunto de las mujeres 
        Mes 9 dia 24 - Jagai profetiza, desde ese dia se pusieron los cimientos del BH, 2do año de Daryavesh`
    },
      {
        title: "Tenth Month (Tevet)",
        titleSp: "Decimo Mes (Tevet)",
        summary: `Events without a specific date:
        - Ajashverosh takes Esther as wife in the 7th year of his reign. \n\n Month 10, Day 1 - The mountain peaks start to appear after the Mabul; officials begin to analyze the issue of women in Ezra.
        Month 10, Day 10 - Nebuchadnezzar builds earthworks around Jerusalem.`
       , summarySp: `Eventos que no dice día exacto:
        - Las aguas del mabul descienden hasta el mes 10mo
        - Ajashverosh toma a ester en el año 7 de su reinado
        
        Mes 10 dia 1 - Aparecen las cimas de las montañas(Mabul), los oficiales empiezan a analizar el tema de las mujeres en Ezra
        Mes 10 dia 10 - Nebujadnetzar construye terraplenes alrededor de Yerushalaim`
      },
      {
        title: "Eleventh Month (Shvat)",
        titleSp: "Undécimo Mes (Shvat)",
        summary: `Month 11, day 24 - 2nd year of Daryavesh, Zechariah sees the horses in the myrtle trees`
       , summarySp: `Mes 11 dia 24 - 2do año de Daryavesh, Zejaria ve los caballos en los mirtos`
    },
      {
        title: "Twelvth Month (Adar)",
        titleSp: "Duodécimo Mes (Adar)",
        summary: `Month 12, Day 3 - The second Temple is completed in the times of Ezra, 6th year of Daryavesh
        Month 12, Day 13 - Jews kill their enemies in Shushan and outside
        Month 12, Day 14 - Purim, Jews outside Shushan stop killing, in Shushan they continue
        Month 12, Day 15 - Shushan Purim`
       , summarySp: `Mes 12 día 3 - Terminan el Bet Hamikdash en Ezra, 6to año de Daryavesh
        Mes 12 dia 13 - Yehudim matan a sus enemigos en Shushan y afuera
        Mes 12 día 14 - Purim, yehudim afuera paran de matar, en Shushan siguen
        Mes 12 día 15 - Shushan Purim`
      },
    ]
  },
  {
    topic: "Israel's trajectory in the desert",
    topicSp: "Trayectorio de Israel en el desierto",
    entries: [
      {
        title: "Trajectory:",
        titleSp: "Trayectorio:",
        summary: `Ramses -> Sukkot
        - 15th day of the first month
        - While the Egyptians were burying their firstborns
        - 600,000 men, not counting children
        - "Many people went up with them, along with very many sheep and cattle"
        - They baked the dough they had brought from Egypt
        Sukkot -> Etham
        - The edge of the desert
        - Pillar of cloud and fire
        Etam -> By the sea (near Pi-Hahiroth, opposite Baal-Zephon, between Migdol and the sea)
        - Paro pursues them
        - They cried out desperately to Hashem
        - Israel complains: "Were there no graves in Egypt?"
        - The sea parts
        Yam Suf -> Midbar Shur/ Midbar Etham
        - They walked for three days without finding water
        Shur -> Mara
        - Israel complains: "What shall we drink?"
        - Moshe threw a tree in the waters, and they became sweet
        - Moshe gave the people laws and statutes and tested them
        - "If you listen to the voice of the Lord, if you do what is right in his eyes and keep his commandments and decrees, I will not put on you the plagues I put on the Egyptians."
        - "For I am the Lord, your Healer."
        Mara -> Elim
        - 12 springs of water and 70 palm trees
        - They camped there by the waters
        Elim -> By the Yam Suf
        By the Yam Suf -> Midbar Sin
        - It is between Elim and Sinai
        - They arrived on the 15th day of the second month of Yetziat Mitzraim
        - The whole community of the children of Israel protested against Moses and Aaron: "It would have been better for us to die at the hands of the Lord in Egypt, when we sat around the pot of meat."
        - The glory of the Lord appeared to them in the cloud
        - They receive Man
        Midbar Sin -> Dofka
        Dofka -> Alsuh
        Alush -> Refidim
        - There was no water for the people to drink
        - The people argued heatedly with Moses
        - "Why do you quarrel with me? Why do you test God?" Moses to the people
        - The people complained: "Why did you bring us up from Egypt to kill us with thirst?"
        - Water flowed from the rock at Horeb
        - Moshe calles it Masa and Meriva, for testing God and quarreling with Moshe
        - The people asked: "Is God with us, yes or no?"
        - War against Amalek
        - Encounter with Itro
        Refidim -> Midbar Sinai
        - They arrived after 3 months of Yetziat Mitzraim
        - They camped in front of the mountain
        - There, Moshe ascended before God, answering His call
        - The people say: "We will do everything God has said"
        - 10 Commandments and giving of the Laws
        - Golden Calf incident
        - All of the Book of Vayikra takes place here
        - Second year of Passover, order of Pesach Sheni
        - Laws of the Trumpets
        Midbar Sinai -> Midbar Paran
        - On the 20th day of the 2nd month, they begin the journey to get here
        - The Nesi'im of each tribe are listed
        - Quail is sent
        - Elders help Moshe
        - Kibrot Hataavah incident
        Kibrot Hataavah -> Hatzerot
        - Miriam's Leprosy
        Hatzerot -> Midbar Paran
        - Merraglim are sent
        - The people complain: "Why did God bring us to this land? To perish by the sword!"
        - Israel decides to choose another leader to return to Egypt
        - "How long will this people continue to provoke Me? How long will they remain stubborn and disbelieve Me?"
        - Hashem says: "Tomorrow, you will turn back and march through the desert, on the way to the Red Sea"
        - Decree of 40 years in the desert
        - Korah's rebellion
        The 40 years of wandering:
        Ritma -> Rimon Peretz
        Rimon Peretz -> Livna
        Livna -> Risa
        Risá -> Khelatá
        Khelatá -> Har Shofer
        Har Shofer -> Haradah
        Jarada -> Maquelot
        Maquelot -> Tájat
        Tájat -> Táraj
        Taraj -> Mithca
        Mitcah -> Jashmonah
        Jashmonah -> Moserot
        Moserot -> Bene Yaakan
        Bene Yaakan -> Jor Hagidgad
        Jor Hagidgad -> Yotvata
        Yotvata -> Avronah
        Avronah -> Etzion Geber
        Etzion Gueber -> Midbar Tzin(Cadesh)
        - They arrived in the first month
        - Miriam died and was buried
        - There was no water for the people
        - The people complain: “We should have died as our brothers died before Hashem"
        - Moshe hits the rock, it is called Meriva, because there Israel complained to God, and He glorified Himself before them.
        - They asked Edom for permission to pass through their land.
        Kadesh -> Hor
        - Border of the land of Edom
        - Aaron died 40 years after leaving Egypt, on the first day of the fifth month.
        - The events of Arad occurred.
        Circling Edom, on the way to Yam Suf:
        - The people grew impatient during the journey.
        - The people protested against God and Moses, "fed up with the empty bread."
        - Poisonous snakes.
        Hor -> Tzalmoná
        Tzalmoná -> Punon
        Punon -> Obot
        Obot -> Iye Avarim
        - In the desert facing Moab, to the east.
        Iye Avarim -> Nahal Zared according to Shemot, Divon Gad according to Numbers
        Divon Gad -> Almon Divlataim
        Almon Divlataim -> Hare Abarim, next to Nebo
        Nahal zared -> Beyond the Arnon
        - In the desert that begins at the border of the Amorites
        - The Arnon is the border of Moab, between Moab and the Amorites
        - That is why it says in the Book of the Wars of the Lord: "What he did at Yam Suf and the Valley of the Arnon, on the slope of the valley that extends from Ar to the border of Moab"
        Beyond the Arnon -> Place of the spring
        - "Gather the people together, that I may give them water" Lord to Moses
        - Song of the well
        - "Bring forth, O spring! Sing to it, O well that the leaders of the people dug with their staffs, at the command of the Lawgiver"
        Place of the spring -> Matanah
        Matanah -> Nahaliel
        Nahaliel -> Bamoth
        Bamoth -> Valley of Moab and summit of Pisgah
        - Israel sends messengers to Sihon
        - They fight and defeat Sihon
        Moab -> Bashan
        - They fight and defeat Og
        Bashan -> Plain of Moab, beyond the Yarden, near Jericho
        - They camped from Beth Haishimoth to Avel Hashitim
        - Balak and Balaam's story
        - Zimri and Cozbi's incident
        - War against Midian
        - Hashem tells Moses to go to Canaan, destroy all the inhabitants, and divide the inheritance
        - Also, to give the Levites part of their inheritance
        - All of Devarim takes place here`
       , summarySp: `Ramses -> Sucot
        - Dia 15 del mes primero
        - Con mano alzada
        - Mientras los mitzrim sepultaban a los primogenitos
        - 600,000 hombres sin contar a los niños
        - "Mucha gente subio con ellos, junto con muchisimos ovinos y vacunos"
        - Cocieron la masa que habian llevado de mitzraim
        Sucot -> Etam 
        - El extremo del desierto
        - Columna de nube y de fuego
        Etam -> Junto al mar(cerca de Pi-Hahirot, frente a Baal-Tzefon, entre Migdol y el mar)
        - Paro los persigue
        - Clamaron desesperadamente a H'
        - Israel se queja: "¿No habian sepulturas en Mitzraim?"
        - Yam suf
        Yam suf -> Midbar Shur/ Midbar Etam
        - Anduvieron 3 dias sin hallar agua
        Shur -> Mara
        - "¿Que beberemos?" Pueblo a Moshe
        - Arbol que echó a las aguas y estas se endulzaron
        - Alli dio al pueblo leyes y estatutos y lo puso a prueba
        - "Si escuches la voz de H', si hagas lo que es recto a Sus ojos y cumplas sus preceptos y leyes, no pondre sobre ti las plagas que puse sobre los egipcios"
        - "Pues Yo soy el Eterno, tu Sanador"
        Mara -> Elim
        - 12 fuentes de agua y 70 palmeras
        - Acamparon allí junto a las aguas
        Elim -> Junto al Yam Suf
        Junto al Yam Suf -> Midbar Sin
        - Esta entre Elim y Sinai
        - Llegaron a los 15 dias del 2do mes de Yetziat Mitzraim
        - Toda la comunidad de los hijos de Israel protestaba contra Moshe y Aharon: "Era preferible morir entre las manos de H' en Mitzraim, cuando nos sentabamos junto a la olla de carne"
        - Se les apareció la gloria de H' en la nube
        - Reciben Man
        Midbar Sin -> Dafka
        Dafka -> Alsuh
        Alush -> Refidim
        - No habia agua para que el pueblo bebiera
        - Discutio acaloradamente el pueblo con Moshe
        - "Porque reñis conmigo? Porque poneis a prueba a H'?" Moshe al pueblo
        - El pueblo se queja: "¿Porque nos hiciste subir de Mitzraim para matarnos de sed?"
        - De la roca en Jorev sale Agua
        - Moshe lo llama Masa y Meriva, por haber puesto a prueba a H' y por reñir con Moshe
        - El pueblo pregunto: "¿Esta H' con nosotros, si o no?"
        - Guerra contra Amalek
        - Encuentro con Itro
        Refidim -> Midbar Sinai
        - Llegaron a los 3 meses de Yetziat Mitzraim
        - Acamparon frente al monte
        - Allí subió Moshe ante Dios, acudiendo a Su llamado
        - Pueblo dice: "Haremos todo lo que dijo H'"
        - 10 mandamientos y entrega de Leyes
        - Becerro de Oro
        - Todo sefer Vaikra pasa aquí
        - Segundo año de Pesaj, orden de Pesaj Sheni
        - Leyes de las trompetas
        Midbar Sinai -> Midbar Paran
        - El dia 20 del mes 2do comienzan el camino para llegar acá
        - Comandantes de cada tribu
        - Pepinos, sandias, puerros, ajos, cebollas 
        - Codornices
        - Ancianos que ayudan a Moshe
        - Kibrot Hataava
        Kibrot Hataava -> Hatzerot
        - Lepra de Miriam
        Hatzerot -> Midbar Paran
        - Merraglim
        - El pueblo se queja: "¿Para que nos trajo H' a esta tierra? ¡Para que perezcamos por la espada!"
        - Deciden elegir otro jefe para volver a Mitzraim 
        - "¿Hasta cuando este pueblo Me seguira provocando? ¿Hasta cuando seguira en su cabezadura sin creerme?"
        - "Mañana mismo, os volvereis y marchareis por el desierto, camino del Mar Rojo" H' dice
        - Decreto de 40 años en el desierto
        - Koraj y su gente
        40 años en el desierto:
        Ritma -> Rimon Peretz
        Rimon Peretz -> Livna
        Livna -> Risá
        Risá -> Khelatá
        Khelatá -> Har Shofer
        Har Shofer -> Jaradá
        Jaradá -> Maquelot
        Maquelot -> Tájat
        Tájat -> Táraj
        Táraj -> Mitca
        Mitca -> Jashmoná
        Jashmoná -> Moserot
        Moserot -> Bene Yaakan
        Bene Yaakan -> Jor Hagidgad
        Jor Hagidgad -> Yotvata
        Yotvata -> Avroná
        Avroná -> Etzion Gueber
        Etzion Gueber ->  Midbar Tzin(Cadesh)
        - Llegaron en el mes primero
        - Murio miriam y fue sepultada
        - No habia agua para la gente
        - “Hubieramos muerto como nuestros hermanos murieron delante de Hashem”
        - Moshe le pega a la roca, se llama Meriva, porque alli israel querello ante H' y Él se glorifico ante ellos
        - Le piden permiso a Edom para pasar por su tierra
        Cadesh -> Hor
        - Extremo de la tierra de Edom
        - Muere Aharon a los 40 años de la salida de mitzraim, el dia primero del quinto mes
        - Pasa lo de Arad
        Rodeando Edom, camino al Yam Suf:
        - El pueblo impacientó durante el trayecto
        - Protesto el pueblo contra H' y moshe, "hartos del pan liviano"
        - Serpientes venenosas
        Hor -> Tzalmoná
        Tzalmoná -> Punon
        Punon -> Obot
        Obot -> Iye avarim
        - En el desierto que esta frente a Moab, hacia el este
        Iye avarim -> Najal Zared segun shemot, Divon Gad segun bamidbar
        Divon Gad -> Almon Divlataim
        Almon Divlataim -> Haré Abarim, frente a Nevo 
        Najal zared -> Al otro lado del arnon
        - En el desierto que empieza en la frontera de los Emorim
        - Arnon es el limite de Moab, entre Moab y los Emorim
        - Por eso dice en el libro de las guerras de H': "Lo que hizo en Yam Suf y valle de Arnon, en el declive del valle que se extiende desde Ar hasta el linde de moab"
        Otro lado del Arnon -> Lugar de la fuente
        - "Reune al pueblo, que le dare agua" H' a Moshe
        - Cantico del pozo
        - "Brota, oh fuente. Cantadle vosotros. Oh pozo que cavaron los jefes del pueblo con sus baculos, por orden del Legislador" 
        Fuente -> Matana
        Matana -> Nahaliel
        Nahaliel -> Bamot
        Bamot -> Valle de Moab y cima de Pisga
        - Envia mensajeros a Sijon
        - Pelean y vencen a Sijon
        Moab -> Bashan
        - Pelean y vencen a Og
        Bashan -> Llano de Moab, al otro lado del Yarden, cerca de Yerijo
        - Acamparon desde Bet Hayishimot hasta Avel Hashitim
        - Balak y Bilaam
        - Zimri y Cosbi
        - Guerra contra Midian
        - H' le dice a Moshe que lleguen a Cnaan, destruyan todos los moradores y se repartan la herencia
        - Tambien que den a los Leviim parte de su heredad
        - Todo Sefer Devarim
        
        
        `
      },
    ]
  },
  {
    topic: "Tables of the Kings",
    topicSp: "Tablas de Reyes",
    entries: [
        { title: "Kings of Yehuda",
        titleSp: "Reyes de Yehuda",
    table: {
      headers: ["#", "King", "Started reigning at age —", "Years he reigned", "Mother", "King of Israel at that time"],
      rows: [
        ["1", "Shlomo", "—", "40", "Bat Sheva bat Eliam", "—"],
        ["2", "Rejavam", "41", "17", "Naama haamoní", "Started in the first year of Yerobaam"],
        ["3", "Aviyam", "—", "3", "Maaja bat Abishalom (Mijaya bat Uriel of Guiba according to Divre Hayamim)", "Started in the 18th year of Yerobaam"],
        ["4", "Asa", "—", "41", "Maaja bat Abishalom", "Started in the 20th year of Yerobaam"],
        ["5", "Yehoshafat", "35", "25", "Azuva bat Shilji", "Started in the 4th year of Ajab"],
        ["6", "Yehoram", "32", "8", "—", "Started in the 5th year of Yehoram ben Ajab"],
        ["7", "Ajazia", "22", "1", "Atalia bat Omri", "Started in the 11/12th year of Yehoram ben Ajab"],
        ["8", "Atalia", "—", "6", "Father - Omri", "Yehu"],
        ["9", "Yoash ben Ajaziahu", "7", "40", "Tzivia of Beer Sheva", "Started in the 7th year of Yehu"],
        ["10", "Amatziahu", "25", "29", "Yehoadan of Yerushalaim", "Started in the 2nd year of Yoash ben Yehoajaz"],
        ["11", "Azaryahu", "16", "52", "Yejoliahu of Yerushalaim", "Started in the 27th year of Yerobaam ben Yoash"],
        ["12", "Yotam", "25", "16", "Yerusha bat Tzadok", "Started in the 2nd year of Pekaj"],
        ["13", "Ajaz", "20", "16", "—", "Started in the 17th year of Yerobaam"],
        ["14", "Jizkiyahu", "25", "29", "Avi bat Zejaria", "Started in the 3rd year of Hoshea"],
        ["15", "Menashe", "12", "55", "Jeftziba", "—"],
        ["16", "Amon", "22", "2", "Meshulemet bat Jarutz of Yotva", "—"],
        ["17", "Yoshiyahu", "8", "31", "Yedida bat Adaya of Botzcat", "—"],
        ["18", "Yehoajaz", "23", "3 meses", "Jamutal bat Yirmiyahu of Livna", "—"],
        ["19", "Yehoyakim", "25", "11", "Zevuda bat Pedaya of Ruma", "—"],
        ["20", "Yehoyajin", "18", "3 meses", "Nejushtá bat Elnatan of Yerushalaim", "—"],
        ["21", "Tzidkiyahu", "21", "11", "Jamutal bat Yirmiyahu of Livna", "—"],
        ["—", "Guedalya", "—", "—", "—", "—"],
      ],
      headersSp: ["#", "Rey", "Empezó a reinar con — años", "Años que reinó", "Madre", "Rey de Israel en ese tiempo"],
      rowsSp: [ ["1", "Shlomo", "—", "40", "Bat Sheva bat Eliam", "—"],
      ["2", "Rejavam", "41", "17", "Naama haamoní", "Empezó en el 1er año de Yerobaam"],
      ["3", "Aviyam", "—", "3", "Maaja bat Abishalom (Mijaya bat Uriel de Guiba según Divré Hayamim)", "Empezó en el 18avo año de Yerobaam"],
      ["4", "Asa", "—", "41", "Maaja bat Abishalom", "Empezó en el 20vo año de Yerobaam"],
      ["5", "Yehoshafat", "35", "25", "Azuva bat Shilji", "Empezó en el 4to año de Ajab"],
      ["6", "Yehoram", "32", "8", "—", "Empezó en el 5to año de Yehoram ben Ajab"],
      ["7", "Ajazia", "22", "1", "Atalia bat Omri", "Empezó en el 12/11 año de Yehoram ben Ajab"],
      ["8", "Atalia", "—", "6", "Padre - Omri", "Yehu"],
      ["9", "Yoash ben Ajaziahu", "7", "40", "Tzivia de Beer Sheva", "Empezó en el 7mo año de Yehu"],
      ["10", "Amatziahu", "25", "29", "Yehoadan de Yerushalaim", "Empezó en el 2do año de Yoash ben Yehoajaz"],
      ["11", "Azaryahu", "16", "52", "Yejoliahu de Yerushalaim", "Empezó en el 27 año de Yerobaam ben Yoash"],
      ["12", "Yotam", "25", "16", "Yerusha bat Tzadok", "Empezó en el 2do año de Pekaj ben Remaliahu"],
      ["13", "Ajaz", "20", "16", "—", "Empezó en el 17 año de Pekaj"],
      ["14", "Jizkiyahu", "25", "29", "Avi bat Zejaria", "Empezó en el 3er año de Hoshea"],
      ["15", "Menashe", "12", "55", "Jeftziba", "—"],
      ["16", "Amon", "22", "2", "Meshulemet bat Jarutz de Yotva", "—"],
      ["17", "Yoshiyahu", "8", "31", "Yedida bat Adaya de Botzcat", "—"],
      ["18", "Yehoajaz", "23", "3 meses", "Jamutal bat Yirmiyahu de Livna", "—"],
      ["19", "Yehoyakim", "25", "11", "Zevuda bat Pedaya de Ruma", "—"],
      ["20", "Yehoyajin", "18", "3 meses", "Neجushtá bat Elnatan de Yerushalaim", "—"],
      ["21", "Tzidkiyahu", "21", "11", "Jamutal bat Yirmiyahu de Livna", "—"],
      ["—", "Guedalya", "—", "—", "—", "—"]]
    }
    },
    {
        title: "Kings of Israel",
        titleSp: "Reyes de Israel",
        table: {
          headers: ["#", "King", "Years he reigned", "King of Yehuda in that time"],
          rows: [
            ["1", "Yerobaam ben Nevat", "22", "Started in the 1st year of Rejovam"],
            ["2", "Nadav", "2", "Started in the 2nd year of Asa"],
            ["3", "Baasha ben Ajiya", "24", "Started in the 3rd year of Asa"],
            ["4", "Ela", "2", "Started in the 26th year of Asa"],
            ["5", "Zimri", "7 dias", "Started in the 27th year of Asa"],
            ["6", "Omri (with Tibni ben Guinat)", "12 (6 of them were Tirtza)", "Started in the 31st year of Asa"],
            ["7", "Ajab", "22", "Started in the 38th year of Asa"],
            ["8", "Ajazia", "2", "Started in the 17th year of Yehoshafat"],
            ["9", "Yehoram", "12", "Started in the 18th year of Yehoshafat / 2nd year of Yehoram ben Yehoshafat"],
            ["10", "Yehu ben Nimshi", "28", "No king of Yehuda at that time(he killed Ajaziahu ben Yehoram)"],
            ["11", "Yehoajaz", "17", "Started in the 23rd year of Yoash ben Ajaziahu"],
            ["12", "Yoash", "16", "Started in the 37th year of Yoash ben Ajaziahu"],
            ["13", "Yerobaam", "41", "Started in the 15th year of Amatzia"],
            ["14", "Zejaria", "6 meses", "Started in the 38th year of Azaria"],
            ["15", "Shalum ben Yabesh", "1 mes", "Started in the 39th year of Azaria"],
            ["16", "Menajem ben Gadi", "10", "Started in the 39th year of Azaria"],
            ["17", "Pekajyahu ben Menajem", "2", "Started in the 50th year of Azaria"],
            ["18", "Pekaj", "20", "Started in the 52nd year of Azaria"],
            ["19", "Hoshea", "9", "Started in the 20th year of Yotam / 12th year of Ajaz"],
          ],
          headersSp: ["#", "Rey", "Años que reinó", "Rey de Yehuda en ese tiempo"],
          rowsSp: [ ["1", "Yerobaam ben Nevat", "22", "Empezó en el 1er año de Rejavam"],
          ["2", "Nadav", "2", "Empezó en el 2do año de Asa"],
          ["3", "Baasha ben Ajiya", "24", "Empezó en el 3er año de Asa"],
          ["4", "Ela", "2", "Empezó en el 26 año de Asa"],
          ["5", "Zimri", "7 dias", "Empezó en el 27 año de Asa"],
          ["6", "Omri (con Tibni ben Guinat)", "12 (6 de esos fueron en Tirtza)", "Empezó en el año 31 de Asa"],
          ["7", "Ajab", "22", "Empezó en el año 38 de Asa"],
          ["8", "Ajazia", "2", "Empezó en el 17 de Yehoshafat"],
          ["9", "Yehoram", "12", "Empezó en el 2do año de Yehoram ben Yehoshafat / En el año 18 de Yehoshafat"],
          ["10", "Yehu ben Nimshi", "28", "Mató a Ajazia (Entonces no había rey de Yehuda en ese tiempo)"],
          ["11", "Yehoajaz", "17", "Empezó en el 23 año de Yoash ben Ajazia"],
          ["12", "Yoash", "16", "Empezó en el 37 año de Yoash ben Ajazia"],
          ["13", "Yerobaam", "41", "Empezó en el 15 año de Amatzia"],
          ["14", "Zejaria", "6 meses", "Empezó en el 38 año de Azariahu"],
          ["15", "Shalum ben Yabesh", "1 mes", "Empezó en el 39 año de Azariahu"],
          ["16", "Menajem ben Gadi", "10", "Empezó en el 39 año de Azariahu"],
          ["17", "Pekajyahu ben Menajem", "2", "Empezó en el 50 año de Azariahu"],
          ["18", "Pekaj", "20", "Empezó en el 52 de Azariahu"],
          ["19", "Hoshea", "9", "Empezó en el 20 de Yotam / Año 12 de Ajaz"] ]
        }
      }
    ]
  },
  {
    topic: "Important Places",
    topicSp: "Lugares Importantes",
    entries: [
      {
        title: "Places to know (ft. Sarah Harari):",
        titleSp: "Lugares para saber (ft. Sarah Harari): ",
        summary: 
        `- UR CASDIM: The birthplace of Terah.
        - HARAN: Abraham traveled to Haran.
        - BETHEL AND AI: Abraham pitched his tents between Bethel and Ai; Joshua’s ambush force positioned themselves between Bethel and Ai.
        - PENUEL: The tower of Penuel—its inhabitants refused to provide food to Gideon and his men.
        - ZORAH AND ESHTAOL: Manoah was from Zorah; the Spirit of the Lord began to stir Samson between Zorah and Eshtaol.
        - PENIEL: Jacob named the place where he crossed the river Peniel.
        - PADAN ARAM: Laban was an Aramean from Padan Aram.
        - SHECHEM: Joseph went to look for his brothers in Shechem; Jotham spoke to the people of Shechem (on Mount Gerizim); Abimelech sowed salt over Shechem.
        - DOTHAN: Joseph’s brothers were in Dothan; Elisha was in Dothan.
        - KARKOR: Zebah and Zalmunna were there with their armies (15,000 men).
        - SUCCOTH: Jacob went to Succoth after meeting Esau; the Children of Israel traveled from Rameses to Succoth; the people of Succoth refused to provide food to Gideon, and Gideon told them he would tear their flesh with the thorns and thistles of the wilderness.
        - TABOR (Mount Tabor): Deborah and Barak; "What were the men like whom you killed at Tabor?" Gideon asked Zebah and Zalmunna.
        - RAMESES: Pithom and Rameses—store cities built for Pharaoh; the Children of Israel traveled from Rameses to Succoth.
        - ETAM: The Children of Israel traveled from Rameses to Succoth, and from Succoth to Etam. After killing the Philistines, Samson went down and lived in a cleft of the rock at Etam. - LEHI: The Philistines advanced upon Lehi (against Judah—specifically, against Samson).
        - KADESH: It was situated between Kadesh and Bered, near Beer-lahai-roi; Miriam died in Kadesh.
        - HESHBON: The Children of Israel conquered Heshbon from Sihon; furthermore, in the "Song of the Well," it is recounted that Heshbon was utterly destroyed, as far as Dibon.
        - HEBRON (also known as Kiryat Arba): Named "Arba" after the four giants—Ahiman, Sheshai, and Talmai, the sons of Anak; the city was given to Caleb son of Jephunneh.
        - ZIKLAG: The city where David resided while he was with Achish, the King of Gath.
        - GATH: When the Ark was brought to Gath, God afflicted the inhabitants with hemorrhoids; Goliath also hailed from the city of Gath.
        - GAZA: Samson was taken to Gaza and imprisoned there.
        - ASHKELON: Samson killed thirty men in Ashkelon.
        - EKRON: The hand of God weighed heavily upon the city while the Ark was kept there.
        - BETHLEHEM: Rachel is buried there.
        - ALLON BACHUT: Deborah, the nursemaid of Rebecca, is buried there.
        - AVEL MITZRAIM: The place where the Egyptians mourned for Jacob; it was given this name because they exclaimed, "This is a grievous mourning for the Egyptians!"
        - HORMAH: The place where the inhabitants of Arad (a Canaanite king) were defeated; it was also the site where the Children of Israel were routed when they attempted to enter the Land of Israel—despite having been forbidden to do so—and were pursued and slaughtered by the Amalekites and others as far back as Hormah.
        - BET SHEMESH: The place where the Philistines deposited the Ark, leaving it at the house of Joshua, near a large stone.
        - HELKAT HATZURIM: The site of the battle between twelve of Abner's men and twelve of Joab's men.
        - KARKOR: The encampment of the army of the "Children of the East" (the southerners) during Gideon's war against Midian; their forces numbered 120,000 men. A vast number perished by the sword, and only 15,000 survived—those who were with Zebah and Zalmunna in Karkor (at the time Gideon was pursuing Zebah and Zalmunna to kill them).
        - OFRA: Gideon’s hometown. The Angel "sat beneath the terebinth tree that was in Ofra," and Gideon placed the Ephod he had fashioned in Ofra.`,
        summarySp: 
        `- UR CASDIM:  tierra natal de Teraj
        - JARAN: Abraham fue a Jaran 
        - BETEL Y HAAY: Abraham plantó sus tiendas entre BetEl y Haay , Yehoshua la emboscada se pusieron entre BetEl y Haay
        - PNUEL: La torre de Pnuel no le quisieron dar comida a Guidon y sus gentes y Guidon 
        - TZORA Y ESHTAOL: Manoaj era de Tzora… , El Ruaj de H empezó a Impulsarle a Shimshon entre Tzora y Eshtaol
        - PENIEL: Jacob el lugar que cruzo el rio lo llamo PeniEl
        - PADAN ARAM : Laban era Sirio de Padan Aram 
        - SHEJEM: Joseph fue a buscar a sus hermanos en Shejem, Yotam le dijo a la gente de Shejem (en el monte Guerizim) Abimelej echo sal en Shejem
        - DOTAN : Hermanos de Joseph estaban en Dotan , Elisha estaba en Dotan
        - CARCOR: Zebaj y Ztalmuna estaban ahí con sus ejércitos (15,000 hombres) 
        - SUCOT : Jacob fue a Sucot después que vio a Esav , Benei Israel fueron de Ramses a Sucot, la gente de Sucot no le querían dar comida a Guidon Guidon le dijo que iba a arrancar su carne con las espinas y abrojos del Desierto
        - TABOR - Har Tabor Deborah y Barak , Como era los hombres que mataste en Tabor que le dice Guidon a Zebaj y Tzalmuna
        - RAMSES - Pitom y Ramses ciudades de almacenamiento para Paro , Benei Israel fuero de Ramses a Sucot 
        - ETAM : Benei Israel fuero de Ramses a Sucot y de Sucot a Etam . Shimshon después de haber matado a los Plishtim bajo y vivió en una hendidura en la roca de Etam. 
        - LEJI: los Plishtim se desplazaron en Leji (VS Yehuda osea VS Shimshon)
        - CADESH : Estaba entre Cadesh Y Bered Beer Lajay Roy , Miriam  se murió en Cadesh 
        - JESHBON- Benei Israel conquistaron Jeshbon de Sijon , también en el Cántico del pozo que Jeshon fue exterminada hasta Divon
        - HEBRON( AKA Kriat Arba) : Arba por los 4 Gigantes Ajiman Sheshay y Talmay Benei Anak, le fue dada a Caleb Ben Yefune 
        - TZICLAG: Ciudad de David cuando estaba con Ajish el Rey de Gat 
        - GAT: cuando llevaron el Aron a Gat, Hashem los castigo con hemorroides y Goliat era de la ciudad de Gat 
        - GAZA: llevan a Shimshon a Gaza a la prision
        - ASHKELON:  Shimshon mató a los 30 hombres en Ashkelon
        - EKRON: La mano de H' era muy pesada alli cuando tenian el aron
        - BETLEJEM : ahí está enterrada Rajel 
        - ALON BAJUT : ahí está enterrada Deborah la nodriza de Rivka 
        - AVEL MITZRAIM: lugar donde lloraron los egipcios a Jacob de llamó así porque dijieron “llanto muy doloroso es este de los egipcios “
        - JORMA : Lugar que mataron a los de Arad Rey de Cnaan , también ahí exterminaron a los de Benei Israel cuando quisieron entrar cuando ya habían dicho que no entren a Eretz Israel los de Amalek y otros más los exterminaron hasta Jorma 
        - BET SHEMESH: donde los Pelishtim dejaron el Aron, en la casa de Yehoshua donde había una piedra grande  
        - JELKAT HATZURIM: Ahí peliaron 12 VS 12 los de abner VS los de Yoab 
        - KARKOR : El ejército de Benei Kedem ( los del sur) en lo de Guidon VS Midian en la guerra de ellos eran 120,000 y se murieron muchísimos por la espada y solo sobraron 15,000 que eran los que estaban con Zebaj y Zalmuna en Karkor (cuando Guidon estaba buscando a Zebaj y Zalmuna para matarlos) 
        - OFRA: Hometown de Guidon , El Malaj “Se sentó debajo del here into que estaba en Ofra” , Guidon puso el Efod que hizo en Ofra `
      },
    ]
  },
  {
    topic: "Numbers",
    topicSp: "Números",
    entries: [
      {
        title: `Numbers that appear less than 10 times in Tanach 
        (ft. Akiva Shrier) `,
        titleSp: `Números que aparecen menos de 10 veces en Tanaj 
        (ft. Akiva Shrier)`,
        table: {
          headers: ["Number", "Context"], 
          rows: [
            ["19", "Yehoshua 19 (Yiron, Migdal-el..nineteen cities); Men of David’s servants that fall against Avner’s army (not including Asahel); In the 19th year of Nevuchadnezzar that Nevuzardan burns the Beit Hamikdash."],

            ["21", "Eat matzot until the 21st day of the first month (Shemot 12:18), Tzidkiyahu is 21 years old when he becomes king, Chaggai encourages the rest of the people to continue building the Temple, The Sar Malchut Paras opposes the man for 21 days (Daniel 10:13)"],

            ["22", "Yehoshua 19 (Umah, Afek, Rechov…22 cities); Yair Hagileadi rules for 22 years, Yeravam reigns 22 years, Achav reigns 22 years, Amon is 22 years old when he becomes king, Achazyahu is 22 when he becomes king, Aviyah has 22 sons"],

            ["23", "Tola ben Puah reigns 23 years; in the 23rd year of Yehoash Yehoachaz reigns; Yehoachaz becomes king at 23 years old; 23rd of Sivan decree (Esther 8:9)"],

            ["24", "Zevach Shalamim cattle; 24 digits of the man killed by Yehonatan; Basha reigns 24 years; multiple events on the 24th day across Tanach (Chaggai, Zecharia, Daniel, Nechemia)"],

            ["25", "Leviim 25+ work in Ohel Moed; Yehoshefat, Amatzia, Yotam, Chizkiyahu, Yehoyakim begin reign at 25; Yechezkel vision of 25 men; Nechemia’s gate finished on 25 Elul"],

            ["26", "Elah son of Baasha begins to reign in the 26th year of Asa"],

            ["27", "27th day of 2nd month earth dries (Noach); Zimri reigns; Azaria begins reign; Yehoyachin freed on 27th"],

            ["28", "Yehu reigns 28 years"],

            ["29", "Nachor is 29 when he begets Terach; Amatzia and Chizkiyahu reign 29 years; 29 knives in Ezra"],

            ["31", "Omri reigns in 31st year of Asa; Yoshiyahu reigns 31 years"],

            ["32", "Reu is 32 when he begets Serug; Ben Hadad has 32 kings; Yehoram begins reign at 32"],

            ["33", "Leah has 33 descendants to Egypt; David reigns 33 years in Jerusalem"],

            ["34", "Ever is 34 when he begets Peleg"],

            ["35", "Arpachshad is 35 when he begets Shelach; Yehoshefat becomes king at 35"],

            ["36", "36 people killed at Ai; Baasha attacks in 36th year of Asa"],

            ["37", "37 giborim of David; Yoash becomes king; Yehoyachin freed in 37th year of exile"],

            ["38", "38 years in desert (Devarim 2:14); Achav and Zecharia begin reigns"],

            ["39", "39th year of Azaria—Shallum and Menachem begin reign"],

            ["41", "Rechavam begins reign at 41; Asa and Yeravam II reign 41 years"],

            ["42", "42 Levite cities; 42 children killed by bears; brothers of Achazia killed"],

            ["45", "45 people in Sodom; Calev lives 45 years after spies; 45 pillars in Shlomo’s structure"],

            ["48", "48 Levite cities including Arei Miklat"],

            ["49", "Counting the Omer"],

            ["52", "Azarya reigns 52 years; Pekach begins reign; Nechemia wall completed in 52 days"],

            ["55", "Menashe reigns 55 years"],

            ["61", "Tribute from donkeys of Midian"],

            ["62", "Darius becomes king at 62; 62 weeks prophecy (Daniel)"],

            ["65", "Multiple figures beget children at 65; prophecy about Efraim"],

            ["66", "66 descendants of Yaakov to Egypt"],

            ["68", "Oved Edom had 68 brothers"],

            ["72", "Tribute from cattle of Midian"],

            ["75", "Avraham leaves Haran at 75"],

            ["77", "Lemech at 77; elders of Succot killed"],

            ["80", "Moshe at 80 before Paroh; Ehud rules 80 years; multiple 80 references"],

            ["83", "Aharon is 83 when he goes to Paroh"],

            ["85", "Calev is 85; Doeg kills 85 kohanim"],

            ["86", "Avraham is 86 when Yishmael is born"],

            ["90", "Enosh begets Keinan; Sarah is 90"],

            ["96", "Reference in Ezra"],

            ["98", "Eli dies at 98"],

            ["99", "Avraham gets brit milah at 99"]
          ],
          headersSp: ["Número", "Contexto"],  
          rowsSp: [
            ["19", "Yehoshua 19 (Yiron, Migdal-el… diecinueve ciudades); Hombres de los siervos de David que cayeron contra el ejército de Avner (sin incluir a Asahel); En el año 19 de Nevujadnetzar, Nevuzaradán quema el Beit Hamikdash."],

            ["21", "Comer matzot hasta el día 21 del primer mes (Shemot 12:18); Tzidkiyahu tenía 21 años cuando comenzó a reinar; Jagai anima al pueblo a continuar construyendo el Templo; El Sar Maljut Paras se opone durante 21 días (Daniel 10:13)"],

            ["22", "Yehoshua 19 (Umah, Afek, Rejov… 22 ciudades); Yair Haguiladí gobierna 22 años; Yeravam reina 22 años; Ajav reina 22 años; Amón tenía 22 años al comenzar a reinar; Ajazyahu tenía 22; Aviyah tuvo 22 hijos"],

            ["23", "Tola ben Puah reina 23 años; en el año 23 de Yehoash reina Yehoajaz; Yehoajaz comienza a reinar a los 23 años; el 23 de Siván se decreta que los judíos pueden defenderse (Ester 8:9)"],

            ["24", "Zevaj Shelamim de ganado; 24 partes del hombre muerto por Yehonatán; Basha reina 24 años; múltiples eventos en el día 24 (Jagai, Zejaria, Daniel, Nejemia)"],

            ["25", "Leviim de 25 años en adelante sirven en el Ohel Moed; Yehoshafat, Amatzia, Yotam, Jizkiyahu, Yehoyakim comienzan a reinar a los 25; visión de 25 hombres en Yejezkel; la puerta de Nejemia se termina el 25 de Elul"],

            ["26", "Elah hijo de Baasha comienza a reinar en el año 26 de Asa"],

            ["27", "Día 27 del segundo mes la tierra se seca (Noaj); Zimri reina; Azaria comienza a reinar; Yehoyajin es liberado el día 27"],

            ["28", "Yehu reina 28 años"],

            ["29", "Najor tenía 29 años cuando engendra a Teraj; Amatzia y Jizkiyahu reinan 29 años; 29 cuchillos en Ezra"],

            ["31", "Omri comienza a reinar en el año 31 de Asa; Yoshiyahu reina 31 años"],

            ["32", "Reu tenía 32 años cuando engendra a Serug; Ben Hadad tenía 32 reyes con él; Yehoram comienza a reinar a los 32"],

            ["33", "Lea tiene 33 descendientes que van a Egipto; David reina 33 años en Jerusalén"],

            ["34", "Ever tenía 34 años cuando engendra a Peleg"],

            ["35", "Arpajshad tenía 35 años cuando engendra a Shelaj; Yehoshafat comienza a reinar a los 35"],

            ["36", "36 personas mueren en Ai; Baasha ataca en el año 36 de Asa"],

            ["37", "37 guerreros de David; Yoash comienza a reinar; Yehoyajin es elevado en el año 37 del exilio"],

            ["38", "38 años en el desierto (Devarim 2:14); Ajav y Zejaria comienzan a reinar"],

            ["39", "En el año 39 de Azaria, Shalum y Menajem comienzan a reinar"],

            ["41", "Rejavam comienza a reinar a los 41 años; Asa y Yeravam II reinan 41 años"],

            ["42", "42 ciudades levíticas; 42 niños asesinados por osos; hermanos de Ajazia asesinados"],

            ["45", "45 personas en Sodoma; Calev vive 45 años después de los espías; 45 pilares en la estructura de Shlomo"],

            ["48", "48 ciudades levíticas incluyendo Arei Miklat"],

            ["49", "Conteo del Omer"],

            ["52", "Azaria reina 52 años; Pekaj comienza a reinar; el muro de Nejemia se completa en 52 días"],

            ["55", "Menashe reina 55 años"],

            ["61", "Tributo de burros de Midian"],

            ["62", "Dario el Medo se convierte en rey a los 62 años; profecía de las 62 semanas (Daniel)"],

            ["65", "Varias personas engendran a los 65 años; profecía sobre Efraim"],

            ["66", "66 descendientes de Yaakov van a Egipto"],

            ["68", "Oved Edom tenía 68 hermanos"],

            ["72", "Tributo de ganado de Midian"],

            ["75", "Avraham sale de Harán a los 75 años"],

            ["77", "Lemej a los 77; ancianos de Sucot asesinados"],

            ["80", "Moshe tenía 80 años ante Paró; Ehud gobierna 80 años; múltiples referencias al número 80"],

            ["83", "Aharón tenía 83 años cuando va ante Paró"],

            ["85", "Calev tenía 85 años; Doeg mata a 85 cohanim"],

            ["86", "Avraham tenía 86 años cuando nace Yishmael"],

            ["90", "Enosh engendra a Keinan; Sarah tenía 90 años"],

            ["96", "Referencia en Ezra"],

            ["98", "Eli muere a los 98 años"],

            ["99", "Avraham recibe el brit milá a los 99 años"]
          ]
          
        }
      }
    ]
  }
];

export default function Notes() {
  const [activeTopic, setActiveTopic] = useState(NOTES[0].topic);
  const [language, setLanguage] = useState('english');
  const current = NOTES.find(n => n.topic === activeTopic);
  console.log('entries:', current.entries.map(e => ({ title: e.title, hasSummary: !!e.summary, hasTable: !!e.table })));
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Helpful Notes</h1>

      {/* Language Toggle */}
      <div className={styles.langToggle}>
        {['english', 'spanish'].map(lang => (
          <button
            key={lang}
            className={`${styles.langBtn} ${language === lang ? styles.langActive : ''}`}
            onClick={() => setLanguage(lang)}
          >
            {lang === 'english' ? 'English' : 'Español'}
          </button>
        ))}
      </div>

      <div className={styles.topicBar}>
        {NOTES.map(n => (
          <button
            key={n.topic}
            className={`${styles.topicBtn} ${activeTopic === n.topic ? styles.active : ''}`}
            onClick={() => setActiveTopic(n.topic)}
          >
            {language === 'spanish' && n.topicSp ? n.topicSp : n.topic}
          </button>
        ))}
      </div>

      <div className={styles.entries}>
        {current.entries.map((entry, i) => (
          <div key={i} className={styles.card}>
            <h2 className={styles.cardTitle}>
              {language === 'spanish' && entry.titleSp ? entry.titleSp : entry.title}
            </h2>
            {entry.table ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {(language === 'spanish' && entry.table.headersSp
                        ? entry.table.headersSp
                        : entry.table.headers
                      ).map((h, j) => (
                        <th key={j}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(language === 'spanish' && entry.table.rowsSp
                      ? entry.table.rowsSp
                      : entry.table.rows
                    ).map((row, j) => (
                      <tr key={j}>
                        {row.map((cell, k) => (
                          <td key={k}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {entry.summary && (
                  <p className={styles.cardText} style={{ marginTop: '1rem', whiteSpace: 'pre-line' }}>
                    {language === 'spanish' && entry.summarySp ? entry.summarySp : entry.summary}
                  </p>
                )}
              </div>
            ) : (
              <p className={styles.cardText} style={{ whiteSpace: 'pre-line' }}>
                {language === 'spanish' && entry.summarySp ? entry.summarySp : entry.summary}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}