import 'package:vibrant_lms/shared/models/entities.dart';

/// Seed data for demo / offline mode. Swap repositories for Firebase in production.
abstract final class MockData {
  static const instructorMaya = InstructorEntity(
    id: 'inst_1',
    name: 'Maya Chen',
    title: 'Senior Product Designer',
    bio: 'Ex-Figma · 12 years teaching design systems and UX craft.',
    rating: 4.9,
    studentsCount: 48200,
    coursesCount: 14,
    avatarUrl: 'https://i.pravatar.cc/150?u=maya',
  );

  static const instructorOmar = InstructorEntity(
    id: 'inst_2',
    name: 'Omar Hassan',
    title: 'Staff Engineer',
    bio: 'Flutter & Dart specialist. Built apps used by millions.',
    rating: 4.8,
    studentsCount: 31100,
    coursesCount: 9,
    avatarUrl: 'https://i.pravatar.cc/150?u=omar',
  );

  static const instructorPriya = InstructorEntity(
    id: 'inst_3',
    name: 'Priya Nair',
    title: 'Data Science Lead',
    bio: 'ML educator focused on practical, ethical AI.',
    rating: 4.95,
    studentsCount: 52700,
    coursesCount: 11,
    avatarUrl: 'https://i.pravatar.cc/150?u=priya',
  );

  static List<CourseEntity> courses = [
    CourseEntity(
      id: 'c1',
      title: 'Flutter Mastery: Build Production Apps',
      description:
          'Ship polished Flutter apps with Clean Architecture, Bloc, and Firebase. '
          'From pixels to Play Store with confidence.',
      category: 'Mobile Development',
      thumbnailUrl: 'https://picsum.photos/seed/flutter/800/450',
      instructor: instructorOmar,
      level: CourseLevel.intermediate,
      rating: 4.9,
      reviewCount: 3842,
      studentsCount: 28940,
      durationHours: 18.5,
      lessonsCount: 64,
      price: 0,
      isFeatured: true,
      isPopular: true,
      objectives: const [
        'Architect scalable Flutter apps',
        'Master Bloc & Riverpod patterns',
        'Integrate Firebase Auth, Firestore, Storage',
        'Ship accessible Material 3 UIs',
      ],
      tags: const ['Flutter', 'Dart', 'Firebase', 'Mobile'],
      progress: 0.42,
      enrollmentStatus: EnrollmentStatus.enrolled,
    ),
    CourseEntity(
      id: 'c2',
      title: 'Design Systems that Scale',
      description:
          'Craft tokens, components, and documentation that keep product teams aligned.',
      category: 'Design',
      thumbnailUrl: 'https://picsum.photos/seed/design/800/450',
      instructor: instructorMaya,
      level: CourseLevel.advanced,
      rating: 4.85,
      reviewCount: 2104,
      studentsCount: 15620,
      durationHours: 12,
      lessonsCount: 38,
      price: 49,
      isFeatured: true,
      objectives: const [
        'Define color, type, and spacing tokens',
        'Build reusable component libraries',
        'Document with Storybook-like workflows',
      ],
      tags: const ['Design Systems', 'Figma', 'Tokens'],
      progress: 0.78,
      enrollmentStatus: EnrollmentStatus.enrolled,
    ),
    CourseEntity(
      id: 'c3',
      title: 'Practical Machine Learning',
      description:
          'From notebooks to production models — without the hype, with real datasets.',
      category: 'Data Science',
      thumbnailUrl: 'https://picsum.photos/seed/ml/800/450',
      instructor: instructorPriya,
      level: CourseLevel.beginner,
      rating: 4.7,
      reviewCount: 1560,
      studentsCount: 22100,
      durationHours: 22,
      lessonsCount: 52,
      price: 79,
      isPopular: true,
      objectives: const [
        'Train and evaluate classic ML models',
        'Avoid common data leakage pitfalls',
        'Deploy simple inference APIs',
      ],
      tags: const ['Python', 'ML', 'AI'],
    ),
    CourseEntity(
      id: 'c4',
      title: 'UX Writing for Product Teams',
      description: 'Clear microcopy that reduces friction and builds trust.',
      category: 'Design',
      thumbnailUrl: 'https://picsum.photos/seed/uxwrite/800/450',
      instructor: instructorMaya,
      level: CourseLevel.beginner,
      rating: 4.75,
      reviewCount: 890,
      studentsCount: 9400,
      durationHours: 6,
      lessonsCount: 24,
      price: 29,
      tags: const ['UX Writing', 'Content'],
    ),
    CourseEntity(
      id: 'c5',
      title: 'Cloud Fundamentals for Mobile Devs',
      description: 'Auth, storage, messaging, and analytics — the essentials.',
      category: 'Cloud',
      thumbnailUrl: 'https://picsum.photos/seed/cloud/800/450',
      instructor: instructorOmar,
      level: CourseLevel.beginner,
      rating: 4.6,
      reviewCount: 1120,
      studentsCount: 13400,
      durationHours: 10,
      lessonsCount: 30,
      price: 0,
      isPopular: true,
      tags: const ['Firebase', 'AWS', 'Backend'],
      enrollmentStatus: EnrollmentStatus.completed,
      progress: 1,
    ),
    CourseEntity(
      id: 'c6',
      title: 'Accessible Interfaces',
      description: 'WCAG, semantics, and inclusive design patterns that ship.',
      category: 'Design',
      thumbnailUrl: 'https://picsum.photos/seed/a11y/800/450',
      instructor: instructorMaya,
      level: CourseLevel.intermediate,
      rating: 4.92,
      reviewCount: 640,
      studentsCount: 7200,
      durationHours: 8,
      lessonsCount: 28,
      price: 39,
      isFeatured: true,
      tags: const ['Accessibility', 'WCAG'],
    ),
  ];

  static List<ModuleEntity> modulesFor(String courseId) {
    return [
      ModuleEntity(
        id: '${courseId}_m1',
        title: 'Getting Started',
        order: 1,
        lessons: [
          LessonEntity(
            id: '${courseId}_l1',
            moduleId: '${courseId}_m1',
            title: 'Welcome & course roadmap',
            type: LessonType.video,
            durationMinutes: 8,
            contentUrl:
                'https://flutter.github.io/assets-for-api-docs/assets/videos/bee.mp4',
            isCompleted: true,
            order: 1,
          ),
          LessonEntity(
            id: '${courseId}_l2',
            moduleId: '${courseId}_m1',
            title: 'Setting up your environment',
            type: LessonType.article,
            durationMinutes: 12,
            contentHtml:
                '<h2>Environment setup</h2><p>Install the latest Flutter SDK, enable Material 3, and configure your IDE.</p>',
            isCompleted: true,
            isBookmarked: true,
            order: 2,
          ),
          LessonEntity(
            id: '${courseId}_l3',
            moduleId: '${courseId}_m1',
            title: 'Architecture overview',
            type: LessonType.pdf,
            durationMinutes: 15,
            contentUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf',
            order: 3,
          ),
        ],
      ),
      ModuleEntity(
        id: '${courseId}_m2',
        title: 'Core Concepts',
        order: 2,
        lessons: [
          LessonEntity(
            id: '${courseId}_l4',
            moduleId: '${courseId}_m2',
            title: 'Domain-driven structure',
            type: LessonType.video,
            durationMinutes: 18,
            contentUrl:
                'https://flutter.github.io/assets-for-api-docs/assets/videos/butterfly.mp4',
            order: 1,
          ),
          LessonEntity(
            id: '${courseId}_l5',
            moduleId: '${courseId}_m2',
            title: 'Interactive lab',
            type: LessonType.interactive,
            durationMinutes: 25,
            order: 2,
          ),
          LessonEntity(
            id: '${courseId}_l6',
            moduleId: '${courseId}_m2',
            title: 'Checkpoint quiz',
            type: LessonType.quiz,
            durationMinutes: 10,
            order: 3,
          ),
        ],
      ),
      ModuleEntity(
        id: '${courseId}_m3',
        title: 'Advanced Patterns',
        order: 3,
        isLocked: false,
        lessons: [
          LessonEntity(
            id: '${courseId}_l7',
            moduleId: '${courseId}_m3',
            title: 'Testing strategies',
            type: LessonType.video,
            durationMinutes: 22,
            order: 1,
          ),
          LessonEntity(
            id: '${courseId}_l8',
            moduleId: '${courseId}_m3',
            title: 'Performance checklist',
            type: LessonType.article,
            durationMinutes: 14,
            contentHtml:
                '<h2>Performance</h2><p>Profile with DevTools, reduce rebuilds, and lazy-load routes.</p>',
            order: 2,
          ),
        ],
      ),
    ];
  }

  static List<ReviewEntity> reviews = [
    ReviewEntity(
      id: 'r1',
      userName: 'Alex Rivera',
      rating: 5,
      comment: 'Clearest Flutter course I have taken. Architecture finally clicked.',
      createdAt: DateTime.now().subtract(const Duration(days: 3)),
      avatarUrl: 'https://i.pravatar.cc/150?u=alex',
    ),
    ReviewEntity(
      id: 'r2',
      userName: 'Jordan Lee',
      rating: 4.5,
      comment: 'Great pacing. Labs are practical and production-minded.',
      createdAt: DateTime.now().subtract(const Duration(days: 8)),
      avatarUrl: 'https://i.pravatar.cc/150?u=jordan',
    ),
    ReviewEntity(
      id: 'r3',
      userName: 'Sam Okonkwo',
      rating: 5,
      comment: 'The design tokens module alone was worth it.',
      createdAt: DateTime.now().subtract(const Duration(days: 14)),
      avatarUrl: 'https://i.pravatar.cc/150?u=sam',
    ),
  ];

  static AssessmentEntity quizFor(String courseId) {
    return AssessmentEntity(
      id: '${courseId}_quiz',
      courseId: courseId,
      title: 'Module Checkpoint',
      type: AssessmentType.mcq,
      durationMinutes: 15,
      passingScore: 70,
      description: 'Quick check on core concepts from this module.',
      questions: const [
        QuestionEntity(
          id: 'q1',
          prompt: 'Which layer should contain business rules in Clean Architecture?',
          options: ['Presentation', 'Domain', 'Data', 'UI widgets'],
          correctIndex: 1,
          explanation: 'Domain holds entities and use cases — framework-agnostic logic.',
        ),
        QuestionEntity(
          id: 'q2',
          prompt: 'What does the Repository Pattern primarily provide?',
          options: [
            'Faster animations',
            'Abstraction over data sources',
            'Automatic DI',
            'Theme management',
          ],
          correctIndex: 1,
        ),
        QuestionEntity(
          id: 'q3',
          prompt: 'Material 3 dynamic color is best used for…',
          options: [
            'Hardcoding brand hex values',
            'Ignoring contrast ratios',
            'Harmonizing UI with accessible roles',
            'Replacing typography',
          ],
          correctIndex: 2,
        ),
        QuestionEntity(
          id: 'q4',
          prompt: 'GoRouter is primarily responsible for…',
          options: [
            'State management',
            'Declarative navigation & deep links',
            'Firebase auth',
            'Secure storage encryption',
          ],
          correctIndex: 1,
        ),
      ],
    );
  }

  static List<CertificateEntity> certificates(String studentName) => [
        CertificateEntity(
          id: 'cert_1',
          courseId: 'c5',
          courseTitle: 'Cloud Fundamentals for Mobile Devs',
          studentName: studentName,
          issuedAt: DateTime.now().subtract(const Duration(days: 21)),
          credentialId: 'VLMS-C5-2026-88421',
          shareUrl: 'https://vibrant.lms/certificates/VLMS-C5-2026-88421',
        ),
      ];

  static List<NotificationEntity> notifications = [
    NotificationEntity(
      id: 'n1',
      title: 'Keep your streak!',
      body: 'You are on a 7-day streak. Complete a lesson today.',
      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      type: 'reminder',
      actionRoute: '/home',
    ),
    NotificationEntity(
      id: 'n2',
      title: 'New lesson unlocked',
      body: 'Advanced Patterns is ready in Flutter Mastery.',
      createdAt: DateTime.now().subtract(const Duration(hours: 18)),
      type: 'course',
      actionRoute: '/courses/c1',
    ),
    NotificationEntity(
      id: 'n3',
      title: 'Certificate ready',
      body: 'Your Cloud Fundamentals certificate is available.',
      createdAt: DateTime.now().subtract(const Duration(days: 2)),
      isRead: true,
      type: 'certificate',
      actionRoute: '/certificates',
    ),
  ];

  static List<BadgeEntity> badges = [
    BadgeEntity(
      id: 'b1',
      title: 'First Steps',
      description: 'Complete your first lesson',
      iconName: 'rocket',
      earnedAt: DateTime.now().subtract(const Duration(days: 30)),
    ),
    BadgeEntity(
      id: 'b2',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      iconName: 'local_fire_department',
      earnedAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
    const BadgeEntity(
      id: 'b3',
      title: 'Quiz Ace',
      description: 'Score 100% on any assessment',
      iconName: 'emoji_events',
    ),
    BadgeEntity(
      id: 'b4',
      title: 'Certified',
      description: 'Earn your first certificate',
      iconName: 'workspace_premium',
      earnedAt: DateTime.now().subtract(const Duration(days: 21)),
    ),
  ];

  static const adminStats = AdminStatsEntity(
    totalStudents: 12840,
    activeStudents: 3921,
    totalCourses: 86,
    totalEnrollments: 45210,
    completionRate: 0.68,
    avgRating: 4.72,
    revenue: 184250,
    newSignupsThisWeek: 312,
  );

  static List<String> categories = const [
    'All',
    'Mobile Development',
    'Design',
    'Data Science',
    'Cloud',
    'Business',
  ];
}
