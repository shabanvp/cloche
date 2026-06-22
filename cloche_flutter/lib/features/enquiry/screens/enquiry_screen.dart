import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../providers/lead_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/shared_widgets.dart';

class EnquiryScreen extends StatefulWidget {
  final String? boutiqueId;
  final String? productName;
  final String? productImage;

  const EnquiryScreen({
    super.key,
    this.boutiqueId,
    this.productName,
    this.productImage,
  });

  @override
  State<EnquiryScreen> createState() => _EnquiryScreenState();
}

class _EnquiryScreenState extends State<EnquiryScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _dateCtrl = TextEditingController();
  final _areaCtrl = TextEditingController();
  final _districtCtrl = TextEditingController();
  final _requirementCtrl = TextEditingController();
  final _specialCtrl = TextEditingController();



  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<LeadProvider>().clearSubmitState();
    });
  }

  @override
  void dispose() {
    for (final c in [
      _nameCtrl, _emailCtrl, _phoneCtrl, _dateCtrl,
      _areaCtrl, _districtCtrl, _requirementCtrl, _specialCtrl
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _pickDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate:
          DateTime.now().add(const Duration(days: 30)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365 * 3)),
      builder: (ctx, child) => Theme(
        data: ThemeData.dark().copyWith(
          colorScheme: const ColorScheme.dark(primary: AppColors.primary),
        ),
        child: child!,
      ),
    );
    if (date != null) {
      _dateCtrl.text =
          '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
    }
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;

    final area = _areaCtrl.text.trim();
    final district = _districtCtrl.text.trim();
    final preferredLocation =
        [area, district].where((s) => s.isNotEmpty).join(', ');

    final body = {
      'fullName': _nameCtrl.text.trim(),
      'email': _emailCtrl.text.trim(),
      'mobileNumber': _phoneCtrl.text.trim(),
      'weddingDate': _dateCtrl.text.trim(),
      'areaLocation': area,
      'districtLocation': district,
      'cityLocation': preferredLocation,
      'requirement': _requirementCtrl.text.trim(),
      'specialRequirement': _specialCtrl.text.trim(),
      if (widget.boutiqueId != null) 'boutiqueId': widget.boutiqueId,
      if (widget.productName != null) 'productName': widget.productName,
      if (widget.productImage != null) 'productImage': widget.productImage,
    };

    final success = await context.read<LeadProvider>().submitEnquiry(body);
    if (success && mounted) {
      _showSuccessDialog();
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        backgroundColor: AppColors.surfaceDark,
        title: const Row(
          children: [
            Icon(Icons.check_circle, color: AppColors.success, size: 24),
            SizedBox(width: 8),
            Text('Enquiry Sent!',
                style: TextStyle(color: AppColors.textLight, fontSize: 18)),
          ],
        ),
        content: const Text(
          'Your enquiry has been submitted. A boutique will get in touch with you shortly.',
          style: TextStyle(color: AppColors.textMuted),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              context.pop();
            },
            child: const Text('Done', style: TextStyle(color: AppColors.primary)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final lead = context.watch<LeadProvider>();

    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textLight),
          onPressed: () => context.pop(),
        ),
        title: const Text('SUBMIT ENQUIRY',
            style: TextStyle(
                color: AppColors.textLight, letterSpacing: 3, fontSize: 14)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Product preview if coming from product
              if (widget.productName != null) ...[
                GlassCard(
                  child: Row(
                    children: [
                      const Icon(Icons.checkroom, color: AppColors.primary, size: 24),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Enquiring about:',
                                style: TextStyle(
                                    color: AppColors.textMuted, fontSize: 11)),
                            const SizedBox(height: 2),
                            Text(widget.productName!,
                                style: Theme.of(context).textTheme.titleSmall),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
              ],

              Text('Your Details',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: AppColors.primary)),
              const SizedBox(height: 16),

              ClocheTextField(
                controller: _nameCtrl,
                label: 'Full Name *',
                validator: (v) => (v == null || v.isEmpty) ? 'Required' : null,
                prefix: const Icon(Icons.person_outline,
                    color: AppColors.textMuted, size: 18),
                textInputAction: TextInputAction.next,
              ),
              const SizedBox(height: 14),
              ClocheTextField(
                controller: _emailCtrl,
                label: 'Email Address',
                keyboardType: TextInputType.emailAddress,
                prefix: const Icon(Icons.mail_outline,
                    color: AppColors.textMuted, size: 18),
                textInputAction: TextInputAction.next,
              ),
              const SizedBox(height: 14),
              ClocheTextField(
                controller: _phoneCtrl,
                label: 'Mobile Number *',
                keyboardType: TextInputType.phone,
                validator: (v) =>
                    (v == null || v.length < 10) ? 'Valid number required' : null,
                prefix: const Icon(Icons.phone,
                    color: AppColors.textMuted, size: 18),
                textInputAction: TextInputAction.next,
              ),
              const SizedBox(height: 20),

              Text('Event Details',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: AppColors.primary)),
              const SizedBox(height: 16),

              GestureDetector(
                onTap: _pickDate,
                child: AbsorbPointer(
                  child: ClocheTextField(
                    controller: _dateCtrl,
                    label: 'Wedding / Event Date *',
                    validator: (v) =>
                        (v == null || v.isEmpty) ? 'Date required' : null,
                    prefix: const Icon(Icons.calendar_today,
                        color: AppColors.textMuted, size: 18),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: ClocheTextField(
                      controller: _areaCtrl,
                      label: 'Area / Town *',
                      validator: (v) =>
                          (v == null || v.isEmpty) ? 'Required' : null,
                      prefix: const Icon(Icons.location_on,
                          color: AppColors.textMuted, size: 18),
                      textInputAction: TextInputAction.next,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ClocheTextField(
                      controller: _districtCtrl,
                      label: 'District',
                      prefix: const Icon(Icons.map,
                          color: AppColors.textMuted, size: 18),
                      textInputAction: TextInputAction.next,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              ClocheTextField(
                controller: _requirementCtrl,
                label: 'Dress Requirement',
                maxLines: 3,
                prefix: const Icon(Icons.edit_note,
                    color: AppColors.textMuted, size: 18),
                textInputAction: TextInputAction.next,
              ),
              const SizedBox(height: 14),
              ClocheTextField(
                controller: _specialCtrl,
                label: 'Special Requirements (optional)',
                maxLines: 2,
                prefix: const Icon(Icons.star_outline,
                    color: AppColors.textMuted, size: 18),
              ),
              const SizedBox(height: 24),

              if (lead.error != null)
                Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.error.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.error.withOpacity(0.4)),
                  ),
                  child: Text(lead.error!,
                      style: const TextStyle(
                          color: AppColors.error, fontSize: 13)),
                ),

              GoldButton(
                label: 'Submit Enquiry',
                onPressed: _submit,
                loading: lead.submitting,
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}
