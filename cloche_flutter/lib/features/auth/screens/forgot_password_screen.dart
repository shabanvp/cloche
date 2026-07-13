import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../services/api_service.dart';
import '../../../widgets/shared_widgets.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailCtrl = TextEditingController();
  bool _loading = false;
  String? _message;
  bool _success = false;

  @override
  void dispose() {
    _emailCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_emailCtrl.text.trim().isEmpty) return;
    setState(() { _loading = true; _message = null; });
    try {
      final data = await ApiService().forgotPassword(_emailCtrl.text.trim());
      setState(() {
        _success = data['success'] == true;
        _message = data['message'] ?? (_success ? 'Reset link sent!' : 'Error');
      });
    } catch (e) {
      setState(() { _success = false; _message = e.toString(); });
    } finally {
      setState(() => _loading = false);
    }
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
        title: const Text('FORGOT PASSWORD',
            style: TextStyle(color: AppColors.textLight, letterSpacing: 3, fontSize: 14)),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 24),
            const Icon(Icons.lock_reset, color: AppColors.primary, size: 48),
            const SizedBox(height: 16),
            Text(
              'Reset Your Password',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              'Enter your email and we\'ll send you a password reset link.',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 32),
            ClocheTextField(
              controller: _emailCtrl,
              label: 'Email Address',
              keyboardType: TextInputType.emailAddress,
              prefix: const Icon(Icons.mail_outline, color: AppColors.textMuted, size: 18),
              textInputAction: TextInputAction.done,
            ),
            const SizedBox(height: 24),
            if (_message != null)
              Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: (_success ? AppColors.success : AppColors.error).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: (_success ? AppColors.success : AppColors.error).withOpacity(0.4),
                  ),
                ),
                child: Text(
                  _message!,
                  style: TextStyle(
                    color: _success ? AppColors.success : AppColors.error,
                    fontSize: 13,
                  ),
                ),
              ),
            GoldButton(label: 'Send Reset Link', onPressed: _submit, loading: _loading),
          ],
        ),
      ),
    );
  }
}
