import 'package:flutter/foundation.dart';
import '../services/api_service.dart';
import '../models/models.dart';

enum LoadState { idle, loading, loaded, error }

class BoutiqueProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<BoutiqueModel> _boutiques = [];
  List<BoutiqueModel> _filtered = [];
  BoutiqueModel? _selected;
  LoadState _state = LoadState.idle;
  String? _error;

  // Filter state
  String _searchQuery = '';
  String _selectedDistrict = '';
  String _selectedArea = '';

  List<BoutiqueModel> get boutiques => _boutiques;
  List<BoutiqueModel> get filtered => _filtered;
  BoutiqueModel? get selected => _selected;
  LoadState get state => _state;
  String? get error => _error;
  String get searchQuery => _searchQuery;
  String get selectedDistrict => _selectedDistrict;
  String get selectedArea => _selectedArea;

  List<String> get availableDistricts {
    final districts = _boutiques
        .map((b) => b.district ?? b.city)
        .where((d) => d.isNotEmpty)
        .cast<String>()
        .toSet()
        .toList();
    districts.sort();
    return districts;
  }

  Future<void> loadBoutiques({bool force = false}) async {
    if (_state == LoadState.loading) return;
    if (_state == LoadState.loaded && !force) return;

    _state = LoadState.loading;
    _error = null;
    notifyListeners();

    try {
      final raw = await _api.getAllBoutiques();
      _boutiques = raw.map((j) => BoutiqueModel.fromJson(j as Map<String, dynamic>)).toList();
      _applyFilters();
      _state = LoadState.loaded;
    } catch (e) {
      _error = e.toString();
      _state = LoadState.error;
    }
    notifyListeners();
  }

  Future<void> loadBoutiqueDetails(int boutiqueId) async {
    _state = LoadState.loading;
    notifyListeners();
    try {
      final raw = await _api.getBoutiqueDetails(boutiqueId);
      _selected = BoutiqueModel.fromJson(raw);
      _state = LoadState.loaded;
    } catch (e) {
      _error = e.toString();
      _state = LoadState.error;
    }
    notifyListeners();
  }

  void setSearch(String query) {
    _searchQuery = query;
    _applyFilters();
    notifyListeners();
  }

  void setDistrict(String district) {
    _selectedDistrict = district;
    _applyFilters();
    notifyListeners();
  }

  void setArea(String area) {
    _selectedArea = area;
    _applyFilters();
    notifyListeners();
  }

  void clearFilters() {
    _searchQuery = '';
    _selectedDistrict = '';
    _selectedArea = '';
    _filtered = List.from(_boutiques);
    notifyListeners();
  }

  void _applyFilters() {
    _filtered = _boutiques.where((b) {
      final q = _searchQuery.toLowerCase();
      final matchesSearch = q.isEmpty ||
          b.boutiqueName.toLowerCase().contains(q) ||
          (b.city.toLowerCase().contains(q)) ||
          (b.district?.toLowerCase().contains(q) ?? false) ||
          (b.area?.toLowerCase().contains(q) ?? false);

      final matchesDistrict = _selectedDistrict.isEmpty ||
          (b.district?.toLowerCase() == _selectedDistrict.toLowerCase()) ||
          (b.city.toLowerCase().contains(_selectedDistrict.toLowerCase()));

      final matchesArea = _selectedArea.isEmpty ||
          (b.area?.toLowerCase().contains(_selectedArea.toLowerCase()) ?? false);

      return matchesSearch && matchesDistrict && matchesArea;
    }).toList();
  }
}
