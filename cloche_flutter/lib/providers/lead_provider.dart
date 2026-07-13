import 'package:flutter/foundation.dart';
import '../services/api_service.dart';
import '../models/models.dart';

class LeadProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<LeadModel> _leads = [];
  bool _loading = false;
  String? _error;
  bool _submitting = false;
  String? _submitSuccess;

  List<LeadModel> get leads => _leads;
  bool get loading => _loading;
  String? get error => _error;
  bool get submitting => _submitting;
  String? get submitSuccess => _submitSuccess;

  Future<void> loadLeads(int boutiqueId) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final raw = await _api.getBoutiqueLeads(boutiqueId);
      _leads = raw.map((j) => LeadModel.fromJson(j as Map<String, dynamic>)).toList();
    } catch (e) {
      _error = e.toString();
    }
    _loading = false;
    notifyListeners();
  }

  Future<bool> submitEnquiry(Map<String, dynamic> body) async {
    _submitting = true;
    _error = null;
    _submitSuccess = null;
    notifyListeners();
    try {
      final data = await _api.submitEnquiry(body);
      _submitSuccess = data['message'] ?? 'Enquiry submitted successfully.';
      _submitting = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _submitting = false;
      notifyListeners();
      return false;
    }
  }

  void clearSubmitState() {
    _submitSuccess = null;
    _error = null;
    notifyListeners();
  }
}
