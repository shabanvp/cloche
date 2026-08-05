/**
 * Utility helper to resolve dynamic category-specific titles for Vendor Dashboard
 */

export interface VendorCategoryTitles {
  mediaTitle: string; // Collections / Portfolio / Gallery & Halls / Food Menu / Designs / Gallery
  mediaSubtitle: string;
  pricingTitle: string; // Collections & Pricing / Packages & Pricing / Halls & Pricing / Menu & Pricing / Products & Pricing
  pricingSubtitle: string;
}

export function getCategoryMenuTitles(category: string = ""): VendorCategoryTitles {
  const cat = (category || "").toLowerCase().trim();

  // 1. Apparel & Jewellery
  if (cat.includes("bridal") || cat.includes("groom") || cat.includes("wear") || cat.includes("boutique")) {
    return {
      mediaTitle: "Collections",
      mediaSubtitle: "Manage your designer outfits, lehengas & bridal wear",
      pricingTitle: "Collections & Pricing",
      pricingSubtitle: "Set outfit pricing, rental rates & customization fees",
    };
  }

  if (cat.includes("jewel") || cat.includes("ornament")) {
    return {
      mediaTitle: "Collections",
      mediaSubtitle: "Manage your luxury jewellery sets & ornaments",
      pricingTitle: "Products & Pricing",
      pricingSubtitle: "Configure gold/diamond set prices & deposit rates",
    };
  }

  // 2. Photo & Video
  if (cat.includes("photo") || cat.includes("video") || cat.includes("film") || cat.includes("cinema")) {
    return {
      mediaTitle: "Portfolio",
      mediaSubtitle: "Showcase wedding albums, photo shoots & trailers",
      pricingTitle: "Packages & Pricing",
      pricingSubtitle: "Manage shoot packages, day rates & equipment add-ons",
    };
  }

  // 3. Makeup & Mehendi
  if (cat.includes("makeup") || cat.includes("beauty") || cat.includes("artist") || cat.includes("mehendi") || cat.includes("henna")) {
    return {
      mediaTitle: "Portfolio",
      mediaSubtitle: "Showcase bridal transformations & mehendi designs",
      pricingTitle: "Packages & Pricing",
      pricingSubtitle: "Set bridal makeup rates, trial fees & group packages",
    };
  }

  // 4. Venue
  if (cat.includes("venue") || cat.includes("resort") || cat.includes("hall") || cat.includes("convention") || cat.includes("auditorium")) {
    return {
      mediaTitle: "Gallery & Halls",
      mediaSubtitle: "Showcase banquet halls, lawns & outdoor spaces",
      pricingTitle: "Halls & Pricing",
      pricingSubtitle: "Configure hall rental rates, guest capacity & slot fees",
    };
  }

  // 5. Caterer
  if (cat.includes("cater") || cat.includes("food") || cat.includes("banquet food")) {
    return {
      mediaTitle: "Food Menu",
      mediaSubtitle: "Showcase signature dishes, live counters & buffets",
      pricingTitle: "Menu & Pricing",
      pricingSubtitle: "Set per-plate rates, veg/non-veg packages & tasting fees",
    };
  }

  // 6. Invitation & Gifts
  if (cat.includes("invitation") || cat.includes("card") || cat.includes("gift") || cat.includes("favor")) {
    return {
      mediaTitle: "Designs",
      mediaSubtitle: "Showcase luxury wedding cards & digital invites",
      pricingTitle: "Products & Pricing",
      pricingSubtitle: "Set printing rates, bulk discounts & customization fees",
    };
  }

  // 7. Decorator / Planner / Default
  return {
    mediaTitle: "Gallery",
    mediaSubtitle: "Showcase stage setups, theme decors & installations",
    pricingTitle: "Packages & Pricing",
    pricingSubtitle: "Set theme packages, decor setup rates & custom quotes",
  };
}
