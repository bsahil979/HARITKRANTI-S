# Background Video Setup Guide

This directory should contain three distinct background videos for the authentication pages.

## Required Video Files

### 1. Login Page - `farm-sunlight.mp4`
- **Theme:** Sunlight through leaves or farm field at sunrise
- **Purpose:** Soft, warm morning light effect
- **Recommended:** Calm sunrise over agricultural fields, sunlight filtering through green leaves
- **Size:** < 5 MB recommended
- **Duration:** 10-30 seconds (will loop)
- **Poster Image:** `farm-sunlight.jpg` (static fallback image)

### 2. Register Page - `farm-fields.mp4`
- **Theme:** Top view of green fields or paddy farms
- **Purpose:** Aerial view of agricultural landscapes
- **Recommended:** Drone footage of green paddy fields, top-down view of crop fields
- **Size:** < 5 MB recommended
- **Duration:** 10-30 seconds (will loop)
- **Poster Image:** `farm-fields.jpg` (static fallback image)

### 3. Select Your Role Page - `farm-meadow.mp4`
- **Theme:** Close-up of crops swaying in the wind or green meadow with gentle breeze
- **Purpose:** Gentle movement, peaceful nature scene
- **Recommended:** Close-up of wheat/rice swaying, green meadow with grass moving
- **Size:** < 5 MB recommended
- **Duration:** 10-30 seconds (will loop)
- **Poster Image:** `farm-meadow.jpg` (static fallback image)

## Where to Get Videos

### Free Video Sources:
1. **Pexels** (https://www.pexels.com/videos/)
   - Search: "farm sunrise", "paddy field", "crops swaying"
   - Free to use, no attribution required

2. **Pixabay** (https://pixabay.com/videos/)
   - Search: "agriculture", "green fields", "farm"
   - Free to use

3. **Coverr** (https://coverr.co/)
   - Search: "nature", "farm", "agriculture"
   - Free stock videos

## File Structure

```
public/
  assets/
    farm-sunlight.mp4    (Login page video)
    farm-sunlight.jpg    (Login page poster/fallback)
    farm-fields.mp4      (Register page video)
    farm-fields.jpg      (Register page poster/fallback)
    farm-meadow.mp4      (Select Role page video)
    farm-meadow.jpg      (Select Role page poster/fallback)
```

## Fallback Behavior

If the new video files are not found, the pages will automatically fall back to using `/haritvideo.mp4` (the existing video from the home page).

## Video Optimization Tips

1. **Compress videos** to keep file sizes small (< 5 MB)
2. **Use H.264 codec** for maximum browser compatibility
3. **Keep duration short** (10-30 seconds) since videos loop
4. **Ensure smooth looping** - the end should seamlessly connect to the beginning
5. **Use appropriate resolution** - 1920x1080 or 1280x720 is sufficient

## Testing

After adding the videos:
1. Clear browser cache
2. Test each page to ensure videos load and loop properly
3. Verify the poster images display if videos fail to load
4. Check on different devices and browsers

