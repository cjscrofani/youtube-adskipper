(function(){
  'use strict';

  //Disable enforcement
  function disableAdblockEnforcement(){
    try {
      if(window.yt && yt.config_ && yt.config_.openPopupConfig && yt.config_.openPopupConfig.supportedPopups){
        yt.config_.openPopupConfig.supportedPopups.adBlockMessageViewModel = false;
        console.log("Disabled adblock enforcement popup via yt.config_.openPopupConfig.supportedPopups");
      }
    } catch(e) { /* ignore errors */ }
    try {
      if(window.ytcsi && typeof window.ytcsi.tick === 'function'){
        window.ytcsi.tick = function(){};
        console.log("Overridden ytcsi.tick to no-op");
      }
    } catch(e) { /* ignore errors */ }
  }
  
  // Run override immediately and then every 200ms for up to 5 seconds
  disableAdblockEnforcement();
  const enforcementInterval = setInterval(disableAdblockEnforcement, 200);
  setTimeout(() => clearInterval(enforcementInterval), 5000);

  //Ad skipping
  setInterval(() => {
    const video = document.querySelector('video');
    const adIndicator = document.querySelector('.ad-showing');
    if(video && adIndicator) {
      const duration = video.duration;
      if (isFinite(duration) && duration > 0) {
        video.currentTime = duration;
        console.log("Ad skipped!");
      } else {
        console.log("Video duration is non-finite, cannot skip ad.");
      }
    }
  }, 500);

  let refreshAttempts = 0;
  const MAX_REFRESH_ATTEMPTS = 3;
  function checkForAdblockError(){
    if(!document.body) return; // Ensure body exists
    const bodyText = document.body.innerText.toLowerCase();
    if(bodyText.includes("ad blockers violate youtube's terms of service") ||
       bodyText.includes("please disable ad blocker")){
      if(refreshAttempts < MAX_REFRESH_ATTEMPTS){
        refreshAttempts++;
        console.log(`Detected enforcement message. Reloading page (attempt ${refreshAttempts})`);
        location.reload();
      } else {
        console.log("Maximum refresh attempts reached. Not reloading further.");
      }
    }
  }
  setInterval(checkForAdblockError, 1000);
})();
