# Translation Setup Guide

This project now uses Google Translate API for dynamic translations instead of hardcoded translations.

## Backend Setup

### 1. Get Google Translate API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Cloud Translation API**
4. Go to **Credentials** and create an API key
5. Copy the API key

### 2. Set Environment Variable

Add the following to your `backend/.env` file:

```env
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

### 3. Start the Backend Server

```bash
cd backend
npm start
```

## Frontend Setup

The frontend automatically uses the translation API. Make sure your `VITE_API_URL` in `.env` points to your backend:

```env
VITE_API_URL=http://localhost:5000/api
```

## How It Works

1. **English as Source**: Only English translations are stored in the codebase
2. **Dynamic Translation**: When a user selects a different language, the frontend requests translations from the backend
3. **Caching**: Translations are cached in localStorage for 7 days to reduce API calls
4. **Fallback**: If translation fails, the app falls back to English

## Supported Languages

- English (en) - Source language
- Hindi (hi)
- Marathi (mr)
- Telugu (te)
- Tamil (ta)
- Kannada (kn)
- Gujarati (gu)
- Bengali (bn)
- Punjabi (pa)
- Odia (or)

## API Endpoints

### Translate Object
```
POST /api/translation/object
Body: {
  "translations": { "key1": "value1", "key2": "value2" },
  "targetLang": "hi"
}
```

### Translate Single Text
```
POST /api/translation/text
Body: {
  "text": "Hello",
  "targetLang": "hi"
}
```

### Translate Batch
```
POST /api/translation/batch
Body: {
  "texts": ["text1", "text2"],
  "targetLang": "hi"
}
```

## Cost Considerations

Google Translate API has a free tier:
- **Free tier**: 500,000 characters per month
- **Paid tier**: $20 per 1 million characters

The app uses caching to minimize API calls and reduce costs.

## Troubleshooting

### Translation not working?

1. Check that `GOOGLE_TRANSLATE_API_KEY` is set in `backend/.env`
2. Verify the API key is valid and has Translation API enabled
3. Check backend logs for errors
4. Ensure the frontend can reach the backend API

### Translations are slow?

- Translations are cached after the first load
- Subsequent language switches should be instant if cached
- First-time translation may take a few seconds

