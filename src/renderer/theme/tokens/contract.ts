/**
 * Token Contract — defines all semantic variables a theme must provide.
 *
 * Naming: --qoowork-{category}-{name}
 * Convention: shadcn/ui background/foreground pairing + Radix 12-step gray scale
 *
 * Every theme (ThemeDefinition.tokens) must supply a value for each key.
 */
export const TOKEN_CONTRACT = {
  // ── Brand ──
  'primary':            '--qoowork-primary',
  'primary-foreground': '--qoowork-primary-foreground',
  'primary-hover':      '--qoowork-primary-hover',
  'primary-muted':      '--qoowork-primary-muted',

  // ── Accent ──
  'accent':             '--qoowork-accent',
  'accent-foreground':  '--qoowork-accent-foreground',

  // ── Surface / Background ──
  'background':         '--qoowork-background',
  'foreground':         '--qoowork-foreground',
  'surface':            '--qoowork-surface',
  'surface-foreground': '--qoowork-surface-foreground',
  'surface-raised':     '--qoowork-surface-raised',
  'surface-overlay':    '--qoowork-surface-overlay',

  // ── Chat bubbles ──
  'chat-user':              '--qoowork-chat-user',
  'chat-user-foreground':   '--qoowork-chat-user-foreground',
  'chat-bot':               '--qoowork-chat-bot',
  'chat-bot-foreground':    '--qoowork-chat-bot-foreground',

  // ── Text hierarchy ──
  'text-primary':       '--qoowork-text-primary',
  'text-secondary':     '--qoowork-text-secondary',
  'text-muted':         '--qoowork-text-muted',

  // ── Borders ──
  'border':             '--qoowork-border',
  'border-subtle':      '--qoowork-border-subtle',
  'input-border':       '--qoowork-input-border',

  // ── Scrollbar ──
  'scroll-thumb':       '--qoowork-scroll-thumb',
  'scroll-thumb-hover': '--qoowork-scroll-thumb-hover',

  // ── Decorative gradients ──
  'gradient-1':         '--qoowork-gradient-1',
  'gradient-2':         '--qoowork-gradient-2',

  // ── Status ──
  'destructive':            '--qoowork-destructive',
  'destructive-foreground': '--qoowork-destructive-foreground',
  'success':                '--qoowork-success',
  'warning':                '--qoowork-warning',

  // ── Gray scale 11 steps (gray-1=lightest → gray-11=darkest, all themes) ──
  'gray-1':  '--qoowork-gray-1',
  'gray-2':  '--qoowork-gray-2',
  'gray-3':  '--qoowork-gray-3',
  'gray-4':  '--qoowork-gray-4',
  'gray-5':  '--qoowork-gray-5',
  'gray-6':  '--qoowork-gray-6',
  'gray-7':  '--qoowork-gray-7',
  'gray-8':  '--qoowork-gray-8',
  'gray-9':  '--qoowork-gray-9',
  'gray-10': '--qoowork-gray-10',
  'gray-11': '--qoowork-gray-11',

  // ── Radius ──
  'radius':  '--qoowork-radius',
} as const;

export type TokenName = keyof typeof TOKEN_CONTRACT;
export type CSSVarName = (typeof TOKEN_CONTRACT)[TokenName];

/** All token keys as an array */
export const TOKEN_NAMES = Object.keys(TOKEN_CONTRACT) as TokenName[];
