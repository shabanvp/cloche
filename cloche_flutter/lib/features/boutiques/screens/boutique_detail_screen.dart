import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../providers/boutique_provider.dart';
import '../../../providers/product_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/router/app_router.dart';
import '../../../core/constants/app_constants.dart';
import '../../../widgets/shared_widgets.dart';
import '../../../models/models.dart';

class BoutiqueDetailScreen extends StatefulWidget {
  final String boutiqueId;
  const BoutiqueDetailScreen({super.key, required this.boutiqueId});

  @override
  State<BoutiqueDetailScreen> createState() => _BoutiqueDetailScreenState();
}

class _BoutiqueDetailScreenState extends State<BoutiqueDetailScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final id = int.tryParse(widget.boutiqueId);
    if (id == null) return;
    await Future.wait([
      context.read<BoutiqueProvider>().loadBoutiqueDetails(id),
      context.read<ProductProvider>().loadBoutiqueProducts(id),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    final boutiqueProvider = context.watch<BoutiqueProvider>();
    final productProvider = context.watch<ProductProvider>();
    final boutique = boutiqueProvider.selected;

    if (boutiqueProvider.state == LoadState.loading && boutique == null) {
      return const Scaffold(
        backgroundColor: AppColors.backgroundDark,
        body: Center(child: CircularProgressIndicator(color: AppColors.primary)),
      );
    }

    if (boutique == null) {
      return Scaffold(
        backgroundColor: AppColors.backgroundDark,
        appBar: ClocheAppBar(title: 'Boutique'),
        body: const ErrorView(message: 'Boutique not found'),
      );
    }

    final location = [boutique.area, boutique.district ?? boutique.city]
        .where((s) => s != null && s.isNotEmpty)
        .join(', ');

    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: CustomScrollView(
        slivers: [
          // Hero image with back button
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            backgroundColor: AppColors.backgroundDark,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: AppColors.white),
              onPressed: () => context.pop(),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.favorite_border, color: AppColors.white),
                onPressed: () {},
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: _buildHeroImage(boutique),
            ),
          ),

          // Boutique Info
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Name + Plan
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          boutique.boutiqueName,
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                      ),
                      if (boutique.plan != null)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(100),
                            border: Border.all(
                                color: AppColors.primary.withOpacity(0.4)),
                          ),
                          child: Text(
                            boutique.plan!.toUpperCase(),
                            style: const TextStyle(
                              color: AppColors.primary,
                              fontSize: 10,
                              letterSpacing: 1.5,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Location
                  Row(
                    children: [
                      const Icon(Icons.location_on,
                          color: AppColors.primary, size: 16),
                      const SizedBox(width: 6),
                      Text(location,
                          style: Theme.of(context).textTheme.bodyMedium),
                    ],
                  ),

                  // Rating
                  if (boutique.rating != null) ...[
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        ...List.generate(
                          5,
                          (i) => Icon(
                            i < (boutique.rating ?? 0).round()
                                ? Icons.star
                                : Icons.star_border,
                            color: AppColors.primary,
                            size: 16,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          boutique.rating!.toStringAsFixed(1),
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ],

                  // Tags
                  if (boutique.tags != null && boutique.tags!.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: boutique.tags!
                          .split(',')
                          .map((t) => _tag(t.trim()))
                          .toList(),
                    ),
                  ],

                  const SizedBox(height: 20),
                  const GoldDivider(),
                  const SizedBox(height: 20),

                  // CTA Buttons
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          icon: const Icon(Icons.edit_note, size: 18),
                          label: const Text('ENQUIRE'),
                          onPressed: () => context.push(
                            '${AppRouter.enquiry}?boutiqueId=${boutique.id}',
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton.icon(
                          icon: const Icon(Icons.chat_bubble_outline, size: 18),
                          label: const Text('MESSAGE'),
                          onPressed: () {},
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 28),

                  // Collections header
                  SectionHeader(
                    label: 'From this boutique',
                    title: 'Collections',
                  ),
                ],
              ),
            ),
          ),

          // Products grid
          if (productProvider.loading)
            const SliverToBoxAdapter(
              child: Center(
                child: Padding(
                  padding: EdgeInsets.all(32),
                  child: CircularProgressIndicator(color: AppColors.primary),
                ),
              ),
            )
          else if (productProvider.boutiqueProducts.isEmpty)
            const SliverToBoxAdapter(
              child: EmptyState(
                message: 'No collections uploaded yet',
                icon: Icons.collections,
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
              sliver: SliverGrid(
                delegate: SliverChildBuilderDelegate(
                  (ctx, i) {
                    final p = productProvider.boutiqueProducts[i];
                    return ProductCard(
                      name: p.productName,
                      price: p.price,
                      category: p.category,
                      imageUrl: p.imageUrl,
                      onEnquire: () => context.push(
                        '${AppRouter.enquiry}?boutiqueId=${boutique.id}&productName=${Uri.encodeComponent(p.productName)}&productImage=${Uri.encodeComponent(p.imageUrl ?? '')}',
                      ),
                    );
                  },
                  childCount: productProvider.boutiqueProducts.length,
                ),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.65,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildHeroImage(BoutiqueModel boutique) {
    final url = boutique.imageUrl;
    if (url != null && url.isNotEmpty) {
      final resolved = url.startsWith('http') ? url : '${AppConstants.cloudinaryBase}$url';
      return Stack(
        fit: StackFit.expand,
        children: [
          CachedNetworkImage(
            imageUrl: resolved,
            fit: BoxFit.cover,
            placeholder: (_, __) => Container(color: AppColors.surfaceDark),
            errorWidget: (_, __, ___) => _placeholderHero(boutique),
          ),
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Colors.transparent, Color(0xCC0D0D0D)],
              ),
            ),
          ),
        ],
      );
    }
    return _placeholderHero(boutique);
  }

  Widget _placeholderHero(BoutiqueModel boutique) {
    return Container(
      color: AppColors.surfaceDark,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.diamond, color: AppColors.primary, size: 48),
            const SizedBox(height: 8),
            Text(
              boutique.boutiqueName.isNotEmpty
                  ? boutique.boutiqueName[0].toUpperCase()
                  : 'C',
              style: const TextStyle(
                color: AppColors.primary,
                fontSize: 48,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _tag(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.08),
        borderRadius: BorderRadius.circular(100),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: AppColors.textMuted,
          fontSize: 11,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
