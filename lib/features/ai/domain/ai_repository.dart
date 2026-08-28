import 'package:dartz/dartz.dart';
import 'package:uuid/uuid.dart';
import 'package:vibrant_lms/core/errors/failures.dart';
import 'package:vibrant_lms/shared/models/entities.dart';

abstract class AiRepository {
  Future<Either<Failure, String>> chat({
    required String message,
    String? courseTitle,
    String? lessonTitle,
  });
  Future<Either<Failure, String>> explain({
    required String text,
    required String mode,
  });
  Future<Either<Failure, AssessmentEntity>> generateQuiz(String topic);
  Future<Either<Failure, List<Map<String, String>>>> flashcards(String topic);
  Future<Either<Failure, DailyPlanEntity>> dailyPlan();
  Future<Either<Failure, Map<String, dynamic>>> studySession({
    required String topic,
    required int minutes,
    required String difficulty,
  });
  Future<Either<Failure, Map<String, dynamic>>> generateCourse({
    required String name,
    required String description,
    required String subject,
    required String difficulty,
    required String audience,
  });
  Future<Either<Failure, String>> adminAssist(String prompt);
  Future<Either<Failure, Map<String, dynamic>>> evaluateAssignment(String text);
}

class MockAiRepository implements AiRepository {
  final _uuid = const Uuid();

  String _reply(String message, {String? lesson, String? course}) {
    final text = message.toLowerCase();
    final lessonTitle = lesson ?? 'this lesson';
    final courseTitle = course ?? 'UX Design for Beginners';
    if (text.contains('quiz')) {
      return 'Here is a short check on $lessonTitle. 1) What is the goal? 2) Name one method. 3) What mistake should you avoid? Reply and I will mark it.';
    }
    if (text.contains('example')) {
      return 'A product team interviews five customers before redesigning checkout. They learn the drop-off is trust, not layout — so they add reassurance instead of a new animation.';
    }
    if (text.contains('wrong') || text.contains('mistake')) {
      return 'Your answer missed the why. Usability testing observes behavior; surveys collect opinions. Mixing those up is the most common error I see.';
    }
    if (text.contains('simpler') || text.contains("don't understand") || text.contains('dont understand')) {
      return 'Let’s slow $lessonTitle down. We watch real people, note friction, then change the design. Two sentences, that is the whole idea.';
    }
    if (text.contains('summar')) {
      return 'Summary of $lessonTitle: define the problem, pick a method that fits, collect evidence, convert it into a decision.';
    }
    return 'I’m your tutor for $courseTitle, currently on $lessonTitle. $message\n\nConnect the idea to a decision you can make in a real product. Ask me to explain simpler, give an example, quiz you, or start from the beginning.';
  }

  @override
  Future<Either<Failure, String>> chat({
    required String message,
    String? courseTitle,
    String? lessonTitle,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 420));
    if (message.trim().isEmpty) {
      return const Left(ValidationFailure('Write a question first.'));
    }
    return Right(_reply(message, lesson: lessonTitle, course: courseTitle));
  }

  @override
  Future<Either<Failure, String>> explain({
    required String text,
    required String mode,
  }) {
    return chat(message: '$mode: $text');
  }

  @override
  Future<Either<Failure, AssessmentEntity>> generateQuiz(String topic) async {
    return Right(
      AssessmentEntity(
        id: 'ai_${_uuid.v4()}',
        courseId: 'c_ux',
        title: '$topic practice',
        type: AssessmentType.mixed,
        questions: [
          QuestionEntity(
            id: 'aq1',
            prompt: 'What best describes $topic?',
            options: const [
              'A surface-level opinion survey',
              'A structured way to reduce design risk',
              'A branding exercise',
              'A coding trick',
            ],
            correctIndex: 1,
            explanation: 'It exists to reduce expensive guesses.',
            topic: topic,
          ),
          QuestionEntity(
            id: 'aq2',
            prompt: '$topic is only useful for experts.',
            options: const ['True', 'False'],
            correctIndex: 1,
            qtype: 'true_false',
            topic: topic,
          ),
          QuestionEntity(
            id: 'aq3',
            prompt: 'Which method fits $topic when you need observed behavior?',
            options: const ['Survey', 'Usability test', 'Brand workshop', 'A/B guess'],
            correctIndex: 1,
            topic: topic,
          ),
        ],
      ),
    );
  }

  @override
  Future<Either<Failure, List<Map<String, String>>>> flashcards(String topic) async {
    return Right([
      for (var i = 1; i <= 6; i++)
        {'front': '$topic · $i', 'back': 'A practical way to apply $topic in your next critique.'},
    ]);
  }

  @override
  Future<Either<Failure, DailyPlanEntity>> dailyPlan() async {
    return const Right(
      DailyPlanEntity(
        title: "Today's goal",
        estimatedMinutes: 35,
        rationale: 'You are 65% through UX Design. Extra time on User Research will raise scores.',
        items: [
          DailyPlanItem(id: 'p1', title: 'Complete Lesson 4 — User Research', minutes: 12, kind: 'lesson'),
          DailyPlanItem(id: 'p2', title: 'Review User Personas', minutes: 10, kind: 'revision'),
          DailyPlanItem(id: 'p3', title: 'Take a 10-question quiz', minutes: 8, kind: 'quiz'),
          DailyPlanItem(id: 'p4', title: 'Practice one case study', minutes: 5, kind: 'practice'),
        ],
      ),
    );
  }

  @override
  Future<Either<Failure, Map<String, dynamic>>> studySession({
    required String topic,
    required int minutes,
    required String difficulty,
  }) async {
    final slice = (minutes / 4).floor().clamp(4, 20);
    return Right({
      'topic': topic,
      'minutes': minutes,
      'difficulty': difficulty,
      'blocks': [
        {'kind': 'Explanation', 'minutes': slice, 'content': 'Plain-language briefing on $topic.'},
        {'kind': 'Example', 'minutes': slice, 'content': 'A worked example applying $topic.'},
        {'kind': 'Practice', 'minutes': slice, 'content': 'One short exercise at $difficulty level.'},
        {'kind': 'Quiz', 'minutes': minutes - 3 * slice, 'content': 'Close with a 4-question check.'},
      ],
    });
  }

  @override
  Future<Either<Failure, Map<String, dynamic>>> generateCourse({
    required String name,
    required String description,
    required String subject,
    required String difficulty,
    required String audience,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 700));
    final ux = name.toLowerCase().contains('ux');
    final modules = ux
        ? [
            {
              'title': 'Introduction to UX',
              'lessons': ['What is UX?', 'UX vs UI', 'Design Thinking', 'User Research'],
            },
            {
              'title': 'User Research',
              'lessons': ['Research Methods', 'Interviews', 'Surveys', 'Personas'],
            },
            {
              'title': 'Experience Design',
              'lessons': ['User flows', 'Wireframes', 'Usability testing', 'Iteration'],
            },
          ]
        : [
            {
              'title': 'Introduction to $name',
              'lessons': ['What is this field?', 'Core vocabulary', 'How professionals work', 'First exercise'],
            },
            {
              'title': 'Foundations',
              'lessons': ['Mental models', 'Methods', 'Tools', 'Practice lab'],
            },
          ];
    return Right({
      'title': name,
      'description': description,
      'subject': subject,
      'difficulty': difficulty,
      'audience': audience,
      'modules': modules,
      'status': 'draft',
    });
  }

  @override
  Future<Either<Failure, String>> adminAssist(String prompt) async {
    final p = prompt.toLowerCase();
    if (p.contains('delete')) {
      return const Right('CONFIRM: This would delete records. Confirm in the dialog before the API executes.');
    }
    if (p.contains('inactive')) {
      return const Right('18 students look inactive this week (streak = 0).');
    }
    if (p.contains('struggl')) {
      return const Right('Students needing intervention: Jordan Lee, Riley Chen, Noah Brooks.');
    }
    if (p.contains('best')) {
      return const Right('UX Design for Beginners is performing best — 78% completion.');
    }
    if (p.contains('report')) {
      return const Right('Monthly report: 3,921 active students, \$184,250 revenue, 12,840 AI sessions.');
    }
    return Right('Prepared an admin action for: $prompt. Review before applying.');
  }

  @override
  Future<Either<Failure, Map<String, dynamic>>> evaluateAssignment(String text) async {
    final score = text.split(' ').length > 40 ? 86 : 71;
    return Right({
      'score': score,
      'strengths': ['Clear problem framing', 'Readable structure'],
      'weaknesses': ['Add one observation as evidence', 'Name the next experiment'],
      'feedback': 'Promising draft. Tie the insight to a product decision.',
    });
  }
}
