import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:vibrant_lms/shared/models/entities.dart';
import 'package:vibrant_lms/shared/widgets/common_widgets.dart';
import 'package:vibrant_lms/themes/app_tokens.dart';

class CourseCard extends StatelessWidget {
  const CourseCard({
    super.key,
    required this.course,
    this.compact = false,
    this.width,
  });

  final CourseEntity course;
  final bool compact;
  final double? width;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final card = Material(
      color: theme.colorScheme.surface,
      borderRadius: BorderRadius.circular(AppRadius.md),
      child: InkWell(
        onTap: () => context.push('/courses/${course.id}'),
        borderRadius: BorderRadius.circular(AppRadius.md),
        child: Ink(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(AppRadius.md),
            border: Border.all(
              color: theme.colorScheme.outline.withValues(alpha: 0.3),
            ),
          ),
          child: compact ? _compact(theme) : _full(theme),
        ),
      ),
    );

    if (width != null) {
      return SizedBox(width: width, child: card);
    }
    return card;
  }

  Widget _full(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: const BorderRadius.vertical(
            top: Radius.circular(AppRadius.md),
          ),
          child: AspectRatio(
            aspectRatio: 16 / 9,
            child: CachedNetworkImage(
              imageUrl: course.thumbnailUrl,
              fit: BoxFit.cover,
              placeholder: (_, __) => Container(
                color: theme.colorScheme.surfaceContainerHighest,
              ),
              errorWidget: (_, __, ___) => Container(
                color: theme.colorScheme.primaryContainer,
                child: const Icon(Icons.school_outlined),
              ),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(AppSpacing.sm),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SoftBadge(label: course.category),
              const SizedBox(height: 8),
              Text(
                course.title,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.titleSmall,
              ),
              const SizedBox(height: 6),
              Text(
                course.instructor.name,
                style: theme.textTheme.bodySmall,
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.star_rounded, size: 16, color: AppColors.streak),
                  const SizedBox(width: 4),
                  Text(
                    course.rating.toStringAsFixed(1),
                    style: theme.textTheme.labelMedium,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '· ${course.studentsCount} learners',
                    style: theme.textTheme.bodySmall,
                  ),
                ],
              ),
              if (course.isEnrolled) ...[
                const SizedBox(height: 10),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: course.progress,
                    minHeight: 6,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${(course.progress * 100).round()}% complete',
                  style: theme.textTheme.labelSmall,
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }

  Widget _compact(ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.sm),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(AppRadius.sm),
            child: CachedNetworkImage(
              imageUrl: course.thumbnailUrl,
              width: 88,
              height: 66,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  course.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: theme.textTheme.titleSmall,
                ),
                const SizedBox(height: 4),
                if (course.isEnrolled)
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: course.progress,
                      minHeight: 5,
                    ),
                  )
                else
                  Text(course.instructor.name, style: theme.textTheme.bodySmall),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class ContinueLearningCard extends StatelessWidget {
  const ContinueLearningCard({super.key, required this.course});

  final CourseEntity course;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Material(
      color: theme.colorScheme.primaryContainer.withValues(alpha: 0.55),
      borderRadius: BorderRadius.circular(AppRadius.lg),
      child: InkWell(
        borderRadius: BorderRadius.circular(AppRadius.lg),
        onTap: () => context.push('/learn/${course.id}'),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Row(
            children: [
              ProgressRing(
                progress: course.progress,
                size: 64,
                child: Text(
                  '${(course.progress * 100).round()}%',
                  style: theme.textTheme.labelMedium?.copyWith(
                    color: theme.colorScheme.onPrimaryContainer,
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Continue learning',
                      style: theme.textTheme.labelMedium?.copyWith(
                        color: theme.colorScheme.primary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      course.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: theme.textTheme.titleMedium,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Pick up where you left off',
                      style: theme.textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.play_circle_fill_rounded,
                size: 40,
                color: theme.colorScheme.primary,
              ),
            ],
          ),
        ),
      ),
    )
        .animate()
        .fadeIn(duration: 400.ms)
        .slideY(begin: 0.08, curve: Curves.easeOutCubic);
  }
}

class StreakChip extends StatelessWidget {
  const StreakChip({super.key, required this.days});

  final int days;

  @override
  Widget build(BuildContext context) {
    return SoftBadge(
      label: '$days day streak',
      color: AppColors.streak,
      icon: Icons.local_fire_department_rounded,
    );
  }
}

class StatTile extends StatelessWidget {
  const StatTile({
    super.key,
    required this.label,
    required this.value,
    required this.icon,
    this.color,
  });

  final String label;
  final String value;
  final IconData icon;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final c = color ?? theme.colorScheme.primary;
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(AppRadius.md),
        border: Border.all(
          color: theme.colorScheme.outline.withValues(alpha: 0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: c),
          const SizedBox(height: AppSpacing.sm),
          Text(value, style: theme.textTheme.headlineSmall),
          Text(label, style: theme.textTheme.bodySmall),
        ],
      ),
    );
  }
}
