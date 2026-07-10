/**
 * Fix import paths after libs/ file reorganization.
 *
 * After moving files, two kinds of imports need fixing:
 *   A. External files importing moved files:  libs/oldName  →  libs/sub/oldName
 *   B. Moved files importing non-moved libs siblings:  ./sibling  →  ../sibling
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');
const LIBS = path.join(SRC, 'main', 'libs');

const SUB_DIRS = ['openclaw', 'auth', 'update'];

// Build a set of files that exist in each subdirectory (without .ts)
const filesInSubDir = {};
for (const sub of SUB_DIRS) {
  const d = path.join(LIBS, sub);
  filesInSubDir[sub] = new Set();
  if (fs.existsSync(d)) {
    for (const f of fs.readdirSync(d)) {
      if (f.endsWith('.ts')) filesInSubDir[sub].add(f.replace(/\.ts$/, ''));
    }
  }
}

// Build a set of ALL files that were moved (for case A)
const allMoved = new Set();
for (const sub of SUB_DIRS) {
  for (const name of filesInSubDir[sub]) allMoved.add(name);
}

// Also build a set of files still at libs/ root (for case B)
const filesInLibsRoot = new Set();
for (const f of fs.readdirSync(LIBS)) {
  if (f.endsWith('.ts') && !SUB_DIRS.includes(f.replace(/\.ts$/, '')))
    filesInLibsRoot.add(f.replace(/\.ts$/, ''));
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&'); }

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

// Determine which subdirectory a file is in, if any
function getSubDir(fp) {
  const rel = path.relative(LIBS, fp).replace(/\\/g, '/');
  for (const sub of SUB_DIRS) {
    if (rel === sub || rel.startsWith(sub + '/')) return sub;
  }
  return null;
}

const allFiles = collectFiles(SRC);
let changedFiles = 0;
let caseA = 0, caseB = 0;

for (const fp of allFiles) {
  let content = fs.readFileSync(fp, 'utf-8');
  let mod = false;
  const subDir = getSubDir(fp);

  // Pass 1: Fix imports by moved file name (case A & B)
  content = content.replace(
    /from\s+(['"])([^'"]+)(['"])/g,
    (match, q1, importPath, q2) => {
      const segs = importPath.replace(/\\/g, '/').split('/');
      const name = segs[segs.length - 1];

      // --- Case A: External file importing a moved file via libs/ path ---
      if (allMoved.has(name) && importPath.includes('libs/')) {
        // Find which subdirectory this file is in
        for (const sub of SUB_DIRS) {
          if (filesInSubDir[sub].has(name)) {
            const prefix = importPath.substring(0, importPath.indexOf('libs/') + 5);
            return `from ${q1}${prefix}${sub}/${name}${q2}`;
          }
        }
      }

      // --- Case B: File in subdir importing a non-moved libs sibling ---
      if (subDir && importPath.startsWith('./') && !importPath.startsWith('./' + subDir)) {
        const target = name;
        // If target is NOT in the current subdirectory
        if (!filesInSubDir[subDir].has(target) && filesInLibsRoot.has(target)) {
          caseB++;
          return `from ${q1}../${target}${q2}`;
        }
      }

      // --- Case B variant: File in subdir A importing file from subdir B ---
      if (subDir && importPath.startsWith('./')) {
        for (const other of SUB_DIRS) {
          if (other !== subDir && filesInSubDir[other].has(name)) {
            return `from ${q1}../${other}/${name}${q2}`;
          }
        }
      }

      return match;
    }
  );

  // Now handle the edge case where a moved file imports from another moved file
  // in the same new subdirectory - path should stay './file' (no change needed, already correct)
  // But if both are moved into different subdirs, the path needs updating
  // This is handled by the Case B variant above.

  if (content !== fs.readFileSync(fp, 'utf-8')) {
    fs.writeFileSync(fp, content, 'utf-8');
    changedFiles++;
    console.log(`[FIX] ${path.relative(SRC, fp)}`);
  }
}

console.log(`\n[DONE] Updated ${changedFiles} files (Case A: libs/ imports, Case B: ../ siblings).`);
