(function () {
  const FOOTER_VERSION = "20260501-global";
  const FOOTER_ID = "clocheGlobalFooter";
  const FOOTER_CSS_HREF = `footer.css?v=${FOOTER_VERSION}`;

  function ensureFooterStylesheet() {
    const existing = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .some((link) => String(link.getAttribute("href") || "").includes("footer.css"));
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FOOTER_CSS_HREF;
    document.head.appendChild(link);
  }

  function removeLegacyFooters() {
    document.querySelectorAll(`footer:not(#${FOOTER_ID})`).forEach((footer) => footer.remove());
  }

  function wrapPagesWithoutMain() {
    if (document.querySelector("main") || document.querySelector(".cloche-page-content")) return;

    const contentElements = Array.from(document.body.children).filter((node) => {
      const tagName = node.tagName.toLowerCase();
      return tagName !== "script" && tagName !== "style" && tagName !== "link" && node.id !== FOOTER_ID;
    });
    if (contentElements.length !== 1) return;

    const onlyChildTag = contentElements[0].tagName.toLowerCase();
    if (["nav", "header", "section", "aside", "footer"].includes(onlyChildTag)) return;

    const wrapper = document.createElement("main");
    wrapper.className = "cloche-page-content";

    Array.from(document.body.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if (tagName === "script" || tagName === "style" || tagName === "link" || node.id === FOOTER_ID) return;
      }
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      wrapper.appendChild(node);
    });

    document.body.insertBefore(wrapper, document.body.firstChild);
  }

  function createFooter() {
    const footer = document.createElement("footer");
    footer.id = FOOTER_ID;
    footer.className = "cloche-site-footer";
    footer.innerHTML = `
      <div class="cloche-site-footer__inner">
        <p class="cloche-footer-copy">&copy; 2024 CLOCHE LUXURY. ALL RIGHTS RESERVED.</p>
        <nav class="cloche-site-footer__links" aria-label="Footer">
          <a href="privacy.html">Privacy</a>
          <a href="terms.html">Terms</a>
          <a href="vendor-agreement.html">Help</a>
        </nav>
      </div>
    `;
    return footer;
  }

  function renderFooter() {
    if (!document.body) return;

    ensureFooterStylesheet();
    removeLegacyFooters();
    wrapPagesWithoutMain();

    document.body.classList.add("cloche-footer-ready");

    let footer = document.getElementById(FOOTER_ID);
    if (!footer) {
      footer = createFooter();
      document.body.appendChild(footer);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderFooter);
  } else {
    renderFooter();
  }
})();
