import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:vibrant_lms/core/constants/mock_data.dart';
import 'package:vibrant_lms/core/di/injection.dart';
import 'package:vibrant_lms/features/auth/domain/repositories/repositories.dart';
import 'package:vibrant_lms/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:vibrant_lms/shared/models/entities.dart';
import 'package:vibrant_lms/shared/widgets/common_widgets.dart';
import 'package:vibrant_lms/shared/widgets/course_widgets.dart';
import 'package:vibrant_lms/themes/app_tokens.dart';
import 'package:vibrant_lms/themes/theme_mode_cubit.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final auth = context.watch<AuthBloc>().state;
    if (auth is! AuthAuthenticated) {
      return const LoadingView();
    }
    final user = auth.user;
    final themeMode = context.watch<ThemeCubit>().state;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            tooltip: 'Settings',
            onPressed: () => context.push('/settings'),
            icon: const Icon(Icons.settings_outlined),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.md),
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 36,
                backgroundImage:
                    user.photoUrl != null ? NetworkImage(user.photoUrl!) : null,
                child: user.photoUrl == null
                    ? Text(user.displayName.characters.first)
                    : null,
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(user.displayName, style: theme.textTheme.headlineSmall),
                    Text(user.email, style: theme.textTheme.bodyMedium),
                    const SizedBox(height: 6),
                    SoftBadge(
                      label: user.role.name.toUpperCase(),
                      icon: Icons.verified_outlined,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),
          Row(
            children: [
              Expanded(
                child: StatTile(
                  label: 'XP',
                  value: '${user.totalXp}',
                  icon: Icons.bolt_rounded,
                  color: AppColors.xp,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: StatTile(
                  label: 'Streak',
                  value: '${user.streakDays}d',
                  icon: Icons.local_fire_department_rounded,
                  color: AppColors.streak,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: StatTile(
                  label: 'Completed',
                  value: '${user.coursesCompleted}',
                  icon: Icons.school_outlined,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),
          Text('Achievements', style: theme.textTheme.titleMedium),
          const SizedBox(height: AppSpacing.sm),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: MockData.badges.map((b) {
              return Container(
                width: 108,
                padding: const EdgeInsets.all(AppSpacing.sm),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  color: b.isEarned
                      ? theme.colorScheme.primaryContainer.withValues(alpha: 0.55)
                      : theme.colorScheme.surfaceContainerHighest
                          .withValues(alpha: 0.4),
                  border: Border.all(
                    color: theme.colorScheme.outline.withValues(alpha: 0.25),
                  ),
                ),
                child: Column(
                  children: [
                    Icon(
                      _badgeIcon(b.iconName),
                      color: b.isEarned
                          ? theme.colorScheme.primary
                          : theme.colorScheme.onSurfaceVariant,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      b.title,
                      textAlign: TextAlign.center,
                      style: theme.textTheme.labelMedium,
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: AppSpacing.lg),
          Text('Preferences', style: theme.textTheme.titleMedium),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text('Dark mode'),
            subtitle: Text(
              themeMode == ThemeMode.system
                  ? 'System'
                  : themeMode == ThemeMode.dark
                      ? 'On'
                      : 'Off',
            ),
            value: themeMode == ThemeMode.dark ||
                (themeMode == ThemeMode.system &&
                    MediaQuery.platformBrightnessOf(context) == Brightness.dark),
            onChanged: (_) => context.read<ThemeCubit>().toggle(),
          ),
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.notifications_outlined),
            title: const Text('Notifications'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/notifications'),
          ),
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const Icon(Icons.analytics_outlined),
            title: const Text('Learning analytics'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/analytics'),
          ),
          const SizedBox(height: AppSpacing.md),
          VButton(
            label: 'Sign out',
            variant: VButtonVariant.outlined,
            icon: Icons.logout_rounded,
            onPressed: () {
              context.read<AuthBloc>().add(const AuthLogoutRequested());
              context.go('/login');
            },
          ),
        ],
      ),
    );
  }

  IconData _badgeIcon(String name) => switch (name) {
        'rocket' => Icons.rocket_launch_rounded,
        'local_fire_department' => Icons.local_fire_department_rounded,
        'emoji_events' => Icons.emoji_events_rounded,
        'workspace_premium' => Icons.workspace_premium_rounded,
        _ => Icons.military_tech_outlined,
      };
}

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final themeCubit = context.watch<ThemeCubit>();
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: [
          const ListTile(
            title: Text('Appearance'),
            subtitle: Text('Theme follows accessibility-friendly contrast'),
          ),
          RadioGroup<ThemeMode>(
            groupValue: themeCubit.state,
            onChanged: (value) {
              if (value != null) context.read<ThemeCubit>().setTheme(value);
            },
            child: Column(
              children: [
                for (final mode in ThemeMode.values)
                  RadioListTile<ThemeMode>(
                    title: Text(mode.name),
                    value: mode,
                  ),
              ],
            ),
          ),
          const Divider(),
          SwitchListTile(
            title: const Text('Push notifications'),
            subtitle: const Text('Course updates & reminders'),
            value: true,
            onChanged: (_) {},
          ),
          SwitchListTile(
            title: const Text('Email digests'),
            value: false,
            onChanged: (_) {},
          ),
          SwitchListTile(
            title: const Text('Download over Wi‑Fi only'),
            value: true,
            onChanged: (_) {},
          ),
          const Divider(),
          ListTile(
            title: const Text('Privacy policy'),
            trailing: const Icon(Icons.open_in_new),
            onTap: () {},
          ),
          ListTile(
            title: const Text('Terms of use'),
            trailing: const Icon(Icons.open_in_new),
            onTap: () {},
          ),
          ListTile(
            title: Text(
              'Demo mode',
              style: TextStyle(color: Theme.of(context).colorScheme.primary),
            ),
            subtitle: const Text(
              'Running with mock repositories (Firebase-ready)',
            ),
          ),
        ],
      ),
    );
  }
}

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  late Future<List<NotificationEntity>> _future;

  @override
  void initState() {
    super.initState();
    _future = sl<NotificationRepository>()
        .getNotifications()
        .then((r) => r.getOrElse(() => []));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: FutureBuilder<List<NotificationEntity>>(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const LoadingView();
          final items = snapshot.data!;
          if (items.isEmpty) {
            return const EmptyState(
              icon: Icons.notifications_none_rounded,
              title: 'You are all caught up',
            );
          }
          return ListView.separated(
            itemCount: items.length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (context, i) {
              final n = items[i];
              return ListTile(
                leading: CircleAvatar(
                  backgroundColor: Theme.of(context)
                      .colorScheme
                      .primaryContainer,
                  child: Icon(_icon(n.type)),
                ),
                title: Text(
                  n.title,
                  style: TextStyle(
                    fontWeight: n.isRead ? FontWeight.w500 : FontWeight.w700,
                  ),
                ),
                subtitle: Text(n.body),
                trailing: n.isRead
                    ? null
                    : SoftBadge(label: 'New', color: AppColors.secondary),
                onTap: () async {
                  await sl<NotificationRepository>().markRead(n.id);
                  if (n.actionRoute != null && context.mounted) {
                    context.push(n.actionRoute!);
                  }
                  setState(() {
                    _future = sl<NotificationRepository>()
                        .getNotifications()
                        .then((r) => r.getOrElse(() => []));
                  });
                },
              );
            },
          );
        },
      ),
    );
  }

  IconData _icon(String type) => switch (type) {
        'reminder' => Icons.local_fire_department_outlined,
        'course' => Icons.menu_book_outlined,
        'certificate' => Icons.workspace_premium_outlined,
        _ => Icons.notifications_outlined,
      };
}

class LearningAnalyticsPage extends StatelessWidget {
  const LearningAnalyticsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Learning analytics')),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.md),
        children: [
          Text('This week', style: theme.textTheme.titleLarge),
          const SizedBox(height: AppSpacing.sm),
          Row(
            children: [
              Expanded(
                child: StatTile(
                  label: 'Minutes',
                  value: '186',
                  icon: Icons.timer_outlined,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: StatTile(
                  label: 'Lessons',
                  value: '11',
                  icon: Icons.play_lesson_outlined,
                  color: AppColors.tertiary,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),
          Text('Focus areas', style: theme.textTheme.titleMedium),
          const SizedBox(height: AppSpacing.sm),
          for (final entry in [
            ('Flutter', 0.72),
            ('Design Systems', 0.54),
            ('Cloud', 1.0),
          ])
            Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(child: Text(entry.$1)),
                      Text('${(entry.$2 * 100).round()}%'),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: entry.$2,
                      minHeight: 8,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
