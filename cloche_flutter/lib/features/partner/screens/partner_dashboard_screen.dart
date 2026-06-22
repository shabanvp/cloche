import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../providers/auth_provider.dart';
import '../../../services/api_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/router/app_router.dart';
import '../../../widgets/shared_widgets.dart';

class PartnerDashboardScreen extends StatefulWidget {
  const PartnerDashboardScreen({super.key});

  @override
  State<PartnerDashboardScreen> createState() => _PartnerDashboardScreenState();
}

class _PartnerDashboardScreenState extends State<PartnerDashboardScreen> {
  Map<String, dynamic> _dashboard = {};
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final auth = context.read<AuthProvider>();
    final boutiqueId = auth.boutiqueId;
    if (boutiqueId == null) return;

    try {
      final data = await ApiService().getDashboard(boutiqueId);
      if (mounted) setState(() { _dashboard = data; _loading = false; });
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    if (!auth.isAuthenticated || !auth.isPartner) {
      return const Scaffold(
        backgroundColor: AppColors.backgroundDark,
        body: Center(child: CircularProgressIndicator(color: AppColors.primary)),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: ClocheAppBar(
        showLogo: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: AppColors.textMuted),
            onPressed: () async {
              await auth.logout();
              if (mounted) context.go(AppRouter.home);
            },
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : RefreshIndicator(
              color: AppColors.primary,
              backgroundColor: AppColors.surfaceDark,
              onRefresh: _load,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Greeting
                    Text(
                      'Welcome back,',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textMuted,
                          ),
                    ),
                    Text(
                      auth.boutiqueName ?? auth.ownerName ?? 'Partner',
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    const SizedBox(height: 4),
                    _planBadge(auth.plan ?? 'Basic'),
                    const SizedBox(height: 24),

                    // Stats
                    Row(
                      children: [
                        _statCard(context, 'Products',
                            _dashboard['productCount']?.toString() ?? '—',
                            Icons.collections),
                        const SizedBox(width: 12),
                        _statCard(context, 'New Leads',
                            _dashboard['newLeadCount']?.toString() ?? '—',
                            Icons.inbox),
                        const SizedBox(width: 12),
                        _statCard(context, 'Total Leads',
                            _dashboard['totalLeadCount']?.toString() ?? '—',
                            Icons.people),
                      ],
                    ),
                    const SizedBox(height: 28),

                    // Quick Actions
                    Text('Quick Actions',
                        style: Theme.of(context).textTheme.titleMedium),
                    const SizedBox(height: 14),
                    _actionItem(context, Icons.collections, 'Manage Collections',
                        'View and add products', AppRouter.manageCollections),
                    _actionItem(context, Icons.inbox, 'View Leads',
                        'See enquiries from users', AppRouter.viewLeads),
                    _actionItem(context, Icons.person, 'Manage Profile',
                        'Update boutique info', AppRouter.manageProfile),
                    const SizedBox(height: 24),

                    // Plan info
                    GlassCard(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.workspace_premium,
                                  color: AppColors.primary, size: 20),
                              const SizedBox(width: 8),
                              Text('Your Plan',
                                  style: Theme.of(context).textTheme.titleSmall),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            auth.plan ?? 'Basic',
                            style: const TextStyle(
                              color: AppColors.primary,
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Upgrade your plan to unlock more leads and premium visibility.',
                            style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                          ),
                          const SizedBox(height: 16),
                          GoldButton(
                            label: 'Upgrade Plan',
                            onPressed: () {},
                            width: 160,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _planBadge(String plan) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.12),
        borderRadius: BorderRadius.circular(100),
        border: Border.all(color: AppColors.primary.withOpacity(0.4)),
      ),
      child: Text(
        plan.toUpperCase(),
        style: const TextStyle(
          color: AppColors.primary,
          fontSize: 10,
          letterSpacing: 2,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _statCard(
      BuildContext context, String label, String value, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
        decoration: BoxDecoration(
          color: AppColors.surfaceDark,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppColors.primary, size: 20),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                color: AppColors.textLight,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(label, style: Theme.of(context).textTheme.labelSmall),
          ],
        ),
      ),
    );
  }

  Widget _actionItem(BuildContext context, IconData icon, String title,
      String subtitle, String route) {
    return GestureDetector(
      onTap: () => context.push(route),
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: AppColors.surfaceDark,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: AppColors.primary, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: Theme.of(context).textTheme.titleSmall),
                  const SizedBox(height: 2),
                  Text(subtitle, style: Theme.of(context).textTheme.bodySmall),
                ],
              ),
            ),
            const Icon(Icons.chevron_right,
                color: AppColors.textMuted, size: 18),
          ],
        ),
      ),
    );
  }
}
