import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../providers/product_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/router/app_router.dart';
import '../../../widgets/shared_widgets.dart';

class CollectionsScreen extends StatefulWidget {
  const CollectionsScreen({super.key});

  @override
  State<CollectionsScreen> createState() => _CollectionsScreenState();
}

class _CollectionsScreenState extends State<CollectionsScreen> {
  String _selectedCategory = 'All';

  final List<String> _categories = [
    'All', 'Wedding', 'Party', 'Formal', 'Casual', 'Uncategorized'
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProductProvider>().loadAllProducts();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ProductProvider>();
    final filtered = _selectedCategory == 'All'
        ? provider.products
        : provider.products
            .where((p) => p.category.toLowerCase() == _selectedCategory.toLowerCase())
            .toList();

    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: const ClocheAppBar(title: 'Collections'),
      body: Column(
        children: [
          // Category filter chips
          SizedBox(
            height: 48,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              itemCount: _categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (_, i) {
                final c = _categories[i];
                final selected = _selectedCategory == c;
                return GestureDetector(
                  onTap: () => setState(() => _selectedCategory = c),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    decoration: BoxDecoration(
                      color: selected ? AppColors.primary : AppColors.surfaceDark,
                      borderRadius: BorderRadius.circular(100),
                      border: Border.all(
                        color: selected ? AppColors.primary : AppColors.cardBorder,
                      ),
                    ),
                    child: Text(
                      c,
                      style: TextStyle(
                        color: selected ? AppColors.backgroundDark : AppColors.textMuted,
                        fontSize: 12,
                        fontWeight: selected ? FontWeight.bold : FontWeight.normal,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // Count
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text('${filtered.length} items',
                  style: Theme.of(context).textTheme.bodySmall),
            ),
          ),

          Expanded(
            child: provider.loading && provider.products.isEmpty
                ? const Center(
                    child: CircularProgressIndicator(color: AppColors.primary))
                : filtered.isEmpty
                    ? const EmptyState(
                        message: 'No collections found', icon: Icons.collections)
                    : RefreshIndicator(
                        color: AppColors.primary,
                        backgroundColor: AppColors.surfaceDark,
                        onRefresh: () => provider.loadAllProducts(),
                        child: GridView.builder(
                          padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            childAspectRatio: 0.65,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                          ),
                          itemCount: filtered.length,
                          itemBuilder: (_, i) {
                            final p = filtered[i];
                            return ProductCard(
                              name: p.productName,
                              price: p.price,
                              category: p.category,
                              imageUrl: p.imageUrl,
                              boutiqueName: p.boutiqueName,
                              onEnquire: () => context.push(
                                '${AppRouter.enquiry}?boutiqueId=${p.boutiqueId}&productName=${Uri.encodeComponent(p.productName)}&productImage=${Uri.encodeComponent(p.imageUrl ?? '')}',
                              ),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}
