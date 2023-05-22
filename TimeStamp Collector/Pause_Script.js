function PauseVideos() {
    try {
      const playButton = document.querySelector(".ytp-chrome-controls .ytp-play-button");
      const isPlaying = playButton.getAttribute("data-title-no-tooltip") === "Pause"; // Check if the video is playing
      console.log(playButton + " Trying to Pause " + isPlaying);
      if (isPlaying) {
        playButton.click(); // Pause the video if it's playing
      }
    } catch (err) {
      return err;
    }
  }
  
  // Wait for page to fully load
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      PauseVideos();
    }, 3000);
  });
  