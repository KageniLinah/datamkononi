// popup.js

// Handle button clicks
document.getElementById("agreeBtn").addEventListener("click", function() {
    // Close the popup and continue browsing
    window.close();
  });
  
  document.getElementById("declineBtn").addEventListener("click", function() {
    // Close the popup and notify background script to block further actions
    window.close();
    chrome.runtime.sendMessage({ action: "blockActions" });
  });
  