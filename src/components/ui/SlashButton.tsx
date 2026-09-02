import styles from "./SlashButton.module.css";

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  external?: boolean;
  type?: "button" | "submit";
};

/** Primary CTA shaped after SceneDrive's red diagonal slash. */
export default function SlashButton({ href, onClick, children, variant = "primary", className = "", external, type = "button" }: Props) {
  const cls = `${styles.btn} ${variant === "ghost" ? styles.ghost : styles.primary} ${className}`;
  if (href) {
    return (
      <a className={cls} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        <span className={styles.label}>{children}</span>
      </a>
    );
  }
  return (
    <button className={cls} onClick={onClick} type={type}>
      <span className={styles.label}>{children}</span>
    </button>
  );
}
