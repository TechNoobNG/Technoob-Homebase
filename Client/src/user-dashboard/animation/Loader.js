import styles from "./Loader.module.css";

function Loader() {
  return (
    <section>
      <div className="avatarProfileSk">
        <div className={styles.avatarSk}></div>
        <p className={styles.usernameSk}></p>
        <p className={styles.dateSk}></p>

        <div className={styles.bannerSk} />
        <section className={styles.cardsSk}>
          <div className={styles.cardSk} />
          <div className={styles.cardSk} />
          <div className={styles.cardSk} />
        </section>
      </div>
    </section>
  );
}

function Avatar() {}

export default Loader;
