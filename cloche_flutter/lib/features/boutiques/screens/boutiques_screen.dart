import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../providers/boutique_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/router/app_router.dart';
import '../../../widgets/shared_widgets.dart';

class BoutiquesScreen extends StatefulWidget {
  const BoutiquesScreen({super.key});

  @override
  State<BoutiquesScreen> createState() => _BoutiquesScreenState();
}

class _BoutiquesScreenState extends State<BoutiquesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<BoutiqueProvider>().loadBoutiques();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<BoutiqueProvider>();

    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: ClocheAppBar(
        title: 'Boutiques',
        actions: [
          IconButton(
            icon: const Icon(Icons.tune, color: AppColors.textLight),
            onPressed: () => _showFilterSheet(context, provider),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            child: TextField(
              style: const TextStyle(color: AppColors.textLight),
              decoration: InputDecoration(
                hintText: 'Search boutiques...',
                prefixIcon: const Icon(Icons.search, color: AppColors.textMuted, size: 20),
                suffixIcon: provider.searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.close, color: AppColors.textMuted, size: 18),
                        onPressed: () => provider.setSearch(''),
                      )
                    : null,
              ),
              onChanged: provider.setSearch,
            ),
          ),

          // Active filters
          if (provider.selectedDistrict.isNotEmpty)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: Row(
                children: [
                  _filterChip(provider.selectedDistrict, () => provider.setDistrict('')),
                ],
              ),
            ),

          const SizedBox(height: 8),

          // Results count
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                Text(
                  '${provider.filtered.length} boutiques',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),

          const SizedBox(height: 8),

          // Grid
          Expanded(
            child: _buildContent(context, provider),
          ),
        ],
      ),
    );
  }

  Widget _buildContent(BuildContext context, BoutiqueProvider provider) {
    if (provider.state == LoadState.loading && provider.boutiques.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.primary),
      );
    }

    if (provider.state == LoadState.error) {
      return ErrorView(
        message: provider.error ?? 'Failed to load boutiques',
        onRetry: () => provider.loadBoutiques(force: true),
      );
    }

    if (provider.filtered.isEmpty) {
      return const EmptyState(
        message: 'No boutiques found.\nTry adjusting your search or filters.',
        icon: Icons.storefront,
      );
    }

    return RefreshIndicator(
      color: AppColors.primary,
      backgroundColor: AppColors.surfaceDark,
      onRefresh: () => provider.loadBoutiques(force: true),
      child: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.65,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
        ),
        itemCount: provider.filtered.length,
        itemBuilder: (context, i) {
          final b = provider.filtered[i];
          final location = [b.area, b.district ?? b.city]
              .where((s) => s != null && s.isNotEmpty)
              .join(', ');
          return BoutiqueCard(
            name: b.boutiqueName,
            location: location,
            imageUrl: b.imageUrl,
            plan: b.plan,
            onTap: () => context.push('${AppRouter.boutiques}/${b.id}'),
          );
        },
      ),
    );
  }

  Widget _filterChip(String label, VoidCallback onRemove) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.15),
        borderRadius: BorderRadius.circular(100),
        border: Border.all(color: AppColors.primary.withOpacity(0.4)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: const TextStyle(color: AppColors.primary, fontSize: 12),
          ),
          const SizedBox(width: 6),
          GestureDetector(
            onTap: onRemove,
            child: const Icon(Icons.close, color: AppColors.primary, size: 14),
          ),
        ],
      ),
    );
  }

  void _showFilterSheet(BuildContext context, BoutiqueProvider provider) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surfaceDark,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Filter by District',
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: provider.availableDistricts.map((d) {
                final selected = provider.selectedDistrict == d;
                return GestureDetector(
                  onTap: () {
                    provider.setDistrict(selected ? '' : d);
                    Navigator.pop(ctx);
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: selected
                          ? AppColors.primary
                          : AppColors.primary.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(100),
                      border: Border.all(
                        color: selected
                            ? AppColors.primary
                            : AppColors.cardBorder,
                      ),
                    ),
                    child: Text(
                      d,
                      style: TextStyle(
                        color: selected
                            ? AppColors.backgroundDark
                            : AppColors.textLight,
                        fontSize: 13,
                        fontWeight: selected
                            ? FontWeight.bold
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 20),
            if (provider.selectedDistrict.isNotEmpty)
              GoldButton(
                label: 'Clear Filters',
                onPressed: () {
                  provider.clearFilters();
                  Navigator.pop(ctx);
                },
              ),
          ],
        ),
      ),
    );
  }
}
