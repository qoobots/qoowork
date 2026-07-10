/**
 * Tailwind CSS v3 plugin — bridges --qoowork-* CSS variables into Tailwind utility classes.
 *
 * Usage in tailwind.config.js:
 *   plugins: [require('./src/renderer/theme/tailwind/plugin.cjs')]
 *
 * Provides: bg-background, text-foreground, bg-primary, border-border, etc.
 * Also provides legacy claude.* aliases for backward compatibility.
 *
 * Colors are wrapped in color-mix() with the <alpha-value> placeholder so that
 * Tailwind opacity modifiers (e.g. text-foreground/90, bg-surface-raised/30)
 * generate working CSS. Without this, var()-based colors silently drop any
 * class that uses an opacity modifier.
 */
const plugin = require('tailwindcss/plugin');

const withAlpha = (variable) =>
  `color-mix(in srgb, var(${variable}) calc(<alpha-value> * 100%), transparent)`;

module.exports = plugin(function () {
  // The plugin itself is a no-op; we only extend the theme below.
}, {
  theme: {
    extend: {
      colors: {
        // === Semantic theme colors (driven by CSS variables) ===
        background:    withAlpha('--qoowork-background'),
        foreground:    withAlpha('--qoowork-foreground'),
        primary: {
          DEFAULT:     withAlpha('--qoowork-primary'),
          foreground:  withAlpha('--qoowork-primary-foreground'),
          hover:       withAlpha('--qoowork-primary-hover'),
          muted:       withAlpha('--qoowork-primary-muted'),
          dark:        withAlpha('--qoowork-primary-hover'),  // backward compat alias
        },
        accent: {
          DEFAULT:     withAlpha('--qoowork-accent'),
          foreground:  withAlpha('--qoowork-accent-foreground'),
        },
        surface: {
          DEFAULT:     withAlpha('--qoowork-surface'),
          foreground:  withAlpha('--qoowork-surface-foreground'),
          raised:      withAlpha('--qoowork-surface-raised'),
          overlay:     withAlpha('--qoowork-surface-overlay'),
          inset:       withAlpha('--qoowork-surface-raised'),  // alias
        },
        border: {
          DEFAULT:     withAlpha('--qoowork-border'),
          subtle:      withAlpha('--qoowork-border-subtle'),
          input:       withAlpha('--qoowork-input-border'),
        },
        muted:         withAlpha('--qoowork-text-muted'),
        destructive: {
          DEFAULT:     withAlpha('--qoowork-destructive'),
          foreground:  withAlpha('--qoowork-destructive-foreground'),
        },
        success:       withAlpha('--qoowork-success'),
        warning:       withAlpha('--qoowork-warning'),

        // === Legacy claude.* aliases (map to --qoowork-* for backward compat) ===
        claude: {
          bg:                withAlpha('--qoowork-background'),
          surface:           withAlpha('--qoowork-surface'),
          surfaceHover:      withAlpha('--qoowork-surface-raised'),
          surfaceMuted:      withAlpha('--qoowork-surface-raised'),
          surfaceInset:      withAlpha('--qoowork-surface-raised'),
          border:            withAlpha('--qoowork-border'),
          borderLight:       withAlpha('--qoowork-border-subtle'),
          text:              withAlpha('--qoowork-text-primary'),
          textSecondary:     withAlpha('--qoowork-text-secondary'),
          // dark.* aliases point to the same vars — theme handles light/dark
          darkBg:            withAlpha('--qoowork-background'),
          darkSurface:       withAlpha('--qoowork-surface'),
          darkSurfaceHover:  withAlpha('--qoowork-surface-raised'),
          darkSurfaceMuted:  withAlpha('--qoowork-surface-raised'),
          darkSurfaceInset:  withAlpha('--qoowork-surface-raised'),
          darkBorder:        withAlpha('--qoowork-border'),
          darkBorderLight:   withAlpha('--qoowork-border-subtle'),
          darkText:          withAlpha('--qoowork-text-primary'),
          darkTextSecondary: withAlpha('--qoowork-text-secondary'),
          // Accent
          accent:            withAlpha('--qoowork-primary'),
          accentHover:       withAlpha('--qoowork-primary-hover'),
          accentLight:       withAlpha('--qoowork-primary'),
          accentMuted:       withAlpha('--qoowork-primary-muted'),
        },
        secondary: {
          DEFAULT: withAlpha('--qoowork-text-secondary'),
          dark:    withAlpha('--qoowork-border'),
        },
      },
      borderRadius: {
        theme: 'var(--qoowork-radius)',
      },
    },
  },
});
