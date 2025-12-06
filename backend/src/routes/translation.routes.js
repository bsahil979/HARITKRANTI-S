import express from 'express';
import { translateText, translateBatch, translateObject } from '../controllers/translation.controller.js';

const router = express.Router();

// Health check endpoint for translation service
router.get('/status', (req, res) => {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  res.json({
    available: !!apiKey,
    apiKeyConfigured: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    message: apiKey 
      ? 'Translation service is configured and ready' 
      : 'Translation service not available - GOOGLE_TRANSLATE_API_KEY not set'
  });
});

// Translate single text
router.post('/text', translateText);

// Translate multiple texts (batch)
router.post('/batch', translateBatch);

// Translate object of key-value pairs
router.post('/object', translateObject);

export default router;

