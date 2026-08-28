import 'package:vibrant_lms/features/ai/domain/ai_repository.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final repo = MockAiRepository();

  test('tutor explains usability testing simply', () async {
    final result = await repo.chat(
      message: "I don't understand usability testing.",
      courseTitle: 'UX Design for Beginners',
      lessonTitle: 'Usability testing',
    );
    final text = result.getOrElse(() => '');
    expect(text.toLowerCase(), contains('usability'));
  });

  test('course generator matches UX beginner structure', () async {
    final result = await repo.generateCourse(
      name: 'UX Design for Beginners',
      description: 'Intro',
      subject: 'UX',
      difficulty: 'beginner',
      audience: 'New designers',
    );
    final draft = result.getOrElse(() => {});
    final modules = draft['modules'] as List;
    expect(modules.first['title'], 'Introduction to UX');
    expect((modules.first['lessons'] as List).first, 'What is UX?');
  });

  test('daily plan has four timed items', () async {
    final plan = (await repo.dailyPlan()).getOrElse(() => throw StateError('plan'));
    expect(plan.items.length, 4);
    expect(plan.estimatedMinutes, 35);
  });
}
