import 'package:flutter/foundation.dart';
import '../services/api_service.dart';
import '../models/models.dart';

class ProductProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<ProductModel> _products = [];
  List<ProductModel> _boutiqueProducts = [];
  ProductModel? _selectedProduct;
  bool _loading = false;
  String? _error;

  List<ProductModel> get products => _products;
  List<ProductModel> get boutiqueProducts => _boutiqueProducts;
  ProductModel? get selectedProduct => _selectedProduct;
  bool get loading => _loading;
  String? get error => _error;

  Future<void> loadAllProducts() async {
    if (_loading) return;
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final raw = await _api.getAllProducts();
      _products = raw
          .map((j) => ProductModel.fromJson(j as Map<String, dynamic>))
          .toList();
    } catch (e) {
      _error = e.toString();
    }
    _loading = false;
    notifyListeners();
  }

  Future<void> loadBoutiqueProducts(int boutiqueId) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final raw = await _api.getBoutiqueProducts(boutiqueId);
      _boutiqueProducts = raw
          .map((j) => ProductModel.fromJson(j as Map<String, dynamic>))
          .toList();
    } catch (e) {
      _error = e.toString();
    }
    _loading = false;
    notifyListeners();
  }

  Future<void> loadProductDetails(int productId) async {
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      final raw = await _api.getProductDetails(productId);
      _selectedProduct = ProductModel.fromJson(raw);
    } catch (e) {
      _error = e.toString();
    }
    _loading = false;
    notifyListeners();
  }

  Future<bool> deleteProduct(int productId) async {
    try {
      await _api.deleteProduct(productId);
      _boutiqueProducts.removeWhere((p) => p.id == productId);
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  void clearBoutiqueProducts() {
    _boutiqueProducts = [];
    notifyListeners();
  }
}
