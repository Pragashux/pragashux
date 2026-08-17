import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:vibrant_lms/features/admin/presentation/pages/admin_pages.dart';
import 'package:vibrant_lms/features/assessments/presentation/pages/assessment_page.dart';
import 'package:vibrant_lms/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:vibrant_lms/features/auth/presentation/pages/auth_pages.dart';
import 'package:vibrant_lms/features/certificates/presentation/pages/certificates_page.dart';
import 'package:vibrant_lms/features/courses/presentation/pages/course_pages.dart';
import 'package:vibrant_lms/features/dashboard/presentation/pages/dashboard_page.dart';
import 'package:vibrant_lms/features/lessons/presentation/pages/learning_page.dart';
import 'package:vibrant_lms/features/profile/presentation/pages/profile_pages.dart';
import 'package:vibrant_lms/shared/widgets/app_shell.dart';

class AppRouter {
  AppRouter(this._authBloc);

  final AuthBloc _authBloc;
  final _rootKey = GlobalKey<NavigatorState>();

  late final GoRouter router = GoRouter(
    navigatorKey: _rootKey,
    initialLocation: '/splash',
    refreshListenable: GoRouterRefreshStream(_authBloc.stream),
    redirect: (context, state) {
      final auth = _authBloc.state;
      final loc = state.matchedLocation;
      final isAuthRoute = loc == '/login' ||
          loc == '/signup' ||
          loc == '/forgot-password' ||
          loc.startsWith('/otp') ||
          loc == '/splash';

      if (auth is AuthInitial || auth is AuthLoading) {
        return loc == '/splash' ? null : '/splash';
      }

      if (auth is AuthUnauthenticated || auth is AuthFailureState) {
        return isAuthRoute ? null : '/login';
      }

      if (auth is AuthAuthenticated) {
        if (loc == '/splash' || loc == '/login' || loc == '/signup') {
          return auth.user.isAdmin ? '/admin' : '/home';
        }
        if (auth.user.isAdmin && _isStudentOnly(loc)) {
          return '/admin';
        }
        if (!auth.user.isAdmin && loc.startsWith('/admin')) {
          return '/home';
        }
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (_, __) => const SplashPage(),
      ),
      GoRoute(path: '/login', builder: (_, __) => const LoginPage()),
      GoRoute(path: '/signup', builder: (_, __) => const SignupPage()),
      GoRoute(
        path: '/forgot-password',
        builder: (_, __) => const ForgotPasswordPage(),
      ),
      GoRoute(
        path: '/otp',
        builder: (_, state) => OtpVerificationPage(
          email: state.uri.queryParameters['email'] ?? '',
        ),
      ),
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) =>
            StudentShell(navigationShell: navigationShell),
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/home',
                builder: (_, __) => const StudentDashboardPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/catalog',
                builder: (_, __) => const CourseCatalogPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/certificates',
                builder: (_, __) => const CertificatesPage(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/profile',
                builder: (_, __) => const ProfilePage(),
              ),
            ],
          ),
        ],
      ),
      GoRoute(
        path: '/courses/:id',
        builder: (_, state) => CourseDetailPage(
          courseId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/learn/:id',
        builder: (_, state) => LearningPage(
          courseId: state.pathParameters['id']!,
        ),
      ),
      GoRoute(
        path: '/assessments/:courseId',
        builder: (_, state) => AssessmentPage(
          courseId: state.pathParameters['courseId']!,
        ),
      ),
      GoRoute(
        path: '/notifications',
        builder: (_, __) => const NotificationsPage(),
      ),
      GoRoute(
        path: '/settings',
        builder: (_, __) => const SettingsPage(),
      ),
      GoRoute(
        path: '/analytics',
        builder: (_, __) => const LearningAnalyticsPage(),
      ),
      ShellRoute(
        builder: (context, state, child) => AdminShell(child: child),
        routes: [
          GoRoute(
            path: '/admin',
            builder: (_, __) => const AdminDashboardPage(),
          ),
          GoRoute(
            path: '/admin/courses',
            builder: (_, __) => const AdminCoursesPage(),
          ),
          GoRoute(
            path: '/admin/students',
            builder: (_, __) => const AdminStudentsPage(),
          ),
          GoRoute(
            path: '/admin/analytics',
            builder: (_, __) => const AdminAnalyticsPage(),
          ),
        ],
      ),
    ],
  );

  bool _isStudentOnly(String loc) {
    return loc == '/home' ||
        loc == '/catalog' ||
        loc == '/certificates' ||
        loc == '/profile' ||
        loc.startsWith('/learn') ||
        loc.startsWith('/courses') ||
        loc.startsWith('/assessments');
  }
}

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    context.read<AuthBloc>().add(const AuthStarted());
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.auto_stories_rounded,
              size: 64,
              color: theme.colorScheme.primary,
            ),
            const SizedBox(height: 16),
            Text(
              'Vibrant LMS',
              style: theme.textTheme.headlineMedium?.copyWith(
                color: theme.colorScheme.primary,
              ),
            ),
            const SizedBox(height: 24),
            const CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}

/// Adapts a [Stream] into a [Listenable] for GoRouter refresh.
class GoRouterRefreshStream extends ChangeNotifier {
  GoRouterRefreshStream(Stream<dynamic> stream) {
    notifyListeners();
    _subscription = stream.asBroadcastStream().listen((_) => notifyListeners());
  }

  late final StreamSubscription<dynamic> _subscription;

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}
