import { useState } from 'react';
import styles from './Notes.module.css';

const NOTES = [
  {
    topic: "Dates",
    entries: [
      {
        title: "First Month (Nisan)",
        summary: `Month 1 Day 1 - Ezra begins his journey from Babylon to Jerusalem (Ezra 7), the matter of the foreign women is resolved (Ezra 10), the waters of the Mabul dry up\n\nMonth 1 Day 2 - The leaders and the people gather to listen to the Torah, read by Ezra (Nehemiah 8)\n\nMonth 1 Day 10 - The day the Passover sacrifice is offered (Exodus 12), they cross the Jordan (Joshua 4)\n\nMonth 1 Day 13 - The scribes write Haman's edict\n\nMonth 1 Day 14 - The day the Passover sacrifice is offered (Exodus), Passover in the desert (Numbers 9), they celebrate Passover at Gilgal (Joshua), Passover in Ezra\n\nMonth 1 Day 15 - Yetziat Mitzraim, Israel leaves Ramses\n\nMonth 1 Day 21 - Last day of Passover\n\nMonth 1 Day 24 - Daniel next to the Hidekel river`
      },
      {
        title: "Second Month (Iyar/Ziv)",
        summary: "First of the Avot (forefathers). Made a covenant with God and was tested 10 times."
      },
      // Add more characters here
    ]
  },
  {
    topic: "Themes",
    entries: [
      {
        title: "Exile and Redemption",
        summary: "A recurring theme throughout Tanach — the Jewish people are exiled but always redeemed."
      },
      {
        title: "Covenant (Brit)",
        summary: "God's binding agreement with the Jewish people, first with Avraham, then at Sinai."
      },
      // Add more themes here
    ]
  },
  // Add more topics here
];

export default function Notes() {
  const [activeTopic, setActiveTopic] = useState(NOTES[0].topic);

  const current = NOTES.find(n => n.topic === activeTopic);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Helpful Notes</h1>

      <div className={styles.topicBar}>
        {NOTES.map(n => (
          <button
            key={n.topic}
            className={`${styles.topicBtn} ${activeTopic === n.topic ? styles.active : ''}`}
            onClick={() => setActiveTopic(n.topic)}
          >
            {n.topic}
          </button>
        ))}
      </div>

      <div className={styles.entries}>
        {current.entries.map((entry, i) => (
          <div key={i} className={styles.card}>
            <h2 className={styles.cardTitle}>{entry.title}</h2>
            <p className={styles.cardText}>{entry.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}