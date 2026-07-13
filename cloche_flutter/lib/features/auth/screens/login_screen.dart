import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../providers/auth_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/router/app_router.dart';
import '../../../widgets/shared_widgets.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _obscure = true;
  String _loginType = 'user'; // 'user' or 'partner'

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final auth = context.read<AuthProvider>();

    bool success;
    if (_loginType == 'partner') {
      success =
          await auth.partnerLogin(_emailCtrl.text.trim(), _passwordCtrl.text);
    } else {
      success =
          await auth.userLogin(_emailCtrl.text.trim(), _passwordCtrl.text);
    }

    if (!mounted) return;
    if (success) {
      if (_loginType == 'partner') {
        context.go(AppRouter.partnerDashboard);
      } else {
        context.go(AppRouter.home);
      }
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
                const SizedBox(height: 32),
                // Logo
                const Icon(Icons.diamond, color: AppColors.primary, size: 36),
                const SizedBox(height: 12),
                Text(
                  'CLOCHE',
                  style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                        letterSpacing: 8,
                      ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Sign in to continue',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 40),

                // Login type toggle
                Container(
                  decoration: BoxDecoration(
                    color: AppColors.surfaceDark,
                    borderRadius: BorderRadius.circular(100),
                    border: Border.all(color: AppColors.cardBorder),
                  ),
                  child: Row(
                    children: [
                      _typeButton('user', 'User'),
                      _typeButton('partner', 'Partner'),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                // Email
                ClocheTextField(
                  controller: _emailCtrl,
                  label: _loginType == 'partner' ? 'Email or Phone' : 'Email',
                  keyboardType: TextInputType.emailAddress,
                  prefix: const Icon(Icons.mail_outline,
                      color: AppColors.textMuted, size: 18),
                  validator: (v) =>
                      (v == null || v.isEmpty) ? 'Required' : null,
                  textInputAction: TextInputAction.next,
                ),
                const SizedBox(height: 16),

                // Password
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
                      size: 18,
                    ),
                    onPressed: () => setState(() => _obscure = !_obscure),
                  ),
                  validator: (v) =>
                      (v == null || v.length < 6)
                          ? 'At least 6 characters'
                          : null,
                  textInputAction: TextInputAction.done,
                ),
                const SizedBox(height: 12),

                // Forgot password
                Align(
                  alignment: Alignment.centerRight,
                  child: GestureDetector(
                    onTap: () => context.push(AppRouter.forgotPassword),
                    child: const Text(
                      'Forgot Password?',
                      style: TextStyle(
                        color: AppColors.primary,
                        fontSize: 12,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 8),

                // Error
                if (auth.error != null)
                  Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.error.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.error.withOpacity(0.4)),
                    ),
                    child: Text(
                      auth.error!,
                      style: const TextStyle(
                        color: AppColors.error,
                        fontSize: 13,
                      ),
                    ),
                  ),

                const SizedBox(height: 8),
                GoldButton(
                  label: 'Sign In',
                  onPressed: _submit,
                  loading: loading,
                ),
                const SizedBox(height: 24),

                // Signup link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Don't have an account? ",
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    GestureDetector(
                      onTap: () => context.push(AppRouter.signup),
                      child: const Text(
                        'Sign Up',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Partner login shortcut
                if (_loginType == 'user')
                  GestureDetector(
                    onTap: () => context.push(AppRouter.partnerLogin),
                    child: const Text(
                      'List Your Boutique →',
                      style: TextStyle(
                        color: AppColors.primary,
                        fontSize: 12,
                        letterSpacing: 1,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _typeButton(String type, String label) {
    final selected = _loginType == type;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _loginType = type),
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
