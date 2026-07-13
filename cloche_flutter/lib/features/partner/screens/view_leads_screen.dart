import 'package:flutter/material.dart';

import 'package:provider/provider.dart';
import '../../../providers/auth_provider.dart';
import '../../../providers/lead_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/shared_widgets.dart';
import '../../../models/models.dart';
import 'package:intl/intl.dart';

class ViewLeadsScreen extends StatefulWidget {
  const ViewLeadsScreen({super.key});

  @override
  State<ViewLeadsScreen> createState() => _ViewLeadsScreenState();
}

class _ViewLeadsScreenState extends State<ViewLeadsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final auth = context.read<AuthProvider>();
    if (auth.boutiqueId != null) {
      await context.read<LeadProvider>().loadLeads(auth.boutiqueId!);
    }
  }

  @override
  Widget build(BuildContext context) {
    final lead = context.watch<LeadProvider>();

    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: const ClocheAppBar(title: 'Leads & Enquiries'),
      body: lead.loading && lead.leads.isEmpty
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : lead.error != null
              ? ErrorView(
                  message: lead.error!,
                  onRetry: _load,
                )
              : lead.leads.isEmpty
                  ? const EmptyState(
                      message: 'No leads yet.\nSubmitted enquiries will appear here.',
                      icon: Icons.inbox,
                    )
                  : RefreshIndicator(
                      color: AppColors.primary,
                      backgroundColor: AppColors.surfaceDark,
                      onRefresh: _load,
                      child: ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: lead.leads.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (_, i) => _leadCard(context, lead.leads[i]),
                      ),
                    ),
    );
  }

  Widget _leadCard(BuildContext context, LeadModel lead) {
    final statusColor = _statusColor(lead.status);

    return GlassCard(
      onTap: () => _showLeadDetails(context, lead),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(lead.name,
                    style: Theme.of(context).textTheme.titleSmall),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(100),
                  border: Border.all(color: statusColor.withOpacity(0.4)),
                ),
                child: Text(
                  lead.status,
                  style: TextStyle(
                    color: statusColor,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (lead.phone.isNotEmpty)
            Row(
              children: [
                const Icon(Icons.phone, size: 14, color: AppColors.textMuted),
                const SizedBox(width: 6),
                Text(lead.phone, style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          if (lead.preferredLocation != null && lead.preferredLocation!.isNotEmpty) ...[
            const SizedBox(height: 4),
            Row(
              children: [
                const Icon(Icons.location_on, size: 14, color: AppColors.primary),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(lead.preferredLocation!,
                      style: Theme.of(context).textTheme.bodySmall),
                ),
              ],
            ),
          ],
          if (lead.weddingDate != null && lead.weddingDate!.isNotEmpty) ...[
            const SizedBox(height: 4),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 14, color: AppColors.textMuted),
                const SizedBox(width: 6),
                Text('Wedding: ${lead.weddingDate}',
                    style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          ],
          if (lead.createdAt != null) ...[
            const SizedBox(height: 8),
            const GoldDivider(),
            const SizedBox(height: 8),
            Text(
              _formatDate(lead.createdAt!),
              style: const TextStyle(color: AppColors.textMuted, fontSize: 10),
            ),
          ],
        ],
      ),
    );
  }

  void _showLeadDetails(BuildContext context, LeadModel lead) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surfaceDark,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.7,
        builder: (_, ctrl) => SingleChildScrollView(
          controller: ctrl,
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Lead Details',
                  style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 20),
              _detailRow(context, 'Name', lead.name),
              _detailRow(context, 'Phone', lead.phone),
              if (lead.email.isNotEmpty) _detailRow(context, 'Email', lead.email),
              if (lead.weddingDate != null)
                _detailRow(context, 'Wedding Date', lead.weddingDate!),
              if (lead.preferredLocation != null)
                _detailRow(context, 'Location', lead.preferredLocation!),
              if (lead.requirement != null)
                _detailRow(context, 'Requirement', lead.requirement!),
              if (lead.specialRequirement != null &&
                  lead.specialRequirement!.isNotEmpty)
                _detailRow(
                    context, 'Special Request', lead.specialRequirement!),
              if (lead.productName != null && lead.productName!.isNotEmpty)
                _detailRow(context, 'Product', lead.productName!),
              const SizedBox(height: 20),
              GoldButton(
                label: 'Call ${lead.name.split(' ').first}',
                onPressed: () {},
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _detailRow(BuildContext context, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label.toUpperCase(),
              style: const TextStyle(
                  color: AppColors.primary,
                  fontSize: 10,
                  letterSpacing: 1.5,
                  fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(value, style: Theme.of(context).textTheme.bodyMedium),
        ],
      ),
    );
  }

  Color _statusColor(String status) {
    switch (status.toUpperCase()) {
      case 'NEW':
        return AppColors.success;
      case 'PENDING':
        return AppColors.primary;
      case 'SENT':
      case 'DIRECT':
        return Colors.blue;
      default:
        return AppColors.textMuted;
    }
  }

  String _formatDate(String iso) {
    try {
      final date = DateTime.parse(iso);
      return DateFormat('d MMM yyyy, h:mm a').format(date.toLocal());
    } catch (_) {
      return iso;
    }
  }
}
