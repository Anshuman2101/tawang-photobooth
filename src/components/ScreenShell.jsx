import styles from './ScreenShell.module.css';

export default function ScreenShell({ children, className = '' }) {
  const classes = [styles.shell, className].filter(Boolean).join(' ');
  return <div className={classes}>{children}</div>;
}
