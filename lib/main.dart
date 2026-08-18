import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:vibrant_lms/core/constants/app_constants.dart';
import 'package:vibrant_lms/core/di/injection.dart';
import 'package:vibrant_lms/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:vibrant_lms/routes/app_router.dart';
import 'package:vibrant_lms/themes/app_theme.dart';
import 'package:vibrant_lms/themes/theme_mode_cubit.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);
  await configureDependencies(demoMode: true);
  runApp(const VibrantLmsApp());
}

class VibrantLmsApp extends StatefulWidget {
  const VibrantLmsApp({super.key});

  @override
  State<VibrantLmsApp> createState() => _VibrantLmsAppState();
}

class _VibrantLmsAppState extends State<VibrantLmsApp> {
  late final AuthBloc _authBloc;
  late final AppRouter _appRouter;

  @override
  void initState() {
    super.initState();
    _authBloc = sl<AuthBloc>();
    _appRouter = AppRouter(_authBloc);
  }

  @override
  void dispose() {
    _authBloc.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider.value(value: _authBloc),
        BlocProvider.value(value: sl<ThemeCubit>()),
      ],
      child: BlocBuilder<ThemeCubit, ThemeMode>(
        builder: (context, themeMode) {
          return MaterialApp.router(
            title: AppConstants.appName,
            debugShowCheckedModeBanner: false,
            theme: AppTheme.light(),
            darkTheme: AppTheme.dark(),
            themeMode: themeMode,
            routerConfig: _appRouter.router,
          );
        },
      ),
    );
  }
}
