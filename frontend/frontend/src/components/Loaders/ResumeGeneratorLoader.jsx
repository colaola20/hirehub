import { useState } from "react";
import styles from "./loaders.module.css";
import Lottie from "lottie-react";
import resumeAnim from "./data.json";

const ResumeGeneratorLoader = () => {
  return (
    <div className={styles.screen}>
      <div className={styles.loaderContainer}>
        <div className={styles.loaderModal}>
          <h2 className={styles.analyzing}>
            Analyzing your Resume<span className={styles.dots}></span>
          </h2>
          <div className={styles.loader}>
            <Lottie animationData={resumeAnim} loop />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeGeneratorLoader;
