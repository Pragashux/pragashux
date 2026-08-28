/// App-wide constants for AI LearnOS.
abstract final class AppConstants {
  static const String appName = 'AI LearnOS';
  static const String appTagline = 'Your AI teacher for every course.';
  static const String demoModeKey = 'demo_mode';

  /// Demo credentials (mock auth — production uses the LearnOS API).
  static const String demoStudentEmail = 'student@ailearnos.app';
  static const String demoAdminEmail = 'admin@ailearnos.app';
  static const String demoPassword = 'LearnOS@123';

  static const int otpLength = 6;
  static const int otpResendSeconds = 60;
  static const int minPasswordLength = 8;

  static const Duration apiTimeout = Duration(seconds: 30);
  static const int pageSize = 20;
}

abstract final class StorageKeys {
  static const String accessToken = 'access_token';
  static const String refreshToken = 'refresh_token';
  static const String userId = 'user_id';
  static const String userRole = 'user_role';
  static const String onboardingComplete = 'onboarding_complete';
}
