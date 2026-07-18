import prisma from '../lib/prisma';
import { CollaboratorRole } from '@prisma/client';

// ============================================================
// SCRIPT CRUD
// ============================================================

/**
 * Create a new screenplay script
 */
export async function createScript(
  ownerId: string,
  data: {
    title?: string;
    writerName?: string;
    draftType?: string;
    language?: string;
    initialContent?: string;
  }
) {
  const script = await prisma.script.create({
    data: {
      title: data.title || 'untitled',
      writerName: data.writerName || 'WRITER NAME',
      draftType: data.draftType || 'Initial Draft',
      language: data.language || 'English',
      ownerId,
      // Create initial page
      pages: {
        create: {
          pageIndex: 0,
          content: data.initialContent || `INT. CREATIVE STUDIO - DAY\n\nA brilliant ray of sunshine filters through the blinds, illuminating a dual widescreen setup.\n\nCHARACTER\nThis is where your screenplay begins.\n\nDescribe the scene, characters, and dialogue here.`,
        },
      },
      // Add owner as OWNER collaborator
      collaborators: {
        create: {
          userId: ownerId,
          role: CollaboratorRole.OWNER,
        },
      },
    },
    include: {
      pages: { orderBy: { pageIndex: 'asc' } },
      collaborators: {
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
      },
      characters: true,
    },
  });

  return script;
}

/**
 * Get all scripts for a user (owned + collaborated on)
 */
export async function getUserScripts(userId: string, includeDeleted: boolean = false) {
  const scripts = await prisma.script.findMany({
    where: {
      AND: [
        {
          OR: [
            { ownerId: userId },
            { collaborators: { some: { userId } } },
          ],
        },
        { isDeleted: includeDeleted ? undefined : false },
      ],
    },
    include: {
      owner: { select: { id: true, name: true, email: true, avatar: true } },
      pages: {
        orderBy: { pageIndex: 'asc' },
        select: { id: true, pageIndex: true, updatedAt: true },
      },
      collaborators: {
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
      },
      _count: {
        select: {
          pages: true,
          versions: true,
          comments: true,
          characters: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return scripts;
}

/**
 * Get a single script with full details
 */
export async function getScriptById(scriptId: string, userId: string) {
  const script = await prisma.script.findFirst({
    where: {
      id: scriptId,
      OR: [
        { ownerId: userId },
        { collaborators: { some: { userId } } },
      ],
    },
    include: {
      owner: { select: { id: true, name: true, email: true, avatar: true } },
      pages: { orderBy: { pageIndex: 'asc' } },
      collaborators: {
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
        },
      },
      characters: { orderBy: { name: 'asc' } },
      _count: {
        select: { versions: true, comments: true },
      },
    },
  });

  if (!script) {
    throw new Error('Script not found or you do not have access.');
  }

  return script;
}

/**
 * Update script metadata
 */
export async function updateScript(
  scriptId: string,
  userId: string,
  data: {
    title?: string;
    writerName?: string;
    draftType?: string;
    language?: string;
  }
) {
  // Verify access (must be owner or editor)
  await verifyScriptAccess(scriptId, userId, [CollaboratorRole.OWNER, CollaboratorRole.EDITOR]);

  const script = await prisma.script.update({
    where: { id: scriptId },
    data,
    include: {
      pages: { orderBy: { pageIndex: 'asc' } },
      characters: true,
    },
  });

  return script;
}

/**
 * Soft-delete a script (move to bin)
 */
export async function deleteScript(scriptId: string, userId: string) {
  // Only owner can delete
  await verifyScriptAccess(scriptId, userId, [CollaboratorRole.OWNER]);

  await prisma.script.update({
    where: { id: scriptId },
    data: { isDeleted: true },
  });
}

/**
 * Restore a script from bin
 */
export async function restoreScript(scriptId: string, userId: string) {
  await verifyScriptAccess(scriptId, userId, [CollaboratorRole.OWNER]);

  await prisma.script.update({
    where: { id: scriptId },
    data: { isDeleted: false },
  });
}

// ============================================================
// PAGES
// ============================================================

/**
 * Bulk update pages for a script (auto-save)
 */
export async function updateScriptPages(
  scriptId: string,
  userId: string,
  pages: Array<{ id?: string; pageIndex: number; content: string }>
) {
  await verifyScriptAccess(scriptId, userId, [CollaboratorRole.OWNER, CollaboratorRole.EDITOR]);

  // Delete all existing pages and recreate (simplifies reordering)
  await prisma.$transaction(async (tx) => {
    await tx.scriptPage.deleteMany({ where: { scriptId } });

    await tx.scriptPage.createMany({
      data: pages.map((page) => ({
        scriptId,
        pageIndex: page.pageIndex,
        content: page.content,
      })),
    });

    // Touch the script's updatedAt
    await tx.script.update({
      where: { id: scriptId },
      data: { updatedAt: new Date() },
    });
  });

  // Return updated pages
  return prisma.scriptPage.findMany({
    where: { scriptId },
    orderBy: { pageIndex: 'asc' },
  });
}

/**
 * Add a new page to a script
 */
export async function addScriptPage(
  scriptId: string,
  userId: string,
  content: string = ''
) {
  await verifyScriptAccess(scriptId, userId, [CollaboratorRole.OWNER, CollaboratorRole.EDITOR]);

  // Get the highest page index
  const lastPage = await prisma.scriptPage.findFirst({
    where: { scriptId },
    orderBy: { pageIndex: 'desc' },
  });

  const newPageIndex = lastPage ? lastPage.pageIndex + 1 : 0;

  const page = await prisma.scriptPage.create({
    data: {
      scriptId,
      pageIndex: newPageIndex,
      content: content || `INT. NEW LOCATION - DAY\n\nDescribe the atmosphere and actor action lines here.\n\n\t\t\t\tCHARACTER\n\t\t\t(parenthetical option)\n\t\t\tDialogue lines go here.`,
    },
  });

  return page;
}

/**
 * Delete a page from a script
 */
export async function deleteScriptPage(scriptId: string, userId: string, pageId: string) {
  await verifyScriptAccess(scriptId, userId, [CollaboratorRole.OWNER, CollaboratorRole.EDITOR]);

  // Check that it's not the last page
  const pageCount = await prisma.scriptPage.count({ where: { scriptId } });
  if (pageCount <= 1) {
    throw new Error('Cannot delete the last page. A script must have at least one page.');
  }

  await prisma.scriptPage.delete({ where: { id: pageId } });

  // Re-index remaining pages
  const remainingPages = await prisma.scriptPage.findMany({
    where: { scriptId },
    orderBy: { pageIndex: 'asc' },
  });

  await prisma.$transaction(
    remainingPages.map((page, index) =>
      prisma.scriptPage.update({
        where: { id: page.id },
        data: { pageIndex: index },
      })
    )
  );
}

// ============================================================
// VERSIONS / SNAPSHOTS
// ============================================================

/**
 * Create a version snapshot of the current script
 */
export async function createScriptVersion(
  scriptId: string,
  userId: string,
  label?: string
) {
  await verifyScriptAccess(scriptId, userId, [CollaboratorRole.OWNER, CollaboratorRole.EDITOR]);

  // Get all pages content
  const pages = await prisma.scriptPage.findMany({
    where: { scriptId },
    orderBy: { pageIndex: 'asc' },
  });

  // Calculate next version number
  const lastVersion = await prisma.scriptVersion.findFirst({
    where: { scriptId },
    orderBy: { versionNumber: 'desc' },
  });
  const nextVersionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;

  const version = await prisma.scriptVersion.create({
    data: {
      scriptId,
      versionNumber: nextVersionNumber,
      createdBy: userId,
      label: label || `Manual Snapshot: ${new Date().toLocaleTimeString()}`,
      type: label ? 'MANUAL' : 'AUTO',
      pages: {
        create: pages.map((p) => ({
          pageIndex: p.pageIndex,
          content: p.content,
        })),
      },
    },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      pages: { orderBy: { pageIndex: 'asc' } },
    },
  });

  return version;
}

/**
 * Get all version snapshots for a script
 */
export async function getScriptVersions(scriptId: string, userId: string) {
  await verifyScriptAccess(scriptId, userId);

  const versions = await prisma.scriptVersion.findMany({
    where: { scriptId },
    include: {
      creator: { select: { id: true, name: true, avatar: true } },
      pages: { orderBy: { pageIndex: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return versions;
}

/**
 * Restore a script from a version snapshot
 */
export async function restoreScriptVersion(
  scriptId: string,
  userId: string,
  versionId: string
) {
  await verifyScriptAccess(scriptId, userId, [CollaboratorRole.OWNER, CollaboratorRole.EDITOR]);

  const version = await prisma.scriptVersion.findFirst({
    where: { id: versionId, scriptId },
    include: { pages: true },
  });

  if (!version) {
    throw new Error('Version not found.');
  }

  // Replace existing pages
  await prisma.$transaction(async (tx) => {
    await tx.scriptPage.deleteMany({ where: { scriptId } });

    await tx.scriptPage.createMany({
      data: version.pages.map((p) => ({
        scriptId,
        pageIndex: p.pageIndex,
        content: p.content,
      })),
    });

    await tx.script.update({
      where: { id: scriptId },
      data: { updatedAt: new Date() },
    });
  });

  return prisma.scriptPage.findMany({
    where: { scriptId },
    orderBy: { pageIndex: 'asc' },
  });
}

// ============================================================
// COLLABORATORS
// ============================================================

/**
 * Add a collaborator to a script by email
 */
export async function addCollaborator(
  scriptId: string,
  ownerId: string,
  collaboratorEmail: string,
  role: CollaboratorRole = CollaboratorRole.EDITOR
) {
  // Only owner can add collaborators
  await verifyScriptAccess(scriptId, ownerId, [CollaboratorRole.OWNER]);

  const userToAdd = await prisma.user.findUnique({
    where: { email: collaboratorEmail.toLowerCase().trim() },
  });

  if (!userToAdd) {
    throw new Error('User not found. They must register first.');
  }

  if (userToAdd.id === ownerId) {
    throw new Error('You are already the owner of this script.');
  }

  // Check if already a collaborator
  const existing = await prisma.scriptCollaborator.findUnique({
    where: { scriptId_userId: { scriptId, userId: userToAdd.id } },
  });

  if (existing) {
    throw new Error('User is already a collaborator on this script.');
  }

  const collaborator = await prisma.scriptCollaborator.create({
    data: {
      scriptId,
      userId: userToAdd.id,
      role,
    },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
  });

  return collaborator;
}

/**
 * Remove a collaborator from a script
 */
export async function removeCollaborator(
  scriptId: string,
  ownerId: string,
  collaboratorUserId: string
) {
  await verifyScriptAccess(scriptId, ownerId, [CollaboratorRole.OWNER]);

  // Cannot remove self (owner)
  if (collaboratorUserId === ownerId) {
    throw new Error('Cannot remove yourself as the owner.');
  }

  await prisma.scriptCollaborator.deleteMany({
    where: { scriptId, userId: collaboratorUserId },
  });
}

/**
 * Get collaborators for a script
 */
export async function getCollaborators(scriptId: string, userId: string) {
  await verifyScriptAccess(scriptId, userId);

  return prisma.scriptCollaborator.findMany({
    where: { scriptId },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true, role: true } },
    },
  });
}

// ============================================================
// COMMENTS
// ============================================================

/**
 * Add a comment to a script
 */
export async function addComment(
  scriptId: string,
  userId: string,
  text: string,
  pageIndex?: number
) {
  await verifyScriptAccess(scriptId, userId);

  const comment = await prisma.scriptComment.create({
    data: {
      scriptId,
      userId,
      text,
      pageIndex,
    },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  });

  return comment;
}

/**
 * Get all comments for a script
 */
export async function getComments(scriptId: string, userId: string) {
  await verifyScriptAccess(scriptId, userId);

  return prisma.scriptComment.findMany({
    where: { scriptId },
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
}

// ============================================================
// CHARACTERS
// ============================================================

/**
 * Add a character to a script's roster
 */
export async function addCharacter(scriptId: string, userId: string, name: string) {
  await verifyScriptAccess(scriptId, userId, [CollaboratorRole.OWNER, CollaboratorRole.EDITOR]);

  const upperName = name.trim().toUpperCase();

  // Check if already exists
  const existing = await prisma.scriptCharacter.findUnique({
    where: { scriptId_name: { scriptId, name: upperName } },
  });

  if (existing) {
    throw new Error(`Character "${upperName}" already exists in this script.`);
  }

  return prisma.scriptCharacter.create({
    data: { scriptId, name: upperName },
  });
}

/**
 * Remove a character from a script's roster
 */
export async function removeCharacter(scriptId: string, userId: string, characterId: string) {
  await verifyScriptAccess(scriptId, userId, [CollaboratorRole.OWNER, CollaboratorRole.EDITOR]);

  await prisma.scriptCharacter.delete({ where: { id: characterId } });
}

/**
 * Get all characters for a script
 */
export async function getCharacters(scriptId: string, userId: string) {
  await verifyScriptAccess(scriptId, userId);

  return prisma.scriptCharacter.findMany({
    where: { scriptId },
    orderBy: { name: 'asc' },
  });
}

// ============================================================
// PERMISSION HELPERS
// ============================================================

/**
 * Verify that a user has access to a script with the required role(s).
 * If no roles specified, any collaborator role or ownership grants access.
 */
async function verifyScriptAccess(
  scriptId: string,
  userId: string,
  requiredRoles?: CollaboratorRole[]
) {
  const collaborator = await prisma.scriptCollaborator.findUnique({
    where: { scriptId_userId: { scriptId, userId } },
  });

  if (!collaborator) {
    // Check if user is the owner directly (fallback)
    const script = await prisma.script.findFirst({
      where: { id: scriptId, ownerId: userId },
    });

    if (!script) {
      throw new Error('Script not found or you do not have access.');
    }

    // Owner has full access
    return;
  }

  if (requiredRoles && !requiredRoles.includes(collaborator.role)) {
    throw new Error('You do not have sufficient permissions for this action.');
  }
}

/**
 * Get deleted scripts for the bin view
 */
export async function getDeletedScripts(userId: string) {
  return prisma.script.findMany({
    where: {
      ownerId: userId,
      isDeleted: true,
    },
    include: {
      _count: { select: { pages: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });
}
