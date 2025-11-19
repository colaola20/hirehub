import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import styles from "./FavoriteButton.module.css";

const FavoriteButton = ({ jobId, onFavoriteChange , initialFavorited}) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);
 

  useEffect(() => {
    // checkFavoriteStatus();
  }, [jobId]);

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`/api/favorites/check/${jobId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.is_favorited);
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation(); // Prevent triggering parent onClick events

    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to favorite jobs");
      setIsLoading(false);
      return;
    }

    try {
      if (isFavorited) {
        // Remove favorite
        const response = await fetch(`/api/favorites/${jobId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsFavorited(false);
          if (onFavoriteChange) {
            onFavoriteChange(jobId, false);
          }
        } else {
          const data = await response.json();
          alert(data.error || "Failed to remove favorite");
        }
      } else {
        // Add favorite
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ job_id: jobId }),
        });

        if (response.ok) {
          setIsFavorited(true);
          if (onFavoriteChange) {
            onFavoriteChange(jobId, true);
          }
        } else {
          const data = await response.json();
          alert(data.error || "Failed to add favorite");
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("An error occurred while updating favorites");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`${styles.favoriteBtn} ${isFavorited ? styles.favorited : ""}`}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      {isLoading ? (
        <span className={styles.spinner}>⏳</span>
      ) : isFavorited ? (
        <FaHeart className={styles.heartIcon} />
      ) : (
        <FaRegHeart className={styles.heartIcon} />
      )}
    </button>
  );
};

export default FavoriteButton;
