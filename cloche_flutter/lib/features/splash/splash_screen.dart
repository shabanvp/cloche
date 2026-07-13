import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/router/app_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fade;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1800),
      vsync: this,
    );

    _fade = CurvedAnimation(parent: _controller, curve: Curves.easeIn);
    _scale = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    );

    _controller.forward().then((_) => _navigate());
  }

  Future<void> _navigate() async {
    if (!mounted) return;
    final auth = context.read<AuthProvider>();
    await auth.checkSession();
    if (!mounted) return;

    if (auth.isAuthenticated) {
      if (auth.isPartner) {
        context.go(AppRouter.partnerDashboard);
      } else {
        context.go(AppRouter.home);
      }
    } else {
      context.go(AppRouter.home);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      body: FadeTransition(
        opacity: _fade,
        child: ScaleTransition(
          scale: _scale,
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Diamond logo
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.primary, width: 1.5),
                    color: AppColors.primary.withOpacity(0.1),
                  ),
                  child: const Icon(
                    Icons.diamond,
                    color: AppColors.primary,
                    size: 36,
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'CLOCHE',
                  style: Theme.of(context).textTheme.displayMedium?.copyWith(
                        letterSpacing: 10,
                        fontSize: 40,
                      ),
                ),
                const SizedBox(height: 12),
                Text(
                  'RENT LUXURY. FEEL ROYAL.',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.primary,
                        letterSpacing: 4,
                        fontSize: 11,
                      ),
                ),
                const SizedBox(height: 60),
                const SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(
                    strokeWidth: 1.5,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
