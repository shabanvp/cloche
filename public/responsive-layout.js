(function () {
  function isMobile() {
    return window.matchMedia("(max-width: 1024px)").matches;
  }

  function resolveProfileLink() {
    const isUserLoggedIn = localStorage.getItem("isUserLoggedIn") === "true";
    const isPartnerLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isUserLoggedIn) return "userprofile.html";
    if (isPartnerLoggedIn) return "profile.html";
    return "boutiquelogin.html";
  }

  function resolveCurrentFile() {
    const path = (window.location.pathname || "").toLowerCase();
    const file = path.split("/").filter(Boolean).pop() || "index.html";
    return file;
  }

  function setupGlobalMobileBars() {
    if (!isMobile()) return;

    const body = document.body;
    if (!body) return;

    const profileHref = resolveProfileLink();

    let topbar = document.querySelector(".mobile-topbar");
    if (!topbar) {
      topbar = document.createElement("div");
      topbar.className = "mobile-topbar";
      topbar.innerHTML = `
        <details class="mobile-menu-details">
          <summary class="mobile-icon-btn" aria-label="Open menu">
            <span class="material-symbols-outlined">menu</span>
          </summary>
          <div class="mobile-menu-panel">
            <a href="index.html">Home</a>
            <a href="boutiques.html">Boutiques</a>
            <a href="viewproducts.html">Collections</a>
            <a href="messageboutique.html">Messages</a>
            <a href="boutiquelogin.html">Partner With Us</a>
            <a data-mobile-login-profile href="${profileHref}">Login / Profile</a>
          </div>
        </details>
        <div class="mobile-logo">CLOCHE</div>
        <a href="messageboutique.html" class="mobile-icon-btn" aria-label="Enquire">
          <span class="material-symbols-outlined">chat</span>
        </a>
      `;
      body.insertBefore(topbar, body.firstChild);
    }

    const loginProfileLink = document.querySelector("[data-mobile-login-profile]");
    if (loginProfileLink) loginProfileLink.setAttribute("href", profileHref);

    let bottom = document.querySelector(".mobile-bottom-nav");
    if (!bottom) {
      bottom = document.createElement("nav");
      bottom.className = "mobile-bottom-nav";
      bottom.setAttribute("aria-label", "Mobile bottom navigation");
      bottom.innerHTML = `
        <a href="index.html" class="mobile-bottom-item" data-mobile-tab="home">
          <span class="material-symbols-outlined">home</span>
          <span>Home</span>
        </a>
        <a href="boutiques.html" class="mobile-bottom-item" data-mobile-tab="boutiques">
          <span class="material-symbols-outlined">storefront</span>
          <span>Boutiques</span>
        </a>
        <a href="messageboutique.html" class="mobile-bottom-item" data-mobile-tab="enquire">
          <span class="material-symbols-outlined">chat</span>
          <span>Enquire</span>
        </a>
        <a href="${profileHref}" class="mobile-bottom-item" data-mobile-tab="profile">
          <span class="material-symbols-outlined">person</span>
          <span>Profile</span>
        </a>
      `;
      body.appendChild(bottom);
    }

    const profileTab = bottom.querySelector('[data-mobile-tab="profile"]');
    if (profileTab) profileTab.setAttribute("href", profileHref);

    // Ensure expected labels/icons even if nav already exists in page markup
    const tabMap = {
      home: { href: "index.html", label: "Home", icon: "home" },
      boutiques: { href: "boutiques.html", label: "Boutiques", icon: "storefront" },
      enquire: { href: "messageboutique.html", label: "Enquire", icon: "chat" },
      profile: { href: profileHref, label: "Profile", icon: "person" }
    };

    Object.keys(tabMap).forEach((key) => {
      const item = bottom.querySelector(`[data-mobile-tab="${key}"]`);
      if (!item) return;
      item.setAttribute("href", tabMap[key].href);
      const icon = item.querySelector(".material-symbols-outlined");
      const text = item.querySelector("span:last-child");
      if (icon) icon.textContent = tabMap[key].icon;
      if (text) text.textContent = tabMap[key].label;
    });

    bottom.querySelectorAll(".mobile-bottom-item").forEach((el) => el.classList.remove("mobile-bottom-active"));
    const current = resolveCurrentFile();
    if (current === "index.html") {
      bottom.querySelector('[data-mobile-tab="home"]')?.classList.add("mobile-bottom-active");
    } else if (current === "boutiques.html" || current === "viewboutique.html") {
      bottom.querySelector('[data-mobile-tab="boutiques"]')?.classList.add("mobile-bottom-active");
    } else if (current === "messageboutique.html" || current === "messages.html") {
      bottom.querySelector('[data-mobile-tab="enquire"]')?.classList.add("mobile-bottom-active");
    } else if (current === "userprofile.html" || current === "profile.html" || current === "boutiquelogin.html" || current === "signup.html") {
      bottom.querySelector('[data-mobile-tab="profile"]')?.classList.add("mobile-bottom-active");
    }

    body.classList.add("has-mobile-bars");
  }

  /* -------------------------------------------------------
     Sidebar drawer setup
  ------------------------------------------------------- */
  function setupSidebarDrawer() {
    const sidebar = document.querySelector("aside.w-72");
    if (!sidebar) return;

    document.body.classList.add("has-responsive-sidebar");
    sidebar.setAttribute("data-responsive-sidebar", "true");

    const main = document.querySelector("main");
    if (main) main.classList.add("responsive-main");

    // Backdrop
    let backdrop = document.querySelector(".responsive-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "responsive-backdrop";
      document.body.appendChild(backdrop);
    }

    // Hamburger toggle button
    let toggle = document.querySelector(".responsive-sidebar-toggle");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.className = "responsive-sidebar-toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-label", "Toggle menu");
      toggle.innerHTML = "&#9776;"; // ☰
      document.body.appendChild(toggle);
    }

    const closeSidebar = () => document.body.classList.remove("responsive-sidebar-open");
    const openSidebar = () => document.body.classList.add("responsive-sidebar-open");
    const toggleSidebar = () => {
      if (document.body.classList.contains("responsive-sidebar-open")) closeSidebar();
      else openSidebar();
    };

    toggle.onclick = toggleSidebar;
    backdrop.onclick = closeSidebar;

    // Close sidebar when a nav link is clicked on mobile
    sidebar.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("click", () => {
        if (isMobile()) closeSidebar();
      });
    });

    const applyToggleVisibility = () => {
      toggle.style.display = isMobile() ? "inline-flex" : "none";
      if (!isMobile()) closeSidebar();
    };

    applyToggleVisibility();
    window.addEventListener("resize", applyToggleVisibility);
  }

  /* -------------------------------------------------------
     Messages page – single-pane mobile behaviour
     Goal: on mobile show conversation list OR chat, not both.
  ------------------------------------------------------- */
  function setupMessagesPage() {
    // Only runs on messages.html
    const layout = document.querySelector(".flex-1.flex.overflow-hidden");
    const leftPane = layout && layout.querySelector("section:first-child");
    const rightPane = layout && layout.querySelector("section:last-child");
    if (!layout || !leftPane || !rightPane) return;

    // Create a "← Back" button to insert in the chat header
    function getOrCreateBackBtn() {
      if (document.getElementById("mobileChatBack")) return document.getElementById("mobileChatBack");
      const btn = document.createElement("button");
      btn.id = "mobileChatBack";
      btn.type = "button";
      btn.setAttribute("aria-label", "Back to conversations");
      btn.innerHTML = "&#8592;"; // ←
      btn.onclick = closeChatPane;
      return btn;
    }

    function openChatPane() {
      if (!isMobile()) return;
      layout.classList.add("chat-active");
      // Insert back button in chat header
      const chatHeader = document.getElementById("chatHeader");
      if (chatHeader && !document.getElementById("mobileChatBack")) {
        const btn = getOrCreateBackBtn();
        chatHeader.insertBefore(btn, chatHeader.firstChild);
      }
    }

    function closeChatPane() {
      layout.classList.remove("chat-active");
    }

    // Expose globally so messages.html JS can call openChatPane()
    window._mobileOpenChat = openChatPane;
    window._mobileCloseChat = closeChatPane;

    // Patch openConversation to trigger mobile animation
    // We wrap it after messages.html's own DOMContentLoaded
    window.addEventListener("load", () => {
      if (typeof openConversation === "function") {
        const original = window.openConversation;
        window.openConversation = async function (...args) {
          await original.apply(this, args);
          openChatPane();
        };
      }
    });

    // Also reset when sidebar is toggled etc.
    window.addEventListener("resize", () => {
      if (!isMobile()) {
        layout.classList.remove("chat-active");
      }
    });
  }

  /* -------------------------------------------------------
     Landing page top-menu fallback (for .hidden.md:flex navs)
  ------------------------------------------------------- */
  function setupTopMenuFallback() {
    if (!isMobile()) return;

    const desktopMenus = document.querySelectorAll("nav .hidden.md\\:flex, header .hidden.md\\:flex");
    desktopMenus.forEach((menu, idx) => {
      if (menu.dataset.responsiveBound === "true") return;
      menu.dataset.responsiveBound = "true";

      const links = Array.from(menu.querySelectorAll("a[href]"));
      if (!links.length) return;

      const host = menu.parentElement;
      if (!host || host.querySelector(".responsive-topmenu")) return;

      const details = document.createElement("details");
      details.className = "responsive-topmenu";
      const summary = document.createElement("summary");
      summary.textContent = "Menu";
      details.appendChild(summary);

      const list = document.createElement("div");
      list.className = "responsive-topmenu-list";
      links.forEach((a) => {
        const clone = document.createElement("a");
        clone.href = a.getAttribute("href");
        clone.textContent = (a.textContent || "").trim() || `Link ${idx + 1}`;
        list.appendChild(clone);
      });
      details.appendChild(list);
      host.appendChild(details);
    });
  }

  /* -------------------------------------------------------
     Init
  ------------------------------------------------------- */
  function init() {
    document.documentElement.classList.add("js-responsive");
    setupGlobalMobileBars();
    setupSidebarDrawer();
    setupMessagesPage();
    setupTopMenuFallback();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
