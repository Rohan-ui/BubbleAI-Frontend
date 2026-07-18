import { Router, Request, Response } from 'express';
import { optionalAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * POST /api/generate
 * AI text generation endpoint.
 * The frontend sends a prompt and expects { data: { generatedText: string } }
 * Currently a stub — replace with Gemini API integration when API key is available.
 */
router.post('/generate', optionalAuthMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({
        success: false,
        error: 'Prompt is required.',
      });
      return;
    }

    // TODO: Integrate with Google Gemini API when GEMINI_API_KEY is set
    // const apiKey = process.env.GEMINI_API_KEY;
    // if (apiKey) {
    //   // Call Gemini API here
    // }

    // Stub response — returns a realistic-looking screenplay continuation
    const stubResponses: Record<string, string> = {
      default: `ARJUN
(with quiet determination)
Every great story begins with a single line of dialogue. The question isn't whether we can tell it — it's whether we have the courage to start.

NARRATOR (V.O.)
And so the creative journey continued, each scene building upon the last, weaving together threads of ambition, artistry, and the relentless pursuit of storytelling excellence.

INT. EDITING SUITE - NIGHT

The monitors glow with the blue light of possibility. ARJUN reviews his latest draft, a faint smile crossing his face as the narrative finally clicks into place.`,
    };

    // Simulate a slight delay for realism
    await new Promise((resolve) => setTimeout(resolve, 500));

    res.json({
      success: true,
      data: {
        generatedText: stubResponses.default,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'AI generation failed.',
    });
  }
});

/**
 * POST /api/format
 * Script formatting endpoint.
 * Frontend sends { draftText, formatType } and expects { data: formattedText }
 */
router.post('/format', optionalAuthMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { draftText, formatType } = req.body;

    if (!draftText) {
      res.status(400).json({
        success: false,
        error: 'Draft text is required.',
      });
      return;
    }

    // Basic local formatting rules as a stub
    let formatted = draftText;

    // Ensure scene headings are uppercase
    formatted = formatted.replace(
      /^(INT\.|EXT\.|INT\/EXT\.)\s*(.+)/gim,
      (_match: string, prefix: string, rest: string) => `${prefix.toUpperCase()} ${rest.toUpperCase()}`
    );

    // Normalize tab indentation for dialogue blocks
    formatted = formatted.replace(/\t+/g, '\t\t\t');

    await new Promise((resolve) => setTimeout(resolve, 300));

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Formatting failed.',
    });
  }
});

/**
 * POST /api/director-strategy
 * Director strategy analysis endpoint.
 * Frontend sends { script, mode } and expects { data: DirectorStrategy }
 */
router.post('/director-strategy', optionalAuthMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { script, mode } = req.body;

    // Stub: Generate strategy metrics based on script length/complexity
    const scriptLength = (script || '').length;
    const sceneCount = ((script || '').match(/^(INT\.|EXT\.)/gm) || []).length;

    // Simulate analysis
    await new Promise((resolve) => setTimeout(resolve, 800));

    const audienceImpact = Math.min(98, 70 + Math.floor(scriptLength / 500));
    const commercialViability = Math.min(95, 60 + Math.floor(sceneCount * 5));
    const festivalPotential = Math.min(92, 55 + Math.floor(Math.random() * 30));
    const culturalDepth = Math.min(90, 50 + Math.floor(Math.random() * 35));

    res.json({
      success: true,
      data: {
        audienceImpact,
        commercialViability,
        festivalPotential,
        culturalDepth,
        viralMoment: `The emotional sequence in scene ${Math.max(1, Math.floor(sceneCount / 2))} presents excellent potential for audience engagement — the character dynamics combined with the ${mode || 'cinematic'} visual style create a powerful moment that could resonate across social platforms and film community discussions.`,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Strategy analysis failed.',
    });
  }
});

export default router;
