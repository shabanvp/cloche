class AppConstants {
  // ─── API ───────────────────────────────────────────────────────────────────
  static const String baseUrl = 'https://cloche-backend.onrender.com';
  static const String apiBase = '$baseUrl/api';
  static const String apiAuth = '$apiBase/auth';
  static const String apiBoutiques = '$apiBase/boutiques';
  static const String apiProducts = '$apiBase/products';
  static const String apiLeads = '$apiBase/leads';
  static const String apiMessages = '$apiBase/messages';
  static const String apiAdmin = '$apiBase/admin';

  // ─── Storage Keys ──────────────────────────────────────────────────────────
  static const String keyBoutiqueId = 'boutiqueId';
  static const String keyBoutiqueName = 'boutiqueName';
  static const String keyOwnerName = 'ownerName';
  static const String keyIsLoggedIn = 'isLoggedIn';
  static const String keyIsUserLoggedIn = 'isUserLoggedIn';
  static const String keyUserId = 'userId';
  static const String keyUserName = 'userName';
  static const String keyUserEmail = 'userEmail';
  static const String keyPlan = 'plan';

  // ─── Cloudinary ────────────────────────────────────────────────────────────
  static const String cloudinaryCloudName = 'dycwsnzyd';
  static const String cloudinaryBase =
      'https://res.cloudinary.com/$cloudinaryCloudName/image/upload/';

  // ─── Design Tokens ─────────────────────────────────────────────────────────
  static const String appName = 'CLOCHE';
  static const String appTagline = 'Rent Luxury. Feel Royal.';
}
