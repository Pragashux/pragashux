import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:vibrant_lms/core/constants/mock_data.dart';
import 'package:vibrant_lms/core/di/injection.dart';
import 'package:vibrant_lms/features/auth/domain/repositories/repositories.dart';
import 'package:vibrant_lms/shared/models/entities.dart';
import 'package:vibrant_lms/shared/widgets/common_widgets.dart';
import 'package:vibrant_lms/shared/widgets/course_widgets.dart';
import 'package:vibrant_lms/themes/app_tokens.dart';

class CourseCatalogPage extends StatefulWidget {
  const CourseCatalogPage({super.key});

  @override
  State<CourseCatalogPage> createState() => _CourseCatalogPageState();
}

class _CourseCatalogPageState extends State<CourseCatalogPage> {
  final _search = TextEditingController();
  String _category = 'All';
  late Future<List<CourseEntity>> _future;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<List<CourseEntity>> _load() async {
    final result = await sl<CourseRepository>().getCourses(
      query: _search.text,
      category: _category,
    );
    return result.fold((_) => [], (c) => c);
  }

  void _refresh() => setState(() => _future = _load());

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Course catalog')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(
              AppSpacing.md,
              AppSpacing.sm,
              AppSpacing.md,
              0,
            ),
            child: TextField(
              controller: _search,
              onSubmitted: (_) => _refresh(),
              decoration: InputDecoration(
                hintText: 'Search courses, skills, topics…',
                prefixIcon: const Icon(Icons.search_rounded),
                suffixIcon: IconButton(
                  tooltip: 'Search',
                  onPressed: _refresh,
                  icon: const Icon(Icons.arrow_forward_rounded),
                ),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          SizedBox(
            height: 40,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
              scrollDirection: Axis.horizontal,
              itemCount: MockData.categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, i) {
                final cat = MockData.categories[i];
                final selected = cat == _category;
                return FilterChip(
                  label: Text(cat),
                  selected: selected,
                  onSelected: (_) {
                    setState(() => _category = cat);
                    _refresh();
                  },
                );
              },
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Expanded(
            child: FutureBuilder<List<CourseEntity>>(
              future: _future,
              builder: (context, snapshot) {
                if (!snapshot.hasData) {
                  return const LoadingView();
                }
                final courses = snapshot.data!;
                if (courses.isEmpty) {
                  return const EmptyState(
                    icon: Icons.search_off_rounded,
                    title: 'No courses found',
                    message: 'Try another keyword or category.',
                  );
                }
                final popular = courses.where((c) => c.isPopular).toList();
                return CustomScrollView(
                  slivers: [
                    if (popular.isNotEmpty) ...[
                      const SliverToBoxAdapter(
                        child: SectionHeader(
                          title: 'Popular',
                          subtitle: 'Trending with learners',
                        ),
                      ),
                      SliverToBoxAdapter(
                        child: SizedBox(
                          height: 300,
                          child: ListView.separated(
                            padding: const EdgeInsets.all(AppSpacing.md),
                            scrollDirection: Axis.horizontal,
                            itemCount: popular.length,
                            separatorBuilder: (_, __) =>
                                const SizedBox(width: AppSpacing.sm),
                            itemBuilder: (context, i) => CourseCard(
                              course: popular[i],
                              width: 240,
                            ),
                          ),
                        ),
                      ),
                    ],
                    const SliverToBoxAdapter(
                      child: SectionHeader(title: 'All courses'),
                    ),
                    if (MediaQuery.sizeOf(context).width >= 700)
                      SliverPadding(
                        padding: const EdgeInsets.all(AppSpacing.md),
                        sliver: SliverGrid(
                          gridDelegate:
                              const SliverGridDelegateWithMaxCrossAxisExtent(
                            maxCrossAxisExtent: 320,
                            mainAxisExtent: 320,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                          ),
                          delegate: SliverChildBuilderDelegate(
                            (context, i) => CourseCard(course: courses[i]),
                            childCount: courses.length,
                          ),
                        ),
                      )
                    else
                      SliverPadding(
                        padding: const EdgeInsets.all(AppSpacing.md),
                        sliver: SliverList.separated(
                          itemCount: courses.length,
                          separatorBuilder: (_, __) =>
                              const SizedBox(height: AppSpacing.sm),
                          itemBuilder: (context, i) =>
                              CourseCard(course: courses[i], compact: true),
                        ),
                      ),
                    const SliverToBoxAdapter(
                      child: SizedBox(height: AppSpacing.xl),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class CourseDetailPage extends StatefulWidget {
  const CourseDetailPage({super.key, required this.courseId});

  final String courseId;

  @override
  State<CourseDetailPage> createState() => _CourseDetailPageState();
}

class _CourseDetailPageState extends State<CourseDetailPage> {
  late Future<
      ({
        CourseEntity course,
        List<ModuleEntity> modules,
        List<ReviewEntity> reviews,
      })> _future;
  bool _enrolling = false;

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<
      ({
        CourseEntity course,
        List<ModuleEntity> modules,
        List<ReviewEntity> reviews,
      })> _load() async {
    final repo = sl<CourseRepository>();
    final course = (await repo.getCourse(widget.courseId))
        .getOrElse(() => throw Exception('missing'));
    final modules =
        (await repo.getModules(widget.courseId)).getOrElse(() => []);
    final reviews =
        (await repo.getReviews(widget.courseId)).getOrElse(() => []);
    return (course: course, modules: modules, reviews: reviews);
  }

  Future<void> _enroll(CourseEntity course) async {
    setState(() => _enrolling = true);
    final result = await sl<CourseRepository>().enroll(course.id);
    setState(() => _enrolling = false);
    result.fold(
      (f) => ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(f.message)),
      ),
      (_) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Enrolled successfully!')),
        );
        setState(() => _future = _load());
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: FutureBuilder(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const LoadingView();
          }
          final data = snapshot.data!;
          final course = data.course;
          final modules = data.modules;
          final reviews = data.reviews;

          return CustomScrollView(
            slivers: [
              SliverAppBar.large(
                title: Text(course.title),
                actions: [
                  IconButton(
                    tooltip: 'Share',
                    onPressed: () {},
                    icon: const Icon(Icons.share_outlined),
                  ),
                ],
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SoftBadge(label: course.level.name),
                      const SizedBox(height: AppSpacing.sm),
                      Text(course.description, style: theme.textTheme.bodyLarge),
                      const SizedBox(height: AppSpacing.md),
                      Row(
                        children: [
                          CircleAvatar(
                            backgroundImage: NetworkImage(
                              course.instructor.avatarUrl ?? '',
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  course.instructor.name,
                                  style: theme.textTheme.titleSmall,
                                ),
                                Text(
                                  course.instructor.title,
                                  style: theme.textTheme.bodySmall,
                                ),
                              ],
                            ),
                          ),
                          SoftBadge(
                            label: course.instructor.rating.toStringAsFixed(1),
                            icon: Icons.star_rounded,
                            color: AppColors.streak,
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.lg),
                      Text('What you will learn', style: theme.textTheme.titleMedium),
                      const SizedBox(height: AppSpacing.sm),
                      ...course.objectives.map(
                        (o) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Icon(
                                Icons.check_circle_rounded,
                                size: 20,
                                color: theme.colorScheme.primary,
                              ),
                              const SizedBox(width: 8),
                              Expanded(child: Text(o)),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      Text('Curriculum', style: theme.textTheme.titleMedium),
                      const SizedBox(height: AppSpacing.sm),
                      ...modules.map(
                        (m) => ExpansionTile(
                          title: Text(m.title),
                          subtitle: Text('${m.lessons.length} lessons'),
                          children: m.lessons
                              .map(
                                (l) => ListTile(
                                  leading: Icon(_lessonIcon(l.type)),
                                  title: Text(l.title),
                                  trailing: Text('${l.durationMinutes} min'),
                                  dense: true,
                                ),
                              )
                              .toList(),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      Text(
                        'Ratings & reviews',
                        style: theme.textTheme.titleMedium,
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      Row(
                        children: [
                          Text(
                            course.rating.toStringAsFixed(1),
                            style: theme.textTheme.displaySmall,
                          ),
                          const SizedBox(width: 8),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: List.generate(
                                  5,
                                  (i) => Icon(
                                    i < course.rating.round()
                                        ? Icons.star_rounded
                                        : Icons.star_outline_rounded,
                                    color: AppColors.streak,
                                    size: 18,
                                  ),
                                ),
                              ),
                              Text('${course.reviewCount} reviews'),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      ...reviews.map(
                        (r) => ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: CircleAvatar(
                            backgroundImage: NetworkImage(r.avatarUrl ?? ''),
                          ),
                          title: Text(r.userName),
                          subtitle: Text(r.comment),
                          trailing: SoftBadge(
                            label: r.rating.toStringAsFixed(1),
                            color: AppColors.streak,
                          ),
                        ),
                      ),
                      const SizedBox(height: 100),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
      bottomNavigationBar: FutureBuilder(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const SizedBox.shrink();
          final course = snapshot.data!.course;
          return SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: course.isEnrolled
                  ? VButton(
                      label: 'Continue learning',
                      icon: Icons.play_arrow_rounded,
                      onPressed: () => context.push('/learn/${course.id}'),
                    )
                  : VButton(
                      label: course.price == 0
                          ? 'Enroll free'
                          : 'Enroll · \$${course.price.toStringAsFixed(0)}',
                      loading: _enrolling,
                      onPressed: () => _enroll(course),
                    ),
            ),
          );
        },
      ),
    );
  }

  IconData _lessonIcon(LessonType type) => switch (type) {
        LessonType.video => Icons.play_circle_outline,
        LessonType.pdf => Icons.picture_as_pdf_outlined,
        LessonType.article => Icons.article_outlined,
        LessonType.interactive => Icons.touch_app_outlined,
        LessonType.quiz => Icons.quiz_outlined,
      };
}
