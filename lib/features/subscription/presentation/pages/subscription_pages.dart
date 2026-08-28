import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:vibrant_lms/core/di/injection.dart';
import 'package:vibrant_lms/features/subscription/domain/subscription_repository.dart';
import 'package:vibrant_lms/shared/models/entities.dart';
import 'package:vibrant_lms/shared/widgets/common_widgets.dart';
import 'package:vibrant_lms/themes/app_tokens.dart';

class SubscriptionPage extends StatefulWidget {
  const SubscriptionPage({super.key});

  @override
  State<SubscriptionPage> createState() => _SubscriptionPageState();
}

class _SubscriptionPageState extends State<SubscriptionPage> {
  late Future<({List<PlanEntity> plans, SubscriptionEntity mine})> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<({List<PlanEntity> plans, SubscriptionEntity mine})> _load() async {
    final repo = sl<SubscriptionRepository>();
    final plans = (await repo.getPlans()).getOrElse(() => <PlanEntity>[]);
    final mine = (await repo.getMine()).getOrElse(
      () => const SubscriptionEntity(planId: 'free', planName: 'Free', status: 'active'),
    );
    return (plans: plans, mine: mine);
  }

  Future<void> _change(String id) async {
    await sl<SubscriptionRepository>().changePlan(id);
    setState(() => _future = _load());
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Plan updated. Payment provider is mocked until keys are set.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Subscription')),
      body: FutureBuilder(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const LoadingView();
          final data = snapshot.data!;
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.md),
            children: [
              Text(
                'Current plan: ${data.mine.planName} · ${data.mine.status}',
                style: theme.textTheme.titleMedium,
              ),
              const SizedBox(height: 4),
              Text(
                'Renewal and billing go through PaymentProvider. No keys are stored in the app.',
                style: theme.textTheme.bodySmall,
              ),
              const SizedBox(height: AppSpacing.lg),
              for (final plan in data.plans)
                Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(plan.name, style: theme.textTheme.titleLarge),
                            const Spacer(),
                            Text(
                              plan.priceMonthly == 0 ? 'Free' : '\$${plan.priceMonthly.toStringAsFixed(0)}/mo',
                              style: theme.textTheme.titleMedium,
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(plan.description),
                        const SizedBox(height: 8),
                        for (final f in plan.features) Text('• $f'),
                        const SizedBox(height: 12),
                        VButton(
                          label: data.mine.planId == plan.id ? 'Current plan' : 'Switch to ${plan.name}',
                          onPressed: data.mine.planId == plan.id ? null : () => _change(plan.id),
                          variant: data.mine.planId == plan.id
                              ? VButtonVariant.outlined
                              : VButtonVariant.filled,
                        ),
                      ],
                    ),
                  ),
                ),
              VButton(
                label: 'Cancel renewal',
                variant: VButtonVariant.text,
                onPressed: () async {
                  final ok = await showDialog<bool>(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      title: const Text('Cancel subscription?'),
                      content: const Text('You will keep access until the period ends.'),
                      actions: [
                        TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Keep')),
                        FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Cancel plan')),
                      ],
                    ),
                  );
                  if (ok == true) {
                    await sl<SubscriptionRepository>().cancel();
                    setState(() => _future = _load());
                  }
                },
              ),
              TextButton(
                onPressed: () => context.push('/settings'),
                child: const Text('Payment history (mock)'),
              ),
            ],
          );
        },
      ),
    );
  }
}

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final _interests = <String>{'UX Design'};
  final _goals = <String>{'Land a UX role'};
  String _skill = 'beginner';
  int _step = 0;
  int _quizIndex = 0;
  int _score = 0;

  static const _interestOptions = ['UX Design', 'Product', 'AI', 'Python', 'Accessibility', 'Mobile'];
  static const _goalOptions = ['Land a UX role', 'Build a portfolio', 'Upskill at work', 'Career change'];
  static const _quiz = [
    ('What is UX primarily about?', ['Pretty screens', 'How a product feels to use', 'Color palettes'], 1),
    ('User research exists to…', ['Confirm the CEO', 'Reduce expensive guesses', 'Replace design'], 1),
  ];

  void _next() {
    if (_step < 3) {
      setState(() => _step++);
      return;
    }
    context.go('/home');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Set up your path')),
      body: Padding(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            LinearProgressIndicator(value: (_step + 1) / 4),
            const SizedBox(height: AppSpacing.lg),
            if (_step == 0) ...[
              Text('What are you curious about?', style: theme.textTheme.headlineSmall),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                children: [
                  for (final i in _interestOptions)
                    FilterChip(
                      label: Text(i),
                      selected: _interests.contains(i),
                      onSelected: (v) => setState(() => v ? _interests.add(i) : _interests.remove(i)),
                    ),
                ],
              ),
            ] else if (_step == 1) ...[
              Text('Your learning goals', style: theme.textTheme.headlineSmall),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                children: [
                  for (final g in _goalOptions)
                    FilterChip(
                      label: Text(g),
                      selected: _goals.contains(g),
                      onSelected: (v) => setState(() => v ? _goals.add(g) : _goals.remove(g)),
                    ),
                ],
              ),
            ] else if (_step == 2) ...[
              Text('Skill check', style: theme.textTheme.headlineSmall),
              const SizedBox(height: 12),
              Text(_quiz[_quizIndex].$1, style: theme.textTheme.titleMedium),
              const SizedBox(height: 12),
              for (var i = 0; i < _quiz[_quizIndex].$2.length; i++)
                ListTile(
                  title: Text(_quiz[_quizIndex].$2[i]),
                  onTap: () {
                    if (i == _quiz[_quizIndex].$3) _score++;
                    if (_quizIndex < _quiz.length - 1) {
                      setState(() => _quizIndex++);
                    } else {
                      setState(() {
                        _skill = _score >= 2 ? 'intermediate' : 'beginner';
                        _step = 3;
                      });
                    }
                  },
                ),
            ] else ...[
              Text('You are set', style: theme.textTheme.headlineSmall),
              const SizedBox(height: 8),
              Text('Starting skill: $_skill. AI will personalize UX Design for Beginners around ${_interests.join(', ')}.'),
            ],
            const Spacer(),
            VButton(label: _step == 3 ? 'Start learning' : 'Continue', onPressed: _next),
          ],
        ),
      ),
    );
  }
}
