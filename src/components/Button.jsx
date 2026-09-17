import styles from './Button.module.css';

export default function Button({ variant = 'primary', sticky = false, className = '', ...props }) {
  const classes = [styles.btn, styles[variant], sticky ? styles.sticky : '', className]
    .filter(Boolean)
    .join(' ');
  return <button className={classes} {...props} />;
}
