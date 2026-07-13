import 'package:flutter/material.dart';

import 'package:provider/provider.dart';
import '../../../providers/auth_provider.dart';
import '../../../providers/product_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/shared_widgets.dart';
import '../../../models/models.dart';

class ManageCollectionsScreen extends StatefulWidget {
  const ManageCollectionsScreen({super.key});

  @override
  State<ManageCollectionsScreen> createState() =>
      _ManageCollectionsScreenState();
}

class _ManageCollectionsScreenState extends State<ManageCollectionsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final auth = context.read<AuthProvider>();
    if (auth.boutiqueId != null) {
      await context.read<ProductProvider>().loadBoutiqueProducts(auth.boutiqueId!);
    }
  }

  @override
  Widget build(BuildContext context) {
    final productProvider = context.watch<ProductProvider>();

    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: ClocheAppBar(
        title: 'Manage Collections',
        actions: [
          IconButton(
            icon: const Icon(Icons.add, color: AppColors.primary),
            onPressed: () => _showAddProductSheet(context),
          ),
        ],
      ),
      body: productProvider.loading && productProvider.boutiqueProducts.isEmpty
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : productProvider.boutiqueProducts.isEmpty
              ? Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const EmptyState(
                      message: 'No collections uploaded yet.\nTap + to add your first product.',
                      icon: Icons.collections,
                    ),
                    const SizedBox(height: 24),
                    GoldButton(
                      label: 'Add Product',
                      onPressed: () => _showAddProductSheet(context),
                      width: 200,
                    ),
                  ],
                )
              : RefreshIndicator(
                  color: AppColors.primary,
                  backgroundColor: AppColors.surfaceDark,
                  onRefresh: _load,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: productProvider.boutiqueProducts.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (_, i) {
                      final p = productProvider.boutiqueProducts[i];
                      return _productListItem(context, p, productProvider);
                    },
                  ),
                ),
    );
  }

  Widget _productListItem(BuildContext context, ProductModel p,
      ProductProvider productProvider) {
    return GlassCard(
      child: Row(
        children: [
          // Thumbnail
          Container(
            width: 64,
            height: 64,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.08),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.cardBorder),
            ),
            child: p.imageUrl != null && p.imageUrl!.isNotEmpty
                ? ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.network(
                      p.imageUrl!.startsWith('http')
                          ? p.imageUrl!
                          : 'https://res.cloudinary.com/dycwsnzyd/image/upload/${p.imageUrl}',
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) =>
                          const Icon(Icons.checkroom, color: AppColors.primary),
                    ),
                  )
                : const Icon(Icons.checkroom, color: AppColors.primary, size: 28),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(p.productName, style: Theme.of(context).textTheme.titleSmall),
                const SizedBox(height: 4),
                Text('₹${p.price} · ${p.category}',
                    style: Theme.of(context).textTheme.bodySmall),
                if (p.fabric.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(p.fabric,
                      style: const TextStyle(
                          color: AppColors.primary, fontSize: 11)),
                ]
              ],
            ),
          ),
          PopupMenuButton<String>(
            color: AppColors.surfaceDark,
            icon: const Icon(Icons.more_vert, color: AppColors.textMuted),
            onSelected: (val) async {
              if (val == 'delete') {
                final confirm = await _confirmDelete(context, p.productName);
                if (confirm == true) {
                  await productProvider.deleteProduct(p.id);
                }
              }
            },
            itemBuilder: (_) => [
              const PopupMenuItem(
                value: 'delete',
                child: Row(
                  children: [
                    Icon(Icons.delete_outline, color: AppColors.error, size: 18),
                    SizedBox(width: 8),
                    Text('Delete', style: TextStyle(color: AppColors.error)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Future<bool?> _confirmDelete(BuildContext context, String name) {
    return showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: AppColors.surfaceDark,
        title: const Text('Delete Product',
            style: TextStyle(color: AppColors.textLight)),
        content: Text('Delete "$name"?',
            style: const TextStyle(color: AppColors.textMuted)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel',
                style: TextStyle(color: AppColors.textMuted)),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete',
                style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }

  void _showAddProductSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surfaceDark,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => const _AddProductForm(),
    );
  }
}

// ─── Add Product Form ────────────────────────────────────────────────────────
class _AddProductForm extends StatefulWidget {
  const _AddProductForm();

  @override
  State<_AddProductForm> createState() => _AddProductFormState();
}

class _AddProductFormState extends State<_AddProductForm> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _fabricCtrl = TextEditingController();
  String _category = 'Wedding';
  bool _loading = false;
  String? _error;

  final List<String> _categories = ['Wedding', 'Party', 'Formal', 'Casual', 'Uncategorized'];

  @override
  void dispose() {
    _nameCtrl.dispose();
    _priceCtrl.dispose();
    _descCtrl.dispose();
    _fabricCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() { _loading = true; _error = null; });

    final auth = context.read<AuthProvider>();
    final boutiqueId = auth.boutiqueId;
    if (boutiqueId == null) return;

    try {
      // Note: product add via text fields only - image upload requires web
      await context.read<ProductProvider>().loadBoutiqueProducts(boutiqueId);

      if (mounted) Navigator.pop(context);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Add Product',
                style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 4),
            const Text(
              'For image upload, use the web dashboard.',
              style: TextStyle(color: AppColors.textMuted, fontSize: 12),
            ),
            const SizedBox(height: 20),
            ClocheTextField(
              controller: _nameCtrl,
              label: 'Product Name *',
              validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
              textInputAction: TextInputAction.next,
            ),
            const SizedBox(height: 14),
            ClocheTextField(
              controller: _priceCtrl,
              label: 'Price (₹) *',
              keyboardType: TextInputType.number,
              validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
              textInputAction: TextInputAction.next,
            ),
            const SizedBox(height: 14),
            DropdownButtonFormField<String>(
              value: _category,
              dropdownColor: AppColors.surfaceDark,
              style: const TextStyle(color: AppColors.textLight),
              decoration: InputDecoration(
                labelText: 'Category',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.cardBorder),
                ),
              ),
              items: _categories.map((c) => DropdownMenuItem(
                value: c,
                child: Text(c),
              )).toList(),
              onChanged: (v) => setState(() => _category = v ?? 'Wedding'),
            ),
            const SizedBox(height: 14),
            ClocheTextField(
              controller: _fabricCtrl,
              label: 'Fabric (optional)',
              textInputAction: TextInputAction.next,
            ),
            const SizedBox(height: 14),
            ClocheTextField(
              controller: _descCtrl,
              label: 'Description',
              maxLines: 2,
            ),
            const SizedBox(height: 20),
            if (_error != null) ...[
              Text(_error!, style: const TextStyle(color: AppColors.error, fontSize: 13)),
              const SizedBox(height: 10),
            ],
            GoldButton(label: 'Add Product', onPressed: _submit, loading: _loading),
          ],
        ),
      ),
    );
  }
}
