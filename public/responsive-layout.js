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

  function isAnyLoggedIn() {
    return localStorage.getItem("isUserLoggedIn") === "true" || localStorage.getItem("isLoggedIn") === "true";
  }

  function resolveCurrentFile() {
    const path = (window.location.pathname || "").toLowerCase();
    const file = path.split("/").filter(Boolean).pop() || "index.html";
    return file;
  }

  function resolveCurrentRouteClass() {
    const file = resolveCurrentFile();
    return `route-${String(file).toLowerCase().replace(".html", "").replace(/[^a-z0-9_-]/g, "")}`;
  }

  function isRoute(current, names) {
    const c = String(current || "").toLowerCase().replace(/^\//, "");
    return names.some((name) => {
      const n = String(name).toLowerCase().replace(/^\//, "");
      return c === n || c === n.replace(".html", "");
    });
  }

  function setupGlobalMobileBars() {
    if (!isMobile()) return;

    const body = document.body;
    if (!body) return;
    body.classList.add(resolveCurrentRouteClass());

    const profileHref = resolveProfileLink();
    const partnerLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userLoggedIn = localStorage.getItem("isUserLoggedIn") === "true";

    let topbar = document.querySelector(".mobile-topbar");
    if (!topbar) {
      topbar = document.createElement("div");
      topbar.className = "mobile-topbar";
      topbar.innerHTML = `
        <button id="menuBtn" class="mobile-icon-btn" aria-label="Open menu">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <div class="mobile-logo">CLOCHE</div>
      `;
      body.insertBefore(topbar, body.firstChild);
    }

    // Side Menu Drawer HTML (Always ensure it exists and has listeners)
    let sideMenu = document.getElementById("sideMenu");
    let overlay = document.getElementById("menuOverlay");

    if (!sideMenu) {
      sideMenu = document.createElement("div");
      sideMenu.id = "sideMenu";
      sideMenu.className = "hidden";
      
      const partnerLinks = partnerLoggedIn ? `
        <a href="profile.html" class="side-menu-link">
          <span class="material-symbols-outlined">person</span>
          <span>Partner Profile</span>
        </a>
        <a href="dashboard.html" class="side-menu-link">
          <span class="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </a>
      ` : `
        <a href="boutiquelogin.html" class="side-menu-link">
          <span class="material-symbols-outlined">handshake</span>
          <span>Partner With Us</span>
        </a>
      `;

      const loginProfileText = (partnerLoggedIn || userLoggedIn) ? "Logout" : "Login / Profile";
      const loginProfileLink = (partnerLoggedIn || userLoggedIn) ? "#" : profileHref;
      const loginOnClick = (partnerLoggedIn || userLoggedIn) ? "localStorage.clear(); window.location.href='index.html';" : "";

      sideMenu.innerHTML = `
        <div class="side-menu-header">
          <h2>MENU</h2>
          <button id="closeMenu" class="mobile-icon-btn">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="side-menu-content">
          <div class="side-menu-section-title">Navigation</div>
          <a href="index.html" class="side-menu-link">
            <span class="material-symbols-outlined">home</span>
            <span>Home</span>
          </a>
          <a href="boutiques.html" class="side-menu-link">
            <span class="material-symbols-outlined">storefront</span>
            <span>Boutiques</span>
          </a>
          <a href="collection.html" class="side-menu-link">
            <span class="material-symbols-outlined">inventory_2</span>
            <span>Collections</span>
          </a>
          <a href="messageboutique.html" class="side-menu-link">
            <span class="material-symbols-outlined">chat</span>
            <span>Enquire</span>
          </a>
          
          <div class="side-menu-section-title">Account</div>
          ${partnerLinks}
          <a href="${loginProfileLink}" class="side-menu-link" onclick="${loginOnClick}">
            <span class="material-symbols-outlined">${(partnerLoggedIn || userLoggedIn) ? 'logout' : 'login'}</span>
            <span>${loginProfileText}</span>
          </a>

          <div class="side-menu-section-title">Wedding Categories</div>
          <div class="side-menu-category">Venues (Coming Soon)</div>
          <div class="side-menu-category">Photographers (Coming Soon)</div>
          <div class="side-menu-category">Makeup (Coming Soon)</div>
          <div class="side-menu-category">Planning & Decor (Coming Soon)</div>
          <div class="side-menu-category">Mehndi (Coming Soon)</div>
          <div class="side-menu-category">Music & Dance (Coming Soon)</div>
          <div class="side-menu-category">Invites & Gifts (Coming Soon)</div>
          <div class="side-menu-category">Food (Coming Soon)</div>
          <div class="side-menu-category">Groom Wear (Coming Soon)</div>
          <div class="side-menu-category">Jewellery & Accessories (Coming Soon)</div>
        </div>
      `;
      body.appendChild(sideMenu);
    }

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "menuOverlay";
      body.appendChild(overlay);
    }

    sideMenu.classList.remove("hidden");
    overlay.classList.remove("hidden");

    // Sidebar logic elements and listeners
        const syncMenuState = (isOpen) => {
      sideMenu.classList.toggle("active", isOpen);
      overlay.classList.toggle("visible", isOpen);

      if (isOpen) {
        document.body.classList.add("menu-open");
      } else {
        document.body.classList.remove("menu-open");
      }
    };
        const openMenu = () => {
      syncMenuState(true);
    };
    const closeMenuFunc = () => {
      syncMenuState(false);
    };

    const mBtn = document.getElementById("menuBtn");
    const cBtn = document.getElementById("closeMenu");
    if (mBtn) mBtn.onclick = openMenu;
    if (cBtn) cBtn.onclick = closeMenuFunc;
    if (overlay) overlay.onclick = closeMenuFunc;
    
    // Close menu on link or category click
    sideMenu.querySelectorAll("a, .side-menu-category").forEach(el => {
      el.onclick = closeMenuFunc;
    });

    // --- Global Click-Outside Handler for <details> Dropdowns ---
    window.addEventListener("click", (e) => {
      // Find all open <details> elements
      document.querySelectorAll("details[open]").forEach((details) => {
        // If the click is NOT inside this <details>, close it
        if (!details.contains(e.target)) {
          details.removeAttribute("open");
        }
      });
    });

    // Remove legacy right-side icon action from mobile topbar (all pages).
    const legacyTopAction = topbar.querySelector(":scope > a.mobile-icon-btn");
    if (legacyTopAction) legacyTopAction.remove();

    const loginProfileLink = document.querySelector("[data-mobile-login-profile]");
    const menuPanel = topbar.querySelector(".mobile-menu-panel");
    let partnerProfileItem = topbar.querySelector("[data-mobile-partner-profile]");
    let partnerCtaItem = topbar.querySelector("[data-mobile-partner-cta]") || Array.from(topbar.querySelectorAll("a")).find(a => a.textContent.trim() === "Partner With Us");
    if (partnerCtaItem && !partnerCtaItem.hasAttribute("data-mobile-partner-cta")) {
      partnerCtaItem.setAttribute("data-mobile-partner-cta", "");
    }
    
    const mobileMenuDetails = topbar.querySelector(".mobile-menu-details");
    if (mobileMenuDetails) {
      // Close on scroll
      window.addEventListener("scroll", () => {
        if (mobileMenuDetails.hasAttribute("open")) {
          mobileMenuDetails.removeAttribute("open");
        }
      });

      // Close on click
      mobileMenuDetails.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (link) {
          // Close menu
          mobileMenuDetails.removeAttribute("open");

          // Handle 'Home' link specially if already on index.html
          const href = link.getAttribute("href");
          const currentFile = resolveCurrentFile();
          if ((href === "index.html" || href === "/" || href === "") && (currentFile === "index.html" || currentFile === "")) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            // Close dropdown if it's the desktop one too (for safety)
            const desktopMenu = document.getElementById("userMenuDropdown");
            if (desktopMenu) desktopMenu.classList.add("hidden");
          }
        }
      });
    }

    if (menuPanel) {
      if (partnerLoggedIn && !partnerProfileItem) {
        const el = document.createElement("a");
        el.href = "profile.html";
        el.setAttribute("data-mobile-partner-profile", "");
        el.innerHTML = `<span class="material-symbols-outlined">person</span><span>Profile</span>`;
        const anchorBefore = menuPanel.querySelector("a[href='boutiquelogin.html']");
        if (anchorBefore) menuPanel.insertBefore(el, anchorBefore);
        else menuPanel.appendChild(el);
        partnerProfileItem = el;
      } else if (!partnerLoggedIn && partnerProfileItem) {
        partnerProfileItem.remove();
      }

      if (partnerLoggedIn && partnerCtaItem) {
        partnerCtaItem.remove();
      } else if (!partnerLoggedIn && !partnerCtaItem) {
        const el = document.createElement("a");
        el.href = "boutiquelogin.html";
        el.setAttribute("data-mobile-partner-cta", "");
        el.textContent = "Partner With Us";
        const anchorBefore = menuPanel.querySelector("[data-mobile-login-profile]");
        if (anchorBefore) menuPanel.insertBefore(el, anchorBefore);
        else menuPanel.appendChild(el);
        partnerCtaItem = el;
      }
    }

    if (loginProfileLink) {
      loginProfileLink.onclick = null;

      if (isAnyLoggedIn()) {
        loginProfileLink.textContent = "Logout";
        loginProfileLink.setAttribute("href", "#");
        loginProfileLink.onclick = (e) => {
          e.preventDefault();
          localStorage.clear();
          window.location.href = "index.html";
        };
      } else {
        loginProfileLink.textContent = "Login / Profile";
        loginProfileLink.setAttribute("href", profileHref);
      }
    }

    let bottom = document.querySelector(".mobile-bottom-nav");
    if (!bottom) {
      bottom = document.createElement("nav");
      bottom.className = "mobile-bottom-nav";
      bottom.setAttribute("aria-label", "Mobile bottom navigation");
      body.appendChild(bottom);
    }

    if (partnerLoggedIn) {
      bottom.innerHTML = `
        <a href="index.html" class="mobile-bottom-item" data-mobile-tab="home">
          <span class="material-symbols-outlined">home</span>
          <span>Home</span>
        </a>
        <a href="dashboard.html" class="mobile-bottom-item" data-mobile-tab="dashboard">
          <span class="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </a>
        <a href="lead.html" class="mobile-bottom-item" data-mobile-tab="leads">
          <span class="material-symbols-outlined">group</span>
          <span>Leads</span>
        </a>
        <a href="boutiqueproducts.html" class="mobile-bottom-item" data-mobile-tab="products">
          <span class="material-symbols-outlined">inventory_2</span>
          <span>Products</span>
        </a>
        <a href="messages.html" class="mobile-bottom-item" data-mobile-tab="messages">
          <span class="material-symbols-outlined">chat_bubble</span>
          <span>Messages</span>
        </a>
      `;
      bottom.style.gridTemplateColumns = "repeat(5, 1fr)";
    } else {
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
      bottom.style.gridTemplateColumns = "repeat(4, 1fr)";
    }

    bottom.querySelectorAll(".mobile-bottom-item").forEach((el) => el.classList.remove("mobile-bottom-active"));
    const current = resolveCurrentFile();
    if (partnerLoggedIn) {
      let activePartnerTab = null;
      if (isRoute(current, ["index.html", ""])) {
        activePartnerTab = bottom.querySelector('[data-mobile-tab="home"]');
      } else if (isRoute(current, ["dashboard.html"])) {
        activePartnerTab = bottom.querySelector('[data-mobile-tab="dashboard"]');
      } else if (isRoute(current, ["lead.html"])) {
        activePartnerTab = bottom.querySelector('[data-mobile-tab="leads"]');
      } else if (isRoute(current, ["boutiqueproducts.html", "boutiqueproduct.html"])) {
        activePartnerTab = bottom.querySelector('[data-mobile-tab="products"]');
      } else if (isRoute(current, ["messages.html", "messageboutique.html"])) {
        activePartnerTab = bottom.querySelector('[data-mobile-tab="messages"]');
      }

      if (activePartnerTab) {
        activePartnerTab.classList.add("mobile-bottom-active");
      }

      bottom.style.gridTemplateColumns = "repeat(5, 1fr)";
    } else {
      if (isRoute(current, ["index.html", ""])) {
        bottom.querySelector('[data-mobile-tab="home"]')?.classList.add("mobile-bottom-active");
      } else if (isRoute(current, ["boutiques.html", "viewboutique.html"])) {
        bottom.querySelector('[data-mobile-tab="boutiques"]')?.classList.add("mobile-bottom-active");
      } else if (isRoute(current, ["messageboutique.html", "messages.html"])) {
        bottom.querySelector('[data-mobile-tab="enquire"]')?.classList.add("mobile-bottom-active");
      } else if (isRoute(current, ["enquiry.html"])) {
        bottom.querySelector('[data-mobile-tab="enquire"]')?.classList.add("mobile-bottom-active");
      } else if (isRoute(current, ["userprofile.html", "profile.html", "boutiquelogin.html", "signup.html"])) {
        bottom.querySelector('[data-mobile-tab="profile"]')?.classList.add("mobile-bottom-active");
      }
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
