/// Compile-time environment. Secrets never belong here — only public URLs and flags.
///
/// Debug:
///   flutter run --dart-define=DEMO_MODE=true --dart-define=API_BASE_URL=http://10.0.2.2:8000/v1
/// Release / Play:
///   flutter build appbundle --release --dart-define=API_BASE_URL=https://api.ailearnos.app/v1
abstract final class AppConfig {
  static const bool demoMode = bool.fromEnvironment(
    'DEMO_MODE',
    defaultValue: false,
  );

  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://api.ailearnos.app/v1',
  );

  static const String privacyPolicyUrl = String.fromEnvironment(
    'PRIVACY_POLICY_URL',
    defaultValue: 'https://ailearnos.app/privacy',
  );

  static const String termsUrl = String.fromEnvironment(
    'TERMS_URL',
    defaultValue: 'https://ailearnos.app/terms',
  );

  static const bool analyticsEnabled = bool.fromEnvironment(
    'ANALYTICS_ENABLED',
    defaultValue: true,
  );

  static const String aiDisclaimer =
      'AI-generated explanations and feedback may contain errors. '
      'Always verify important information. AI LearnOS is an educational assistant, not a certified instructor.';
}
