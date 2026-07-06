/**
 * Fix import paths after libs/ file reorganization — ROUND 2.
 *
 * Handles:
 *   1. Files inside libs/ (non-moved) importing via ../movedFile  →  ../sub/movedFile
 *   2. Moved files' relative imports going outside libs/ need extra ../
 *      (because they're now one level deeper)
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');
const LIBS = path.join(SRC, 'main', 'libs');

const SUB_DIRS = ['openclaw', 'auth', 'update'];

// Build set of files in each subdirectory
const filesInSub = {};
for (const sub of SUB_DIRS) {
  filesInSub[sub] = new Set();
  const d = path.join(LIBS, sub);
  if (fs.existsSync(d)) {
    for (const f of fs.readdirSync(d)) {
      if (f.endsWith('.ts')) filesInSub[sub].add(f.replace(/\.ts$/, ''));
    }
  }
}

function collectFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules' && e.name !== 'vendor')
      out.push(...collectFiles(fp));
    else if (e.isFile() && /\.(ts|tsx)$/.test(e.name))
      out.push(fp);
  }
  return out;
}

function getSubDir(fp) {
  const rel = path.relative(LIBS, fp).replace(/\\/g, '/');
  for (const sub of SUB_DIRS) {
    if (rel === sub || rel.startsWith(sub + '/')) return sub;
  }
  return null;
}

function isInLibs(fp) {
  const rel = path.relative(LIBS, fp).replace(/\\/g, '/');
  return rel && !rel.startsWith('..');
}

const allFiles = collectFiles(SRC);
let changed = 0;

for (const fp of allFiles) {
  let content = fs.readFileSync(fp, 'utf-8');
  let mod = false;
  const subDir = getSubDir(fp);
  const insideLibs = isInLibs(fp);

  content = content.replace(
    /from\s+(['"])([^'"]+)(['"])/g,
    (match, q1, importPath, q2) => {
      const segs = importPath.replace(/\\/g, '/').split('/');
      const name = segs[segs.length - 1];

      // --- Fix 1: Non-moved libs/ files importing moved files via ../name ---
      // E.g., libs/agentEngine/openclawRuntimeAdapter.ts →
      //   '../openclawHistory'  should become  '../openclaw/openclawHistory'
      if (insideLibs && !subDir) {
        for (const sub of SUB_DIRS) {
          if (filesInSub[sub].has(name)) {
            // Only fix if currently pointing to wrong place
            if (!importPath.includes(sub + '/')) {
              // ../movedFile → ../sub/movedFile
              const dirPart = importPath.substring(0, importPath.lastIndexOf('/') + 1);
              return `from ${q1}${dirPart}${sub}/${name}${q2}`;
            }
          }
        }
      }

      // --- Fix 2: Moved files' top-level imports now need extra ../ ---
      // When a file moves from libs/ to libs/sub/, imports like
      // '../../shared/foo' need to become '../../../shared/foo'
      // But '../libs/foo' should stay the same (still relative to libs/)
      if (subDir && importPath.startsWith('..')) {
        // Check if the target exists at the current path
        // If import starts with '../', it goes to parent of current dir (libs/)
        // After moving, parent is libs/, so '../file' points to libs/file
        // This is correct if 'file' exists at libs/ root
        // But if import is '../../shared/...', it goes to main/shared (WRONG, should be src/shared)
        // Solution: add '../' for paths going above libs/

        // Count directories in the import path
        const upCount = (importPath.match(/\.\.\//g) || []).length;
        const basePath = importPath.replace(/^(\.\.\/)+/, ''); // remove all ../ prefixes

        // Moved one level deeper: ALL ../ imports need one more ../
        // Originally '../../shared/X' from libs/ → src/shared/X
        // After moving to libs/sub/, '../../shared/X' → main/shared/X (WRONG)
        // Fix: '../../../shared/X' → src/shared/X (CORRECT)
        return `from ${q1}${'../'.repeat(upCount + 1)}${basePath}${q2}`;
      }

      return match;
    }
  );

  if (content !== fs.readFileSync(fp, 'utf-8')) {
    fs.writeFileSync(fp, content, 'utf-8');
    changed++;
    console.log(`[FIX2] ${path.relative(SRC, fp)}`);
  }
}

console.log(`\n[DONE] Updated ${changed} files.`);
