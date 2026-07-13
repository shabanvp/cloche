import 'package:flutter/foundation.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';


enum AuthStatus { initial, loading, authenticated, unauthenticated, error }

class AuthProvider extends ChangeNotifier {
  final ApiService _api = ApiService();
  final AuthService _auth = AuthService();

  AuthStatus _status = AuthStatus.initial;
  String? _error;
  bool _isPartner = false;
  int? _boutiqueId;
  String? _boutiqueName;
  String? _ownerName;
  String? _plan;
  int? _userId;
  String? _userName;
  String? _userEmail;

  AuthStatus get status => _status;
  String? get error => _error;
  bool get isPartner => _isPartner;
  int? get boutiqueId => _boutiqueId;
  String? get boutiqueName => _boutiqueName;
  String? get ownerName => _ownerName;
  String? get plan => _plan;
  int? get userId => _userId;
  String? get userName => _userName;
  String? get userEmail => _userEmail;
  bool get isAuthenticated => _status == AuthStatus.authenticated;

  Future<void> checkSession() async {
    _status = AuthStatus.loading;
    notifyListeners();

    final isPartner = await _auth.isPartnerLoggedIn();
    final isUser = await _auth.isUserLoggedIn();

    if (isPartner) {
      _isPartner = true;
      _boutiqueId = await _auth.getBoutiqueId();
      _boutiqueName = await _auth.getBoutiqueName();
      _ownerName = await _auth.getOwnerName();
      _plan = await _auth.getPlan();
      _status = AuthStatus.authenticated;
    } else if (isUser) {
      _isPartner = false;
      _userId = await _auth.getUserId();
      _userName = await _auth.getUserName();
      _userEmail = await _auth.getUserEmail();
      _status = AuthStatus.authenticated;
    } else {
      _status = AuthStatus.unauthenticated;
    }
    notifyListeners();
  }

  Future<bool> partnerLogin(String identifier, String password) async {
    _status = AuthStatus.loading;
    _error = null;
    notifyListeners();

    try {
      final data = await _api.partnerLogin(identifier, password);
      if (data['success'] == true) {
        final boutiqueId = data['boutiqueId'] as int? ??
            int.tryParse(data['boutiqueId']?.toString() ?? '0') ?? 0;
        await _auth.savePartnerSession(
          boutiqueId: boutiqueId,
          boutiqueName: data['boutiqueName'] ?? '',
          ownerName: data['ownerName'] ?? '',
          plan: data['plan'] ?? 'Basic',
        );
        _isPartner = true;
        _boutiqueId = boutiqueId;
        _boutiqueName = data['boutiqueName'];
        _ownerName = data['ownerName'];
        _plan = data['plan'];
        _status = AuthStatus.authenticated;
        notifyListeners();
        return true;
      }
      _error = data['message'] ?? 'Login failed';
      _status = AuthStatus.error;
      notifyListeners();
      return false;
    } catch (e) {
      _error = _extractError(e);
      _status = AuthStatus.error;
      notifyListeners();
      return false;
    }
  }

  Future<bool> userLogin(String email, String password) async {
    _status = AuthStatus.loading;
    _error = null;
    notifyListeners();

    try {
      final data = await _api.userLogin(email, password);
      if (data['success'] == true) {
        final userId = data['userId'] as int? ??
            int.tryParse(data['userId']?.toString() ?? '0') ?? 0;
        await _auth.saveUserSession(
          userId: userId,
          userName: data['name'] ?? '',
          userEmail: data['email'] ?? '',
        );
        _isPartner = false;
        _userId = userId;
        _userName = data['name'];
        _userEmail = data['email'];
        _status = AuthStatus.authenticated;
        notifyListeners();
        return true;
      }
      _error = data['message'] ?? 'Login failed';
      _status = AuthStatus.error;
      notifyListeners();
      return false;
    } catch (e) {
      _error = _extractError(e);
      _status = AuthStatus.error;
      notifyListeners();
      return false;
    }
  }

  Future<Map<String, dynamic>> signup(Map<String, dynamic> body) async {
    _status = AuthStatus.loading;
    _error = null;
    notifyListeners();
    try {
      final data = await _api.signup(body);
      _status = AuthStatus.unauthenticated;
      notifyListeners();
      return data;
    } catch (e) {
      _error = _extractError(e);
      _status = AuthStatus.error;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> logout() async {
    await _auth.logout();
    _status = AuthStatus.unauthenticated;
    _isPartner = false;
    _boutiqueId = null;
    _boutiqueName = null;
    _ownerName = null;
    _plan = null;
    _userId = null;
    _userName = null;
    _userEmail = null;
    notifyListeners();
  }

  String _extractError(dynamic e) {
    if (e is Exception) {
      final msg = e.toString();
      final match = RegExp(r'"message":"([^"]+)"').firstMatch(msg);
      if (match != null) return match.group(1) ?? msg;
      return msg.replaceAll('Exception: ', '');
    }
    return e.toString();
  }
}
