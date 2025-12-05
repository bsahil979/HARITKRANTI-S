import express from 'express';
import { translateText, translateBatch, translateObject } from '../controllers/translation.controller.js';

const router = express.Router();

// Translate single text
router.post('/text', translateText);

// Translate multiple texts (batch)
router.post('/batch', translateBatch);

// Translate object of key-value pairs
router.post('/object', translateObject);

export default router;

