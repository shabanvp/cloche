import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/auth_provider.dart';
import '../../../services/api_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/shared_widgets.dart';

class ManageProfileScreen extends StatefulWidget {
  const ManageProfileScreen({super.key});

  @override
  State<ManageProfileScreen> createState() => _ManageProfileScreenState();
}

class _ManageProfileScreenState extends State<ManageProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  final _ownerNameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _cityCtrl = TextEditingController();
  final _shopLocationCtrl = TextEditingController();
  bool _loading = true;
  bool _saving = false;
  String? _error;
  Map<String, dynamic> _profile = {};

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final auth = context.read<AuthProvider>();
    if (auth.boutiqueId == null) return;
    try {
      final data = await ApiService().getBoutiqueProfile(auth.boutiqueId!);
      if (mounted) {
        setState(() {
          _profile = data;
          _ownerNameCtrl.text = data['owner_name'] ?? '';
          _emailCtrl.text = data['email'] ?? '';
          _phoneCtrl.text = data['phone'] ?? '';
          _cityCtrl.text = data['city'] ?? '';
          _shopLocationCtrl.text = data['shop_location'] ?? '';
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() { _error = e.toString(); _loading = false; });
    }
  }

  Future<void> _save() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final auth = context.read<AuthProvider>();
    if (auth.boutiqueId == null) return;

    setState(() { _saving = true; _error = null; });
    try {
      await ApiService().updateBoutiqueProfile(auth.boutiqueId!, {
        'owner_name': _ownerNameCtrl.text.trim(),
        'phone': _phoneCtrl.text.trim(),
        'city': _cityCtrl.text.trim(),
        'shop_location': _shopLocationCtrl.text.trim(),
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile updated successfully'),
            backgroundColor: AppColors.success,
          ),
        );
      }
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  void dispose() {
    _ownerNameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _cityCtrl.dispose();
    _shopLocationCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: const ClocheAppBar(title: 'Manage Profile'),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Boutique name (read only)
                    if (_profile['boutique_name'] != null) ...[
                      Text('Boutique Name',
                          style: Theme.of(context).textTheme.bodySmall),
                      const SizedBox(height: 6),
                      Text(_profile['boutique_name'].toString(),
                          style: Theme.of(context)
                              .textTheme
                              .headlineSmall
                              ?.copyWith(color: AppColors.primary)),
                      const SizedBox(height: 24),
                    ],

                    ClocheTextField(
                      controller: _ownerNameCtrl,
                      label: 'Owner Name',
                      prefix: const Icon(Icons.person_outline,
                          color: AppColors.textMuted, size: 18),
                      validator: (v) =>
                          (v == null || v.isEmpty) ? 'Required' : null,
                      textInputAction: TextInputAction.next,
                    ),
                    const SizedBox(height: 16),
                    ClocheTextField(
                      controller: _emailCtrl,
                      label: 'Email',
                      prefix: const Icon(Icons.mail_outline,
                          color: AppColors.textMuted, size: 18),
                      textInputAction: TextInputAction.next,
                    ),
                    const SizedBox(height: 16),
                    ClocheTextField(
                      controller: _phoneCtrl,
                      label: 'Phone',
                      keyboardType: TextInputType.phone,
                      prefix: const Icon(Icons.phone,
                          color: AppColors.textMuted, size: 18),
                      textInputAction: TextInputAction.next,
                    ),
                    const SizedBox(height: 16),
                    ClocheTextField(
                      controller: _cityCtrl,
                      label: 'City',
                      prefix: const Icon(Icons.location_city,
                          color: AppColors.textMuted, size: 18),
                      textInputAction: TextInputAction.next,
                    ),
                    const SizedBox(height: 16),
                    ClocheTextField(
                      controller: _shopLocationCtrl,
                      label: 'Shop Location / Address',
                      prefix: const Icon(Icons.location_on,
                          color: AppColors.textMuted, size: 18),
                      maxLines: 2,
                    ),
                    const SizedBox(height: 24),

                    // Plan info
                    GlassCard(
                      child: Row(
                        children: [
                          const Icon(Icons.workspace_premium,
                              color: AppColors.primary, size: 20),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Current Plan',
                                  style: TextStyle(
                                      color: AppColors.textMuted, fontSize: 11)),
                              Text(
                                _profile['plan']?.toString() ?? 'Basic',
                                style: const TextStyle(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    if (_error != null) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppColors.error.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                              color: AppColors.error.withOpacity(0.4)),
                        ),
                        child: Text(_error!,
                            style: const TextStyle(
                                color: AppColors.error, fontSize: 13)),
                      ),
                      const SizedBox(height: 16),
                    ],

                    GoldButton(
                      label: 'Save Profile',
                      onPressed: _save,
                      loading: _saving,
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
