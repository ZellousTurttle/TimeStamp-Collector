console.log("Backgrounded");

// loads once the chromepluing is active, then sets all the pages to active. 
chrome.tabs.query({ url: '*://*.youtube.com/*' }, tabs => {
  tabs.forEach(tab => {
    console.log("Tabs "+JSON.stringify(tab))
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        console.log(tab.url+ " Updated" );

        chrome.tabs.update(tab.id, { active: true});
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  });
});



function getDataFromStorage(keys, sendResponse) {
  chrome.storage.local.get(keys, result => {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving data from storage:', chrome.runtime.lastError);
      sendResponse({ success: false, data: null });
    } else {
      console.log('Data retrieved from storage:', result);
      sendResponse({ success: true, data: result });
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getData') {
    const keysToRetrieve = message.keys;
    getDataFromStorage(keysToRetrieve, sendResponse);
    return true; // Indicates that the response will be sent asynchronously
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.data) {
    const receivedArray = message.data;
    console.log("receivedArray Background " + receivedArray);
    // Process the received array as needed
    const promises = receivedArray.map(element => {
      return new Promise((resolve, reject) => {
        chrome.tabs.remove(element, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    });

    Promise.all(promises)
      .then(() => {
        console.log("Tabs removed successfully");
        // Optionally, send a response back to the sending script
        const response = 'Tabs removed!';
        sendResponse(response);
      })
      .catch(error => {
        console.error("Error removing tabs:", error);
        // Optionally, send an error response back to the sending script
        const response = 'Error removing tabs!';
        sendResponse(response);
      });
  }
  // Return true to indicate that the response will be sent asynchronously
  return true;
});



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  
  if (message.links) {
    console.log("Hello world:= "+ JSON.stringify(message.links));
    message.links.forEach(link => {
      console.log("link==> " + link);
      chrome.tabs.create({ url: link }, tab => {
        chrome.tabs.executeScript(tab.id, { file: 'Pause_Script.js' });
      });
    });
  
  }

});

