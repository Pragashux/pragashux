import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:vibrant_lms/core/constants/app_constants.dart';
import 'package:vibrant_lms/features/auth/presentation/bloc/auth_bloc.dart';
import 'package:vibrant_lms/shared/widgets/common_widgets.dart';
import 'package:vibrant_lms/themes/app_tokens.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _email = TextEditingController(text: AppConstants.demoStudentEmail);
  final _password = TextEditingController(text: AppConstants.demoPassword);
  bool _obscure = true;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    context.read<AuthBloc>().add(
          AuthLoginRequested(
            email: _email.text.trim(),
            password: _password.text,
          ),
        );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthFailureState) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message)),
            );
          }
          if (state is AuthAuthenticated) {
            context.go(state.user.isAdmin ? '/admin' : '/home');
          }
        },
        builder: (context, state) {
          final loading = state is AuthLoading;
          return DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  theme.colorScheme.primary.withValues(alpha: 0.12),
                  theme.scaffoldBackgroundColor,
                  theme.colorScheme.secondary.withValues(alpha: 0.08),
                ],
              ),
            ),
            child: SafeArea(
              child: ResponsiveShell(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: AppSpacing.xl),
                        Text(
                          AppConstants.appName,
                          style: theme.textTheme.displaySmall?.copyWith(
                            color: theme.colorScheme.primary,
                          ),
                        )
                            .animate()
                            .fadeIn()
                            .slideX(begin: -0.05),
                        const SizedBox(height: 8),
                        Text(
                          AppConstants.appTagline,
                          style: theme.textTheme.bodyLarge,
                        ).animate().fadeIn(delay: 80.ms),
                        const SizedBox(height: AppSpacing.xxl),
                        Text('Welcome back', style: theme.textTheme.headlineMedium),
                        const SizedBox(height: 8),
                        Text(
                          'Sign in to continue your learning journey.',
                          style: theme.textTheme.bodyMedium,
                        ),
                        const SizedBox(height: AppSpacing.lg),
                        VTextField(
                          controller: _email,
                          label: 'Email',
                          keyboardType: TextInputType.emailAddress,
                          prefixIcon: Icons.mail_outline_rounded,
                          autofillHints: const [AutofillHints.email],
                          validator: (v) {
                            if (v == null || !v.contains('@')) {
                              return 'Enter a valid email';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: AppSpacing.md),
                        VTextField(
                          controller: _password,
                          label: 'Password',
                          obscureText: _obscure,
                          prefixIcon: Icons.lock_outline_rounded,
                          autofillHints: const [AutofillHints.password],
                          suffix: IconButton(
                            tooltip: _obscure ? 'Show password' : 'Hide password',
                            onPressed: () => setState(() => _obscure = !_obscure),
                            icon: Icon(
                              _obscure
                                  ? Icons.visibility_outlined
                                  : Icons.visibility_off_outlined,
                            ),
                          ),
                          validator: (v) {
                            if (v == null || v.length < 8) {
                              return 'Minimum 8 characters';
                            }
                            return null;
                          },
                          onSubmitted: (_) => _submit(),
                        ),
                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton(
                            onPressed: () => context.push('/forgot-password'),
                            child: const Text('Forgot password?'),
                          ),
                        ),
                        const SizedBox(height: AppSpacing.sm),
                        VButton(
                          label: 'Sign in',
                          loading: loading,
                          onPressed: _submit,
                        ),
                        const SizedBox(height: AppSpacing.md),
                        Row(
                          children: [
                            const Expanded(child: Divider()),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 12),
                              child: Text('or continue with', style: theme.textTheme.bodySmall),
                            ),
                            const Expanded(child: Divider()),
                          ],
                        ),
                        const SizedBox(height: AppSpacing.md),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: loading
                                    ? null
                                    : () => context.read<AuthBloc>().add(
                                          const AuthSocialRequested('google'),
                                        ),
                                icon: const Icon(Icons.g_mobiledata_rounded),
                                label: const Text('Google'),
                              ),
                            ),
                            const SizedBox(width: AppSpacing.sm),
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: loading
                                    ? null
                                    : () => context.read<AuthBloc>().add(
                                          const AuthSocialRequested('apple'),
                                        ),
                                icon: const Icon(Icons.apple),
                                label: const Text('Apple'),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: AppSpacing.lg),
                        Center(
                          child: Wrap(
                            crossAxisAlignment: WrapCrossAlignment.center,
                            children: [
                              Text(
                                "Don't have an account?",
                                style: theme.textTheme.bodyMedium,
                              ),
                              TextButton(
                                onPressed: () => context.push('/signup'),
                                child: const Text('Sign up'),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: AppSpacing.md),
                        _DemoHints(theme: theme),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _DemoHints extends StatelessWidget {
  const _DemoHints({required this.theme});
  final ThemeData theme;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(AppRadius.md),
      ),
      child: Text(
        'Demo\nStudent: ${AppConstants.demoStudentEmail}\n'
        'Admin: ${AppConstants.demoAdminEmail}\n'
        'Password: ${AppConstants.demoPassword}',
        style: theme.textTheme.bodySmall,
      ),
    );
  }
}

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _obscure = true;

  @override
  void dispose() {
    _name.dispose();
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Create account')),
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthFailureState) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message)),
            );
          }
          if (state is AuthAuthenticated) {
            context.go('/otp?email=${Uri.encodeComponent(_email.text.trim())}');
          }
        },
        builder: (context, state) {
          final loading = state is AuthLoading;
          return ResponsiveShell(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Join Vibrant LMS',
                      style: theme.textTheme.headlineMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Build skills with a premium learning experience.',
                      style: theme.textTheme.bodyMedium,
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    VTextField(
                      controller: _name,
                      label: 'Full name',
                      prefixIcon: Icons.person_outline_rounded,
                      validator: (v) =>
                          v == null || v.trim().length < 2 ? 'Enter your name' : null,
                    ),
                    const SizedBox(height: AppSpacing.md),
                    VTextField(
                      controller: _email,
                      label: 'Email',
                      keyboardType: TextInputType.emailAddress,
                      prefixIcon: Icons.mail_outline_rounded,
                      validator: (v) =>
                          v == null || !v.contains('@') ? 'Enter a valid email' : null,
                    ),
                    const SizedBox(height: AppSpacing.md),
                    VTextField(
                      controller: _password,
                      label: 'Password',
                      obscureText: _obscure,
                      prefixIcon: Icons.lock_outline_rounded,
                      suffix: IconButton(
                        onPressed: () => setState(() => _obscure = !_obscure),
                        icon: Icon(
                          _obscure
                              ? Icons.visibility_outlined
                              : Icons.visibility_off_outlined,
                        ),
                      ),
                      validator: (v) =>
                          v == null || v.length < 8 ? 'Minimum 8 characters' : null,
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    VButton(
                      label: 'Create account',
                      loading: loading,
                      onPressed: () {
                        if (!_formKey.currentState!.validate()) return;
                        context.read<AuthBloc>().add(
                              AuthSignupRequested(
                                name: _name.text.trim(),
                                email: _email.text.trim(),
                                password: _password.text,
                              ),
                            );
                      },
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class ForgotPasswordPage extends StatefulWidget {
  const ForgotPasswordPage({super.key});

  @override
  State<ForgotPasswordPage> createState() => _ForgotPasswordPageState();
}

class _ForgotPasswordPageState extends State<ForgotPasswordPage> {
  final _email = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _email.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Reset password')),
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthPasswordResetSent) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Reset link sent. Check your inbox.')),
            );
            context.push('/otp?email=${Uri.encodeComponent(_email.text.trim())}');
          }
          if (state is AuthFailureState) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message)),
            );
          }
        },
        builder: (context, state) {
          return ResponsiveShell(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Forgot your password?',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Enter your email and we will send a verification code.',
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    VTextField(
                      controller: _email,
                      label: 'Email',
                      keyboardType: TextInputType.emailAddress,
                      prefixIcon: Icons.mail_outline_rounded,
                      validator: (v) =>
                          v == null || !v.contains('@') ? 'Enter a valid email' : null,
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    VButton(
                      label: 'Send code',
                      loading: state is AuthLoading,
                      onPressed: () {
                        if (!_formKey.currentState!.validate()) return;
                        context.read<AuthBloc>().add(
                              AuthForgotPasswordRequested(_email.text.trim()),
                            );
                      },
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class OtpVerificationPage extends StatefulWidget {
  const OtpVerificationPage({super.key, required this.email});

  final String email;

  @override
  State<OtpVerificationPage> createState() => _OtpVerificationPageState();
}

class _OtpVerificationPageState extends State<OtpVerificationPage> {
  final _otp = TextEditingController();

  @override
  void dispose() {
    _otp.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Verify OTP')),
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthOtpSuccess || state is AuthAuthenticated) {
            final auth = context.read<AuthBloc>().state;
            if (auth is AuthAuthenticated && auth.user.isAdmin) {
              context.go('/admin');
            } else {
              context.go('/home');
            }
          }
          if (state is AuthFailureState) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message)),
            );
          }
        },
        builder: (context, state) {
          return ResponsiveShell(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Enter the 6-digit code',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  Text('Sent to ${widget.email}'),
                  const SizedBox(height: AppSpacing.lg),
                  VTextField(
                    controller: _otp,
                    label: 'OTP',
                    hint: '123456',
                    keyboardType: TextInputType.number,
                    prefixIcon: Icons.pin_outlined,
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  VButton(
                    label: 'Verify',
                    loading: state is AuthLoading,
                    onPressed: () {
                      context.read<AuthBloc>().add(
                            AuthOtpVerified(
                              email: widget.email,
                              otp: _otp.text.trim(),
                            ),
                          );
                    },
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
