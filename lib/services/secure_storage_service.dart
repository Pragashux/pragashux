import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:vibrant_lms/core/constants/app_constants.dart';

abstract class SecureStorageService {
  Future<void> write(String key, String value);
  Future<String?> read(String key);
  Future<void> delete(String key);
  Future<void> clear();
}

class SecureStorageServiceImpl implements SecureStorageService {
  SecureStorageServiceImpl(this._storage);

  final FlutterSecureStorage _storage;

  @override
  Future<void> write(String key, String value) =>
      _storage.write(key: key, value: value);

  @override
  Future<String?> read(String key) => _storage.read(key: key);

  @override
  Future<void> delete(String key) => _storage.delete(key: key);

  @override
  Future<void> clear() => _storage.deleteAll();
}

abstract class AuthTokenStore {
  Future<void> saveSession({
    required String userId,
    required String role,
    required String accessToken,
  });
  Future<String?> getAccessToken();
  Future<String?> getUserId();
  Future<String?> getRole();
  Future<void> clearSession();
  Future<bool> hasSession();
}

class AuthTokenStoreImpl implements AuthTokenStore {
  AuthTokenStoreImpl(this._secure);

  final SecureStorageService _secure;

  @override
  Future<void> saveSession({
    required String userId,
    required String role,
    required String accessToken,
  }) async {
    await _secure.write(StorageKeys.userId, userId);
    await _secure.write(StorageKeys.userRole, role);
    await _secure.write(StorageKeys.accessToken, accessToken);
  }

  @override
  Future<String?> getAccessToken() => _secure.read(StorageKeys.accessToken);

  @override
  Future<String?> getUserId() => _secure.read(StorageKeys.userId);

  @override
  Future<String?> getRole() => _secure.read(StorageKeys.userRole);

  @override
  Future<void> clearSession() async {
    await _secure.delete(StorageKeys.accessToken);
    await _secure.delete(StorageKeys.refreshToken);
    await _secure.delete(StorageKeys.userId);
    await _secure.delete(StorageKeys.userRole);
  }

  @override
  Future<bool> hasSession() async {
    final token = await getAccessToken();
    return token != null && token.isNotEmpty;
  }
}
