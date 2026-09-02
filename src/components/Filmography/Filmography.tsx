import type { Dictionary, Locale } from "@/i18n";
import Eyebrow from "@/components/ui/Eyebrow";
import FilmographyList from "./FilmographyList";
import SplitCompare from "./SplitCompare";
import styles from "./Filmography.module.css";

type Props = { locale: Locale; t: Dictionary };

/** Raw-vs-final pairs, in the order of t.filmography.pairs. Media and HUD labels are the same in every edition. */
const PAIRS = [
  {
    raw: { src: "v/DWe5jjpjJnS_00.mp4", poster: "v/DWe5jjpjJnS_00.jpg" },
    final: { src: "loop/chase_tunnel.mp4", poster: "loop/chase_tunnel.jpg" },
    timecode: "TC 00:14:22:07",
    cam: "A-CAM",
  },
  {
    raw: { src: "v/DVM4JqliOwl_00.mp4", poster: "v/DVM4JqliOwl_00.jpg" },
    final: { src: "loop/orange_maserati.mp4", poster: "loop/orange_maserati.jpg" },
    timecode: "TC 00:03:41:18",
    cam: "B-CAM",
  },
];

/** End credits: tabbed credits crawl + two raw-vs-final split panels. */
export default function Filmography({ t }: Props) {
  const f = t.filmography;
  return (
    <section id="filmography" className="section">
      <div className="wrap">
        <div className={styles.inner}>
          <header className={styles.head}>
            <Eyebrow>{f.eyebrow}</Eyebrow>
            <h2>{f.title}</h2>
          </header>

          <FilmographyList />

          <div className={styles.compare}>
            <div className={styles.compareHead}>
              <h3>{f.compareTitle}</h3>
              <p className={styles.sub}>{f.compareSub}</p>
            </div>
            <div className={styles.pairs}>
              {PAIRS.map((pair, i) => (
                <SplitCompare
                  key={pair.final.src}
                  raw={pair.raw}
                  final={pair.final}
                  caption={f.pairs[i]?.caption ?? ""}
                  timecode={pair.timecode}
                  cam={pair.cam}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
