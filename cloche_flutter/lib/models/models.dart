// ── Models barrel ──────────────────────────────────────────────────────────

// Boutique
class BoutiqueModel {
  final int id;
  final String boutiqueName;
  final String ownerName;
  final String email;
  final String phone;
  final String city;
  final String? district;
  final String? area;
  final String? plan;
  final String? imageUrl;
  final double? rating;
  final String? tags;
  final String? shopLocation;

  const BoutiqueModel({
    required this.id,
    required this.boutiqueName,
    required this.ownerName,
    required this.email,
    required this.phone,
    required this.city,
    this.district,
    this.area,
    this.plan,
    this.imageUrl,
    this.rating,
    this.tags,
    this.shopLocation,
  });

  factory BoutiqueModel.fromJson(Map<String, dynamic> json) {
    return BoutiqueModel(
      id: _parseInt(json['id']),
      boutiqueName: _str(json['boutique_name']),
      ownerName: _str(json['owner_name']),
      email: _str(json['email']),
      phone: _str(json['phone']),
      city: _str(json['city']),
      district: json['district'] as String?,
      area: json['area'] as String?,
      plan: json['plan'] as String?,
      imageUrl: json['image_url'] as String?,
      rating: _parseDouble(json['rating']),
      tags: json['tags'] as String?,
      shopLocation: json['shop_location'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'boutique_name': boutiqueName,
        'owner_name': ownerName,
        'email': email,
        'phone': phone,
        'city': city,
        'district': district,
        'area': area,
        'plan': plan,
        'image_url': imageUrl,
        'rating': rating,
        'tags': tags,
        'shop_location': shopLocation,
      };

  static int _parseInt(dynamic v) =>
      v is int ? v : int.tryParse(v?.toString() ?? '0') ?? 0;
  static double? _parseDouble(dynamic v) =>
      v == null ? null : double.tryParse(v.toString());
  static String _str(dynamic v) => (v ?? '').toString().trim();
}

// Product / Collection
class ProductModel {
  final int id;
  final String productName;
  final String price;
  final int stock;
  final int boutiqueId;
  final String category;
  final String description;
  final String fabric;
  final String location;
  final String? imageUrl;
  final List<String> gallery;
  final String? boutiqueName;
  final String? district;
  final String? area;
  final String? city;
  final double? showcaseRating;

  const ProductModel({
    required this.id,
    required this.productName,
    required this.price,
    required this.stock,
    required this.boutiqueId,
    required this.category,
    required this.description,
    required this.fabric,
    required this.location,
    this.imageUrl,
    this.gallery = const [],
    this.boutiqueName,
    this.district,
    this.area,
    this.city,
    this.showcaseRating,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: _parseInt(json['id']),
      productName: _str(json['product_name']),
      price: _str(json['price']),
      stock: _parseInt(json['stock']),
      boutiqueId: _parseInt(json['boutique_id']),
      category: _str(json['category']),
      description: _str(json['description']),
      fabric: _str(json['fabric']),
      location: _str(json['location']),
      imageUrl: json['image_url'] as String?,
      gallery: _parseStringList(json['gallery']),
      boutiqueName: json['boutique_name'] as String?,
      district: json['district'] as String?,
      area: json['area'] as String?,
      city: json['city'] as String? ?? json['boutique_city'] as String?,
      showcaseRating: _parseDouble(json['showcase_rating']),
    );
  }

  static int _parseInt(dynamic v) =>
      v is int ? v : int.tryParse(v?.toString() ?? '0') ?? 0;
  static double? _parseDouble(dynamic v) =>
      v == null ? null : double.tryParse(v.toString());
  static String _str(dynamic v) => (v ?? '').toString().trim();
  static List<String> _parseStringList(dynamic v) {
    if (v is List) return v.map((e) => e.toString()).toList();
    return [];
  }
}

// Auth / User
class UserModel {
  final int id;
  final String name;
  final String email;
  final String? createdAt;

  const UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        id: json['id'] is int
            ? json['id']
            : int.tryParse(json['id']?.toString() ?? '0') ?? 0,
        name: (json['name'] ?? '').toString(),
        email: (json['email'] ?? '').toString(),
        createdAt: json['created_at'] as String?,
      );
}

// Lead / Enquiry
class LeadModel {
  final int id;
  final String name;
  final String email;
  final String phone;
  final String? weddingDate;
  final String? preferredLocation;
  final String? requirement;
  final String? specialRequirement;
  final String status;
  final String? category;
  final String? productName;
  final String? productImage;
  final String? createdAt;

  const LeadModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    this.weddingDate,
    this.preferredLocation,
    this.requirement,
    this.specialRequirement,
    required this.status,
    this.category,
    this.productName,
    this.productImage,
    this.createdAt,
  });

  factory LeadModel.fromJson(Map<String, dynamic> json) => LeadModel(
        id: json['id'] is int
            ? json['id']
            : int.tryParse(json['id']?.toString() ?? '0') ?? 0,
        name: (json['name'] ?? '').toString(),
        email: (json['email'] ?? '').toString(),
        phone: (json['phone'] ?? '').toString(),
        weddingDate: json['wedding_date'] as String?,
        preferredLocation: json['preferred_location'] as String?,
        requirement: json['requirement'] as String?,
        specialRequirement: json['special_requirement'] as String?,
        status: (json['status'] ?? 'NEW').toString(),
        category: json['category'] as String?,
        productName: json['product_name'] as String?,
        productImage: json['product_image'] as String?,
        createdAt: json['created_at'] as String?,
      );
}
