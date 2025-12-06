// Translation service using Google Translate API via backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Cache for translations (stored in localStorage)
const CACHE_KEY_PREFIX = 'hk_translation_cache_';
const CACHE_EXPIRY_DAYS = 7; // Cache expires after 7 days

/**
 * Get cache key for a language
 */
function getCacheKey(lang) {
  return `${CACHE_KEY_PREFIX}${lang}`;
}

/**
 * Get cached translations
 */
function getCachedTranslations(lang) {
  try {
    const cacheKey = getCacheKey(lang);
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const { translations, timestamp } = JSON.parse(cached);
    const now = Date.now();
    const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    // Check if cache is expired
    if (now - timestamp > expiryTime) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return translations;
  } catch (error) {
    console.error('Error reading translation cache:', error);
    return null;
  }
}

/**
 * Cache translations
 */
function cacheTranslations(lang, translations) {
  try {
    const cacheKey = getCacheKey(lang);
    const cacheData = {
      translations,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error caching translations:', error);
  }
}

/**
 * Translate an object of key-value pairs using the backend API
 */
export async function translateObject(translations, targetLang) {
  // If target language is English, return original
  if (targetLang === 'en') {
    return translations;
  }

  // Check cache first
  const cached = getCachedTranslations(targetLang);
  if (cached) {
    // Merge cached translations with any new keys
    return { ...cached, ...translations };
  }

  try {
    console.log(`🌐 Requesting translation for language: ${targetLang}`);
    console.log(`📡 API URL: ${API_BASE_URL}/translation/object`);
    console.log(`📦 Translation keys count: ${Object.keys(translations).length}`);
    
    const response = await fetch(`${API_BASE_URL}/translation/object`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        translations,
        targetLang
      })
    });

    console.log(`📊 Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('❌ Translation API error:', error);
      console.error(`❌ Status: ${response.status}, StatusText: ${response.statusText}`);
      // Fallback to English if translation fails
      return translations;
    }

    const data = await response.json();
    const translated = data.translations;
    
    if (!translated) {
      console.error('❌ Translation response missing translations object:', data);
      return translations;
    }
    
    console.log(`✅ Translation successful! Received ${Object.keys(translated).length} translated keys`);
    
    // Cache the translations
    cacheTranslations(targetLang, translated);

    return translated;
  } catch (error) {
    console.error('❌ Translation service error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    // Fallback to English if API call fails
    return translations;
  }
}

/**
 * Translate a single text
 */
export async function translateText(text, targetLang) {
  // If target language is English, return original
  if (targetLang === 'en') {
    return text;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/translation/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLang
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Translation API error:', error);
      // Fallback to English if translation fails
      return text;
    }

    const { translatedText } = await response.json();
    return translatedText;
  } catch (error) {
    console.error('Translation service error:', error);
    // Fallback to English if API call fails
    return text;
  }
}

/**
 * Clear translation cache for a specific language or all languages
 */
export function clearTranslationCache(lang = null) {
  if (lang) {
    localStorage.removeItem(getCacheKey(lang));
  } else {
    // Clear all translation caches
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

