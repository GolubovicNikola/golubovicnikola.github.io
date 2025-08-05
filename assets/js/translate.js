let translateInitialized = false;

function initTranslate() {
  const btn = document.getElementById('translate-btn');
  const container = document.getElementById('google_translate_element');
  
  if (!translateInitialized) {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span class="translate-text">Loading...</span>';
    

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.onerror = function() {
      btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span class="translate-text">Error</span>';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-language"></i> <span class="translate-text">Translate</span>';
      }, 2000);
    };
    document.head.appendChild(script);
    
    window.googleTranslateElementInit = function() {
      new google.translate.TranslateElement({
        pageLanguage: 'sr', 
        includedLanguages: 'en,de,fr,es,it,ru,zh,ja,ko,ar,bg,ro,hu,pl,cs,sk',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
      
      translateInitialized = true;
      btn.style.display = 'none';
      container.style.display = 'inline-block';
      
      setTimeout(() => {
        const selectElement = container.querySelector('select');
        if (selectElement) {
          selectElement.style.fontFamily = 'inherit';
          selectElement.style.fontSize = '0.875rem';
        }
      }, 500);
    };
  } else {
    if (container.style.display === 'none') {
      container.style.display = 'inline-block';
      btn.style.display = 'none';
    }
  }
}

// Reset on page navigation (for SPA-like behavior)
document.addEventListener('DOMContentLoaded', function() {
  translateInitialized = false;
});