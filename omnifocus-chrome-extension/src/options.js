// Default templates
const DEFAULT_TITLE_TEMPLATE = '{title}';
const DEFAULT_NOTE_TEMPLATE = '{url}\n\n{selection}';

// DOM elements
const titleTemplateInput = document.getElementById('titleTemplate');
const noteTemplateInput = document.getElementById('noteTemplate');
const saveButton = document.getElementById('save');
const resetButton = document.getElementById('reset');
const statusDiv = document.getElementById('status');
const shortcutsLink = document.getElementById('shortcutsLink');

// Load saved options on page load
document.addEventListener('DOMContentLoaded', loadOptions);

// Save options when save button is clicked
saveButton.addEventListener('click', saveOptions);

// Reset to defaults when reset button is clicked
resetButton.addEventListener('click', resetOptions);

// Handle shortcuts link click
shortcutsLink.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
});

// Load options from Chrome storage
function loadOptions() {
  chrome.storage.sync.get({
    titleTemplate: DEFAULT_TITLE_TEMPLATE,
    noteTemplate: DEFAULT_NOTE_TEMPLATE
  }, (items) => {
    titleTemplateInput.value = items.titleTemplate;
    noteTemplateInput.value = items.noteTemplate;
  });
}

// Save options to Chrome storage
function saveOptions() {
  const titleTemplate = titleTemplateInput.value.trim() || DEFAULT_TITLE_TEMPLATE;
  const noteTemplate = noteTemplateInput.value.trim() || DEFAULT_NOTE_TEMPLATE;
  
  chrome.storage.sync.set({
    titleTemplate: titleTemplate,
    noteTemplate: noteTemplate
  }, () => {
    // Update inputs with saved values
    titleTemplateInput.value = titleTemplate;
    noteTemplateInput.value = noteTemplate;
    
    // Show success message
    showStatus('Options saved successfully!', 'success');
  });
}

// Reset options to defaults
function resetOptions() {
  chrome.storage.sync.set({
    titleTemplate: DEFAULT_TITLE_TEMPLATE,
    noteTemplate: DEFAULT_NOTE_TEMPLATE
  }, () => {
    // Update inputs with default values
    titleTemplateInput.value = DEFAULT_TITLE_TEMPLATE;
    noteTemplateInput.value = DEFAULT_NOTE_TEMPLATE;
    
    // Show success message
    showStatus('Options reset to defaults!', 'success');
  });
}

// Show status message
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type} show`;
  
  // Hide status after 3 seconds
  setTimeout(() => {
    statusDiv.classList.remove('show');
  }, 3000);
}

// Auto-save when user types (with debounce)
let saveTimeout;
[titleTemplateInput, noteTemplateInput].forEach(input => {
  input.addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      saveOptions();
    }, 1000);
  });
});