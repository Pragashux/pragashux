import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'app_tokens.dart';

abstract final class AppTypography {
  static TextTheme textTheme(Brightness brightness) {
    final base = brightness == Brightness.light
        ? AppColors.lightOnSurface
        : AppColors.darkOnSurface;
    final muted = brightness == Brightness.light
        ? AppColors.lightOnSurfaceVariant
        : AppColors.darkOnSurfaceVariant;

    final display = GoogleFonts.outfit(
      color: base,
      fontWeight: FontWeight.w700,
      letterSpacing: -0.5,
      height: 1.15,
    );
    final body = GoogleFonts.plusJakartaSans(
      color: base,
      fontWeight: FontWeight.w400,
      height: 1.5,
    );

    return TextTheme(
      displayLarge: display.copyWith(fontSize: 40),
      displayMedium: display.copyWith(fontSize: 32),
      displaySmall: display.copyWith(fontSize: 28),
      headlineLarge: display.copyWith(fontSize: 26, fontWeight: FontWeight.w600),
      headlineMedium: display.copyWith(fontSize: 22, fontWeight: FontWeight.w600),
      headlineSmall: display.copyWith(fontSize: 20, fontWeight: FontWeight.w600),
      titleLarge: body.copyWith(fontSize: 18, fontWeight: FontWeight.w600),
      titleMedium: body.copyWith(fontSize: 16, fontWeight: FontWeight.w600),
      titleSmall: body.copyWith(fontSize: 14, fontWeight: FontWeight.w600),
      bodyLarge: body.copyWith(fontSize: 16),
      bodyMedium: body.copyWith(fontSize: 14),
      bodySmall: body.copyWith(fontSize: 12, color: muted),
      labelLarge: body.copyWith(fontSize: 14, fontWeight: FontWeight.w600, letterSpacing: 0.2),
      labelMedium: body.copyWith(fontSize: 12, fontWeight: FontWeight.w600, letterSpacing: 0.3),
      labelSmall: body.copyWith(fontSize: 11, fontWeight: FontWeight.w500, color: muted),
    );
  }
}
