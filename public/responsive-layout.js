(function () {
  const PARTNER_SIGNUP_URL = "signup.html?role=partner";

  function getPartnerSignupUrl() {
    return PARTNER_SIGNUP_URL;
  }

  window.CLOCHE_PARTNER_SIGNUP_URL = PARTNER_SIGNUP_URL;
  window.getPartnerSignupUrl = getPartnerSignupUrl;

  function isPartnerSignupLink(anchor) {
    if (!anchor) return false;
    if (anchor.id === "listYourBoutiqueNav" || anchor.id === "heroListBoutiqueBtn") return true;
    if (anchor.hasAttribute("data-partner-signup-link") || anchor.hasAttribute("data-mobile-partner-cta")) return true;
    const text = String(anchor.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    return text === "list your boutique" || text === "partner with us";
  }

  function setupPartnerSignupLinks(root = document) {
    root.querySelectorAll("a[href]").forEach((anchor) => {
      if (!isPartnerSignupLink(anchor)) return;
      anchor.setAttribute("href", getPartnerSignupUrl());
      anchor.setAttribute("data-partner-signup-link", "");
    });
  }

  function setupPartnerSignupNavigation() {
    if (document.documentElement.dataset.partnerSignupNavBound === "true") return;
    document.documentElement.dataset.partnerSignupNavBound = "true";

    document.addEventListener("click", (event) => {
      const anchor = event.target && typeof event.target.closest === "function"
        ? event.target.closest("a")
        : null;
      if (!isPartnerSignupLink(anchor)) return;

      event.preventDefault();
      window.location.href = getPartnerSignupUrl();
    }, true);
  }

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

  function badgeMarkup(type) {
    return `<span class="side-menu-badge hidden" data-menu-badge="${type}" aria-label="0 new items">0</span>`;
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
    body.classList.add("has-mobile-bars");

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
        <a href="dashboard.html" class="side-menu-link">
          <span class="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </a>
        <a href="lead.html" class="side-menu-link">
          <span class="material-symbols-outlined">group</span>
          <span>Leads</span>
          ${badgeMarkup("leads")}
        </a>
        <a href="boutiqueproducts.html" class="side-menu-link">
          <span class="material-symbols-outlined">inventory_2</span>
          <span>Products</span>
        </a>
        <a href="messages.html" class="side-menu-link">
          <span class="material-symbols-outlined">chat_bubble</span>
          <span>Messages</span>
          ${badgeMarkup("messages")}
        </a>
        <a href="subscription.html" class="side-menu-link">
          <span class="material-symbols-outlined">star</span>
          <span>Subscription</span>
        </a>
        <a href="profile.html" class="side-menu-link">
          <span class="material-symbols-outlined">person</span>
          <span>Partner Profile</span>
        </a>
      ` : `
        <a href="${getPartnerSignupUrl()}" class="side-menu-link" data-partner-signup-link>
          <span class="material-symbols-outlined">handshake</span>
          <span>Partner With Us</span>
        </a>
      `;

      const isLoggedInNow = partnerLoggedIn || userLoggedIn;
      const loginProfileText = isLoggedInNow ? "Logout" : "Login / Profile";
      const loginProfileLink = isLoggedInNow ? "#" : profileHref;
      const loginOnClick = isLoggedInNow ? "window.logout(); return false;" : "";

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
          ${!partnerLoggedIn ? `
          <a href="messageboutique.html?view=list" class="side-menu-link">
            <span class="material-symbols-outlined">chat_bubble</span>
            <span>Enquire</span>
            ${badgeMarkup("messages")}
          </a>
          ` : ""}

          ${userLoggedIn ? `
          <a href="userprofile.html" class="side-menu-link">
            <span class="material-symbols-outlined">person</span>
            <span>User Profile</span>
          </a>
          ` : ""}

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
      overlay.className = "hidden";
      body.appendChild(overlay);
    }

    // Sidebar logic elements and listeners
    const openMenu = () => {
      sideMenu.classList.add("active");
      overlay.classList.add("visible");
      document.body.classList.add("menu-open");
    };
    const closeMenuFunc = () => {
      sideMenu.classList.remove("active");
      overlay.classList.remove("visible");
      document.body.classList.remove("menu-open");
    };

    const mBtn = document.getElementById("menuBtn");
    const cBtn = document.getElementById("closeMenu");
    if (mBtn) mBtn.onclick = openMenu;
    if (cBtn) cBtn.onclick = closeMenuFunc;
    if (overlay) overlay.onclick = closeMenuFunc;

    // Close menu on link or category click (without overriding existing onclick handlers like Logout)
    sideMenu.querySelectorAll("a, .side-menu-category").forEach((el) => {
      if (el.dataset.mobileCloseMenuBound === "true") return;
      el.dataset.mobileCloseMenuBound = "true";
      el.addEventListener("click", (e) => {
        const href = String(el.getAttribute("href") || "");
        if (href.includes("messages.html") || href.includes("messageboutique.html")) {
          setMenuBadge("messages", 0);
        }
        if (href.includes("lead.html")) {
          setMenuBadge("leads", 0);
        }

        const isStandardLink = el.tagName.toLowerCase() === 'a' && href && href !== '#' && !href.startsWith('javascript:') && !el.hasAttribute('onclick') && el.target !== '_blank';

        if (isStandardLink) {
          e.preventDefault();
          closeMenuFunc();
          // Delay routing so the mobile menu can fully animate closed smoothly
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        } else {
          closeMenuFunc();
        }
      });
    });

    updateMobileMenuBadges({ partnerLoggedIn, userLoggedIn });

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
        const anchorBefore = partnerCtaItem || menuPanel.querySelector("[data-mobile-partner-cta]");
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
        el.href = getPartnerSignupUrl();
        el.setAttribute("data-mobile-partner-cta", "");
        el.setAttribute("data-partner-signup-link", "");
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
  }

  function setMenuBadge(type, count) {
    const safeCount = Math.max(0, Number(count || 0));
    document.querySelectorAll(`[data-menu-badge="${type}"]`).forEach((badge) => {
      badge.textContent = safeCount > 99 ? "99+" : String(safeCount);
      badge.setAttribute("aria-label", `${safeCount} new ${type}`);
      badge.classList.toggle("hidden", safeCount <= 0);
    });
  }

  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  }

  function currentRouteName() {
    return resolveCurrentRouteClass().replace(/^route-/, "");
  }

  async function updateMobileMenuBadges({ partnerLoggedIn, userLoggedIn }) {
    const API_ORIGIN = window.API_ORIGIN || "https://cloche-backend.onrender.com";
    const route = currentRouteName();

    if (partnerLoggedIn) {
      const boutiqueId = localStorage.getItem("boutiqueId") || localStorage.getItem("selectedBoutiqueId") || "";
      if (!boutiqueId) return;

      try {
        const conversations = await fetchJson(`${API_ORIGIN}/api/messages/conversations/${encodeURIComponent(boutiqueId)}`);
        const unreadMessages = (Array.isArray(conversations) ? conversations : [])
          .reduce((sum, conv) => sum + Number(conv.unread_count || 0), 0);
        const seenMessageKey = `clocheSeenMessageUnread.partner.${boutiqueId}`;
        if (route === "messages") {
          localStorage.setItem(seenMessageKey, String(unreadMessages));
          setMenuBadge("messages", 0);
        } else {
          const seenUnread = Number(localStorage.getItem(seenMessageKey) || 0);
          setMenuBadge("messages", Math.max(0, unreadMessages - seenUnread));
        }
      } catch (_) {
        setMenuBadge("messages", 0);
      }

      try {
        const leads = await fetchJson(`${API_ORIGIN}/api/leads/list/${encodeURIComponent(boutiqueId)}`);
        const totalLeads = Array.isArray(leads) ? leads.length : 0;
        const seenKey = `clocheSeenLeadCount.${boutiqueId}`;
        if (route === "lead") {
          localStorage.setItem(seenKey, String(totalLeads));
          setMenuBadge("leads", 0);
        } else {
          if (localStorage.getItem(seenKey) === null) {
            localStorage.setItem(seenKey, String(totalLeads));
            setMenuBadge("leads", 0);
            return;
          }
          const seenLeads = Number(localStorage.getItem(seenKey) || 0);
          setMenuBadge("leads", Math.max(0, totalLeads - seenLeads));
        }
      } catch (_) {
        setMenuBadge("leads", 0);
      }
      return;
    }

    if (userLoggedIn) {
      const email = String(localStorage.getItem("userEmail") || "").trim();
      if (!email) return;
      try {
        const conversations = await fetchJson(`${API_ORIGIN}/api/messages/customer/conversations?email=${encodeURIComponent(email)}`);
        const unreadMessages = (Array.isArray(conversations) ? conversations : [])
          .reduce((sum, conv) => sum + Number(conv.unread_count || 0), 0);
        const seenMessageKey = `clocheSeenMessageUnread.user.${email.toLowerCase()}`;
        if (route === "messageboutique") {
          localStorage.setItem(seenMessageKey, String(unreadMessages));
          setMenuBadge("messages", 0);
        } else {
          const seenUnread = Number(localStorage.getItem(seenMessageKey) || 0);
          setMenuBadge("messages", Math.max(0, unreadMessages - seenUnread));
        }
      } catch (_) {
        setMenuBadge("messages", 0);
      }
    }
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
     Global Logout
  ------------------------------------------------------- */
  window.logout = function () {
    console.log("[Auth] Logging out...");
    localStorage.clear();
    // Use session storage if used anywhere, but cloche primarily uses local
    sessionStorage.clear();
    window.location.href = "index.html";
  };

  /* -------------------------------------------------------
     Desktop Header Patching
     Centralizes desktop dropdown logic to avoid hardcoding in every HTML file.
  ------------------------------------------------------- */
  function setupDesktopHeaderPatching() {
    const authNav = document.getElementById("authNav");
    const profileIconLink = document.getElementById("profileIconLink");
    const listYourBoutiqueNav = document.getElementById("listYourBoutiqueNav");
    const userMenuDropdown = document.getElementById("userMenuDropdown");
    const avatar = document.getElementById("navAvatar");

    const partnerLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userLoggedIn = localStorage.getItem("isUserLoggedIn") === "true";
    const ownerName = localStorage.getItem("ownerName") || "B";
    const userName = localStorage.getItem("userName") || "User";

    if (!authNav || !userMenuDropdown) return;

    // Helper to toggle desktop dropdown
    const toggleMenu = (e) => {
      if (window.innerWidth < 768) return; // Allow mobile logic to take over if needed
      e.preventDefault();
      e.stopPropagation();
      userMenuDropdown.classList.toggle("hidden");
    };

    if (partnerLoggedIn) {
      authNav.textContent = "DASHBOARD";
      authNav.href = "dashboard.html";
      authNav.onclick = toggleMenu;
      if (profileIconLink) profileIconLink.onclick = toggleMenu;
      if (profileIconLink) {
        profileIconLink.href = "profile.html";
        profileIconLink.title = "Boutique Profile";
      }
      if (avatar) avatar.textContent = ownerName.charAt(0).toUpperCase();
      if (listYourBoutiqueNav) listYourBoutiqueNav.style.display = "none";

      userMenuDropdown.innerHTML = `
        <a href="dashboard.html" class="block px-3 py-2 rounded text-xs uppercase tracking-widest text-white/80 hover:bg-primary/10 hover:text-primary">Dashboard</a>
        <a href="lead.html" class="block px-3 py-2 rounded text-xs uppercase tracking-widest text-white/80 hover:bg-primary/10 hover:text-primary">Leads</a>
        <a href="boutiqueproducts.html" class="block px-3 py-2 rounded text-xs uppercase tracking-widest text-white/80 hover:bg-primary/10 hover:text-primary">Products</a>
        <a href="messages.html" class="block px-3 py-2 rounded text-xs uppercase tracking-widest text-white/80 hover:bg-primary/10 hover:text-primary">Messages</a>
        <a href="subscription.html" class="block px-3 py-2 rounded text-xs uppercase tracking-widest text-white/80 hover:bg-primary/10 hover:text-primary">Subscription</a>
        <a href="profile.html" class="block px-3 py-2 rounded text-xs uppercase tracking-widest text-white/80 hover:bg-primary/10 hover:text-primary">Profile</a>
        <button onclick="window.logout()" class="w-full text-left px-3 py-2 rounded text-xs uppercase tracking-widest text-white/80 hover:bg-primary/10 hover:text-primary">Logout</button>
      `;
    } else if (userLoggedIn) {
      const firstName = userName.trim().split(/\s+/)[0] || "User";
      authNav.textContent = firstName.toUpperCase();
      authNav.href = "#";
      authNav.onclick = toggleMenu;
      if (profileIconLink) profileIconLink.onclick = toggleMenu;
      if (profileIconLink) {
        profileIconLink.href = "#";
        profileIconLink.title = "Profile";
      }
      if (avatar) avatar.textContent = firstName.charAt(0).toUpperCase();
      if (listYourBoutiqueNav) listYourBoutiqueNav.style.display = "";

      userMenuDropdown.innerHTML = `
        <a href="userprofile.html" class="block px-3 py-2 rounded text-xs uppercase tracking-widest text-white/80 hover:bg-primary/10 hover:text-primary">Profile</a>
        <a href="messageboutique.html" class="block px-3 py-2 rounded text-xs uppercase tracking-widest text-white/80 hover:bg-primary/10 hover:text-primary">Inbox</a>
        <button onclick="window.logout()" class="w-full text-left px-3 py-2 rounded text-xs uppercase tracking-widest text-white/80 hover:bg-primary/10 hover:text-primary">Logout</button>
      `;
    } else {
      authNav.textContent = "LOGIN";
      authNav.href = "boutiquelogin.html";
      authNav.onclick = null;
      if (profileIconLink) {
        profileIconLink.href = "boutiquelogin.html";
        profileIconLink.title = "Login";
        profileIconLink.onclick = null;
      }
      if (avatar) avatar.textContent = "C";
      if (listYourBoutiqueNav) listYourBoutiqueNav.style.display = "";
      userMenuDropdown.classList.add("hidden");
    }
  }

  /* -------------------------------------------------------
     Instant Smooth Navigation (Zero Lag)
  ------------------------------------------------------- */
  function setupInstantSmoothNavigation() {
    const prefetched = new Set();

    // 1. Prefetch on hover (desktop) or touchstart (mobile) for instant loading
    function prefetchLink(e) {
      const anchor = e.target.closest('aside a, nav a, .mobile-bottom-nav a, .responsive-topmenu-list a, .desktop-user-menu a');
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      if (anchor.hostname && anchor.hostname !== window.location.hostname) return;
      
      if (!prefetched.has(href)) {
        prefetched.add(href);
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
      }
    }
    
    document.addEventListener('mouseover', prefetchLink, { passive: true });
    document.addEventListener('touchstart', prefetchLink, { passive: true });

    // 2. Clear transition if coming back via swipe/back-button
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) document.body.style.opacity = '1';
    });

    // 3. Fade out smoothly on click without artificially delaying the browser
    document.addEventListener('click', (event) => {
      const anchor = event.target.closest('aside a, nav a, .mobile-bottom-nav a, .responsive-topmenu-list a, .desktop-user-menu a');
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      if (anchor.hostname && anchor.hostname !== window.location.hostname) return;
      if (anchor.hasAttribute('data-partner-signup-link')) return;

      // DO NOT prevent default. Let browser route immediately to avoid "time lag".
      // Just visually fade out while the browser does its work natively.
      document.body.style.transition = 'opacity 0.15s ease-in';
      document.body.style.opacity = '0';
    });
  }

  /* -------------------------------------------------------
     Init
  ------------------------------------------------------- */
  function init() {
    document.documentElement.classList.add("js-responsive");
    setupPartnerSignupNavigation();
    setupGlobalMobileBars();
    setupPartnerSignupLinks();
    setupSidebarDrawer();
    setupMessagesPage();
    setupTopMenuFallback();
    setupPartnerSignupLinks();
    setupDesktopHeaderPatching();
    setupInstantSmoothNavigation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
