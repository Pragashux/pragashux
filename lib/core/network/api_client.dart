import 'package:dio/dio.dart';
import 'package:logger/logger.dart';
import 'package:vibrant_lms/core/constants/app_constants.dart';
import 'package:vibrant_lms/services/secure_storage_service.dart';

/// REST-ready HTTP client. Point [baseUrl] at your LMS API when ready.
class ApiClient {
  ApiClient({
    required AuthTokenStore tokenStore,
    String baseUrl = 'https://api.vibrant.lms/v1',
    Dio? dio,
  })  : _tokenStore = tokenStore,
        _dio = dio ??
            Dio(
              BaseOptions(
                baseUrl: baseUrl,
                connectTimeout: AppConstants.apiTimeout,
                receiveTimeout: AppConstants.apiTimeout,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
              ),
            ) {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _tokenStore.getAccessToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) {
          _logger.e('API error', error: error, stackTrace: error.stackTrace);
          handler.next(error);
        },
      ),
    );
  }

  final Dio _dio;
  final AuthTokenStore _tokenStore;
  final _logger = Logger();

  Dio get dio => _dio;

  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) =>
      _dio.get<T>(path, queryParameters: queryParameters);

  Future<Response<T>> post<T>(String path, {Object? data}) =>
      _dio.post<T>(path, data: data);

  Future<Response<T>> put<T>(String path, {Object? data}) =>
      _dio.put<T>(path, data: data);

  Future<Response<T>> delete<T>(String path) => _dio.delete<T>(path);
}
