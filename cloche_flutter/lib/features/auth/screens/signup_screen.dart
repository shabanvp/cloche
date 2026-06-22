import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/router/app_router.dart';
import '../../../services/api_service.dart';
import '../../../widgets/shared_widgets.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _formKey = GlobalKey<FormState>();
  String _accountType = 'user';
  bool _loading = false;
  String? _error;
  bool _obscure = true;

  // User fields
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();

  // Partner extra fields
  final _boutiqueNameCtrl = TextEditingController();
  final _ownerNameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _cityCtrl = TextEditingController();
  final _districtCtrl = TextEditingController();

  @override
  void dispose() {
    for (final c in [
      _nameCtrl, _emailCtrl, _passwordCtrl,
      _boutiqueNameCtrl, _ownerNameCtrl, _phoneCtrl, _cityCtrl, _districtCtrl
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() { _loading = true; _error = null; });

    try {
      final body = <String, dynamic>{
        'account_type': _accountType,
        'email': _emailCtrl.text.trim(),
        'password': _passwordCtrl.text,
      };

      if (_accountType == 'user') {
        body['name'] = _nameCtrl.text.trim();
      } else {
        body['boutique_name'] = _boutiqueNameCtrl.text.trim();
        body['owner_name'] = _ownerNameCtrl.text.trim();
        body['phone'] = _phoneCtrl.text.trim();
        body['city'] = _cityCtrl.text.trim();
        body['district'] = _districtCtrl.text.trim();
        // Partner signup requires image; for MVP inform user to use web
      }

      final data = await ApiService().signup(body);
      if (!mounted) return;

      if (data['success'] == true) {
        _showSuccess(data['message'] ?? 'Account created successfully!');
      } else {
        setState(() => _error = data['message'] ?? 'Signup failed');
      }
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _showSuccess(String message) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: AppColors.surfaceDark,
        title: const Text('Success', style: TextStyle(color: AppColors.primary)),
        content: Text(message, style: const TextStyle(color: AppColors.textLight)),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              context.go(AppRouter.login);
            },
            child: const Text('Login Now', style: TextStyle(color: AppColors.primary)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textLight),
          onPressed: () => context.pop(),
        ),
        title: const Text('CREATE ACCOUNT',
            style: TextStyle(color: AppColors.textLight, letterSpacing: 3, fontSize: 14)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Account type toggle
              Container(
                decoration: BoxDecoration(
                  color: AppColors.surfaceDark,
                  borderRadius: BorderRadius.circular(100),
                  border: Border.all(color: AppColors.cardBorder),
                ),
                child: Row(
                  children: [
                    _typeBtn('user', 'User'),
                    _typeBtn('partner', 'Partner'),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              if (_accountType == 'user') ...[
                ClocheTextField(
                  controller: _nameCtrl,
                  label: 'Full Name',
                  validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                  prefix: const Icon(Icons.person_outline, color: AppColors.textMuted, size: 18),
                  textInputAction: TextInputAction.next,
                ),
                const SizedBox(height: 16),
              ] else ...[
                ClocheTextField(
                  controller: _boutiqueNameCtrl,
                  label: 'Boutique Name',
                  validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                  prefix: const Icon(Icons.storefront, color: AppColors.textMuted, size: 18),
                  textInputAction: TextInputAction.next,
                ),
                const SizedBox(height: 16),
                ClocheTextField(
                  controller: _ownerNameCtrl,
                  label: 'Owner Name',
                  validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                  prefix: const Icon(Icons.person_outline, color: AppColors.textMuted, size: 18),
                  textInputAction: TextInputAction.next,
                ),
                const SizedBox(height: 16),
                ClocheTextField(
                  controller: _phoneCtrl,
                  label: 'Mobile Number',
                  keyboardType: TextInputType.phone,
                  validator: (v) => (v == null || v.length < 10) ? 'Valid phone required' : null,
                  prefix: const Icon(Icons.phone, color: AppColors.textMuted, size: 18),
                  textInputAction: TextInputAction.next,
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: ClocheTextField(
                        controller: _cityCtrl,
                        label: 'City / Area',
                        validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                        prefix: const Icon(Icons.location_city, color: AppColors.textMuted, size: 18),
                        textInputAction: TextInputAction.next,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ClocheTextField(
                        controller: _districtCtrl,
                        label: 'District',
                        prefix: const Icon(Icons.map, color: AppColors.textMuted, size: 18),
                        textInputAction: TextInputAction.next,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.primary.withOpacity(0.3)),
                  ),
                  child: const Text(
                    '📸 Boutique showcase image is required for partner signup. Please complete registration on the web for image upload.',
                    style: TextStyle(color: AppColors.primary, fontSize: 12),
                  ),
                ),
                const SizedBox(height: 16),
              ],

              ClocheTextField(
                controller: _emailCtrl,
                label: 'Email Address',
                keyboardType: TextInputType.emailAddress,
                validator: (v) =>
                    (v != null && v.contains('@')) ? null : 'Valid email required',
                prefix: const Icon(Icons.mail_outline, color: AppColors.textMuted, size: 18),
                textInputAction: TextInputAction.next,
              ),
              const SizedBox(height: 16),

              ClocheTextField(
                controller: _passwordCtrl,
                label: 'Password',
                obscure: _obscure,
                validator: (v) => (v != null && v.length >= 6) ? null : 'Min 6 chars',
                prefix: const Icon(Icons.lock_outline, color: AppColors.textMuted, size: 18),
                suffix: IconButton(
                  icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility,
                      color: AppColors.textMuted, size: 18),
                  onPressed: () => setState(() => _obscure = !_obscure),
                ),
                textInputAction: TextInputAction.done,
              ),
              const SizedBox(height: 24),

              if (_error != null)
                Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.error.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.error.withOpacity(0.4)),
                  ),
                  child: Text(_error!,
                      style: const TextStyle(color: AppColors.error, fontSize: 13)),
                ),

              GoldButton(
                label: 'Create Account',
                onPressed: _submit,
                loading: _loading,
              ),
              const SizedBox(height: 20),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('Already have an account? ',
                      style: Theme.of(context).textTheme.bodySmall),
                  GestureDetector(
                    onTap: () => context.go(AppRouter.login),
                    child: const Text('Sign In',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        )),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _typeBtn(String type, String label) {
    final selected = _accountType == type;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _accountType = type),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: selected ? AppColors.primary : Colors.transparent,
            borderRadius: BorderRadius.circular(100),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: selected ? AppColors.backgroundDark : AppColors.textMuted,
              fontWeight: FontWeight.bold,
              fontSize: 13,
              letterSpacing: 1,
            ),
          ),
        ),
      ),
    );
  }
}
