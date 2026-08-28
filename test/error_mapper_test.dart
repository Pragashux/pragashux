import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:vibrant_lms/core/errors/failures.dart';
import 'package:vibrant_lms/core/network/error_mapper.dart';

void main() {
  test('maps connection errors to a user-facing network failure', () {
    final failure = mapDioError(
      DioException(
        requestOptions: RequestOptions(path: '/x'),
        type: DioExceptionType.connectionError,
      ),
    );
    expect(failure, isA<NetworkFailure>());
    expect(
      failure.message,
      contains('Unable to connect'),
    );
  });

  test('maps 401 to auth failure', () {
    final failure = mapDioError(
      DioException(
        requestOptions: RequestOptions(path: '/x'),
        type: DioExceptionType.badResponse,
        response: Response(
          requestOptions: RequestOptions(path: '/x'),
          statusCode: 401,
        ),
      ),
    );
    expect(failure, isA<AuthFailure>());
  });
}
