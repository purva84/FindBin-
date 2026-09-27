import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper for rule-based category fallback
function getRuleBasedSuggestion(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes('battery') || lower.includes('cell') || lower.includes('chemical') || lower.includes('acid') || lower.includes('paint') || lower.includes('toxic')) {
    return {
      suggestedCategory: 'Battery / Hazardous',
      detectedItem: text.slice(0, 50),
      specialHandlingWarning: 'Contains toxic or combustible chemicals. Do not crush, puncture, or expose to water.',
      suggestedHandling: 'Store separately in an insulated, dry container and give strictly to certified hazardous waste handlers.',
      confidence: 0.92,
    };
  }
  if (lower.includes('laptop') || lower.includes('phone') || lower.includes('computer') || lower.includes('charger') || lower.includes('cable') || lower.includes('monitor') || lower.includes('tv') || lower.includes('electronic') || lower.includes('printer') || lower.includes('pcb') || lower.includes('circuit')) {
    const hasBattery = lower.includes('battery') || lower.includes('swollen');
    return {
      suggestedCategory: 'E-Waste',
      detectedItem: text.slice(0, 50),
      specialHandlingWarning: hasBattery ? 'Potentially hazardous swollen or aging battery.' : 'Fragile electronic components and circuit boards.',
      suggestedHandling: hasBattery ? 'Specialized e-waste and battery recovery. Handle gently without pressure.' : 'Send to authorized e-waste recycler for component extraction and precious metal recovery.',
      confidence: 0.95,
    };
  }
  if (lower.includes('clothes') || lower.includes('shirt') || lower.includes('pant') || lower.includes('fabric') || lower.includes('garment') || lower.includes('dress') || lower.includes('cotton') || lower.includes('textile') || lower.includes('jeans')) {
    return {
      suggestedCategory: 'Textile',
      detectedItem: text.slice(0, 50),
      specialHandlingWarning: 'Keep dry to prevent mildew before collection.',
      suggestedHandling: 'If in good wearable condition, prioritize donation or reuse. Otherwise suitable for shredding into acoustic insulation or industrial wiping rags.',
      confidence: 0.9,
    };
  }
  if (lower.includes('box') || lower.includes('cardboard') || lower.includes('paper') || lower.includes('book') || lower.includes('newspaper') || lower.includes('carton') || lower.includes('magazine')) {
    return {
      suggestedCategory: 'Paper & Cardboard',
      detectedItem: text.slice(0, 50),
      specialHandlingWarning: 'Keep away from moisture and food contamination.',
      suggestedHandling: 'Flatten boxes to save volume; tie newspapers in bundles for easy baling.',
      confidence: 0.94,
    };
  }
  if (lower.includes('bottle') || lower.includes('plastic') || lower.includes('container') || lower.includes('polythene') || lower.includes('pet') || lower.includes('hdpe') || lower.includes('canister')) {
    return {
      suggestedCategory: 'Plastic',
      detectedItem: text.slice(0, 50),
      specialHandlingWarning: 'Rinse thoroughly if it previously contained oils or dairy.',
      suggestedHandling: 'Sort by resin code if possible; compress bottles to optimize transport space.',
      confidence: 0.91,
    };
  }
  if (lower.includes('glass') || lower.includes('jar') || lower.includes('mirror') || lower.includes('pane')) {
    return {
      suggestedCategory: 'Glass',
      detectedItem: text.slice(0, 50),
      specialHandlingWarning: 'Sharp hazard if broken. Wrap edges carefully.',
      suggestedHandling: 'Sort clear glass from colored cullet; ensure no ceramics or porcelain are mixed.',
      confidence: 0.93,
    };
  }
  if (lower.includes('metal') || lower.includes('iron') || lower.includes('steel') || lower.includes('aluminum') || lower.includes('copper') || lower.includes('wire') || lower.includes('pipe') || lower.includes('can')) {
    return {
      suggestedCategory: 'Metal',
      detectedItem: text.slice(0, 50),
      specialHandlingWarning: 'Sharp edges or rust hazard. Use gloves while handling.',
      suggestedHandling: 'Separate non-ferrous metals (copper, brass, aluminum) for significantly higher scrap value.',
      confidence: 0.94,
    };
  }
  if (lower.includes('food') || lower.includes('peel') || lower.includes('vegetable') || lower.includes('organic') || lower.includes('leaf') || lower.includes('compost') || lower.includes('kitchen')) {
    return {
      suggestedCategory: 'Wet / Organic Waste',
      detectedItem: text.slice(0, 50),
      specialHandlingWarning: 'High moisture and odor potential. Needs collection within 24-48 hours.',
      suggestedHandling: 'Store in ventilated compost bin or sealed pail; avoid mixing with plastic wrap or toothpicks.',
      confidence: 0.92,
    };
  }

  return {
    suggestedCategory: 'Mixed Waste',
    detectedItem: text.slice(0, 50) || 'Miscellaneous item',
    specialHandlingWarning: 'Mixed materials may require manual segregation prior to recycling.',
    suggestedHandling: 'Inspect item to check if components can be disassembled into separate recyclables.',
    confidence: 0.8,
  };
}

// GET endpoint for simple health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST endpoint for optional Gemini Category Suggestion
app.post('/api/gemini/suggest-category', async (req, res) => {
  const { description = '', imageBase64 = '', mimeType = 'image/jpeg' } = req.body;

  if (!description && !imageBase64) {
    return res.status(400).json({ error: 'Please provide either a description or an image.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Graceful rule-based fallback when API key is not configured
    const fallback = getRuleBasedSuggestion(description || 'General household unwanted item');
    return res.json({
      ...fallback,
      source: 'rule-based',
      note: 'Analyzed via FindBin catalog (AI offline)'
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'findbin-app/1.0',
        },
      },
    });

    const allowedCategories = [
      'Wet / Organic Waste',
      'Plastic',
      'Paper & Cardboard',
      'Glass',
      'Metal',
      'Textile',
      'E-Waste',
      'Battery / Hazardous',
      'Mixed Waste',
      'Other'
    ];

    const promptText = `
You are the category classification assistant for FindBin, a recycling and material recovery platform.
Analyze the user's item (via text description and/or image) and classify it into EXACTLY ONE of these categories:
${allowedCategories.join(', ')}.

User description: "${description}"

Provide:
1. suggestedCategory: Must match one of the allowed categories.
2. detectedItem: Concise title of the item (e.g., "Old phone with swollen battery").
3. specialHandlingWarning: Short cautionary note if it is hazardous, fragile, leaking, or toxic. If benign, provide a brief note (e.g. "Safe to handle normally").
4. suggestedHandling: Practical advice for storing or preparing the item before pickup.
5. confidence: A number between 0.1 and 1.0.
`;

    const contents: any[] = [];
    if (imageBase64) {
      contents.push({
        inlineData: {
          data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
          mimeType: mimeType || 'image/jpeg',
        },
      });
    }
    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents.length === 1 ? contents[0].text : { parts: contents },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedCategory: {
              type: Type.STRING,
              description: 'One of the allowed categories',
            },
            detectedItem: {
              type: Type.STRING,
              description: 'Short identified name of the item',
            },
            specialHandlingWarning: {
              type: Type.STRING,
              description: 'Warning or safety note',
            },
            suggestedHandling: {
              type: Type.STRING,
              description: 'Best preparation advice for pickup',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence score between 0 and 1',
            },
          },
          required: ['suggestedCategory', 'detectedItem', 'specialHandlingWarning', 'suggestedHandling'],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error('Empty response from model');
    }

    const parsed = JSON.parse(text);
    return res.json({
      ...parsed,
      source: 'gemini-2.5-flash',
    });
  } catch (err) {
    console.warn('Gemini categorization failed, falling back to rule-based analysis:', err);
    const fallback = getRuleBasedSuggestion(description || 'General unwanted item');
    return res.json({
      ...fallback,
      source: 'rule-based-fallback',
      note: 'Rule-based categorization applied.'
    });
  }
});

async function main() {
  const isDev = process.env.NODE_ENV === 'development' || process.argv.some(arg => arg.includes('tsx'));
  if (!isDev) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FindBin full-stack server listening on http://0.0.0.0:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  main().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
