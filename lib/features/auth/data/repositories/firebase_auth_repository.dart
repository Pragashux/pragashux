/// Production Firebase implementations — enable after `flutterfire configure`.
///
/// Swap registrations in `lib/core/di/injection.dart`:
/// ```dart
/// sl.registerLazySingleton<AuthRepository>(() => FirebaseAuthRepository(...));
/// ```
///
/// Keep interfaces in domain; put Firebase SDK calls only in this data layer.
library;

// Example skeleton (uncomment when Firebase is configured):
//
// import 'package:firebase_auth/firebase_auth.dart';
// import 'package:cloud_firestore/cloud_firestore.dart';
// import 'package:dartz/dartz.dart';
// import 'package:vibrant_lms/core/errors/failures.dart';
// import 'package:vibrant_lms/features/auth/domain/repositories/repositories.dart';
// import 'package:vibrant_lms/shared/models/entities.dart';
//
// class FirebaseAuthRepository implements AuthRepository {
//   FirebaseAuthRepository(this._auth, this._db);
//   final FirebaseAuth _auth;
//   final FirebaseFirestore _db;
//   ...
// }
