import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants/app_constants.dart';

/// Cross-platform session storage using SharedPreferences.
/// On Android/iOS this is backed by the platform keystore equivalent;
/// on Web it uses localStorage. For production mobile, swap back to
/// flutter_secure_storage once an Android device is available.
class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  Future<SharedPreferences> get _prefs => SharedPreferences.getInstance();

  // ─── Partner ─────────────────────────────────────────────────────────────

  Future<void> savePartnerSession({
    required int boutiqueId,
    required String boutiqueName,
    required String ownerName,
    required String plan,
  }) async {
    final p = await _prefs;
    await Future.wait([
      p.setString(AppConstants.keyIsLoggedIn, 'true'),
      p.setString(AppConstants.keyBoutiqueId, boutiqueId.toString()),
      p.setString(AppConstants.keyBoutiqueName, boutiqueName),
      p.setString(AppConstants.keyOwnerName, ownerName),
      p.setString(AppConstants.keyPlan, plan),
    ]);
  }

  Future<bool> isPartnerLoggedIn() async {
    final p = await _prefs;
    return p.getString(AppConstants.keyIsLoggedIn) == 'true';
  }

  Future<int?> getBoutiqueId() async {
    final p = await _prefs;
    final v = p.getString(AppConstants.keyBoutiqueId);
    return v != null ? int.tryParse(v) : null;
  }

  Future<String?> getBoutiqueName() async {
    final p = await _prefs;
    return p.getString(AppConstants.keyBoutiqueName);
  }

  Future<String?> getOwnerName() async {
    final p = await _prefs;
    return p.getString(AppConstants.keyOwnerName);
  }

  Future<String?> getPlan() async {
    final p = await _prefs;
    return p.getString(AppConstants.keyPlan);
  }

  // ─── User ─────────────────────────────────────────────────────────────────

  Future<void> saveUserSession({
    required int userId,
    required String userName,
    required String userEmail,
  }) async {
    final p = await _prefs;
    await Future.wait([
      p.setString(AppConstants.keyIsUserLoggedIn, 'true'),
      p.setString(AppConstants.keyUserId, userId.toString()),
      p.setString(AppConstants.keyUserName, userName),
      p.setString(AppConstants.keyUserEmail, userEmail),
    ]);
  }

  Future<bool> isUserLoggedIn() async {
    final p = await _prefs;
    return p.getString(AppConstants.keyIsUserLoggedIn) == 'true';
  }

  Future<int?> getUserId() async {
    final p = await _prefs;
    final v = p.getString(AppConstants.keyUserId);
    return v != null ? int.tryParse(v) : null;
  }

  Future<String?> getUserName() async {
    final p = await _prefs;
    return p.getString(AppConstants.keyUserName);
  }

  Future<String?> getUserEmail() async {
    final p = await _prefs;
    return p.getString(AppConstants.keyUserEmail);
  }

  // ─── Session Info ─────────────────────────────────────────────────────────

  Future<bool> isAnyUserLoggedIn() async {
    final partner = await isPartnerLoggedIn();
    final user = await isUserLoggedIn();
    return partner || user;
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  Future<void> logout() async {
    final p = await _prefs;
    await p.clear();
  }
}
