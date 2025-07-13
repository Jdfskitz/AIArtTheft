chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "report-ai-image",
    title: "Report AI-Generated Image",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "report-ai-image" && info.srcUrl && tab.id) {
    // Send message to content script to open modal
    chrome.tabs.sendMessage(tab.id, {
      action: "showReportModal",
      imageUrl: info.srcUrl
    });
  }
});
