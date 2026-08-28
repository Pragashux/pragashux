import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:vibrant_lms/core/network/api_client.dart';
import 'package:vibrant_lms/core/network/error_mapper.dart';
import 'package:vibrant_lms/core/errors/failures.dart';
import 'package:vibrant_lms/features/auth/domain/repositories/repositories.dart';
import 'package:vibrant_lms/services/secure_storage_service.dart';
import 'package:vibrant_lms/shared/models/entities.dart';

UserEntity userFromJson(Map<String, dynamic> json) {
  final role = json['role'] == 'admin' ? UserRole.admin : UserRole.student;
  return UserEntity(
    id: json['id'] as String? ?? '',
    email: json['email'] as String? ?? '',
    displayName: json['displayName'] as String? ?? json['name'] as String? ?? '',
    role: role,
    photoUrl: json['photoUrl'] as String?,
    bio: json['bio'] as String?,
    streakDays: json['streakDays'] as int? ?? 0,
    totalXp: json['totalXp'] as int? ?? 0,
    skillLevel: json['skillLevel'] as String? ?? 'beginner',
    interests: (json['interests'] as List?)?.cast<String>() ?? const [],
    goals: (json['goals'] as List?)?.cast<String>() ?? const [],
    onboardingComplete: json['onboardingComplete'] as bool? ?? true,
    status: json['status'] as String? ?? 'active',
  );
}

class RemoteAuthRepository implements AuthRepository {
  RemoteAuthRepository(this._client, this._tokenStore);

  final ApiClient _client;
  final AuthTokenStore _tokenStore;

  @override
  Stream<UserEntity?> get authStateChanges async* {
    yield null;
  }

  Future<Either<Failure, UserEntity>> _persist(Map<String, dynamic> body) async {
    final user = userFromJson(body['user'] as Map<String, dynamic>);
    await _tokenStore.saveSession(
      userId: user.id,
      role: user.role.name,
      accessToken: body['access_token'] as String? ?? '',
    );
    return Right(user);
  }

  @override
  Future<Either<Failure, UserEntity>> login({
    required String email,
    required String password,
  }) async {
    try {
      final res = await _client.post<Map<String, dynamic>>(
        '/auth/login',
        data: {'email': email, 'password': password},
      );
      return await _persist(res.data!);
    } catch (e) {
      return Left(mapDioError(e));
    }
  }

  @override
  Future<Either<Failure, UserEntity>> signup({
    required String name,
    required String email,
    required String password,
    UserRole role = UserRole.student,
  }) async {
    try {
      final res = await _client.post<Map<String, dynamic>>(
        '/auth/register',
        data: {'name': name, 'email': email, 'password': password},
      );
      return await _persist(res.data!);
    } catch (e) {
      return Left(mapDioError(e));
    }
  }

  @override
  Future<Either<Failure, void>> forgotPassword(String email) async {
    try {
      await _client.post('/auth/forgot-password', data: {'email': email});
      return const Right(null);
    } catch (e) {
      return Left(mapDioError(e));
    }
  }

  @override
  Future<Either<Failure, bool>> verifyOtp({
    required String email,
    required String otp,
  }) async {
    return const Right(true);
  }

  @override
  Future<Either<Failure, UserEntity>> socialLogin(String provider) async {
    return const Left(
      AuthFailure('Social sign-in is not enabled in this build.'),
    );
  }

  @override
  Future<Either<Failure, UserEntity?>> getCurrentUser() async {
    try {
      final has = await _tokenStore.hasSession();
      if (!has) return const Right(null);
      final res = await _client.get<Map<String, dynamic>>('/auth/me');
      return Right(userFromJson(res.data!));
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        await _tokenStore.clearSession();
        return const Right(null);
      }
      return Left(mapDioError(e));
    } catch (e) {
      return Left(mapDioError(e));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    await _tokenStore.clearSession();
    return const Right(null);
  }

  @override
  Future<Either<Failure, void>> deleteAccount() async {
    try {
      await _client.delete('/auth/me');
      await _tokenStore.clearSession();
      return const Right(null);
    } catch (e) {
      return Left(mapDioError(e));
    }
  }
}
