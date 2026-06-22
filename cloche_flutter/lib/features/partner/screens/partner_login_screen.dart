import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../providers/auth_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/router/app_router.dart';
import '../../../widgets/shared_widgets.dart';

class PartnerLoginScreen extends StatefulWidget {
  const PartnerLoginScreen({super.key});

  @override
  State<PartnerLoginScreen> createState() => _PartnerLoginScreenState();
}

class _PartnerLoginScreenState extends State<PartnerLoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _identifierCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _obscure = true;

  @override
  void dispose() {
    _identifierCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final auth = context.read<AuthProvider>();
    final success = await auth.partnerLogin(
        _identifierCtrl.text.trim(), _passwordCtrl.text);
    if (success && mounted) {
      context.go(AppRouter.partnerDashboard);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final loading = auth.status == AuthStatus.loading;

    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 24),
                const Icon(Icons.storefront, color: AppColors.primary, size: 40),
                const SizedBox(height: 12),
                Text(
                  'PARTNER LOGIN',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        letterSpacing: 5,
                      ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Access your boutique dashboard',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 40),

                ClocheTextField(
                  controller: _identifierCtrl,
                  label: 'Email or Phone',
                  prefix: const Icon(Icons.person_outline,
                      color: AppColors.textMuted, size: 18),
                  validator: (v) =>
                      (v == null || v.isEmpty) ? 'Required' : null,
                  textInputAction: TextInputAction.next,
                ),
                const SizedBox(height: 16),

                ClocheTextField(
                  controller: _passwordCtrl,
                  label: 'Password',
                  obscure: _obscure,
                  prefix: const Icon(Icons.lock_outline,
                      color: AppColors.textMuted, size: 18),
                  suffix: IconButton(
                    icon: Icon(
                        _obscure ? Icons.visibility_off : Icons.visibility,
                        color: AppColors.textMuted,
                        size: 18),
                    onPressed: () => setState(() => _obscure = !_obscure),
                  ),
                  validator: (v) =>
                      (v == null || v.length < 4) ? 'Required' : null,
                  textInputAction: TextInputAction.done,
                ),
                const SizedBox(height: 12),

                Align(
                  alignment: Alignment.centerRight,
                  child: GestureDetector(
                    onTap: () => context.push(AppRouter.forgotPassword),
                    child: const Text('Forgot Password?',
                        style: TextStyle(
                            color: AppColors.primary,
                            fontSize: 12)),
                  ),
                ),
                const SizedBox(height: 16),

                if (auth.error != null)
                  Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.error.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                      border:
                          Border.all(color: AppColors.error.withOpacity(0.4)),
                    ),
                    child: Text(auth.error!,
                        style: const TextStyle(
                            color: AppColors.error, fontSize: 13)),
                  ),

                GoldButton(
                    label: 'Login to Dashboard',
                    onPressed: _submit,
                    loading: loading),
                const SizedBox(height: 24),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text("New to CLOCHE? ",
                        style: Theme.of(context).textTheme.bodySmall),
                    GestureDetector(
                      onTap: () => context.push(AppRouter.signup),
                      child: const Text('Register Your Boutique',
                          style: TextStyle(
                              color: AppColors.primary,
                              fontWeight: FontWeight.bold,
                              fontSize: 12)),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                GestureDetector(
                  onTap: () => context.go(AppRouter.home),
                  child: const Text('← Back to Home',
                      style: TextStyle(
                          color: AppColors.textMuted, fontSize: 12)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
