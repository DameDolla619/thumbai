const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate', async (req, res) => {
  const { title, niche, style, mood } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });

  const styleMap = {
    bold:    'bold dramatic composition, high contrast colors, explosive energy, bright saturated tones',
    dark:    'dark cinematic mood, deep shadows, moody atmospheric lighting, mysterious vibe',
    clean:   'clean minimal design, bright white background, sharp focus, professional look',
    viral:   'viral shocking composition, exaggerated expressions, eye-catching colors, maximum impact',
  };

  const nicheMap = {
    gaming:    'gaming setup, controller, neon lights, action scene',
    tech:      'futuristic technology, holographic displays, sleek devices',
    lifestyle: 'luxury lifestyle, aspirational setting, premium aesthetic',
    business:  'professional business setting, success symbols, modern office',
    fitness:   'athletic performance, gym environment, powerful physique',
    finance:   'money, wealth symbols, charts going up, financial success',
    food:      'delicious food close-up, vibrant colors, appetizing presentation',
    travel:    'exotic destination, stunning landscape, adventure vibes',
    general:   'cinematic scene, compelling visual story',
  };

  const moodText = mood || 'high energy';
  const styleText = styleMap[style] || styleMap.bold;
  const nicheText = nicheMap[niche] || nicheMap.general;

  const prompt = `YouTube thumbnail, ${title}, ${nicheText}, ${styleText}, ${moodText}, large bold text overlay space, ultra HD 4K, professional photography, rule of thirds composition, thumbnail optimized 16:9, no watermarks, photorealistic`;

  const encoded = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&model=flux&nologo=true&enhance=true&seed=${Date.now()}`;

  try {
    const check = await fetch(imageUrl, { method: 'HEAD' });
    if (!check.ok) throw new Error('Generation failed');
    res.json({ url: imageUrl, prompt });
  } catch (err) {
    res.status(500).json({ error: 'Image generation failed. Try again.' });
  }
});

app.listen(PORT, () => console.log(`ThumbAI running on port ${PORT}`));
