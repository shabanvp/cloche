import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../providers/auth_provider.dart';
import '../../../providers/boutique_provider.dart';
import '../../../providers/product_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/router/app_router.dart';
import '../../../widgets/shared_widgets.dart';


class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadData());
  }

  Future<void> _loadData() async {
    final boutiqueProvider = context.read<BoutiqueProvider>();
    final productProvider = context.read<ProductProvider>();
    await Future.wait([
      boutiqueProvider.loadBoutiques(),
      productProvider.loadAllProducts(),
    ]);
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: _buildBody(),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildBottomNav() {
    final auth = context.watch<AuthProvider>();
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surfaceDark,
        border: Border(
          top: BorderSide(color: AppColors.cardBorder, width: 0.5),
        ),
      ),
      child: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (i) => setState(() => _selectedIndex = i),
        backgroundColor: Colors.transparent,
        elevation: 0,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.textMuted,
        type: BottomNavigationBarType.fixed,
        items: [
          const BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Home',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.storefront_outlined),
            activeIcon: Icon(Icons.storefront),
            label: 'Boutiques',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: 'Search',
          ),
          const BottomNavigationBarItem(
            icon: Icon(Icons.collections_outlined),
            activeIcon: Icon(Icons.collections),
            label: 'Collections',
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.person_outline),
            activeIcon: const Icon(Icons.person),
            label: auth.isAuthenticated ? 'Profile' : 'Login',
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    switch (_selectedIndex) {
      case 0:
        return _HomeTab();
      case 1:
        return const _BoutiquesTab();
      case 2:
        return const _SearchTab();
      case 3:
        return const _CollectionsTab();
      case 4:
        return const _ProfileTab();
      default:
        return _HomeTab();
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME TAB
// ─────────────────────────────────────────────────────────────────────────────
class _HomeTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final boutiqueProvider = context.watch<BoutiqueProvider>();
    final productProvider = context.watch<ProductProvider>();

    return CustomScrollView(
      slivers: [
        // Hero SliverAppBar
        SliverAppBar(
          expandedHeight: 320,
          pinned: true,
          backgroundColor: AppColors.backgroundDark,
          flexibleSpace: FlexibleSpaceBar(
            background: Stack(
              fit: StackFit.expand,
              children: [
                // Background image
                Image.network(
                  'https://images.unsplash.com/photo-1583391733981-849840f3f1c2?q=80&w=1200&auto=format&fit=crop',
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    color: AppColors.surfaceDark,
                  ),
                ),
                // Gradient overlay
                const DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Color(0x4D0D0D0D),
                        Color(0x990D0D0D),
                        AppColors.backgroundDark,
                      ],
                    ),
                  ),
                ),
                // Content
                Positioned(
                  bottom: 32,
                  left: 0,
                  right: 0,
                  child: Column(
                    children: [
                      const Icon(Icons.diamond, color: AppColors.primary, size: 24),
                      const SizedBox(height: 8),
                      Text(
                        'CLOCHE',
                        style: Theme.of(context).textTheme.displayMedium?.copyWith(
                              fontSize: 36,
                              letterSpacing: 10,
                            ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'RENT LUXURY. FEEL ROYAL.',
                        style: TextStyle(
                          color: AppColors.primary,
                          letterSpacing: 4,
                          fontSize: 10,
                        ),
                      ),
                      const SizedBox(height: 20),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Row(
                          children: [
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () => context.push(AppRouter.enquiry),
                                child: const Text('GET WEDDING LOOK'),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: OutlinedButton(
                                onPressed: () =>
                                    context.push(AppRouter.partnerLogin),
                                child: const Text('LIST BOUTIQUE'),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          leading: const SizedBox(),
          actions: [
            IconButton(
              icon: const Icon(Icons.search, color: AppColors.textLight),
              onPressed: () => context.push(AppRouter.search),
            ),
          ],
        ),

        // Featured Boutiques
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 32, 20, 16),
            child: SectionHeader(
              label: 'Curation',
              title: 'Featured Boutiques',
              actionLabel: 'View All',
              onAction: () => context.push(AppRouter.boutiques),
            ),
          ),
        ),

        if (boutiqueProvider.state == LoadState.loading)
          const SliverToBoxAdapter(
            child: Center(
              child: Padding(
                padding: EdgeInsets.all(32),
                child: CircularProgressIndicator(color: AppColors.primary),
              ),
            ),
          )
        else if (boutiqueProvider.boutiques.isEmpty)
          const SliverToBoxAdapter(
            child: EmptyState(message: 'No boutiques available', icon: Icons.storefront),
          )
        else
          SliverToBoxAdapter(
            child: SizedBox(
              height: 280,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: boutiqueProvider.boutiques.take(6).length,
                separatorBuilder: (_, __) => const SizedBox(width: 14),
                itemBuilder: (context, i) {
                  final b = boutiqueProvider.boutiques[i];
                  final location = [b.area, b.district ?? b.city]
                      .where((s) => s != null && s.isNotEmpty)
                      .join(', ');
                  return SizedBox(
                    width: 180,
                    child: BoutiqueCard(
                      name: b.boutiqueName,
                      location: location,
                      imageUrl: b.imageUrl,
                      plan: b.plan,
                      onTap: () => context
                          .push('${AppRouter.boutiques}/${b.id}'),
                    ),
                  );
                },
              ),
            ),
          ),

        // Featured Collections
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 32, 20, 16),
            child: SectionHeader(
              label: 'Collections',
              title: 'Featured Collections',
              actionLabel: 'View All',
              onAction: () => context.push(AppRouter.collections),
            ),
          ),
        ),

        if (productProvider.loading)
          const SliverToBoxAdapter(
            child: Center(
              child: Padding(
                padding: EdgeInsets.all(32),
                child: CircularProgressIndicator(color: AppColors.primary),
              ),
            ),
          )
        else if (productProvider.products.isEmpty)
          const SliverToBoxAdapter(
            child: EmptyState(message: 'No collections available', icon: Icons.collections),
          )
        else
          SliverToBoxAdapter(
            child: SizedBox(
              height: 300,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: productProvider.products.take(6).length,
                separatorBuilder: (_, __) => const SizedBox(width: 14),
                itemBuilder: (context, i) {
                  final p = productProvider.products[i];
                  return SizedBox(
                    width: 180,
                    child: ProductCard(
                      name: p.productName,
                      price: p.price,
                      category: p.category,
                      imageUrl: p.imageUrl,
                      boutiqueName: p.boutiqueName,
                      onEnquire: () => context.push(
                        '${AppRouter.enquiry}?boutiqueId=${p.boutiqueId}&productName=${Uri.encodeComponent(p.productName)}&productImage=${Uri.encodeComponent(p.imageUrl ?? '')}',
                      ),
                    ),
                  );
                },
              ),
            ),
          ),

        // How it Works
        SliverToBoxAdapter(
          child: Container(
            margin: const EdgeInsets.fromLTRB(0, 32, 0, 0),
            color: AppColors.surfaceDark.withOpacity(0.5),
            padding: const EdgeInsets.all(28),
            child: Column(
              children: [
                const SectionHeader(
                  label: 'The Process',
                  title: 'The Royal Journey',
                ),
                const SizedBox(height: 24),
                ..._howItWorksSteps(context),
              ],
            ),
          ),
        ),

        const SliverToBoxAdapter(child: SizedBox(height: 40)),
      ],
    );
  }

  List<Widget> _howItWorksSteps(BuildContext context) {
    final steps = [
      (Icons.search, 'Discover', 'Explore designer collections from verified boutiques.'),
      (Icons.chat_bubble_outline, 'Message', 'Contact boutiques directly about your date.'),
      (Icons.support_agent, 'Get Connected', 'Our team connects you with boutiques.'),
      (Icons.storefront, 'Boutique Fulfilment', 'Boutique manages booking and delivery.'),
    ];
    return steps.map((s) => Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.primary.withOpacity(0.12),
              border: Border.all(color: AppColors.cardBorder),
            ),
            child: Icon(s.$1, color: AppColors.primary, size: 22),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(s.$2, style: Theme.of(context).textTheme.titleSmall),
                const SizedBox(height: 4),
                Text(s.$3, style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          ),
        ],
      ),
    )).toList();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BOUTIQUES TAB (redirect)
// ─────────────────────────────────────────────────────────────────────────────
class _BoutiquesTab extends StatelessWidget {
  const _BoutiquesTab();

  @override
  Widget build(BuildContext context) {
    // Full boutiques content is on its own screen; push from bottom nav
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.push(AppRouter.boutiques);
    });
    return const Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: Center(child: CircularProgressIndicator(color: AppColors.primary)),
    );
  }
}

class _SearchTab extends StatelessWidget {
  const _SearchTab();

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.push(AppRouter.search);
    });
    return const Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: Center(child: CircularProgressIndicator(color: AppColors.primary)),
    );
  }
}

class _CollectionsTab extends StatelessWidget {
  const _CollectionsTab();

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.push(AppRouter.collections);
    });
    return const Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: Center(child: CircularProgressIndicator(color: AppColors.primary)),
    );
  }
}

class _ProfileTab extends StatelessWidget {
  const _ProfileTab();

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthProvider>();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (auth.isAuthenticated) {
        if (auth.isPartner) {
          context.push(AppRouter.partnerDashboard);
        } else {
          context.push(AppRouter.userProfile);
        }
      } else {
        context.push(AppRouter.login);
      }
    });
    return const Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: Center(child: CircularProgressIndicator(color: AppColors.primary)),
    );
  }
}
