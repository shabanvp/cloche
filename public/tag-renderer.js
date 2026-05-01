(() => {
  const debugTags = (() => {
    try {
      return new URLSearchParams(window.location.search).has("debugTags");
    } catch (_) {
      return false;
    }
  })();

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseCommaTags(tagsRaw) {
    const parsed = String(tagsRaw || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const lowered = parsed.map((t) => t.toLowerCase());
    const defaults = ["bridal wear", "handloom", "couture"];
    if (lowered.length === defaults.length && defaults.every((d) => lowered.includes(d))) {
      return [];
    }

    return parsed;
  }

  function renderTagSpans(tagsRaw, options) {
    const opts = options || {};
    const limit = Number.isFinite(opts.limit) ? Math.max(0, opts.limit) : null;
    const spanClass = String(opts.spanClass || "");

    const tags = parseCommaTags(tagsRaw);
    const sliced = limit === null ? tags : tags.slice(0, limit);
    if (!sliced.length) return "";

    return sliced
      .map((tag) => `<span class="${spanClass}">${escapeHtml(tag)}</span>`)
      .join("");
  }

  window.__CLOCHE__ = window.__CLOCHE__ || {};
  window.__CLOCHE__.parseCommaTags = parseCommaTags;
  window.__CLOCHE__.renderTagSpans = renderTagSpans;

  if (debugTags) console.log("[CLOCHE] tag-renderer.js v20260501 loaded");
})();
