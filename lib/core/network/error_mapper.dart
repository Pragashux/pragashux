import 'package:dio/dio.dart';
import 'package:vibrant_lms/core/errors/failures.dart';

Failure mapDioError(Object error) {
  if (error is DioException) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.connectionError:
        return const NetworkFailure(
          'Unable to connect. Please check your internet connection and try again.',
        );
      case DioExceptionType.badResponse:
        final code = error.response?.statusCode ?? 0;
        if (code == 401) {
          return const AuthFailure('Your session expired. Please sign in again.');
        }
        if (code == 403) {
          return const PermissionFailure();
        }
        if (code >= 500) {
          return const ServerFailure(
            'The service is temporarily unavailable. Please try again.',
          );
        }
        final detail = error.response?.data;
        if (detail is Map && detail['detail'] is String) {
          return ServerFailure(detail['detail'] as String);
        }
        return const ServerFailure();
      case DioExceptionType.cancel:
        return const NetworkFailure('Request cancelled.');
      case DioExceptionType.badCertificate:
        return const NetworkFailure('Secure connection failed.');
      case DioExceptionType.unknown:
        return const NetworkFailure(
          'Unable to connect. Please check your internet connection and try again.',
        );
    }
  }
  return const ServerFailure();
}
