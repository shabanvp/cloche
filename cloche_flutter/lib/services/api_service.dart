import 'package:dio/dio.dart';
import '../core/constants/app_constants.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  late final Dio _dio = Dio(
    BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: const Duration(seconds: 60),
      receiveTimeout: const Duration(seconds: 60),
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    ),
  )..interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          options.headers['Cache-Control'] = 'no-cache, no-store';
          handler.next(options);
        },
        onError: (error, handler) {
          handler.next(error);
        },
      ),
    );

  Dio get dio => _dio;

  // ─── Auth ────────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> signup(Map<String, dynamic> body,
      {FormData? formData}) async {
    final response = await _dio.post(
      '/api/auth/signup',
      data: formData ?? body,
      options: formData != null
          ? Options(contentType: 'multipart/form-data')
          : null,
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> partnerLogin(
      String identifier, String password) async {
    final response = await _dio.post('/api/auth/login', data: {
      'email': identifier,
      'password': password,
      'account_type': 'partner',
    });
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> userLogin(
      String email, String password) async {
    final response = await _dio.post('/api/auth/login-user', data: {
      'email': email,
      'password': password,
    });
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> forgotPassword(String email) async {
    final response = await _dio.post('/api/auth/forgot-password', data: {
      'email': email,
    });
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> resendVerification(String email) async {
    final response = await _dio.post('/api/auth/resend-verification', data: {
      'email': email,
    });
    return response.data as Map<String, dynamic>;
  }

  // ─── Profile ─────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> getBoutiqueProfile(int boutiqueId) async {
    final response =
        await _dio.get('/api/auth/profile/$boutiqueId');
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateBoutiqueProfile(
      int boutiqueId, Map<String, dynamic> body) async {
    final response =
        await _dio.put('/api/auth/profile/$boutiqueId', data: body);
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getDashboard(int boutiqueId) async {
    final response =
        await _dio.get('/api/auth/dashboard/$boutiqueId');
    return response.data as Map<String, dynamic>;
  }

  // ─── Boutiques ───────────────────────────────────────────────────────────

  Future<List<dynamic>> getAllBoutiques() async {
    final response = await _dio.get('/api/boutiques');
    return response.data as List<dynamic>;
  }

  Future<Map<String, dynamic>> getBoutiqueDetails(int boutiqueId) async {
    final response = await _dio.get('/api/boutiques/$boutiqueId');
    return response.data as Map<String, dynamic>;
  }

  // ─── Products ────────────────────────────────────────────────────────────

  Future<List<dynamic>> getAllProducts() async {
    final response = await _dio.get('/api/products');
    return response.data as List<dynamic>;
  }

  Future<List<dynamic>> getBoutiqueProducts(int boutiqueId) async {
    final response =
        await _dio.get('/api/products/boutique/$boutiqueId');
    return response.data as List<dynamic>;
  }

  Future<Map<String, dynamic>> getProductDetails(int productId) async {
    final response = await _dio.get('/api/products/$productId');
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> addProduct(
      FormData formData) async {
    final response = await _dio.post(
      '/api/products/add',
      data: formData,
      options: Options(contentType: 'multipart/form-data'),
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateProduct(
      int productId, Map<String, dynamic> body) async {
    final response =
        await _dio.put('/api/products/$productId', data: body);
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> deleteProduct(int productId) async {
    final response = await _dio.delete('/api/products/$productId');
    return response.data as Map<String, dynamic>;
  }

  // ─── Leads / Enquiries ───────────────────────────────────────────────────

  Future<Map<String, dynamic>> submitEnquiry(
      Map<String, dynamic> body) async {
    final response = await _dio.post('/api/leads/enquiry', data: body);
    return response.data as Map<String, dynamic>;
  }

  Future<List<dynamic>> getBoutiqueLeads(int boutiqueId) async {
    final response =
        await _dio.get('/api/leads/boutique/$boutiqueId');
    return response.data as List<dynamic>;
  }

  // ─── Showcase ────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> getShowcase(int boutiqueId) async {
    final response =
        await _dio.get('/api/auth/profile/$boutiqueId/showcase');
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateShowcase(
      int boutiqueId, Map<String, dynamic> body) async {
    final response = await _dio
        .put('/api/auth/profile/$boutiqueId/showcase', data: body);
    return response.data as Map<String, dynamic>;
  }
}
