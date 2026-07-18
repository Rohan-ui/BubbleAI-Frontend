import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as scriptService from '../services/script.service';

const router = Router();

// All script routes require authentication
router.use(authMiddleware);

// ============================================================
// SCRIPTS CRUD
// ============================================================

/**
 * GET /api/scripts
 * List all scripts for the current user (owned + collaborated)
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const includeDeleted = req.query.deleted === 'true';
    const scripts = includeDeleted
      ? await scriptService.getDeletedScripts(req.user!.userId)
      : await scriptService.getUserScripts(req.user!.userId);

    res.json({ success: true, data: scripts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scripts
 * Create a new script
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, writerName, draftType, language, initialContent } = req.body;

    const script = await scriptService.createScript(req.user!.userId, {
      title,
      writerName,
      draftType,
      language,
      initialContent,
    });

    res.status(201).json({
      success: true,
      data: script,
      message: 'Script created successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/scripts/:id
 * Get a script with full details (pages, characters, collaborators)
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const script = await scriptService.getScriptById(req.params.id, req.user!.userId);
    res.json({ success: true, data: script });
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/scripts/:id
 * Update script metadata (title, writerName, draftType, language)
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, writerName, draftType, language } = req.body;

    const script = await scriptService.updateScript(req.params.id, req.user!.userId, {
      title,
      writerName,
      draftType,
      language,
    });

    res.json({
      success: true,
      data: script,
      message: 'Script updated successfully.',
    });
  } catch (error: any) {
    const status = error.message.includes('not found') || error.message.includes('permissions') ? 403 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/scripts/:id
 * Soft-delete a script (move to bin)
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await scriptService.deleteScript(req.params.id, req.user!.userId);
    res.json({ success: true, message: 'Script moved to bin.' });
  } catch (error: any) {
    res.status(403).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scripts/:id/restore
 * Restore a script from the bin
 */
router.post('/:id/restore', async (req: Request, res: Response): Promise<void> => {
  try {
    await scriptService.restoreScript(req.params.id, req.user!.userId);
    res.json({ success: true, message: 'Script restored from bin.' });
  } catch (error: any) {
    res.status(403).json({ success: false, error: error.message });
  }
});

// ============================================================
// PAGES
// ============================================================

/**
 * PUT /api/scripts/:id/pages
 * Bulk update pages (auto-save from frontend)
 */
router.put('/:id/pages', async (req: Request, res: Response): Promise<void> => {
  try {
    const { pages } = req.body;

    if (!Array.isArray(pages)) {
      res.status(400).json({ success: false, error: 'Pages must be an array.' });
      return;
    }

    const updatedPages = await scriptService.updateScriptPages(
      req.params.id,
      req.user!.userId,
      pages
    );

    res.json({ success: true, data: updatedPages });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scripts/:id/pages
 * Add a new page
 */
router.post('/:id/pages', async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const page = await scriptService.addScriptPage(req.params.id, req.user!.userId, content);
    res.status(201).json({ success: true, data: page });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/scripts/:id/pages/:pageId
 * Remove a page
 */
router.delete('/:id/pages/:pageId', async (req: Request, res: Response): Promise<void> => {
  try {
    await scriptService.deleteScriptPage(req.params.id, req.user!.userId, req.params.pageId);
    res.json({ success: true, message: 'Page deleted.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ============================================================
// VERSIONS / SNAPSHOTS
// ============================================================

/**
 * GET /api/scripts/:id/versions
 * Get all version snapshots
 */
router.get('/:id/versions', async (req: Request, res: Response): Promise<void> => {
  try {
    const versions = await scriptService.getScriptVersions(req.params.id, req.user!.userId);
    res.json({ success: true, data: versions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scripts/:id/versions
 * Create a manual version snapshot
 */
router.post('/:id/versions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { label } = req.body;
    const version = await scriptService.createScriptVersion(req.params.id, req.user!.userId, label);
    res.status(201).json({
      success: true,
      data: version,
      message: 'Version snapshot created.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scripts/:id/versions/:versionId/restore
 * Restore a script from a version snapshot
 */
router.post('/:id/versions/:versionId/restore', async (req: Request, res: Response): Promise<void> => {
  try {
    const pages = await scriptService.restoreScriptVersion(
      req.params.id,
      req.user!.userId,
      req.params.versionId
    );
    res.json({ success: true, data: pages, message: 'Version restored.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// COLLABORATORS
// ============================================================

/**
 * GET /api/scripts/:id/collaborators
 */
router.get('/:id/collaborators', async (req: Request, res: Response): Promise<void> => {
  try {
    const collaborators = await scriptService.getCollaborators(req.params.id, req.user!.userId);
    res.json({ success: true, data: collaborators });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scripts/:id/collaborators
 * Add a collaborator by email
 */
router.post('/:id/collaborators', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, role } = req.body;

    if (!email) {
      res.status(400).json({ success: false, error: 'Email is required.' });
      return;
    }

    const collaborator = await scriptService.addCollaborator(
      req.params.id,
      req.user!.userId,
      email,
      role
    );

    res.status(201).json({
      success: true,
      data: collaborator,
      message: 'Collaborator added successfully.',
    });
  } catch (error: any) {
    const status = error.message.includes('not found') ? 404 : error.message.includes('already') ? 409 : 403;
    res.status(status).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/scripts/:id/collaborators/:userId
 * Remove a collaborator
 */
router.delete('/:id/collaborators/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    await scriptService.removeCollaborator(req.params.id, req.user!.userId, req.params.userId);
    res.json({ success: true, message: 'Collaborator removed.' });
  } catch (error: any) {
    res.status(403).json({ success: false, error: error.message });
  }
});

// ============================================================
// COMMENTS
// ============================================================

/**
 * GET /api/scripts/:id/comments
 */
router.get('/:id/comments', async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await scriptService.getComments(req.params.id, req.user!.userId);
    res.json({ success: true, data: comments });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scripts/:id/comments
 */
router.post('/:id/comments', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, pageIndex } = req.body;

    if (!text || !text.trim()) {
      res.status(400).json({ success: false, error: 'Comment text is required.' });
      return;
    }

    const comment = await scriptService.addComment(
      req.params.id,
      req.user!.userId,
      text.trim(),
      pageIndex
    );

    res.status(201).json({ success: true, data: comment });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// CHARACTERS
// ============================================================

/**
 * GET /api/scripts/:id/characters
 */
router.get('/:id/characters', async (req: Request, res: Response): Promise<void> => {
  try {
    const characters = await scriptService.getCharacters(req.params.id, req.user!.userId);
    res.json({ success: true, data: characters });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/scripts/:id/characters
 */
router.post('/:id/characters', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, error: 'Character name is required.' });
      return;
    }

    const character = await scriptService.addCharacter(req.params.id, req.user!.userId, name);
    res.status(201).json({ success: true, data: character });
  } catch (error: any) {
    const status = error.message.includes('already exists') ? 409 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/scripts/:id/characters/:charId
 */
router.delete('/:id/characters/:charId', async (req: Request, res: Response): Promise<void> => {
  try {
    await scriptService.removeCharacter(req.params.id, req.user!.userId, req.params.charId);
    res.json({ success: true, message: 'Character removed from roster.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
