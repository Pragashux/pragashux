import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:video_player/video_player.dart';
import 'package:vibrant_lms/core/di/injection.dart';
import 'package:vibrant_lms/features/auth/domain/repositories/repositories.dart';
import 'package:vibrant_lms/shared/models/entities.dart';
import 'package:vibrant_lms/shared/widgets/common_widgets.dart';
import 'package:vibrant_lms/themes/app_tokens.dart';

class LearningPage extends StatefulWidget {
  const LearningPage({super.key, required this.courseId});

  final String courseId;

  @override
  State<LearningPage> createState() => _LearningPageState();
}

class _LearningPageState extends State<LearningPage> {
  late Future<({CourseEntity course, List<ModuleEntity> modules})> _future;
  LessonEntity? _selected;
  final _noteCtrl = TextEditingController();
  final Set<String> _bookmarked = {};
  final Set<String> _completed = {};

  @override
  void initState() {
    super.initState();
    _future = _load();
  }

  Future<({CourseEntity course, List<ModuleEntity> modules})> _load() async {
    final repo = sl<CourseRepository>();
    final course = (await repo.getCourse(widget.courseId))
        .getOrElse(() => throw Exception('Course missing'));
    final modules =
        (await repo.getModules(widget.courseId)).getOrElse(() => []);
    for (final m in modules) {
      for (final l in m.lessons) {
        if (l.isCompleted) _completed.add(l.id);
        if (l.isBookmarked) _bookmarked.add(l.id);
      }
    }
    _selected ??= modules.isNotEmpty && modules.first.lessons.isNotEmpty
        ? modules.first.lessons.first
        : null;
    return (course: course, modules: modules);
  }

  @override
  void dispose() {
    _noteCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final wide = MediaQuery.sizeOf(context).width >= 900;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Learning'),
        actions: [
          IconButton(
            tooltip: 'Take assessment',
            onPressed: () => context.push('/assessments/${widget.courseId}'),
            icon: const Icon(Icons.quiz_outlined),
          ),
          IconButton(
            tooltip: 'Discussion',
            onPressed: () => _showDiscussion(context),
            icon: const Icon(Icons.forum_outlined),
          ),
        ],
      ),
      body: FutureBuilder(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const LoadingView();
          final modules = snapshot.data!.modules;
          final course = snapshot.data!.course;
          final lesson = _selected;

          final player = lesson == null
              ? const EmptyState(
                  icon: Icons.menu_book_outlined,
                  title: 'Select a lesson',
                )
              : _LessonPlayer(
                  lesson: lesson,
                  bookmarked: _bookmarked.contains(lesson.id),
                  completed: _completed.contains(lesson.id),
                  noteController: _noteCtrl,
                  onBookmark: () {
                    setState(() {
                      if (_bookmarked.contains(lesson.id)) {
                        _bookmarked.remove(lesson.id);
                      } else {
                        _bookmarked.add(lesson.id);
                      }
                    });
                  },
                  onComplete: () {
                    setState(() => _completed.add(lesson.id));
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Lesson marked complete')),
                    );
                  },
                );

          final curriculum = _CurriculumPane(
            modules: modules,
            selectedId: lesson?.id,
            completed: _completed,
            onSelect: (l) => setState(() {
              _selected = l;
              _noteCtrl.clear();
            }),
          );

          if (wide) {
            return Row(
              children: [
                SizedBox(width: 320, child: curriculum),
                const VerticalDivider(width: 1),
                Expanded(child: player),
              ],
            );
          }

          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppSpacing.md,
                  0,
                  AppSpacing.md,
                  AppSpacing.xs,
                ),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Text(course.title, style: theme.textTheme.titleSmall),
                ),
              ),
              Expanded(flex: 3, child: player),
              const Divider(height: 1),
              Expanded(flex: 2, child: curriculum),
            ],
          );
        },
      ),
    );
  }

  void _showDiscussion(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      showDragHandle: true,
      isScrollControlled: true,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            left: AppSpacing.md,
            right: AppSpacing.md,
            bottom: MediaQuery.viewInsetsOf(context).bottom + AppSpacing.lg,
            top: AppSpacing.sm,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Discussion forum',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: AppSpacing.sm),
              const ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(child: Text('A')),
                title: Text('How do repositories stay testable?'),
                subtitle: Text('Alex · 2 replies'),
              ),
              const ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(child: Text('J')),
                title: Text('Best practices for lesson downloads?'),
                subtitle: Text('Jordan · 5 replies'),
              ),
              const SizedBox(height: AppSpacing.sm),
              TextField(
                decoration: const InputDecoration(
                  hintText: 'Start a discussion…',
                  suffixIcon: Icon(Icons.send_rounded),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _CurriculumPane extends StatelessWidget {
  const _CurriculumPane({
    required this.modules,
    required this.selectedId,
    required this.completed,
    required this.onSelect,
  });

  final List<ModuleEntity> modules;
  final String? selectedId;
  final Set<String> completed;
  final ValueChanged<LessonEntity> onSelect;

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        for (final m in modules)
          ExpansionTile(
            initiallyExpanded: true,
            title: Text(m.title),
            children: [
              for (final l in m.lessons)
                ListTile(
                  selected: l.id == selectedId,
                  leading: Icon(
                    completed.contains(l.id)
                        ? Icons.check_circle_rounded
                        : Icons.circle_outlined,
                    color: completed.contains(l.id)
                        ? AppColors.success
                        : null,
                  ),
                  title: Text(l.title),
                  subtitle: Text(
                    '${l.type.name} · ${l.durationMinutes} min',
                  ),
                  onTap: () => onSelect(l),
                ),
            ],
          ),
      ],
    );
  }
}

class _LessonPlayer extends StatefulWidget {
  const _LessonPlayer({
    required this.lesson,
    required this.bookmarked,
    required this.completed,
    required this.noteController,
    required this.onBookmark,
    required this.onComplete,
  });

  final LessonEntity lesson;
  final bool bookmarked;
  final bool completed;
  final TextEditingController noteController;
  final VoidCallback onBookmark;
  final VoidCallback onComplete;

  @override
  State<_LessonPlayer> createState() => _LessonPlayerState();
}

class _LessonPlayerState extends State<_LessonPlayer> {
  VideoPlayerController? _video;

  @override
  void initState() {
    super.initState();
    _initVideo();
  }

  @override
  void didUpdateWidget(covariant _LessonPlayer oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.lesson.id != widget.lesson.id) {
      _video?.dispose();
      _video = null;
      _initVideo();
    }
  }

  Future<void> _initVideo() async {
    if (widget.lesson.type != LessonType.video ||
        widget.lesson.contentUrl == null) {
      setState(() {});
      return;
    }
    final controller =
        VideoPlayerController.networkUrl(Uri.parse(widget.lesson.contentUrl!));
    _video = controller;
    try {
      await controller.initialize();
      if (mounted) setState(() {});
    } catch (_) {
      if (mounted) setState(() {});
    }
  }

  @override
  void dispose() {
    _video?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final lesson = widget.lesson;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(lesson.title, style: theme.textTheme.headlineSmall),
          const SizedBox(height: AppSpacing.sm),
          SoftBadge(label: lesson.type.name.toUpperCase()),
          const SizedBox(height: AppSpacing.md),
          if (lesson.type == LessonType.video) ...[
            AspectRatio(
              aspectRatio: _video?.value.isInitialized == true
                  ? _video!.value.aspectRatio
                  : 16 / 9,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(AppRadius.md),
                ),
                child: _video?.value.isInitialized == true
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(AppRadius.md),
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            VideoPlayer(_video!),
                            IconButton(
                              iconSize: 56,
                              color: Colors.white,
                              onPressed: () {
                                setState(() {
                                  _video!.value.isPlaying
                                      ? _video!.pause()
                                      : _video!.play();
                                });
                              },
                              icon: Icon(
                                _video!.value.isPlaying
                                    ? Icons.pause_circle_filled
                                    : Icons.play_circle_filled,
                              ),
                            ),
                          ],
                        ),
                      )
                    : const Center(
                        child: CircularProgressIndicator(color: Colors.white),
                      ),
              ),
            ),
          ] else if (lesson.type == LessonType.article ||
              lesson.type == LessonType.pdf) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceContainerHighest
                    .withValues(alpha: 0.5),
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              child: Text(
                lesson.contentHtml
                        ?.replaceAll(RegExp(r'<[^>]+>'), ' ')
                        .trim() ??
                    'Open the attached ${lesson.type.name} resource to continue.',
                style: theme.textTheme.bodyLarge,
              ),
            ),
          ] else if (lesson.type == LessonType.interactive) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.lg),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    theme.colorScheme.primaryContainer,
                    theme.colorScheme.secondaryContainer,
                  ],
                ),
                borderRadius: BorderRadius.circular(AppRadius.md),
              ),
              child: Column(
                children: [
                  const Icon(Icons.touch_app_rounded, size: 40),
                  const SizedBox(height: 8),
                  Text(
                    'Interactive lab',
                    style: theme.textTheme.titleMedium,
                  ),
                  const Text('Complete the guided exercise to unlock XP.'),
                  const SizedBox(height: 12),
                  VButton(
                    label: 'Start lab',
                    expanded: false,
                    onPressed: widget.onComplete,
                  ),
                ],
              ),
            ),
          ] else ...[
            VButton(
              label: 'Open quiz',
              icon: Icons.quiz_outlined,
              onPressed: () =>
                  context.push('/assessments/${lesson.moduleId.split('_').first}'),
            ),
          ],
          const SizedBox(height: AppSpacing.md),
          Row(
            children: [
              IconButton.filledTonal(
                tooltip: widget.bookmarked ? 'Remove bookmark' : 'Bookmark',
                onPressed: widget.onBookmark,
                icon: Icon(
                  widget.bookmarked
                      ? Icons.bookmark_rounded
                      : Icons.bookmark_border_rounded,
                ),
              ),
              IconButton.filledTonal(
                tooltip: 'Download for offline',
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Queued for offline download')),
                  );
                },
                icon: const Icon(Icons.download_outlined),
              ),
              const Spacer(),
              if (!widget.completed)
                FilledButton.icon(
                  onPressed: widget.onComplete,
                  icon: const Icon(Icons.check_rounded),
                  label: const Text('Mark complete'),
                )
              else
                SoftBadge(
                  label: 'Completed',
                  color: AppColors.success,
                  icon: Icons.check_circle_rounded,
                ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),
          Text('Your notes', style: theme.textTheme.titleMedium),
          const SizedBox(height: AppSpacing.xs),
          TextField(
            controller: widget.noteController,
            maxLines: 4,
            decoration: const InputDecoration(
              hintText: 'Capture insights, questions, and follow-ups…',
            ),
          ),
          const SizedBox(height: AppSpacing.sm),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Note saved')),
                );
              },
              icon: const Icon(Icons.save_outlined),
              label: const Text('Save note'),
            ),
          ),
        ],
      ),
    );
  }
}
