import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:vibrant_lms/core/di/injection.dart';
import 'package:vibrant_lms/features/auth/domain/repositories/repositories.dart';
import 'package:vibrant_lms/shared/models/entities.dart';
import 'package:vibrant_lms/shared/widgets/common_widgets.dart';
import 'package:vibrant_lms/themes/app_tokens.dart';

class AssessmentPage extends StatefulWidget {
  const AssessmentPage({super.key, required this.courseId});

  final String courseId;

  @override
  State<AssessmentPage> createState() => _AssessmentPageState();
}

class _AssessmentPageState extends State<AssessmentPage> {
  late Future<AssessmentEntity> _future;
  final Map<String, int> _answers = {};
  AssessmentResultEntity? _result;
  bool _submitting = false;
  int _index = 0;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<AssessmentEntity> _load() async {
    final result =
        await sl<AssessmentRepository>().getAssessment(widget.courseId);
    return result.getOrElse(() => throw Exception('Assessment missing'));
  }

  Future<void> _submit(AssessmentEntity assessment) async {
    setState(() => _submitting = true);
    final result = await sl<AssessmentRepository>().submit(
      assessmentId: assessment.id,
      answers: _answers,
    );
    setState(() => _submitting = false);
    result.fold(
      (f) => ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(f.message)),
      ),
      (r) => setState(() => _result = r),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Assessment')),
      body: FutureBuilder<AssessmentEntity>(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const LoadingView();
          final assessment = snapshot.data!;

          if (_result != null) {
            return _ResultView(
              result: _result!,
              assessment: assessment,
              onRetry: () => setState(() {
                _result = null;
                _answers.clear();
                _index = 0;
              }),
              onDone: () => context.pop(),
            );
          }

          final q = assessment.questions[_index];
          return ResponsiveShell(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(assessment.title, style: theme.textTheme.headlineSmall),
                  const SizedBox(height: 4),
                  Text(
                    'Question ${_index + 1} of ${assessment.questions.length}'
                    ' · ${assessment.durationMinutes} min · Pass ${assessment.passingScore}%',
                    style: theme.textTheme.bodySmall,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: (_index + 1) / assessment.questions.length,
                      minHeight: 8,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xl),
                  Text(q.prompt, style: theme.textTheme.titleLarge)
                      .animate()
                      .fadeIn()
                      .slideY(begin: 0.05),
                  const SizedBox(height: AppSpacing.lg),
                  ...List.generate(q.options.length, (i) {
                    final selected = _answers[q.id] == i;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                      child: Material(
                        color: selected
                            ? theme.colorScheme.primaryContainer
                            : theme.colorScheme.surface,
                        borderRadius: BorderRadius.circular(AppRadius.md),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(AppRadius.md),
                          onTap: () => setState(() => _answers[q.id] = i),
                          child: Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(AppSpacing.md),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(AppRadius.md),
                              border: Border.all(
                                color: selected
                                    ? theme.colorScheme.primary
                                    : theme.colorScheme.outline
                                        .withValues(alpha: 0.35),
                              ),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  selected
                                      ? Icons.radio_button_checked
                                      : Icons.radio_button_off,
                                  color: selected
                                      ? theme.colorScheme.primary
                                      : null,
                                ),
                                const SizedBox(width: 12),
                                Expanded(child: Text(q.options[i])),
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  }),
                  const Spacer(),
                  Row(
                    children: [
                      if (_index > 0)
                        OutlinedButton(
                          onPressed: () => setState(() => _index--),
                          child: const Text('Back'),
                        ),
                      const Spacer(),
                      if (_index < assessment.questions.length - 1)
                        FilledButton(
                          onPressed: _answers.containsKey(q.id)
                              ? () => setState(() => _index++)
                              : null,
                          child: const Text('Next'),
                        )
                      else
                        FilledButton(
                          onPressed: _answers.length ==
                                      assessment.questions.length &&
                                  !_submitting
                              ? () => _submit(assessment)
                              : null,
                          child: _submitting
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                  ),
                                )
                              : const Text('Submit'),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _ResultView extends StatelessWidget {
  const _ResultView({
    required this.result,
    required this.assessment,
    required this.onRetry,
    required this.onDone,
  });

  final AssessmentResultEntity result;
  final AssessmentEntity assessment;
  final VoidCallback onRetry;
  final VoidCallback onDone;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              result.passed
                  ? Icons.emoji_events_rounded
                  : Icons.sentiment_dissatisfied_outlined,
              size: 72,
              color: result.passed ? AppColors.streak : theme.colorScheme.error,
            )
                .animate()
                .scale(begin: const Offset(0.6, 0.6))
                .fadeIn(),
            const SizedBox(height: AppSpacing.md),
            Text(
              result.passed ? 'You passed!' : 'Keep practicing',
              style: theme.textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text(
              '${result.score}/${result.total} correct'
              ' · ${result.percentage.toStringAsFixed(0)}%',
              style: theme.textTheme.titleMedium,
            ),
            const SizedBox(height: AppSpacing.lg),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                OutlinedButton(onPressed: onRetry, child: const Text('Retry')),
                const SizedBox(width: 12),
                FilledButton(onPressed: onDone, child: const Text('Done')),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
