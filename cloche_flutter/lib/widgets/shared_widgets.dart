import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../core/theme/app_theme.dart';
import '../core/constants/app_constants.dart';

// ─── Gold Gradient Button ───────────────────────────────────────────────────
class GoldButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool loading;
  final double? width;

  const GoldButton({
    super.key,
    required this.label,
    this.onPressed,
    this.loading = false,
    this.width,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width ?? double.infinity,
      child: ElevatedButton(
        onPressed: loading ? null : onPressed,
        child: loading
            ? const SizedBox(
                height: 18,
                width: 18,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: AppColors.backgroundDark,
                ),
              )
            : Text(
                label.toUpperCase(),
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  letterSpacing: 2,
                  fontSize: 12,
                ),
              ),
      ),
    );
  }
}

// ─── Outlined Ghost Button ──────────────────────────────────────────────────
class GhostButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;

  const GhostButton({super.key, required this.label, this.onPressed});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton(
        onPressed: onPressed,
        child: Text(label.toUpperCase()),
      ),
    );
  }
}

// ─── Gold Divider ───────────────────────────────────────────────────────────
class GoldDivider extends StatelessWidget {
  const GoldDivider({super.key});

  @override
  Widget build(BuildContext context) {
    return const Divider(
      color: AppColors.cardBorder,
      thickness: 0.5,
    );
  }
}

// ─── Section Header ─────────────────────────────────────────────────────────
class SectionHeader extends StatelessWidget {
  final String label;
  final String title;
  final String? actionLabel;
  final VoidCallback? onAction;

  const SectionHeader({
    super.key,
    required this.label,
    required this.title,
    this.actionLabel,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label.toUpperCase(),
                style: const TextStyle(
                  color: AppColors.primary,
                  letterSpacing: 4,
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                title,
                style: Theme.of(context).textTheme.headlineMedium,
              ),
            ],
          ),
        ),
        if (actionLabel != null && onAction != null)
          GestureDetector(
            onTap: onAction,
            child: Text(
              actionLabel!,
              style: const TextStyle(
                color: AppColors.primary,
                fontSize: 12,
                letterSpacing: 1.5,
                decoration: TextDecoration.underline,
                decorationColor: AppColors.primary,
              ),
            ),
          ),
      ],
    );
  }
}

// ─── Glass Card ─────────────────────────────────────────────────────────────
class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final BorderRadius? borderRadius;
  final VoidCallback? onTap;

  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.borderRadius,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: padding ?? const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surfaceDark.withOpacity(0.6),
          borderRadius: borderRadius ?? BorderRadius.circular(16),
          border: Border.all(color: AppColors.cardBorder, width: 1),
        ),
        child: child,
      ),
    );
  }
}

// ─── Boutique Card ───────────────────────────────────────────────────────────
class BoutiqueCard extends StatelessWidget {
  final String name;
  final String location;
  final String? imageUrl;
  final String? plan;
  final VoidCallback? onTap;

  const BoutiqueCard({
    super.key,
    required this.name,
    required this.location,
    this.imageUrl,
    this.plan,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surfaceDark,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.cardBorder, width: 1),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            AspectRatio(
              aspectRatio: 3 / 4,
              child: _buildImage(),
            ),
            // Info
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: Theme.of(context).textTheme.titleSmall,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.location_on,
                          size: 12, color: AppColors.primary),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          location,
                          style: Theme.of(context).textTheme.bodySmall,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  if (plan != null && plan!.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(100),
                        border: Border.all(
                            color: AppColors.primary.withOpacity(0.4),
                            width: 0.5),
                      ),
                      child: Text(
                        plan!.toUpperCase(),
                        style: const TextStyle(
                          color: AppColors.primary,
                          fontSize: 9,
                          letterSpacing: 1.5,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ]
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildImage() {
    if (imageUrl != null && imageUrl!.isNotEmpty) {
      final resolved = _resolveUrl(imageUrl!);
      return CachedNetworkImage(
        imageUrl: resolved,
        fit: BoxFit.cover,
        placeholder: (_, __) => _placeholder(),
        errorWidget: (_, __, ___) => _placeholder(),
      );
    }
    return _placeholder();
  }

  Widget _placeholder() {
    return Container(
      color: AppColors.surfaceDark,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.diamond, color: AppColors.primary, size: 32),
            const SizedBox(height: 8),
            Text(
              name.isNotEmpty ? name[0].toUpperCase() : 'C',
              style: const TextStyle(
                color: AppColors.primary,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _resolveUrl(String url) {
    if (url.startsWith('http')) return url;
    return '${AppConstants.cloudinaryBase}$url';
  }
}

// ─── Product Card ─────────────────────────────────────────────────────────────
class ProductCard extends StatelessWidget {
  final String name;
  final String price;
  final String category;
  final String? imageUrl;
  final String? boutiqueName;
  final VoidCallback? onTap;
  final VoidCallback? onEnquire;

  const ProductCard({
    super.key,
    required this.name,
    required this.price,
    required this.category,
    this.imageUrl,
    this.boutiqueName,
    this.onTap,
    this.onEnquire,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surfaceDark,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.cardBorder, width: 1),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 3 / 4,
              child: _buildImage(),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: Theme.of(context).textTheme.titleSmall,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '₹$price',
                    style: const TextStyle(
                      color: AppColors.primary,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  if (boutiqueName != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      boutiqueName!,
                      style: Theme.of(context).textTheme.bodySmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                  if (onEnquire != null) ...[
                    const SizedBox(height: 10),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: onEnquire,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          textStyle: const TextStyle(fontSize: 10, letterSpacing: 1.5),
                        ),
                        child: const Text('ENQUIRE'),
                      ),
                    ),
                  ]
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildImage() {
    if (imageUrl != null && imageUrl!.isNotEmpty) {
      final resolved = imageUrl!.startsWith('http')
          ? imageUrl!
          : '${AppConstants.cloudinaryBase}$imageUrl';
      return CachedNetworkImage(
        imageUrl: resolved,
        fit: BoxFit.cover,
        placeholder: (_, __) => _placeholder(),
        errorWidget: (_, __, ___) => _placeholder(),
      );
    }
    return _placeholder();
  }

  Widget _placeholder() => Container(
        color: AppColors.surfaceDark,
        child: const Center(
          child: Icon(Icons.checkroom, color: AppColors.primary, size: 40),
        ),
      );
}

// ─── Cloche AppBar ───────────────────────────────────────────────────────────
class ClocheAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final List<Widget>? actions;
  final bool showLogo;

  const ClocheAppBar({
    super.key,
    this.title,
    this.actions,
    this.showLogo = false,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AppColors.surfaceDark.withOpacity(0.95),
      elevation: 0,
      title: showLogo
          ? Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.diamond, color: AppColors.primary, size: 20),
                const SizedBox(width: 6),
                Text(
                  'CLOCHE',
                  style: Theme.of(context).appBarTheme.titleTextStyle,
                ),
              ],
            )
          : title != null
              ? Text(title!, style: Theme.of(context).appBarTheme.titleTextStyle)
              : null,
      actions: actions,
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

// ─── Loading Shimmer ─────────────────────────────────────────────────────────
class LoadingCard extends StatelessWidget {
  const LoadingCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceDark,
        borderRadius: BorderRadius.circular(16),
      ),
    );
  }
}

// ─── Error View ──────────────────────────────────────────────────────────────
class ErrorView extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;

  const ErrorView({super.key, required this.message, this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline,
                color: AppColors.primary, size: 48),
            const SizedBox(height: 16),
            Text(
              message,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 24),
              GoldButton(label: 'Retry', onPressed: onRetry, width: 150),
            ]
          ],
        ),
      ),
    );
  }
}

// ─── Empty State ─────────────────────────────────────────────────────────────
class EmptyState extends StatelessWidget {
  final String message;
  final IconData icon;

  const EmptyState({
    super.key,
    required this.message,
    this.icon = Icons.diamond,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: AppColors.primary, size: 48),
            const SizedBox(height: 16),
            Text(
              message,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Cloche Text Field ───────────────────────────────────────────────────────
class ClocheTextField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String? hint;
  final bool obscure;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;
  final Widget? suffix;
  final Widget? prefix;
  final int maxLines;
  final TextInputAction? textInputAction;
  final void Function(String)? onChanged;

  const ClocheTextField({
    super.key,
    required this.controller,
    required this.label,
    this.hint,
    this.obscure = false,
    this.keyboardType,
    this.validator,
    this.suffix,
    this.prefix,
    this.maxLines = 1,
    this.textInputAction,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscure,
      keyboardType: keyboardType,
      validator: validator,
      maxLines: maxLines,
      textInputAction: textInputAction,
      onChanged: onChanged,
      style: const TextStyle(color: AppColors.textLight, fontSize: 14),
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        suffixIcon: suffix,
        prefixIcon: prefix,
      ),
    );
  }
}
