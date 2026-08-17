import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:vibrant_lms/core/di/injection.dart';
import 'package:vibrant_lms/features/auth/domain/repositories/repositories.dart';
import 'package:vibrant_lms/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:vibrant_lms/shared/models/entities.dart';
import 'package:vibrant_lms/shared/widgets/common_widgets.dart';
import 'package:vibrant_lms/shared/widgets/course_widgets.dart';
import 'package:vibrant_lms/themes/app_tokens.dart';

class AdminDashboardPage extends StatefulWidget {
  const AdminDashboardPage({super.key});

  @override
  State<AdminDashboardPage> createState() => _AdminDashboardPageState();
}

class _AdminDashboardPageState extends State<AdminDashboardPage> {
  late Future<AdminStatsEntity> _future;

  @override
  void initState() {
    super.initState();
    _future = sl<AdminRepository>()
        .getStats()
        .then((r) => r.getOrElse(() => throw Exception('stats')));
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final currency = NumberFormat.compactCurrency(symbol: '\$');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin dashboard'),
        actions: [
          IconButton(
            tooltip: 'Sign out',
            onPressed: () {
              context.read<AuthBloc>().add(const AuthLogoutRequested());
              context.go('/login');
            },
            icon: const Icon(Icons.logout_rounded),
          ),
        ],
      ),
      body: FutureBuilder<AdminStatsEntity>(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const LoadingView();
          final s = snapshot.data!;
          return ListView(
            padding: const EdgeInsets.all(AppSpacing.md),
            children: [
              Text(
                'Platform overview',
                style: theme.textTheme.headlineSmall,
              ),
              const SizedBox(height: 4),
              Text(
                'Monitor learners, courses, and engagement in real time.',
                style: theme.textTheme.bodyMedium,
              ),
              const SizedBox(height: AppSpacing.lg),
              LayoutBuilder(
                builder: (context, constraints) {
                  final cross = constraints.maxWidth > 700 ? 4 : 2;
                  return GridView.count(
                    crossAxisCount: cross,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: AppSpacing.sm,
                    crossAxisSpacing: AppSpacing.sm,
                    childAspectRatio: 1.35,
                    children: [
                      StatTile(
                        label: 'Total students',
                        value: NumberFormat.compact().format(s.totalStudents),
                        icon: Icons.groups_outlined,
                      ),
                      StatTile(
                        label: 'Active',
                        value: NumberFormat.compact().format(s.activeStudents),
                        icon: Icons.bolt_rounded,
                        color: AppColors.success,
                      ),
                      StatTile(
                        label: 'Courses',
                        value: '${s.totalCourses}',
                        icon: Icons.menu_book_outlined,
                        color: AppColors.tertiary,
                      ),
                      StatTile(
                        label: 'Revenue',
                        value: currency.format(s.revenue),
                        icon: Icons.payments_outlined,
                        color: AppColors.secondary,
                      ),
                    ],
                  );
                },
              ),
              const SizedBox(height: AppSpacing.lg),
              Row(
                children: [
                  Expanded(
                    child: StatTile(
                      label: 'Completion rate',
                      value: '${(s.completionRate * 100).round()}%',
                      icon: Icons.task_alt_rounded,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: StatTile(
                      label: 'Avg rating',
                      value: s.avgRating.toStringAsFixed(2),
                      icon: Icons.star_rounded,
                      color: AppColors.streak,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: StatTile(
                      label: 'New this week',
                      value: '${s.newSignupsThisWeek}',
                      icon: Icons.person_add_alt_1_outlined,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.xl),
              Text('Enrollments (7 days)', style: theme.textTheme.titleMedium),
              const SizedBox(height: AppSpacing.md),
              SizedBox(
                height: 200,
                child: BarChart(
                  BarChartData(
                    alignment: BarChartAlignment.spaceAround,
                    borderData: FlBorderData(show: false),
                    gridData: const FlGridData(show: false),
                    titlesData: FlTitlesData(
                      topTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      rightTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      leftTitles: const AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      bottomTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          getTitlesWidget: (v, _) {
                            const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                            final i = v.toInt();
                            if (i < 0 || i >= days.length) {
                              return const SizedBox.shrink();
                            }
                            return Text(days[i], style: theme.textTheme.labelSmall);
                          },
                        ),
                      ),
                    ),
                    barGroups: [
                      for (var i = 0; i < 7; i++)
                        BarChartGroupData(
                          x: i,
                          barRods: [
                            BarChartRodData(
                              toY: [42, 55, 48, 70, 63, 38, 51][i].toDouble(),
                              color: theme.colorScheme.primary,
                              width: 16,
                              borderRadius: BorderRadius.circular(6),
                            ),
                          ],
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.xl),
              Text('Quick actions', style: theme.textTheme.titleMedium),
              const SizedBox(height: AppSpacing.sm),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  FilledButton.tonalIcon(
                    onPressed: () => context.go('/admin/courses'),
                    icon: const Icon(Icons.add_rounded),
                    label: const Text('Manage courses'),
                  ),
                  FilledButton.tonalIcon(
                    onPressed: () => context.go('/admin/students'),
                    icon: const Icon(Icons.groups_outlined),
                    label: const Text('View students'),
                  ),
                  FilledButton.tonalIcon(
                    onPressed: () => context.go('/admin/analytics'),
                    icon: const Icon(Icons.insights_outlined),
                    label: const Text('Deep analytics'),
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );
  }
}

class AdminCoursesPage extends StatefulWidget {
  const AdminCoursesPage({super.key});

  @override
  State<AdminCoursesPage> createState() => _AdminCoursesPageState();
}

class _AdminCoursesPageState extends State<AdminCoursesPage> {
  late Future<List<CourseEntity>> _future;

  @override
  void initState() {
    super.initState();
    _future = sl<AdminRepository>()
        .getManagedCourses()
        .then((r) => r.getOrElse(() => []));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Course management')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Course builder opens here (Firebase Storage ready)'),
            ),
          );
        },
        icon: const Icon(Icons.add),
        label: const Text('New course'),
      ),
      body: FutureBuilder<List<CourseEntity>>(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const LoadingView();
          final courses = snapshot.data!;
          return ListView.separated(
            padding: const EdgeInsets.all(AppSpacing.md),
            itemCount: courses.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, i) {
              final c = courses[i];
              return ListTile(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(AppRadius.md),
                  side: BorderSide(
                    color: Theme.of(context)
                        .colorScheme
                        .outline
                        .withValues(alpha: 0.3),
                  ),
                ),
                leading: SoftBadge(label: c.category),
                title: Text(c.title),
                subtitle: Text(
                  '${c.studentsCount} students · ★ ${c.rating}',
                ),
                trailing: PopupMenuButton<String>(
                  onSelected: (v) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('$v · ${c.title}')),
                    );
                  },
                  itemBuilder: (_) => const [
                    PopupMenuItem(value: 'Edit', child: Text('Edit')),
                    PopupMenuItem(value: 'Publish', child: Text('Publish')),
                    PopupMenuItem(value: 'Archive', child: Text('Archive')),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class AdminStudentsPage extends StatefulWidget {
  const AdminStudentsPage({super.key});

  @override
  State<AdminStudentsPage> createState() => _AdminStudentsPageState();
}

class _AdminStudentsPageState extends State<AdminStudentsPage> {
  late Future<List<UserEntity>> _future;
  String _query = '';

  @override
  void initState() {
    super.initState();
    _future =
        sl<AdminRepository>().getStudents().then((r) => r.getOrElse(() => []));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Students')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: TextField(
              decoration: const InputDecoration(
                hintText: 'Search students…',
                prefixIcon: Icon(Icons.search),
              ),
              onChanged: (v) => setState(() => _query = v.toLowerCase()),
            ),
          ),
          Expanded(
            child: FutureBuilder<List<UserEntity>>(
              future: _future,
              builder: (context, snapshot) {
                if (!snapshot.hasData) return const LoadingView();
                final students = snapshot.data!
                    .where(
                      (s) =>
                          _query.isEmpty ||
                          s.displayName.toLowerCase().contains(_query) ||
                          s.email.toLowerCase().contains(_query),
                    )
                    .toList();
                return ListView.builder(
                  itemCount: students.length,
                  itemBuilder: (context, i) {
                    final s = students[i];
                    return ListTile(
                      leading: CircleAvatar(
                        backgroundImage: s.photoUrl != null
                            ? NetworkImage(s.photoUrl!)
                            : null,
                      ),
                      title: Text(s.displayName),
                      subtitle: Text(
                        '${s.email} · ${s.coursesCompleted} courses · ${s.totalXp} XP',
                      ),
                      trailing: SoftBadge(
                        label: '${s.streakDays}d',
                        color: AppColors.streak,
                        icon: Icons.local_fire_department,
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class AdminAnalyticsPage extends StatelessWidget {
  const AdminAnalyticsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Analytics')),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.md),
        children: [
          Text('Engagement mix', style: theme.textTheme.titleLarge),
          const SizedBox(height: AppSpacing.md),
          SizedBox(
            height: 220,
            child: PieChart(
              PieChartData(
                sectionsSpace: 2,
                centerSpaceRadius: 48,
                sections: [
                  PieChartSectionData(
                    value: 42,
                    title: 'Mobile',
                    color: theme.colorScheme.primary,
                    radius: 52,
                  ),
                  PieChartSectionData(
                    value: 28,
                    title: 'Design',
                    color: theme.colorScheme.secondary,
                    radius: 52,
                  ),
                  PieChartSectionData(
                    value: 18,
                    title: 'Data',
                    color: theme.colorScheme.tertiary,
                    radius: 52,
                  ),
                  PieChartSectionData(
                    value: 12,
                    title: 'Cloud',
                    color: AppColors.xp,
                    radius: 52,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
          Text('Operational insights', style: theme.textTheme.titleMedium),
          const SizedBox(height: AppSpacing.sm),
          const ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Icon(Icons.trending_up_rounded),
            title: Text('Completion up 8% week-over-week'),
            subtitle: Text('Driven by Flutter Mastery cohort'),
          ),
          const ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Icon(Icons.schedule_rounded),
            title: Text('Peak learning window: 7–9 PM'),
            subtitle: Text('Schedule live sessions accordingly'),
          ),
          const ListTile(
            contentPadding: EdgeInsets.zero,
            leading: Icon(Icons.warning_amber_rounded),
            title: Text('12 at-risk learners'),
            subtitle: Text('No activity in 14+ days'),
          ),
        ],
      ),
    );
  }
}
