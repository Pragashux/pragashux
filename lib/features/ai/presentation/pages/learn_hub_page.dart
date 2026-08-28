import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:vibrant_lms/core/di/injection.dart';
import 'package:vibrant_lms/features/ai/domain/ai_repository.dart';
import 'package:vibrant_lms/shared/models/entities.dart';
import 'package:vibrant_lms/shared/widgets/common_widgets.dart';
import 'package:vibrant_lms/themes/app_tokens.dart';

class LearnHubPage extends StatefulWidget {
  const LearnHubPage({super.key});

  @override
  State<LearnHubPage> createState() => _LearnHubPageState();
}

class _LearnHubPageState extends State<LearnHubPage> {
  late Future<DailyPlanEntity> _plan;
  final _topic = TextEditingController(text: 'UX Research');
  int _minutes = 20;
  String _difficulty = 'beginner';
  Map<String, dynamic>? _session;

  @override
  void initState() {
    super.initState();
    _plan = sl<AiRepository>().dailyPlan().then(
          (r) => r.getOrElse(
            () => const DailyPlanEntity(title: 'Today', estimatedMinutes: 0, items: []),
          ),
        );
  }

  Future<void> _generateSession() async {
    final result = await sl<AiRepository>().studySession(
      topic: _topic.text,
      minutes: _minutes,
      difficulty: _difficulty,
    );
    setState(() => _session = result.getOrElse(() => {}));
  }

  @override
  void dispose() {
    _topic.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Learn')),
      body: FutureBuilder(
        future: _plan,
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const LoadingView();
          final plan = snapshot.data!;
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.md),
            children: [
              Text(plan.title, style: theme.textTheme.headlineSmall),
              const SizedBox(height: 4),
              Text(
                '${plan.estimatedMinutes} minutes · ${plan.rationale}',
                style: theme.textTheme.bodyMedium,
              ),
              const SizedBox(height: AppSpacing.md),
              for (final item in plan.items)
                Card(
                  margin: const EdgeInsets.only(bottom: 10),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: AppColors.primaryContainer,
                      child: Text('${item.minutes}'),
                    ),
                    title: Text(item.title),
                    subtitle: Text(item.kind),
                    trailing: const Icon(Icons.chevron_right_rounded),
                    onTap: () {
                      if (item.kind == 'quiz') {
                        context.push('/assessments/c_ux');
                      } else {
                        context.push('/learn/c_ux');
                      }
                    },
                  ),
                ),
              const SizedBox(height: AppSpacing.lg),
              Text('AI Study Mode', style: theme.textTheme.titleLarge),
              const SizedBox(height: 8),
              Text(
                'I have $_minutes minutes to learn ${_topic.text}.',
                style: theme.textTheme.bodyMedium,
              ),
              const SizedBox(height: 12),
              VTextField(controller: _topic, label: 'Topic'),
              const SizedBox(height: 12),
              Text('Available time: $_minutes min'),
              Slider(
                value: _minutes.toDouble(),
                min: 10,
                max: 60,
                divisions: 10,
                label: '$_minutes min',
                onChanged: (v) => setState(() => _minutes = v.round()),
              ),
              Wrap(
                spacing: 8,
                children: [
                  for (final d in ['beginner', 'intermediate', 'advanced'])
                    ChoiceChip(
                      label: Text(d),
                      selected: _difficulty == d,
                      onSelected: (_) => setState(() => _difficulty = d),
                    ),
                ],
              ),
              const SizedBox(height: 12),
              VButton(
                label: 'Generate session',
                icon: Icons.auto_awesome_rounded,
                onPressed: _generateSession,
              ),
              if (_session != null) ...[
                const SizedBox(height: 16),
                for (final block in (_session!['blocks'] as List))
                  Card(
                    margin: const EdgeInsets.only(bottom: 8),
                    child: ListTile(
                      title: Text('${block['kind']} · ${block['minutes']} min'),
                      subtitle: Text('${block['content']}'),
                    ),
                  ),
              ],
            ],
          );
        },
      ),
    );
  }
}
