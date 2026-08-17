/// App-wide constants for Vibrant LMS.
abstract final class AppConstants {
  static const String appName = 'Vibrant LMS';
  static const String appTagline = 'Learn boldly. Grow daily.';
  static const String demoModeKey = 'demo_mode';

  /// Demo credentials (mock auth — replace with Firebase).
  static const String demoStudentEmail = 'student@vibrant.lms';
  static const String demoAdminEmail = 'admin@vibrant.lms';
  static const String demoPassword = 'Vibrant@123';

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
