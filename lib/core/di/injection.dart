import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vibrant_lms/core/network/api_client.dart';
import 'package:vibrant_lms/features/auth/domain/repositories/repositories.dart';
import 'package:vibrant_lms/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:vibrant_lms/services/firebase_service.dart';
import 'package:vibrant_lms/services/secure_storage_service.dart';
import 'package:vibrant_lms/themes/theme_mode_cubit.dart';

final sl = GetIt.instance;

Future<void> configureDependencies({bool demoMode = true}) async {
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

  sl.registerLazySingleton(() => FirebaseService(demoMode: demoMode));
  sl.registerLazySingleton(
    () => NotificationService(demoMode: demoMode),
  );
  sl.registerLazySingleton(() => ApiClient(tokenStore: sl()));

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

  sl.registerFactory(() => AuthBloc(sl()));

  await sl<FirebaseService>().initialize();
  await sl<NotificationService>().initialize();
}
