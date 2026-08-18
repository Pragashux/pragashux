import 'package:dartz/dartz.dart';
import 'package:vibrant_lms/core/constants/app_constants.dart';
import 'package:vibrant_lms/core/constants/mock_data.dart';
import 'package:vibrant_lms/core/errors/failures.dart';
import 'package:vibrant_lms/services/secure_storage_service.dart';
import 'package:vibrant_lms/shared/models/entities.dart';
import 'package:uuid/uuid.dart';

abstract class AuthRepository {
  Future<Either<Failure, UserEntity>> login({
    required String email,
    required String password,
  });
  Future<Either<Failure, UserEntity>> signup({
    required String name,
    required String email,
    required String password,
    UserRole role = UserRole.student,
  });
  Future<Either<Failure, void>> forgotPassword(String email);
  Future<Either<Failure, bool>> verifyOtp({
    required String email,
    required String otp,
  });
  Future<Either<Failure, UserEntity>> socialLogin(String provider);
  Future<Either<Failure, UserEntity?>> getCurrentUser();
  Future<Either<Failure, void>> logout();
  Stream<UserEntity?> get authStateChanges;
}

class MockAuthRepository implements AuthRepository {
  MockAuthRepository(this._tokenStore);

  final AuthTokenStore _tokenStore;
  UserEntity? _current;
  final _uuid = const Uuid();

  @override
  Stream<UserEntity?> get authStateChanges async* {
    yield _current;
  }

  @override
  Future<Either<Failure, UserEntity>> login({
    required String email,
    required String password,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 600));
    if (password != AppConstants.demoPassword && password.length < 8) {
      return const Left(AuthFailure('Invalid email or password.'));
    }

    final isAdmin = email.toLowerCase() == AppConstants.demoAdminEmail ||
        email.toLowerCase().contains('admin');
    final user = UserEntity(
      id: isAdmin ? 'admin_1' : 'student_1',
      email: email,
      displayName: isAdmin ? 'Alex Admin' : 'Sam Student',
      role: isAdmin ? UserRole.admin : UserRole.student,
      photoUrl: isAdmin
          ? 'https://i.pravatar.cc/150?u=admin'
          : 'https://i.pravatar.cc/150?u=student',
      streakDays: isAdmin ? 0 : 7,
      totalXp: isAdmin ? 0 : 2450,
      coursesCompleted: isAdmin ? 0 : 3,
      createdAt: DateTime.now().subtract(const Duration(days: 120)),
    );

    await _tokenStore.saveSession(
      userId: user.id,
      role: user.role.name,
      accessToken: 'demo_token_${user.id}',
    );
    _current = user;
    return Right(user);
  }

  @override
  Future<Either<Failure, UserEntity>> signup({
    required String name,
    required String email,
    required String password,
    UserRole role = UserRole.student,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 700));
    if (password.length < AppConstants.minPasswordLength) {
      return const Left(
        ValidationFailure('Password must be at least 8 characters.'),
      );
    }
    final user = UserEntity(
      id: _uuid.v4(),
      email: email,
      displayName: name,
      role: role,
      createdAt: DateTime.now(),
    );
    await _tokenStore.saveSession(
      userId: user.id,
      role: user.role.name,
      accessToken: 'demo_token_${user.id}',
    );
    _current = user;
    return Right(user);
  }

  @override
  Future<Either<Failure, void>> forgotPassword(String email) async {
    await Future<void>.delayed(const Duration(milliseconds: 500));
    if (!email.contains('@')) {
      return const Left(ValidationFailure('Enter a valid email.'));
    }
    return const Right(null);
  }

  @override
  Future<Either<Failure, bool>> verifyOtp({
    required String email,
    required String otp,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 400));
    if (otp == '123456' || otp.length == AppConstants.otpLength) {
      return const Right(true);
    }
    return const Left(ValidationFailure('Invalid OTP. Try 123456 in demo.'));
  }

  @override
  Future<Either<Failure, UserEntity>> socialLogin(String provider) async {
    return login(
      email: AppConstants.demoStudentEmail,
      password: AppConstants.demoPassword,
    );
  }

  @override
  Future<Either<Failure, UserEntity?>> getCurrentUser() async {
    if (_current != null) return Right(_current);
    final has = await _tokenStore.hasSession();
    if (!has) return const Right(null);
    final role = await _tokenStore.getRole();
    final id = await _tokenStore.getUserId() ?? 'student_1';
    final isAdmin = role == UserRole.admin.name;
    _current = UserEntity(
      id: id,
      email: isAdmin
          ? AppConstants.demoAdminEmail
          : AppConstants.demoStudentEmail,
      displayName: isAdmin ? 'Alex Admin' : 'Sam Student',
      role: isAdmin ? UserRole.admin : UserRole.student,
      photoUrl: isAdmin
          ? 'https://i.pravatar.cc/150?u=admin'
          : 'https://i.pravatar.cc/150?u=student',
      streakDays: isAdmin ? 0 : 7,
      totalXp: isAdmin ? 0 : 2450,
      coursesCompleted: isAdmin ? 0 : 3,
    );
    return Right(_current);
  }

  @override
  Future<Either<Failure, void>> logout() async {
    await _tokenStore.clearSession();
    _current = null;
    return const Right(null);
  }
}

abstract class CourseRepository {
  Future<Either<Failure, List<CourseEntity>>> getCourses({
    String? query,
    String? category,
  });
  Future<Either<Failure, CourseEntity>> getCourse(String id);
  Future<Either<Failure, List<ModuleEntity>>> getModules(String courseId);
  Future<Either<Failure, List<ReviewEntity>>> getReviews(String courseId);
  Future<Either<Failure, CourseEntity>> enroll(String courseId);
  Future<Either<Failure, void>> updateLessonProgress({
    required String lessonId,
    required bool completed,
  });
}

class MockCourseRepository implements CourseRepository {
  final _courses = List<CourseEntity>.from(MockData.courses);

  @override
  Future<Either<Failure, List<CourseEntity>>> getCourses({
    String? query,
    String? category,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 350));
    var list = _courses;
    if (category != null && category != 'All') {
      list = list.where((c) => c.category == category).toList();
    }
    if (query != null && query.trim().isNotEmpty) {
      final q = query.toLowerCase();
      list = list
          .where(
            (c) =>
                c.title.toLowerCase().contains(q) ||
                c.tags.any((t) => t.toLowerCase().contains(q)),
          )
          .toList();
    }
    return Right(list);
  }

  @override
  Future<Either<Failure, CourseEntity>> getCourse(String id) async {
    await Future<void>.delayed(const Duration(milliseconds: 200));
    try {
      return Right(_courses.firstWhere((c) => c.id == id));
    } catch (_) {
      return const Left(NotFoundFailure('Course not found.'));
    }
  }

  @override
  Future<Either<Failure, List<ModuleEntity>>> getModules(String courseId) async {
    await Future<void>.delayed(const Duration(milliseconds: 250));
    return Right(MockData.modulesFor(courseId));
  }

  @override
  Future<Either<Failure, List<ReviewEntity>>> getReviews(String courseId) async {
    return Right(MockData.reviews);
  }

  @override
  Future<Either<Failure, CourseEntity>> enroll(String courseId) async {
    await Future<void>.delayed(const Duration(milliseconds: 400));
    final i = _courses.indexWhere((c) => c.id == courseId);
    if (i < 0) return const Left(NotFoundFailure());
    _courses[i] = _courses[i].copyWith(
      enrollmentStatus: EnrollmentStatus.enrolled,
      progress: 0.01,
    );
    return Right(_courses[i]);
  }

  @override
  Future<Either<Failure, void>> updateLessonProgress({
    required String lessonId,
    required bool completed,
  }) async {
    return const Right(null);
  }
}

abstract class AssessmentRepository {
  Future<Either<Failure, AssessmentEntity>> getAssessment(String courseId);
  Future<Either<Failure, AssessmentResultEntity>> submit({
    required String assessmentId,
    required Map<String, int> answers,
  });
}

class MockAssessmentRepository implements AssessmentRepository {
  @override
  Future<Either<Failure, AssessmentEntity>> getAssessment(String courseId) async {
    return Right(MockData.quizFor(courseId));
  }

  @override
  Future<Either<Failure, AssessmentResultEntity>> submit({
    required String assessmentId,
    required Map<String, int> answers,
  }) async {
    await Future<void>.delayed(const Duration(milliseconds: 500));
    final quiz = MockData.quizFor(assessmentId.replaceAll('_quiz', ''));
    var score = 0;
    for (final q in quiz.questions) {
      if (answers[q.id] == q.correctIndex) score++;
    }
    final total = quiz.questions.length;
    final pct = (score / total) * 100;
    return Right(
      AssessmentResultEntity(
        assessmentId: assessmentId,
        score: score,
        total: total,
        passed: pct >= quiz.passingScore,
        completedAt: DateTime.now(),
      ),
    );
  }
}

abstract class CertificateRepository {
  Future<Either<Failure, List<CertificateEntity>>> getCertificates(
    String studentName,
  );
}

class MockCertificateRepository implements CertificateRepository {
  @override
  Future<Either<Failure, List<CertificateEntity>>> getCertificates(
    String studentName,
  ) async {
    return Right(MockData.certificates(studentName));
  }
}

abstract class NotificationRepository {
  Future<Either<Failure, List<NotificationEntity>>> getNotifications();
  Future<Either<Failure, void>> markRead(String id);
}

class MockNotificationRepository implements NotificationRepository {
  final _items = List<NotificationEntity>.from(MockData.notifications);

  @override
  Future<Either<Failure, List<NotificationEntity>>> getNotifications() async {
    return Right(List.unmodifiable(_items));
  }

  @override
  Future<Either<Failure, void>> markRead(String id) async {
    final i = _items.indexWhere((n) => n.id == id);
    if (i >= 0) {
      final n = _items[i];
      _items[i] = NotificationEntity(
        id: n.id,
        title: n.title,
        body: n.body,
        createdAt: n.createdAt,
        isRead: true,
        type: n.type,
        actionRoute: n.actionRoute,
      );
    }
    return const Right(null);
  }
}

abstract class AdminRepository {
  Future<Either<Failure, AdminStatsEntity>> getStats();
  Future<Either<Failure, List<CourseEntity>>> getManagedCourses();
  Future<Either<Failure, List<UserEntity>>> getStudents();
}

class MockAdminRepository implements AdminRepository {
  @override
  Future<Either<Failure, AdminStatsEntity>> getStats() async {
    await Future<void>.delayed(const Duration(milliseconds: 300));
    return const Right(MockData.adminStats);
  }

  @override
  Future<Either<Failure, List<CourseEntity>>> getManagedCourses() async {
    return Right(MockData.courses);
  }

  @override
  Future<Either<Failure, List<UserEntity>>> getStudents() async {
    return Right([
      for (var i = 1; i <= 12; i++)
        UserEntity(
          id: 's$i',
          email: 'student$i@mail.com',
          displayName: 'Student $i',
          role: UserRole.student,
          photoUrl: 'https://i.pravatar.cc/150?u=s$i',
          streakDays: i * 2,
          totalXp: i * 320,
          coursesCompleted: i % 4,
        ),
    ]);
  }
}
