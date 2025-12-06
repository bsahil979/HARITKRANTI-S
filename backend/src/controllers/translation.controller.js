// Google Translate API configuration
const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

// Get API key dynamically (in case .env loads after module import)
function getApiKey() {
  return process.env.GOOGLE_TRANSLATE_API_KEY;
}

// Check API key on first use
let apiKeyWarningShown = false;
function checkApiKey() {
  const apiKey = getApiKey();
  if (!apiKey && !apiKeyWarningShown) {
    console.warn('⚠️  GOOGLE_TRANSLATE_API_KEY not set. Translation API will not work.');
    apiKeyWarningShown = true;
  }
  return apiKey;
}

/**
 * Translate text using Google Translate REST API with timeout and error handling
 */
async function translateTextHelper(text, targetLang, retries = 2) {
  const API_KEY = checkApiKey();
  if (!API_KEY) {
    throw new Error('Google Translate API key not configured');
  }

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(`${TRANSLATE_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        format: 'text'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Translation failed');
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // If it's a timeout or network error and we have retries left, try again
    if ((error.name === 'AbortError' || error.code === 'ETIMEDOUT') && retries > 0) {
      console.warn(`Translation timeout, retrying... (${retries} retries left)`);
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return translateTextHelper(text, targetLang, retries - 1);
    }
    
    // Re-throw the error if no retries left or it's a different error
    throw error;
  }
}

// Language code mapping
const languageMap = {
  en: 'en',
  hi: 'hi',
  mr: 'mr',
  te: 'te',
  ta: 'ta',
  kn: 'kn',
  gu: 'gu',
  bn: 'bn',
  pa: 'pa',
  or: 'or'
};

/**
 * Translate a single text
 */
export const translateText = async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!targetLang) {
      return res.status(400).json({ error: 'Target language is required' });
    }

    // If target language is English or same as source, return original
    if (targetLang === 'en') {
      return res.json({ translatedText: text });
    }

    // Check if API key is configured
    const API_KEY = checkApiKey();
    if (!API_KEY) {
      return res.status(503).json({ 
        error: 'Translation service not available. Please set GOOGLE_TRANSLATE_API_KEY in environment variables.' 
      });
    }

    const targetLanguageCode = languageMap[targetLang] || targetLang;

    // Translate the text
    const translation = await translateTextHelper(text, targetLanguageCode);

    res.json({ translatedText: translation });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: 'Translation failed', 
      message: error.message 
    });
  }
};

/**
 * Translate multiple texts at once (batch translation)
 */
export const translateBatch = async (req, res) => {
  try {
    const { texts, targetLang } = req.body;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ error: 'Texts array is required' });
    }

    if (!targetLang) {
      return res.status(400).json({ error: 'Target language is required' });
    }

    // If target language is English, return original texts
    if (targetLang === 'en') {
      const result = {};
      texts.forEach((text, index) => {
        result[index] = text;
      });
      return res.json({ translations: result });
    }

    // Check if API key is configured
    const API_KEY = checkApiKey();
    if (!API_KEY) {
      return res.status(503).json({ 
        error: 'Translation service not available. Please set GOOGLE_TRANSLATE_API_KEY in environment variables.' 
      });
    }

    const targetLanguageCode = languageMap[targetLang] || targetLang;

    // Translate all texts in parallel with error handling
    const translationPromises = texts.map(text => 
      translateTextHelper(text, targetLanguageCode).catch(error => {
        console.warn(`Translation failed for text: ${text}`, error.message);
        // Return original text if translation fails
        return text;
      })
    );
    const translations = await Promise.all(translationPromises);

    // Return as object with same keys
    const result = {};
    texts.forEach((text, index) => {
      result[index] = translations[index];
    });

    res.json({ translations: result });
  } catch (error) {
    console.error('Batch translation error:', error);
    // Return original texts if translation completely fails (graceful degradation)
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT') || error.code === 'ETIMEDOUT') {
      console.warn('Translation timed out, returning original texts');
      const result = {};
      texts.forEach((text, index) => {
        result[index] = text;
      });
      return res.json({ translations: result });
    }
    res.status(500).json({ 
      error: 'Translation failed', 
      message: error.message 
    });
  }
};

/**
 * Translate an object of key-value pairs
 */
export const translateObject = async (req, res) => {
  try {
    const { translations: translationObject, targetLang } = req.body;

    if (!translationObject || typeof translationObject !== 'object') {
      return res.status(400).json({ error: 'Translations object is required' });
    }

    if (!targetLang) {
      return res.status(400).json({ error: 'Target language is required' });
    }

    // If target language is English, return original
    if (targetLang === 'en') {
      return res.json({ translations: translationObject });
    }

    // Check if API key is configured
    const API_KEY = checkApiKey();
    if (!API_KEY) {
      return res.status(503).json({ 
        error: 'Translation service not available. Please set GOOGLE_TRANSLATE_API_KEY in environment variables.' 
      });
    }

    const targetLanguageCode = languageMap[targetLang] || targetLang;

    // Extract all values to translate
    const keys = Object.keys(translationObject);
    const values = keys.map(key => translationObject[key]);

    // Translate all values in parallel with error handling
    // Use Promise.allSettled to handle individual failures gracefully
    const translationPromises = values.map(value => 
      translateTextHelper(value, targetLanguageCode).catch(error => {
        console.warn(`Translation failed for value: ${value}`, error.message);
        // Return original value if translation fails
        return value;
      })
    );
    const translatedValues = await Promise.all(translationPromises);

    // Reconstruct object with translated values
    const result = {};
    keys.forEach((key, index) => {
      result[key] = translatedValues[index];
    });

    res.json({ translations: result });
  } catch (error) {
    console.error('Object translation error:', error);
    // Return original object if translation completely fails (graceful degradation)
    // This prevents the entire request from failing
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT') || error.code === 'ETIMEDOUT') {
      console.warn('Translation timed out, returning original text');
      return res.json({ translations: translationObject });
    }
    res.status(500).json({ 
      error: 'Translation failed', 
      message: error.message 
    });
  }
};

