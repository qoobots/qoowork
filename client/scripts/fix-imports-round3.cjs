/**
 * Fix round 2 over-corrections.
 * In subdir files (openclaw/, auth/, update/):
 *   '../../fileInLibs'  →  '../fileInLibs' (over-corrected by round 2)
 * Also fix: main.ts imports of auth/ files.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');
const LIBS = path.join(SRC, 'main', 'libs');
const SUB_DIRS = ['openclaw', 'auth', 'update'];

// Files that exist at libs/ root level (non-subdir, non-moved)
const rootLibFiles = new Set();
for (const f of fs.readdirSync(LIBS)) {
  const full = path.join(LIBS, f);
  if (fs.statSync(full).isFile() && f.endsWith('.ts')) {
    rootLibFiles.add(f.replace(/\.ts$/, ''));
  }
}
// Also add subdirectory names that files in one subdir need to import from another subdir
for (const sub of SUB_DIRS) {
  rootLibFiles.add(sub); // e.g., 'openclaw', 'auth', 'update'
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

// Fix 1: Undo over-corrections in subdirectory files
for (const sub of SUB_DIRS) {
  const subDir = path.join(LIBS, sub);
  if (!fs.existsSync(subDir)) continue;
  const files = fs.readdirSync(subDir).filter(f => f.endsWith('.ts'));
  for (const f of files) {
    const fp = path.join(subDir, f);
    let content = fs.readFileSync(fp, 'utf-8');
    let mod = false;

    content = content.replace(
      /from\s+(['"])(\.\.\/\.\.\/)([^'"]+)(['"])/g,
      (match, q1, prefix, rest, q2) => {
        // Check if the first segment of 'rest' is at libs/ level
        const firstSeg = rest.split('/')[0];
        if (rootLibFiles.has(firstSeg) || rootLibFiles.has(firstSeg + '.ts')) {
          return `from ${q1}../${rest}${q2}`;
        }
        return match;
      }
    );

    if (content !== fs.readFileSync(fp, 'utf-8')) {
      fs.writeFileSync(fp, content, 'utf-8');
      mod = true;
      console.log(`[FIX] ${sub}/${f}`);
    }
  }
}

// Fix 2: main.ts — auth files moved
const mainTs = path.join(SRC, 'main', 'main.ts');
let mainContent = fs.readFileSync(mainTs, 'utf-8');

// Fix imports like './libs/githubCopilotAuth' → './libs/auth/githubCopilotAuth'
const authFiles = ['githubCopilotAuth', 'openaiCodexAuth', 'copilotTokenManager'];
for (const af of authFiles) {
  const regex = new RegExp(`(from\\s+['"])(\\.?\\/?)libs\\/${af}(['"])`, 'g');
  mainContent = mainContent.replace(regex, `$1libs/auth/${af}$3`);
}

// Also check for authCallbackRouter etc.
const otherAuthFiles = ['authCallbackRouter', 'authLocalCallbackServer', 'claudeSettings'];
for (const af of otherAuthFiles) {
  const regex = new RegExp(`(from\\s+['"])libs\\/${af}(['"])`, 'g');
  mainContent = mainContent.replace(regex, `$1libs/auth/${af}$2`);
}

if (mainContent !== fs.readFileSync(mainTs, 'utf-8')) {
  fs.writeFileSync(mainTs, mainContent, 'utf-8');
  console.log('[FIX] main.ts');
}

// Fix 3: coworkOpenAICompatProxy.ts — imports from copilotTokenManager (now in auth/)
const cppFile = path.join(LIBS, 'coworkOpenAICompatProxy.ts');
if (fs.existsSync(cppFile)) {
  let cppContent = fs.readFileSync(cppFile, 'utf-8');
  const newCpp = cppContent.replace(
    /from\s+(['"])\.\/copilotTokenManager(['"])/g,
    `from $1./auth/copilotTokenManager$2`
  );
  if (newCpp !== cppContent) {
    fs.writeFileSync(cppFile, newCpp, 'utf-8');
    console.log('[FIX] libs/coworkOpenAICompatProxy.ts');
  }
}

console.log('[DONE] Round 2 fix complete.');
