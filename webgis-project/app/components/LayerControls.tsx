"use client";

import { ViewMode } from "../models/types";
import styles from "../styles/LayerControls.module.css";




interface LayerControls {
  onViewModeChange: (mode: ViewMode) => void;
  currentMode: ViewMode;
}

const LayerControls = ({ onViewModeChange, currentMode }: LayerControls) => {
  return (
    <div className={styles.controlsPanel}>
      <h3 className={styles.title}>Layer Visibility</h3>
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${currentMode === "points" ? styles.active : ""}`}
          onClick={() => onViewModeChange("points")}
        >
          📍 Points Only
        </button>
        <button
          className={`${styles.button} ${currentMode === "polygons" ? styles.active : ""}`}
          onClick={() => onViewModeChange("polygons")}
        >
          🟧 Polygons Only
        </button>
        <button
          className={`${styles.button} ${currentMode === "both" ? styles.active : ""}`}
          onClick={() => onViewModeChange("both")}
        >
          🔄 Both
        </button>
      </div>
    </div>
  );
};

export default LayerControls;