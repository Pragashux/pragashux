import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:vibrant_lms/core/di/injection.dart';
import 'package:vibrant_lms/core/constants/mock_data.dart';
import 'package:vibrant_lms/features/auth/domain/repositories/repositories.dart';
import 'package:vibrant_lms/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:vibrant_lms/shared/models/entities.dart';
import 'package:vibrant_lms/shared/widgets/common_widgets.dart';
import 'package:vibrant_lms/shared/widgets/course_widgets.dart';
import 'package:vibrant_lms/themes/app_tokens.dart';

class StudentDashboardPage extends StatefulWidget {
  const StudentDashboardPage({super.key});

  @override
  State<StudentDashboardPage> createState() => _StudentDashboardPageState();
}

class _StudentDashboardPageState extends State<StudentDashboardPage> {
  late Future<List<CourseEntity>> _coursesFuture;

  @override
  void initState() {
    super.initState();
    _coursesFuture = _load();
  }

  Future<List<CourseEntity>> _load() async {
    final result = await sl<CourseRepository>().getCourses();
    return result.fold((_) => <CourseEntity>[], (c) => c);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final user = context.watch<AuthBloc>().state;
    final name = user is AuthAuthenticated ? user.user.displayName : 'Learner';
    final streak = user is AuthAuthenticated ? user.user.streakDays : 0;
    final xp = user is AuthAuthenticated ? user.user.totalXp : 0;

    return Scaffold(
      body: FutureBuilder<List<CourseEntity>>(
        future: _coursesFuture,
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const LoadingView(message: 'Loading your dashboard…');
          }
          final courses = snapshot.data!;
          final enrolled =
              courses.where((c) => c.isEnrolled && c.progress < 1).toList();
          final continueCourse =
              enrolled.isNotEmpty ? enrolled.first : null;
          final recommended =
              courses.where((c) => !c.isEnrolled).take(4).toList();
          final featured = courses.where((c) => c.isFeatured).toList();

          return CustomScrollView(
            slivers: [
              SliverAppBar(
                floating: true,
                title: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Hello, ${name.split(' ').first}',
                      style: theme.textTheme.titleLarge,
                    ),
                    Text(
                      'Ready to learn something new?',
                      style: theme.textTheme.bodySmall,
                    ),
                  ],
                ),
                actions: [
                  IconButton(
                    tooltip: 'Notifications',
                    onPressed: () => context.push('/notifications'),
                    icon: Badge(
                      isLabelVisible: MockData.notifications.any((n) => !n.isRead),
                      child: const Icon(Icons.notifications_outlined),
                    ),
                  ),
                ],
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(
                    AppSpacing.md,
                    AppSpacing.sm,
                    AppSpacing.md,
                    0,
                  ),
                  child: Row(
                    children: [
                      StreakChip(days: streak),
                      const SizedBox(width: AppSpacing.xs),
                      SoftBadge(
                        label: '$xp XP',
                        color: AppColors.xp,
                        icon: Icons.bolt_rounded,
                      ),
                    ],
                  )
                      .animate()
                      .fadeIn()
                      .slideY(begin: 0.1, curve: Curves.easeOut),
                ),
              ),
              if (continueCourse != null)
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    child: ContinueLearningCard(course: continueCourse),
                  ),
                ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                  child: Row(
                    children: [
                      Expanded(
                        child: StatTile(
                          label: 'In progress',
                          value: '${enrolled.length}',
                          icon: Icons.play_circle_outline_rounded,
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: StatTile(
                          label: 'Completed',
                          value:
                              '${courses.where((c) => c.enrollmentStatus == EnrollmentStatus.completed).length}',
                          icon: Icons.check_circle_outline_rounded,
                          color: AppColors.success,
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: StatTile(
                          label: 'Certificates',
                          value: '${MockData.certificates(name).length}',
                          icon: Icons.workspace_premium_outlined,
                          color: AppColors.certificate,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.lg)),
              SliverToBoxAdapter(
                child: SectionHeader(
                  title: 'Recommended',
                  subtitle: 'Curated for your path',
                  actionLabel: 'See all',
                  onAction: () => context.go('/catalog'),
                ),
              ),
              SliverToBoxAdapter(
                child: SizedBox(
                  height: 300,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    scrollDirection: Axis.horizontal,
                    itemCount: recommended.length,
                    separatorBuilder: (_, __) =>
                        const SizedBox(width: AppSpacing.sm),
                    itemBuilder: (context, i) => CourseCard(
                      course: recommended[i],
                      width: 240,
                    )
                        .animate(delay: (80 * i).ms)
                        .fadeIn()
                        .slideX(begin: 0.06),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: SectionHeader(
                  title: 'Featured',
                  subtitle: 'Hand-picked this week',
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.all(AppSpacing.md),
                sliver: SliverList.separated(
                  itemCount: featured.length,
                  separatorBuilder: (_, __) =>
                      const SizedBox(height: AppSpacing.sm),
                  itemBuilder: (context, i) => CourseCard(
                    course: featured[i],
                    compact: true,
                  ),
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xxl)),
            ],
          );
        },
      ),
    );
  }
}
