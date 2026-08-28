import 'package:flutter/foundation.dart';
import 'package:logger/logger.dart';

/// Release builds must not print tokens, PII, or stack traces to logcat.
Logger createAppLogger() {
  return Logger(
    printer: PrettyPrinter(methodCount: 0, errorMethodCount: 4),
    level: kReleaseMode ? Level.off : Level.debug,
  );
}
