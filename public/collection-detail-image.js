(function () {
  const HERO_HEIGHT_RATIO = 0.68;
  const HERO_MIN_HEIGHT = 520;
  const HERO_MAX_HEIGHT = 760;
  const FRAME_RADIUS = "32px";

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getHeroHeight() {
    return Math.round(clamp(window.innerHeight * HERO_HEIGHT_RATIO, HERO_MIN_HEIGHT, HERO_MAX_HEIGHT));
  }

  function applyFrameStyles(frame) {
    if (!frame) return;

    frame.style.position = "relative";
    frame.style.display = "block";
    frame.style.flex = "none";
    frame.style.width = "100%";
    frame.style.maxWidth = "100%";
    frame.style.height = `${getHeroHeight()}px`;
    frame.style.minHeight = "0";
    frame.style.maxHeight = "none";
    frame.style.overflow = "hidden";
    frame.style.borderRadius = FRAME_RADIUS;
    frame.style.contain = "layout paint";
    frame.style.isolation = "isolate";
    frame.style.background = "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)";
    frame.style.aspectRatio = "auto";
  }

  function applyImageStyles(image) {
    if (!image) return;
    image.style.position = "absolute";
    image.style.inset = "0";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.maxWidth = "none";
    image.style.minHeight = "0";
    image.style.objectFit = "cover";
    image.style.objectPosition = "center center";
    image.style.display = "block";
  }

  function createFrame() {
    const frame = document.createElement("div");
    frame.className = "collection-detail-media-frame product-image-container shadow-2xl animate-fade-in group";
    frame.dataset.collectionDetailPanel = "true";

    const image = document.createElement("img");
    image.id = "mainImage";
    image.className = "collection-detail-media-image transition-transform duration-1000 group-hover:scale-105 opacity-0";
    image.alt = "Product Detail";
    image.dataset.collectionDetailImage = "true";
    image.addEventListener("load", () => {
      applyFrameStyles(frame);
      applyImageStyles(image);
      image.style.opacity = "1";
    });

    const controls = document.createElement("div");
    controls.id = "sliderControls";
    controls.className = "absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-20";
    controls.innerHTML = `
      <button id="prevImg" class="slider-btn size-10 rounded-full flex items-center justify-center">
        <span class="material-symbols-outlined">chevron_left</span>
      </button>
      <button id="nextImg" class="slider-btn size-10 rounded-full flex items-center justify-center">
        <span class="material-symbols-outlined">chevron_right</span>
      </button>
    `;

    const loader = document.createElement("div");
    loader.id = "imageLoader";
    loader.className = "absolute inset-0 flex items-center justify-center z-10";
    loader.innerHTML = `<div class="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>`;

    const badge = document.createElement("div");
    badge.className = "absolute top-6 left-6 z-20";
    badge.innerHTML = `
      <span class="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary px-3 py-1 rounded-full text-[8px] font-bold tracking-widest uppercase">Verified Luxury</span>
    `;

    const dots = document.createElement("div");
    dots.id = "imageDots";
    dots.className = "absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20";

    frame.append(image, controls, loader, badge, dots);
    applyFrameStyles(frame);
    applyImageStyles(image);
    return { frame, image, controls, loader, dots };
  }

  function mountCollectionDetailImage(target) {
    const host = typeof target === "string" ? document.getElementById(target) : target;
    if (!host) return null;

    host.innerHTML = "";
    const parts = createFrame();
    host.appendChild(parts.frame);

    const relock = () => {
      applyFrameStyles(parts.frame);
      applyImageStyles(parts.image);
    };

    window.addEventListener("resize", relock);
    window.addEventListener("orientationchange", relock);
    requestAnimationFrame(relock);

    return {
      ...parts,
      setImage(src) {
        relock();
        parts.image.style.opacity = "0";
        if (parts.loader) parts.loader.classList.remove("hidden");
        parts.image.src = src;
      },
      setDots(count, activeIndex) {
        parts.dots.innerHTML = Array(count).fill(0).map((_, i) => (
          `<div class="img-dot size-1.5 rounded-full" style="background: ${i === activeIndex ? "#c1a671" : "rgba(255,255,255,0.2)"};"></div>`
        )).join("");
      },
      setControlsVisible(visible) {
        parts.controls.classList.toggle("hidden", !visible);
      },
      relock
    };
  }

  window.CLOCHE_COLLECTION_DETAIL_IMAGE = {
    mount: mountCollectionDetailImage,
    applyFrameStyles,
    applyImageStyles
  };
})();
