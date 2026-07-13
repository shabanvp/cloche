import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../providers/boutique_provider.dart';
import '../../../providers/product_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/router/app_router.dart';
import '../../../widgets/shared_widgets.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabCtrl;
  final _searchCtrl = TextEditingController();
  String _query = '';

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<BoutiqueProvider>().loadBoutiques();
      context.read<ProductProvider>().loadAllProducts();
    });
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final boutiqueProvider = context.watch<BoutiqueProvider>();
    final productProvider = context.watch<ProductProvider>();

    final filteredBoutiques = _query.isEmpty
        ? boutiqueProvider.boutiques
        : boutiqueProvider.boutiques.where((b) {
            final q = _query.toLowerCase();
            return b.boutiqueName.toLowerCase().contains(q) ||
                (b.city.toLowerCase().contains(q)) ||
                (b.district?.toLowerCase().contains(q) ?? false);
          }).toList();

    final filteredProducts = _query.isEmpty
        ? productProvider.products
        : productProvider.products.where((p) {
            final q = _query.toLowerCase();
            return p.productName.toLowerCase().contains(q) ||
                p.category.toLowerCase().contains(q) ||
                (p.boutiqueName?.toLowerCase().contains(q) ?? false);
          }).toList();

    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: AppBar(
        backgroundColor: AppColors.surfaceDark,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textLight),
          onPressed: () => context.pop(),
        ),
        title: TextField(
          controller: _searchCtrl,
          autofocus: true,
          style: const TextStyle(color: AppColors.textLight, fontSize: 16),
          decoration: InputDecoration(
            hintText: 'Search boutiques, collections...',
            hintStyle: const TextStyle(color: AppColors.textMuted),
            border: InputBorder.none,
            enabledBorder: InputBorder.none,
            focusedBorder: InputBorder.none,
            fillColor: Colors.transparent,
            filled: true,
            suffixIcon: _query.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.close,
                        color: AppColors.textMuted, size: 18),
                    onPressed: () {
                      _searchCtrl.clear();
                      setState(() => _query = '');
                    },
                  )
                : null,
          ),
          onChanged: (v) => setState(() => _query = v),
        ),
        bottom: TabBar(
          controller: _tabCtrl,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textMuted,
          indicatorColor: AppColors.primary,
          tabs: [
            Tab(text: 'Boutiques (${filteredBoutiques.length})'),
            Tab(text: 'Collections (${filteredProducts.length})'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabCtrl,
        children: [
          // Boutiques tab
          _buildBoutiqueList(context, filteredBoutiques),
          // Collections tab
          _buildProductGrid(context, filteredProducts),
        ],
      ),
    );
  }

  Widget _buildBoutiqueList(BuildContext context, List list) {
    if (list.isEmpty) {
      return EmptyState(
        message: _query.isEmpty ? 'Start typing to search' : 'No boutiques found',
        icon: Icons.storefront,
      );
    }
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: list.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (_, i) {
        final b = list[i];
        final location = [b.area, b.district ?? b.city]
            .where((s) => s != null && s.isNotEmpty)
            .join(', ');
        return GlassCard(
          onTap: () => context.push('${AppRouter.boutiques}/${b.id}'),
          child: Row(
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.cardBorder),
                ),
                child: const Icon(Icons.diamond, color: AppColors.primary),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(b.boutiqueName,
                        style: Theme.of(context).textTheme.titleSmall),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.location_on,
                            size: 12, color: AppColors.primary),
                        const SizedBox(width: 4),
                        Text(location,
                            style: Theme.of(context).textTheme.bodySmall),
                      ],
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right,
                  color: AppColors.textMuted, size: 18),
            ],
          ),
        );
      },
    );
  }

  Widget _buildProductGrid(BuildContext context, List list) {
    if (list.isEmpty) {
      return EmptyState(
        message: _query.isEmpty ? 'Start typing to search' : 'No collections found',
        icon: Icons.collections,
      );
    }
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.65,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: list.length,
      itemBuilder: (_, i) {
        final p = list[i];
        return ProductCard(
          name: p.productName,
          price: p.price,
          category: p.category,
          imageUrl: p.imageUrl,
          boutiqueName: p.boutiqueName,
          onEnquire: () => context.push(
            '${AppRouter.enquiry}?boutiqueId=${p.boutiqueId}&productName=${Uri.encodeComponent(p.productName)}',
          ),
        );
      },
    );
  }
}
