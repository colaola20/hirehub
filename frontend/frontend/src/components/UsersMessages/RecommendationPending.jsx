
import styles from "./RecommendationPending.module.css";

export default function RecommendationPending() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loader}></div>


      <h2 className={styles.title}>Your AI Recommendations Are Being Generated</h2>
      <p className={styles.subtitle}>
        Our AI is currently analyzing thousands of job listings to find the best
        matches for your skills.
      </p>

      <p className={styles.smallText}>
        This may take a moment — check back soon!
      </p>
    </div>
  );
}
