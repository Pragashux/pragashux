import 'package:equatable/equatable.dart';

enum UserRole { student, admin, instructor }

enum CourseLevel { beginner, intermediate, advanced, allLevels }

enum LessonType { video, pdf, article, interactive, quiz }

enum EnrollmentStatus { notEnrolled, enrolled, completed, dropped }

enum AssessmentType { quiz, mcq, coding, assignment, mixed }

class UserEntity extends Equatable {
  const UserEntity({
    required this.id,
    required this.email,
    required this.displayName,
    required this.role,
    this.photoUrl,
    this.bio,
    this.streakDays = 0,
    this.totalXp = 0,
    this.coursesCompleted = 0,
    this.skillLevel = 'beginner',
    this.interests = const [],
    this.goals = const [],
    this.preferredFormat = 'mixed',
    this.onboardingComplete = true,
    this.planId = 'pro',
    this.status = 'active',
    this.createdAt,
  });

  final String id;
  final String email;
  final String displayName;
  final UserRole role;
  final String? photoUrl;
  final String? bio;
  final int streakDays;
  final int totalXp;
  final int coursesCompleted;
  final String skillLevel;
  final List<String> interests;
  final List<String> goals;
  final String preferredFormat;
  final bool onboardingComplete;
  final String planId;
  final String status;
  final DateTime? createdAt;

  bool get isAdmin => role == UserRole.admin;
  bool get isStudent => role == UserRole.student;

  UserEntity copyWith({
    String? displayName,
    String? photoUrl,
    String? bio,
    int? streakDays,
    int? totalXp,
    int? coursesCompleted,
    bool? onboardingComplete,
    String? planId,
    String? status,
    List<String>? interests,
    List<String>? goals,
    String? skillLevel,
  }) {
    return UserEntity(
      id: id,
      email: email,
      displayName: displayName ?? this.displayName,
      role: role,
      photoUrl: photoUrl ?? this.photoUrl,
      bio: bio ?? this.bio,
      streakDays: streakDays ?? this.streakDays,
      totalXp: totalXp ?? this.totalXp,
      coursesCompleted: coursesCompleted ?? this.coursesCompleted,
      skillLevel: skillLevel ?? this.skillLevel,
      interests: interests ?? this.interests,
      goals: goals ?? this.goals,
      preferredFormat: preferredFormat,
      onboardingComplete: onboardingComplete ?? this.onboardingComplete,
      planId: planId ?? this.planId,
      status: status ?? this.status,
      createdAt: createdAt,
    );
  }

  @override
  List<Object?> get props => [id, email, displayName, role, photoUrl, planId];
}

class InstructorEntity extends Equatable {
  const InstructorEntity({
    required this.id,
    required this.name,
    required this.title,
    this.avatarUrl,
    this.bio,
    this.rating = 4.8,
    this.studentsCount = 0,
    this.coursesCount = 0,
  });

  final String id;
  final String name;
  final String title;
  final String? avatarUrl;
  final String? bio;
  final double rating;
  final int studentsCount;
  final int coursesCount;

  @override
  List<Object?> get props => [id, name];
}

class CourseEntity extends Equatable {
  const CourseEntity({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.thumbnailUrl,
    required this.instructor,
    required this.level,
    this.rating = 0,
    this.reviewCount = 0,
    this.studentsCount = 0,
    this.durationHours = 0,
    this.lessonsCount = 0,
    this.price = 0,
    this.isFeatured = false,
    this.isPopular = false,
    this.isTrending = false,
    this.objectives = const [],
    this.tags = const [],
    this.progress = 0,
    this.enrollmentStatus = EnrollmentStatus.notEnrolled,
    this.summary = '',
  });

  final String id;
  final String title;
  final String description;
  final String category;
  final String thumbnailUrl;
  final InstructorEntity instructor;
  final CourseLevel level;
  final double rating;
  final int reviewCount;
  final int studentsCount;
  final double durationHours;
  final int lessonsCount;
  final double price;
  final bool isFeatured;
  final bool isPopular;
  final bool isTrending;
  final List<String> objectives;
  final List<String> tags;
  final double progress;
  final EnrollmentStatus enrollmentStatus;
  final String summary;

  bool get isEnrolled =>
      enrollmentStatus == EnrollmentStatus.enrolled ||
      enrollmentStatus == EnrollmentStatus.completed;

  CourseEntity copyWith({
    double? progress,
    EnrollmentStatus? enrollmentStatus,
  }) {
    return CourseEntity(
      id: id,
      title: title,
      description: description,
      category: category,
      thumbnailUrl: thumbnailUrl,
      instructor: instructor,
      level: level,
      rating: rating,
      reviewCount: reviewCount,
      studentsCount: studentsCount,
      durationHours: durationHours,
      lessonsCount: lessonsCount,
      price: price,
      isFeatured: isFeatured,
      isPopular: isPopular,
      isTrending: isTrending,
      objectives: objectives,
      tags: tags,
      progress: progress ?? this.progress,
      enrollmentStatus: enrollmentStatus ?? this.enrollmentStatus,
      summary: summary,
    );
  }

  @override
  List<Object?> get props => [id, title, progress, enrollmentStatus];
}

class ModuleEntity extends Equatable {
  const ModuleEntity({
    required this.id,
    required this.title,
    required this.order,
    required this.lessons,
    this.isLocked = false,
    this.description = '',
  });

  final String id;
  final String title;
  final int order;
  final List<LessonEntity> lessons;
  final bool isLocked;
  final String description;

  double get progress {
    if (lessons.isEmpty) return 0;
    final done = lessons.where((l) => l.isCompleted).length;
    return done / lessons.length;
  }

  @override
  List<Object?> get props => [id, title, lessons];
}

class LessonEntity extends Equatable {
  const LessonEntity({
    required this.id,
    required this.moduleId,
    required this.title,
    required this.type,
    required this.durationMinutes,
    this.contentUrl,
    this.contentHtml,
    this.isCompleted = false,
    this.isBookmarked = false,
    this.isLocked = false,
    this.order = 0,
    this.description = '',
  });

  final String id;
  final String moduleId;
  final String title;
  final LessonType type;
  final int durationMinutes;
  final String? contentUrl;
  final String? contentHtml;
  final bool isCompleted;
  final bool isBookmarked;
  final bool isLocked;
  final int order;
  final String description;

  LessonEntity copyWith({bool? isCompleted, bool? isBookmarked}) {
    return LessonEntity(
      id: id,
      moduleId: moduleId,
      title: title,
      type: type,
      durationMinutes: durationMinutes,
      contentUrl: contentUrl,
      contentHtml: contentHtml,
      isCompleted: isCompleted ?? this.isCompleted,
      isBookmarked: isBookmarked ?? this.isBookmarked,
      isLocked: isLocked,
      order: order,
      description: description,
    );
  }

  @override
  List<Object?> get props => [id, isCompleted, isBookmarked];
}

class ReviewEntity extends Equatable {
  const ReviewEntity({
    required this.id,
    required this.userName,
    required this.rating,
    required this.comment,
    required this.createdAt,
    this.avatarUrl,
  });

  final String id;
  final String userName;
  final double rating;
  final String comment;
  final DateTime createdAt;
  final String? avatarUrl;

  @override
  List<Object?> get props => [id];
}

class AssessmentEntity extends Equatable {
  const AssessmentEntity({
    required this.id,
    required this.courseId,
    required this.title,
    required this.type,
    required this.questions,
    this.durationMinutes = 30,
    this.passingScore = 70,
    this.description,
  });

  final String id;
  final String courseId;
  final String title;
  final AssessmentType type;
  final List<QuestionEntity> questions;
  final int durationMinutes;
  final int passingScore;
  final String? description;

  @override
  List<Object?> get props => [id, title];
}

class QuestionEntity extends Equatable {
  const QuestionEntity({
    required this.id,
    required this.prompt,
    required this.options,
    required this.correctIndex,
    this.explanation,
    this.codeStub,
    this.qtype = 'mcq',
    this.topic = '',
  });

  final String id;
  final String prompt;
  final List<String> options;
  final int correctIndex;
  final String? explanation;
  final String? codeStub;
  final String qtype;
  final String topic;

  @override
  List<Object?> get props => [id];
}

class AssessmentResultEntity extends Equatable {
  const AssessmentResultEntity({
    required this.assessmentId,
    required this.score,
    required this.total,
    required this.passed,
    required this.completedAt,
    this.weakTopics = const [],
    this.nextAction = '',
    this.details = const [],
  });

  final String assessmentId;
  final int score;
  final int total;
  final bool passed;
  final DateTime completedAt;
  final List<String> weakTopics;
  final String nextAction;
  final List<String> details;

  double get percentage => total == 0 ? 0 : (score / total) * 100;

  @override
  List<Object?> get props => [assessmentId, score, passed];
}

class CertificateEntity extends Equatable {
  const CertificateEntity({
    required this.id,
    required this.courseId,
    required this.courseTitle,
    required this.studentName,
    required this.issuedAt,
    this.credentialId,
    this.shareUrl,
  });

  final String id;
  final String courseId;
  final String courseTitle;
  final String studentName;
  final DateTime issuedAt;
  final String? credentialId;
  final String? shareUrl;

  @override
  List<Object?> get props => [id];
}

class NotificationEntity extends Equatable {
  const NotificationEntity({
    required this.id,
    required this.title,
    required this.body,
    required this.createdAt,
    this.isRead = false,
    this.type = 'general',
    this.actionRoute,
  });

  final String id;
  final String title;
  final String body;
  final DateTime createdAt;
  final bool isRead;
  final String type;
  final String? actionRoute;

  @override
  List<Object?> get props => [id, isRead];
}

class BadgeEntity extends Equatable {
  const BadgeEntity({
    required this.id,
    required this.title,
    required this.description,
    required this.iconName,
    this.earnedAt,
  });

  final String id;
  final String title;
  final String description;
  final String iconName;
  final DateTime? earnedAt;

  bool get isEarned => earnedAt != null;

  @override
  List<Object?> get props => [id, earnedAt];
}

class AdminStatsEntity extends Equatable {
  const AdminStatsEntity({
    required this.totalStudents,
    required this.activeStudents,
    required this.totalCourses,
    required this.totalEnrollments,
    required this.completionRate,
    required this.avgRating,
    this.revenue = 0,
    this.newSignupsThisWeek = 0,
    this.aiUsage = 0,
    this.atRiskStudents = 0,
    this.activeSubscriptions = 0,
    this.failedAssessments = 0,
    this.insights = const [],
  });

  final int totalStudents;
  final int activeStudents;
  final int totalCourses;
  final int totalEnrollments;
  final double completionRate;
  final double avgRating;
  final double revenue;
  final int newSignupsThisWeek;
  final int aiUsage;
  final int atRiskStudents;
  final int activeSubscriptions;
  final int failedAssessments;
  final List<String> insights;

  @override
  List<Object?> get props => [totalStudents, activeStudents, totalCourses];
}

class LearningNoteEntity extends Equatable {
  const LearningNoteEntity({
    required this.id,
    required this.lessonId,
    required this.content,
    required this.updatedAt,
  });

  final String id;
  final String lessonId;
  final String content;
  final DateTime updatedAt;

  @override
  List<Object?> get props => [id, content];
}

class PlanEntity extends Equatable {
  const PlanEntity({
    required this.id,
    required this.name,
    required this.priceMonthly,
    required this.description,
    required this.features,
  });

  final String id;
  final String name;
  final double priceMonthly;
  final String description;
  final List<String> features;

  @override
  List<Object?> get props => [id, name];
}

class SubscriptionEntity extends Equatable {
  const SubscriptionEntity({
    required this.planId,
    required this.planName,
    required this.status,
    this.renewsAt,
    this.priceMonthly = 0,
  });

  final String planId;
  final String planName;
  final String status;
  final DateTime? renewsAt;
  final double priceMonthly;

  @override
  List<Object?> get props => [planId, status];
}

class DailyPlanEntity extends Equatable {
  const DailyPlanEntity({
    required this.title,
    required this.estimatedMinutes,
    required this.items,
    this.rationale = '',
  });

  final String title;
  final int estimatedMinutes;
  final List<DailyPlanItem> items;
  final String rationale;

  @override
  List<Object?> get props => [title, items];
}

class DailyPlanItem extends Equatable {
  const DailyPlanItem({
    required this.id,
    required this.title,
    required this.minutes,
    required this.kind,
  });

  final String id;
  final String title;
  final int minutes;
  final String kind;

  @override
  List<Object?> get props => [id, title];
}

class ChatMessageEntity extends Equatable {
  const ChatMessageEntity({
    required this.id,
    required this.role,
    required this.text,
    required this.createdAt,
  });

  final String id;
  final String role;
  final String text;
  final DateTime createdAt;

  bool get isUser => role == 'user';

  @override
  List<Object?> get props => [id, role, text];
}

class AssignmentEntity extends Equatable {
  const AssignmentEntity({
    required this.id,
    required this.courseId,
    required this.title,
    required this.brief,
    this.criteria = const [],
  });

  final String id;
  final String courseId;
  final String title;
  final String brief;
  final List<String> criteria;

  @override
  List<Object?> get props => [id];
}

class StudentInsightEntity extends Equatable {
  const StudentInsightEntity({
    required this.user,
    required this.flags,
    required this.needsIntervention,
  });

  final UserEntity user;
  final List<String> flags;
  final bool needsIntervention;

  @override
  List<Object?> get props => [user, flags];
}
