// High-Speed, Zero-Overhead Pure CSS Blockers (0% CPU Lag, Instant 60 FPS)

export const YOUTUBE_BLOCK_SCRIPT = `
(function() {
  if (document.getElementById('unreel-yt-style')) return;
  const style = document.createElement('style');
  style.id = 'unreel-yt-style';
  style.textContent = \`
    /* 1. Hide Shorts button in bottom bar */
    ytm-pivot-bar-renderer > ytm-pivot-bar-item-renderer:nth-child(2),
    ytm-pivot-bar-renderer > *:nth-child(2),
    ytm-pivot-bar-item-renderer[aria-label*="Shorts"],
    ytm-pivot-bar-item-renderer:has(a[href*="/shorts"]),
    a[href*="/shorts"],
    
    /* 2. Hide all Shorts shelves, carousels & grids */
    ytm-reel-shelf-renderer,
    ytm-rich-section-renderer:has(ytm-reel-shelf-renderer),
    ytm-rich-section-renderer:has(ytm-shorts-lockup-view-model),
    ytm-shorts-lockup-view-model,
    ytm-shorts-lockup-view-model-v2,
    ytm-reel-item-renderer,
    ytm-reel-shelf-renderer-layout,
    ytm-shorts-lockup-view-model-grid-renderer,
    ytm-item-section-renderer:has(ytm-reel-shelf-renderer),
    ytm-item-section-renderer:has(ytm-shorts-lockup-view-model),
    ytm-item-section-renderer:has(a[href*="/shorts"]),
    ytm-video-with-context-renderer:has(a[href*="/shorts"]),
    ytm-compact-video-renderer:has(a[href*="/shorts"]),
    [data-content-type*="shorts"] {
      display: none !important;
    }

    /* 3. Hide App Promos */
    ytm-mealbar-promo-renderer,
    .dialog-overlay {
      display: none !important;
    }
  \`;
  (document.head || document.documentElement).appendChild(style);
})();
true;
`;

export const INSTAGRAM_BLOCK_SCRIPT = `
(function() {
  if (document.getElementById('unreel-ig-style')) return;
  const style = document.createElement('style');
  style.id = 'unreel-ig-style';
  style.textContent = \`
    /* 1. Hide Reels button from navigation */
    a[href*="/reels/"],
    a[href="/reels/"],
    svg[aria-label="Reels"],
    svg[aria-label="Clips"],
    
    /* 2. Hide Reels trays in feed */
    div[data-testid="reels_tray"],
    div:has(> a[href*="/reels/"]) {
      display: none !important;
    }
  \`;
  (document.head || document.documentElement).appendChild(style);
})();
true;
`;

export const FACEBOOK_BLOCK_SCRIPT = `
(function() {
  if (document.getElementById('unreel-fb-style')) return;
  const style = document.createElement('style');
  style.id = 'unreel-fb-style';
  style.textContent = \`
    /* 1. Hide Reels tab in Stories header */
    div[role="tablist"] div[role="tab"]:nth-child(2),
    div[aria-label*="Reels"],
    div[aria-label*="reels"],
    div[aria-label*="Short videos"],
    div[aria-label*="short videos"],

    /* 2. Hide Reels trays & modules in Feed */
    div[data-sigil*="reels"],
    div[data-module-id*="reels"],
    div[role="feed"] > div:has(a[href*="/reel/"]),
    div[role="feed"] > div:has(a[href*="/reels/"]),
    div[role="article"]:has(a[href*="/reel/"]),
    div[role="article"]:has(a[href*="/reels/"]),
    div:has(> a[href*="/reel/"]),
    div:has(> a[href*="/reels/"]),

    /* 3. Hide direct Reel links & Watch Reels */
    a[href*="/reel/"],
    a[href*="/reels/"],
    a[href*="/watch/reels/"],

    /* 4. Hide "Open app" banners */
    div[data-sigil*="m-app-banner"],
    div[data-sigil*="app_upsell"],
    div[id*="m-app-banner"],
    div[id*="app-banner"],
    div[class*="app_upsell"],
    div[class*="app-banner"],
    div:has(> a[href*="play.google.com"]) {
      display: none !important;
      visibility: hidden !important;
    }
  \`;
  (document.head || document.documentElement).appendChild(style);
})();
true;
`;
