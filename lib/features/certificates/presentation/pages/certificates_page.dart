import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:share_plus/share_plus.dart';
import 'package:vibrant_lms/core/di/injection.dart';
import 'package:vibrant_lms/features/auth/domain/repositories/repositories.dart';
import 'package:vibrant_lms/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:vibrant_lms/shared/models/entities.dart';
import 'package:vibrant_lms/shared/widgets/common_widgets.dart';
import 'package:vibrant_lms/themes/app_tokens.dart';

class CertificatesPage extends StatefulWidget {
  const CertificatesPage({super.key});

  @override
  State<CertificatesPage> createState() => _CertificatesPageState();
}

class _CertificatesPageState extends State<CertificatesPage> {
  late Future<List<CertificateEntity>> _future;

  @override
  void initState() {
    super.initState();
    final auth = context.read<AuthBloc>().state;
    final name =
        auth is AuthAuthenticated ? auth.user.displayName : 'Sam Student';
    _future = sl<CertificateRepository>()
        .getCertificates(name)
        .then((r) => r.getOrElse(() => []));
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Certificates')),
      body: FutureBuilder<List<CertificateEntity>>(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const LoadingView();
          final certs = snapshot.data!;
          if (certs.isEmpty) {
            return const EmptyState(
              icon: Icons.workspace_premium_outlined,
              title: 'No certificates yet',
              message: 'Complete a course to earn your first credential.',
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(AppSpacing.md),
            itemCount: certs.length,
            separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.md),
            itemBuilder: (context, i) {
              final c = certs[i];
              return Container(
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(AppRadius.lg),
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      theme.colorScheme.primary.withValues(alpha: 0.15),
                      theme.colorScheme.tertiary.withValues(alpha: 0.12),
                      theme.colorScheme.surface,
                    ],
                  ),
                  border: Border.all(
                    color: theme.colorScheme.outline.withValues(alpha: 0.35),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.workspace_premium_rounded,
                          color: AppColors.certificate,
                          size: 32,
                        ),
                        const Spacer(),
                        SoftBadge(
                          label: c.credentialId ?? c.id,
                          color: AppColors.certificate,
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Text('Certificate of Completion', style: theme.textTheme.labelLarge),
                    const SizedBox(height: 4),
                    Text(c.courseTitle, style: theme.textTheme.headlineSmall),
                    const SizedBox(height: 8),
                    Text('Awarded to ${c.studentName}'),
                    Text(
                      'Issued ${_format(c.issuedAt)}',
                      style: theme.textTheme.bodySmall,
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Row(
                      children: [
                        FilledButton.tonalIcon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Certificate PDF ready to download'),
                              ),
                            );
                          },
                          icon: const Icon(Icons.download_rounded),
                          label: const Text('Download'),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton.icon(
                          onPressed: () {
                            final url = c.shareUrl ?? '';
                            Share.share(
                              'I earned a Vibrant LMS certificate for ${c.courseTitle}! $url',
                            );
                          },
                          icon: const Icon(Icons.share_outlined),
                          label: const Text('Share'),
                        ),
                        IconButton(
                          tooltip: 'Copy credential ID',
                          onPressed: () {
                            Clipboard.setData(
                              ClipboardData(text: c.credentialId ?? c.id),
                            );
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Credential ID copied')),
                            );
                          },
                          icon: const Icon(Icons.copy_rounded),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }

  String _format(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
}
