// Service worker for Save to OmniFocus extension

// Default templates
const DEFAULT_TITLE_TEMPLATE = '{title}';
const DEFAULT_NOTE_TEMPLATE = '{url}\n\n{selection}';

// Initialize context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-link-to-omnifocus',
    title: 'Save link to OmniFocus',
    contexts: ['link']
  });
  
  chrome.contextMenus.create({
    id: 'save-page-to-omnifocus',
    title: 'Save page to OmniFocus',
    contexts: ['page']
  });
});

// Handle browser action click
chrome.action.onClicked.addListener((tab) => {
  saveToOmniFocus(tab);
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'save-to-omnifocus') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        saveToOmniFocus(tabs[0]);
      }
    });
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'save-link-to-omnifocus') {
    saveLinkToOmniFocus(info.linkUrl, info.linkText || info.linkUrl, tab);
  } else if (info.menuItemId === 'save-page-to-omnifocus') {
    saveToOmniFocus(tab);
  }
});

// Main function to save to OmniFocus
async function saveToOmniFocus(tab) {
  try {
    // Get selected text from the page
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getPageInfo
    });
    
    const pageInfo = result.result;
    const templates = await getTemplates();
    
    const taskName = formatTemplate(templates.titleTemplate, {
      title: pageInfo.title,
      url: pageInfo.url,
      selection: pageInfo.selection
    });
    
    const taskNote = formatTemplate(templates.noteTemplate, {
      title: pageInfo.title,
      url: pageInfo.url,
      selection: pageInfo.selection
    });
    
    sendToOmniFocus(taskName, taskNote, tab.id);
  } catch (error) {
    console.error('Error saving to OmniFocus:', error);
    showNotification('Error', 'Failed to save to OmniFocus', 'error');
  }
}

// Save a link to OmniFocus
async function saveLinkToOmniFocus(url, text, tab) {
  try {
    const templates = await getTemplates();
    
    const taskName = formatTemplate(templates.titleTemplate, {
      title: text,
      url: url,
      selection: ''
    });
    
    const taskNote = formatTemplate(templates.noteTemplate, {
      title: text,
      url: url,
      selection: ''
    });
    
    sendToOmniFocus(taskName, taskNote, tab.id);
  } catch (error) {
    console.error('Error saving link to OmniFocus:', error);
    showNotification('Error', 'Failed to save link to OmniFocus', 'error');
  }
}

// Get page information from content
function getPageInfo() {
  return {
    title: document.title,
    url: window.location.href,
    selection: window.getSelection().toString().trim()
  };
}

// Send task to OmniFocus using URL scheme
async function sendToOmniFocus(name, note, tabId) {
  const omnifocusUrl = `omnifocus:///add?name=${encodeURIComponent(name)}&note=${encodeURIComponent(note)}`;
  
  try {
    // Inject iframe to trigger URL scheme
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (url) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        
        // Remove iframe after a short delay
        setTimeout(() => {
          iframe.remove();
        }, 1000);
      },
      args: [omnifocusUrl]
    });
    
    await showNotification('Success', 'Task saved to OmniFocus', 'success');
  } catch (error) {
    console.error('Error triggering OmniFocus URL:', error);
    // Try alternative method - open in new tab
    chrome.tabs.create({ url: omnifocusUrl, active: false }, (tab) => {
      setTimeout(() => chrome.tabs.remove(tab.id), 1000);
      showNotification('Success', 'Task saved to OmniFocus', 'success');
    });
  }
}

// Get templates from storage
async function getTemplates() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({
      titleTemplate: DEFAULT_TITLE_TEMPLATE,
      noteTemplate: DEFAULT_NOTE_TEMPLATE
    }, (items) => {
      resolve(items);
    });
  });
}

// Format template with values
function formatTemplate(template, values) {
  return template
    .replace(/{title}/g, values.title || '')
    .replace(/{url}/g, values.url || '')
    .replace(/{selection}/g, values.selection || '');
}

// Show notification
async function showNotification(title, message, type) {
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (t, m, tp) => {
        // Check if notification already exists
        const existingNotification = document.getElementById('omnifocus-notification');
        if (existingNotification) {
          existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.id = 'omnifocus-notification';
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: ${tp === 'success' ? '#4CAF50' : '#f44336'};
          color: white;
          padding: 16px;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          z-index: 10000;
          font-family: system-ui, sans-serif;
          font-size: 14px;
          max-width: 300px;
          animation: slideIn 0.3s ease-out;
        `;
        notification.innerHTML = `<strong>${t}</strong><br>${m}`;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.style.animation = 'slideIn 0.3s ease-out reverse';
          setTimeout(() => {
            notification.remove();
            style.remove();
          }, 300);
        }, 3000);
      },
      args: [title, message, type]
    });
  } catch (error) {
    console.log(`${title}: ${message}`);
  }
}