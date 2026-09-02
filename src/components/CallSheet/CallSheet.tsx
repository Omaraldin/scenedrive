"use client";
import { useEffect, useRef, useState } from "react";
import Eyebrow from "@/components/ui/Eyebrow";
import MonitorFrame from "@/components/ui/MonitorFrame";
import SlashButton from "@/components/ui/SlashButton";
import { fleet } from "@/data/fleet";
import { site, whatsappLink } from "@/data/site";
import { en } from "@/i18n/en";
import { useT } from "@/i18n/LocaleProvider";
import { useCallSheet } from "@/lib/callsheet";
import { setField as set, useForm } from "./formStore";
import styles from "./CallSheet.module.css";

type TypeKey = keyof typeof en.book.types;
const TYPE_KEYS = Object.keys(en.book.types) as TypeKey[];
/** Stored location value: the English entry, so a saved sheet reads the same in both editions. */
const LOCATION_VALUES = en.book.locations;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/** Car and brand names stay Latin in both editions. */
function carName(id: string) {
  const car = fleet.find((c) => c.id === id);
  return car ? `${car.make} ${car.model}` : id;
}

/** Bidi-isolate a Latin run (the phone number) so it keeps its order inside RTL text. */
function ltr(s: string) {
  return `⁦${s}⁩`;
}

/** One hairline row of the sheet: mono label at the start, control after it. */
function Row({ label, htmlFor, labelId, children }: { label: string; htmlFor?: string; labelId?: string; children: React.ReactNode }) {
  return (
    <div className={styles.row}>
      {htmlFor ? (
        <label htmlFor={htmlFor} className={styles.label}>
          {label}
        </label>
      ) : (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      )}
      <div className={styles.control}>{children}</div>
    </div>
  );
}

/** Booking without a phone call: a blank call sheet that turns into a WhatsApp message. */
export default function CallSheet() {
  const { t } = useT();
  const b = t.book;
  const { cars, remove } = useCallSheet();
  // Server snapshot is the blank sheet; the saved one lands right after hydration.
  const form = useForm();
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | undefined>(undefined);
  const extraRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const sheetCars = cars.map(carName);
  const extraCars = form.extra
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const carsText = [...sheetCars, ...extraCars].join(", ");
  const carCount = sheetCars.length + extraCars.length;

  // Saved values are keys; resolve them to the current dictionary for display and for the message.
  const typeKey = (TYPE_KEYS as string[]).includes(form.type) ? (form.type as TypeKey) : "";
  const typeText = typeKey ? b.types[typeKey] : "";
  const locationIndex = LOCATION_VALUES.indexOf(form.location);
  const locationValue = locationIndex >= 0 ? form.location : "";
  const locationText = locationIndex >= 0 ? (b.locations[locationIndex] ?? form.location) : "";

  const lines = [
    { label: b.message.production, value: typeText },
    { label: b.message.cars, value: carsText },
    { label: b.message.dates, value: form.dates.trim() },
    { label: b.message.location, value: locationText },
    { label: b.message.action, value: form.action ? b.yes : b.no },
    { label: b.message.from, value: form.name.trim() },
    { label: b.message.notes, value: form.notes.trim() },
  ];
  const message = [b.message.hi, ...lines.filter((l) => l.value).map((l) => `${l.label}: ${l.value}`)].join("\n");
  const ready = carsText !== "" || form.notes.trim() !== "";
  const waHref = whatsappLink(message);
  const mailHref = `mailto:${site.email}?subject=${encodeURIComponent(b.emailSubject)}&body=${encodeURIComponent(message)}`;

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(site.phoneDisplay);
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <section id="book" className="section">
      <div className="wrap">
        <header className={styles.head}>
          <Eyebrow>{b.eyebrow}</Eyebrow>
          <h2>{b.title}</h2>
          <p className="lead">{b.lead}</p>
        </header>

        <div className={styles.grid}>
          {/* ---- the sheet ---- */}
          <form className={styles.sheet} onSubmit={(e) => e.preventDefault()} noValidate aria-label={b.sheetHead}>
            <div className={styles.sheetHead}>
              <span>
                <b>{t.brand.name}</b> · {b.sheetHead}
              </span>
              <span className="num">{b.rev}</span>
            </div>

            <Row label={b.fields.type} labelId="cs-type-label">
              <div className={styles.chips} role="radiogroup" aria-labelledby="cs-type-label">
                {TYPE_KEYS.map((k) => (
                  <label key={k} className={styles.chip}>
                    <input type="radio" name="cs-type" value={k} className="sr-only" checked={typeKey === k} onChange={() => set("type", k)} />
                    <span>{b.types[k]}</span>
                  </label>
                ))}
              </div>
            </Row>

            <Row label={b.fields.cars} labelId="cs-cars-label">
              {cars.length > 0 ? (
                <ul className={styles.chips} aria-labelledby="cs-cars-label">
                  {cars.map((id) => (
                    <li key={id} className={styles.car}>
                      <span>{carName(id)}</span>
                      <button type="button" className={styles.remove} onClick={() => remove(id)} aria-label={`${b.remove} ${carName(id)}`}>
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.empty}>{b.noCars}</p>
              )}
              <button type="button" className={styles.link} onClick={() => scrollToId("garage")}>
                {b.addFromGarage}
              </button>
            </Row>

            <Row label={b.fields.extraCars} htmlFor="cs-extra">
              <input
                ref={extraRef}
                id="cs-extra"
                className={styles.input}
                type="text"
                value={form.extra}
                onChange={(e) => set("extra", e.target.value)}
                placeholder={b.placeholders.extraCars}
                autoComplete="off"
              />
            </Row>

            <Row label={b.fields.dates} htmlFor="cs-dates">
              <input
                id="cs-dates"
                className={styles.input}
                type="date"
                value={form.dates}
                onChange={(e) => set("dates", e.target.value)}
              />
            </Row>

            <Row label={b.fields.location} htmlFor="cs-location">
              <div className={styles.selectWrap}>
                <select id="cs-location" className={`${styles.input} ${styles.select}`} value={locationValue} onChange={(e) => set("location", e.target.value)}>
                  <option value="">{b.select}</option>
                  {LOCATION_VALUES.map((value, i) => (
                    <option key={value} value={value}>
                      {b.locations[i] ?? value}
                    </option>
                  ))}
                </select>
              </div>
            </Row>

            <Row label={b.fields.action} labelId="cs-action-label">
              <button
                type="button"
                role="switch"
                aria-checked={form.action}
                aria-labelledby="cs-action-label"
                className={styles.switch}
                onClick={() => set("action", !form.action)}
              >
                <span className={styles.track} aria-hidden="true" />
                <span className={styles.switchText}>{form.action ? b.yes : b.no}</span>
              </button>
            </Row>

            <Row label={b.fields.name} htmlFor="cs-name">
              <input
                id="cs-name"
                className={styles.input}
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder={b.placeholders.name}
                autoComplete="organization"
              />
            </Row>

            <Row label={b.fields.notes} htmlFor="cs-notes">
              <textarea
                id="cs-notes"
                className={styles.input}
                rows={3}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder={b.placeholders.notes}
              />
            </Row>
          </form>

          {/* ---- the message ---- */}
          <aside className={styles.preview} aria-label={b.preview}>
            <MonitorFrame
              className={styles.monitor}
              tag={b.preview}
              timecode={String(carCount).padStart(2, "0")}
              cam={`${b.previewFoot} ${ltr(site.phoneDisplay)}`}
            >
              <pre className={styles.msg}>
                <span>{b.message.hi}</span>
                {lines.map((l) => (
                  <span key={l.label} className={l.value ? undefined : styles.dim}>
                    {l.label}: {l.value || "—"}
                  </span>
                ))}
              </pre>
            </MonitorFrame>

            <div className={styles.actions}>
              {ready ? (
                <SlashButton href={waHref} external>
                  {b.send}
                </SlashButton>
              ) : (
                <SlashButton onClick={() => extraRef.current?.focus()} className={styles.off}>
                  {b.send}
                </SlashButton>
              )}
              <SlashButton href={mailHref} variant="ghost">
                {b.email}
              </SlashButton>
            </div>
            {!ready && <p className={styles.hint}>{b.sendHint}</p>}

            <div className={styles.contact}>
              <button type="button" className={styles.copy} onClick={copyPhone} aria-label={`${b.copy} ${site.phoneDisplay}`}>
                <span className="num" dir="ltr">
                  {site.phoneDisplay}
                </span>
                <span className={styles.copyState} aria-live="polite">
                  {copied ? b.copied : b.copy}
                </span>
              </button>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer">
                {b.dm} ↗
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
