// background.js

let currentTabId = null;

// Function to check if the page contains personal data collection activity
function checkForPersonalData(tabId) {
  // Simulate checking for personal data collection activity
  const containsPersonalData = Math.random() < 0.5; // Randomly decide if it contains personal data

  if (containsPersonalData) {
    currentTabId = tabId;
    // Show alert notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Personal Data Alert",
      message: "This website may be collecting personal data. Do you want to continue?",
      buttons: [{ title: "Agree" }, { title: "Decline" }],
      priority: 2
    });
  }
}

// Listener for web requests
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.tabId !== -1) {
      checkForPersonalData(details.tabId);
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Listener for button clicks on toast notification
chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
  if (buttonIndex === 0) {
    // User clicked Agree
    // Do nothing, continue browsing
  } else if (buttonIndex === 1) {
    // User clicked Decline
    // Notify content script to block further actions
    chrome.tabs.sendMessage(currentTabId, { action: "blockActions" });
  }
});

// Listener for messages from popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "blockActions") {
    // Block further actions
    chrome.webRequest.onBeforeRequest.addListener(
      function(details) {
        return { cancel: true };
      },
      { urls: ["<all_urls>"], tabId: currentTabId },
      ["blocking"]
    );
  }
});


// Ad Tracker and Blocker

// Function to check if an element is an ad
function isAd(element) {
    // You can customize this function based on your ad detection logic
    // For simplicity, let's assume any element with 'ad' class is an ad
    return element.classList.contains('ad');
}

// Function to block an ad
function blockAd(adElement) {
    adElement.style.display = 'none';
}

// Function to show a popup message
function showPopup(message) {
    alert(message);
}

// Main function to track and block ads
function trackAndBlockAds() {
    // Find all elements on the page
    var allElements = document.getElementsByTagName('*');

    // Loop through each element
    for (var i = 0; i < allElements.length; i++) {
        var element = allElements[i];
        
        // Check if the element is an ad
        if (isAd(element)) {
            // Block the ad
            blockAd(element);
            // Show a popup message indicating that the ad was blocked
            showPopup("Ad was blocked successfully!");
        }
    }
}

// Call the main function when the page is loaded
window.onload = trackAndBlockAds;

