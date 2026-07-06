/**
 * Reorganize src/main/libs/:
 *   - openclaw*.ts  →  libs/openclaw/
 *   - auth*.ts, claudeSettings, copilotTokenManager, githubCopilotAuth, openaiCodexAuth, coworkModelApi  →  libs/auth/
 *   - appUpdate*.ts  →  libs/update/
 *
 * Steps:
 *   1. Create target directories
 *   2. Move files (including .test.ts companions)
 *   3. Fix import paths in all affected .ts/.tsx files under src/
 */

const fs = require('fs');
const path = require('path');

const LIBS_DIR = path.join(__dirname, '..', 'src', 'main', 'libs');
const SRC_DIR = path.join(__dirname, '..', 'src');

// ─── Move plan ───
const GROUPS = {
  'openclaw': {
    dir: 'openclaw',
    files: fs.readdirSync(LIBS_DIR).filter(f =>
      f.startsWith('openclaw') && f.endsWith('.ts')
    ),
  },
  'auth': {
    dir: 'auth',
    files: [
      'authCallbackRouter.ts', 'authCallbackRouter.test.ts',
      'authLocalCallbackServer.ts', 'authLocalCallbackServer.test.ts',
      'claudeSettings.ts',
      'copilotTokenManager.ts',
      'coworkModelApi.ts', 'coworkModelApi.test.ts',
      'githubCopilotAuth.ts',
      'openaiCodexAuth.ts',
    ].filter(f => fs.existsSync(path.join(LIBS_DIR, f))),
  },
  'update': {
    dir: 'update',
    files: [
      'appUpdateCoordinator.ts', 'appUpdateCoordinator.test.ts',
      'appUpdateInstaller.ts', 'appUpdateInstaller.test.ts',
    ].filter(f => fs.existsSync(path.join(LIBS_DIR, f))),
  },
};

// ─── 1. Create directories and move files ───
const moveMap = new Map(); // oldRelativePath → newRelativePath (from src/main/)

for (const [/* name */, group] of Object.entries(GROUPS)) {
  const targetDir = path.join(LIBS_DIR, group.dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`[OK] Created ${targetDir}`);
  }

  for (const file of group.files) {
    const src = path.join(LIBS_DIR, file);
    const dst = path.join(targetDir, file);
    fs.renameSync(src, dst);
    moveMap.set(
      `libs/${file}`,
      `libs/${group.dir}/${file}`,
    );
    console.log(`[MV] ${file} → libs/${group.dir}/`);
  }
}

// ─── 2. Fix import paths in all source files ───
function findAllSourceFiles(dir) {
  const result = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'vendor') {
      result.push(...findAllSourceFiles(full));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      result.push(full);
    }
  }
  return result;
}

const sourceFiles = findAllSourceFiles(SRC_DIR);
let changedCount = 0;
let replacedCount = 0;

for (const filePath of sourceFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  for (const [oldRelative, newRelative] of moveMap) {
    // Strip .ts extension and build the import path (TS imports don't include extension)
    const oldImport = oldRelative.replace(/\.ts$/, '');
    const newImport = newRelative.replace(/\.ts$/, '');
    // Escape for regex
    const escapedOld = oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Match: from 'relative/path/file'  or  from "relative/path/file"
    // relative path can be: ./ or ../../  etc.
    const regex = new RegExp(
      `(from\\s+['"])(\\.\\.?\\/)(${escapedOld})(['"])`,
      'g',
    );

    let replaced = false;
    const newContent = content.replace(regex, (match, prefix, dotdots, matchPath, suffix) => {
      // Preserve the original relative depth prefix
      return `${prefix}${dotdots}${newImport}${suffix}`;
    });

    if (newContent !== content) {
      replaced = true;
      content = newContent;
    }

    if (replaced) {
      const matchCount = (content.match(regex) || []).length;
      // Since we already replaced, match count would be 0; track differently
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    changedCount++;
    // Count total replacements via diff
    const oldLines = fs.readFileSync(filePath, 'utf-8');
    const diffs = (oldLines.match(/from\s+['"]\.\.?\/.*openclaw/g) || []).length +
      (oldLines.match(/from\s+['"]\.\.?\/.*appUpdate/g) || []).length +
      (oldLines.match(/from\s+['"]\.\.?\/.*auth/g) || []).length;
    replacedCount += diffs;
    // Write the content back (it was already written)
  }
}

console.log(`\n[OK] Updated imports in ${changedCount} files (${replacedCount} replacements)`);
console.log('[DONE] Reorganization complete.');
