import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:dartz/dartz.dart';
import 'package:vibrant_lms/core/errors/failures.dart';
import 'package:vibrant_lms/features/auth/domain/repositories/repositories.dart';
import 'package:vibrant_lms/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:vibrant_lms/shared/models/entities.dart';

class _MockAuthRepo extends Mock implements AuthRepository {}

void main() {
  late _MockAuthRepo repo;

  const user = UserEntity(
    id: '1',
    email: 'student@vibrant.lms',
    displayName: 'Sam',
    role: UserRole.student,
  );

  setUp(() {
    repo = _MockAuthRepo();
  });

  blocTest<AuthBloc, AuthState>(
    'emits [loading, authenticated] on successful login',
    build: () {
      when(
        () => repo.login(
          email: any(named: 'email'),
          password: any(named: 'password'),
        ),
      ).thenAnswer((_) async => const Right(user));
      return AuthBloc(repo);
    },
    act: (bloc) => bloc.add(
      const AuthLoginRequested(
        email: 'student@vibrant.lms',
        password: 'Vibrant@123',
      ),
    ),
    expect: () => [
      const AuthLoading(),
      const AuthAuthenticated(user),
    ],
  );

  blocTest<AuthBloc, AuthState>(
    'emits [loading, failure] on bad credentials',
    build: () {
      when(
        () => repo.login(
          email: any(named: 'email'),
          password: any(named: 'password'),
        ),
      ).thenAnswer((_) async => const Left(AuthFailure('Invalid')));
      return AuthBloc(repo);
    },
    act: (bloc) => bloc.add(
      const AuthLoginRequested(email: 'x', password: 'y'),
    ),
    expect: () => [
      const AuthLoading(),
      const AuthFailureState('Invalid'),
    ],
  );
}
