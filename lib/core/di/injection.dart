import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vibrant_lms/core/config/app_config.dart';
import 'package:vibrant_lms/core/network/api_client.dart';
import 'package:vibrant_lms/features/ai/domain/ai_repository.dart';
import 'package:vibrant_lms/features/auth/data/repositories/remote_auth_repository.dart';
import 'package:vibrant_lms/features/auth/domain/repositories/repositories.dart';
import 'package:vibrant_lms/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:vibrant_lms/features/subscription/domain/billing_service.dart';
import 'package:vibrant_lms/features/subscription/domain/subscription_repository.dart';
import 'package:vibrant_lms/services/firebase_service.dart';
import 'package:vibrant_lms/services/secure_storage_service.dart';
import 'package:vibrant_lms/themes/theme_mode_cubit.dart';

final sl = GetIt.instance;

Future<void> configureDependencies({bool? demoMode}) async {
  final useDemo = demoMode ?? AppConfig.demoMode;
  if (sl.isRegistered<AuthRepository>()) {
    return;
  }

  final prefs = await SharedPreferences.getInstance();
  sl.registerSingleton<SharedPreferences>(prefs);
  sl.registerLazySingleton(() => ThemeCubit(prefs));

  const storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );
  sl.registerLazySingleton<SecureStorageService>(
    () => SecureStorageServiceImpl(storage),
  );
  sl.registerLazySingleton<AuthTokenStore>(
    () => AuthTokenStoreImpl(sl()),
  );

  sl.registerLazySingleton(() => FirebaseService(demoMode: useDemo));
  sl.registerLazySingleton(
    () => NotificationService(demoMode: useDemo),
  );
  sl.registerLazySingleton(
    () => ApiClient(tokenStore: sl(), baseUrl: AppConfig.apiBaseUrl),
  );

  if (useDemo) {
    sl.registerLazySingleton<AuthRepository>(() => MockAuthRepository(sl()));
    sl.registerLazySingleton<CourseRepository>(() => MockCourseRepository());
    sl.registerLazySingleton<AssessmentRepository>(
      () => MockAssessmentRepository(),
    );
    sl.registerLazySingleton<CertificateRepository>(
      () => MockCertificateRepository(),
    );
    sl.registerLazySingleton<NotificationRepository>(
      () => MockNotificationRepository(),
    );
    sl.registerLazySingleton<AdminRepository>(() => MockAdminRepository());
    sl.registerLazySingleton<AiRepository>(() => MockAiRepository());
    sl.registerLazySingleton<BillingService>(() => MockBillingService());
    sl.registerLazySingleton<SubscriptionRepository>(
      () => MockSubscriptionRepository(),
    );
  } else {
    sl.registerLazySingleton<AuthRepository>(
      () => RemoteAuthRepository(sl(), sl()),
    );
    sl.registerLazySingleton<CourseRepository>(() => MockCourseRepository());
    sl.registerLazySingleton<AssessmentRepository>(
      () => MockAssessmentRepository(),
    );
    sl.registerLazySingleton<CertificateRepository>(
      () => MockCertificateRepository(),
    );
    sl.registerLazySingleton<NotificationRepository>(
      () => MockNotificationRepository(),
    );
    sl.registerLazySingleton<AdminRepository>(() => MockAdminRepository());
    sl.registerLazySingleton<AiRepository>(() => MockAiRepository());
    sl.registerLazySingleton<BillingService>(() => PlayBillingService());
    sl.registerLazySingleton<SubscriptionRepository>(
      () => BillingBackedSubscriptionRepository(sl()),
    );
  }

  sl.registerLazySingleton<AssignmentRepository>(
    () => MockAssignmentRepository(),
  );

  sl.registerFactory(() => AuthBloc(sl()));

  await sl<FirebaseService>().initialize();
  await sl<NotificationService>().initialize();
  assert(!kReleaseMode || !useDemo, 'Release builds must not use demo/mock auth.');
}
