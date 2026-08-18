import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:vibrant_lms/features/auth/domain/repositories/repositories.dart';
import 'package:vibrant_lms/shared/models/entities.dart';

// Events
abstract class AuthEvent extends Equatable {
  const AuthEvent();
  @override
  List<Object?> get props => [];
}

class AuthStarted extends AuthEvent {
  const AuthStarted();
}

class AuthLoginRequested extends AuthEvent {
  const AuthLoginRequested({required this.email, required this.password});
  final String email;
  final String password;
  @override
  List<Object?> get props => [email, password];
}

class AuthSignupRequested extends AuthEvent {
  const AuthSignupRequested({
    required this.name,
    required this.email,
    required this.password,
  });
  final String name;
  final String email;
  final String password;
  @override
  List<Object?> get props => [name, email, password];
}

class AuthForgotPasswordRequested extends AuthEvent {
  const AuthForgotPasswordRequested(this.email);
  final String email;
  @override
  List<Object?> get props => [email];
}

class AuthOtpVerified extends AuthEvent {
  const AuthOtpVerified({required this.email, required this.otp});
  final String email;
  final String otp;
  @override
  List<Object?> get props => [email, otp];
}

class AuthSocialRequested extends AuthEvent {
  const AuthSocialRequested(this.provider);
  final String provider;
  @override
  List<Object?> get props => [provider];
}

class AuthLogoutRequested extends AuthEvent {
  const AuthLogoutRequested();
}

// States
abstract class AuthState extends Equatable {
  const AuthState();
  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {
  const AuthInitial();
}

class AuthLoading extends AuthState {
  const AuthLoading();
}

class AuthAuthenticated extends AuthState {
  const AuthAuthenticated(this.user);
  final UserEntity user;
  @override
  List<Object?> get props => [user];
}

class AuthUnauthenticated extends AuthState {
  const AuthUnauthenticated();
}

class AuthFailureState extends AuthState {
  const AuthFailureState(this.message);
  final String message;
  @override
  List<Object?> get props => [message];
}

class AuthPasswordResetSent extends AuthState {
  const AuthPasswordResetSent();
}

class AuthOtpSuccess extends AuthState {
  const AuthOtpSuccess();
}

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc(this._repo) : super(const AuthInitial()) {
    on<AuthStarted>(_onStarted);
    on<AuthLoginRequested>(_onLogin);
    on<AuthSignupRequested>(_onSignup);
    on<AuthForgotPasswordRequested>(_onForgot);
    on<AuthOtpVerified>(_onOtp);
    on<AuthSocialRequested>(_onSocial);
    on<AuthLogoutRequested>(_onLogout);
  }

  final AuthRepository _repo;

  Future<void> _onStarted(AuthStarted event, Emitter<AuthState> emit) async {
    emit(const AuthLoading());
    final result = await _repo.getCurrentUser();
    result.fold(
      (f) => emit(const AuthUnauthenticated()),
      (user) => emit(
        user == null
            ? const AuthUnauthenticated()
            : AuthAuthenticated(user),
      ),
    );
  }

  Future<void> _onLogin(
    AuthLoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());
    final result = await _repo.login(
      email: event.email,
      password: event.password,
    );
    result.fold(
      (f) => emit(AuthFailureState(f.message)),
      (user) => emit(AuthAuthenticated(user)),
    );
  }

  Future<void> _onSignup(
    AuthSignupRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());
    final result = await _repo.signup(
      name: event.name,
      email: event.email,
      password: event.password,
    );
    result.fold(
      (f) => emit(AuthFailureState(f.message)),
      (user) => emit(AuthAuthenticated(user)),
    );
  }

  Future<void> _onForgot(
    AuthForgotPasswordRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());
    final result = await _repo.forgotPassword(event.email);
    result.fold(
      (f) => emit(AuthFailureState(f.message)),
      (_) => emit(const AuthPasswordResetSent()),
    );
  }

  Future<void> _onOtp(AuthOtpVerified event, Emitter<AuthState> emit) async {
    emit(const AuthLoading());
    final result = await _repo.verifyOtp(email: event.email, otp: event.otp);
    result.fold(
      (f) => emit(AuthFailureState(f.message)),
      (_) => emit(const AuthOtpSuccess()),
    );
  }

  Future<void> _onSocial(
    AuthSocialRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());
    final result = await _repo.socialLogin(event.provider);
    result.fold(
      (f) => emit(AuthFailureState(f.message)),
      (user) => emit(AuthAuthenticated(user)),
    );
  }

  Future<void> _onLogout(
    AuthLogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    await _repo.logout();
    emit(const AuthUnauthenticated());
  }
}
