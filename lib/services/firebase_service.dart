import 'package:logger/logger.dart';

/// Firebase bootstrap. Call [initialize] after adding google-services / GoogleService-Info.
/// Demo mode skips Firebase so the app runs without project credentials.
class FirebaseService {
  FirebaseService({this.demoMode = true});

  final bool demoMode;
  bool _ready = false;
  final _logger = Logger();

  bool get isReady => _ready;
  bool get isDemoMode => demoMode;

  Future<void> initialize() async {
    if (demoMode) {
      _logger.i('Firebase skipped — running in demo mode');
      _ready = false;
      return;
    }
    try {
      // Uncomment after `flutterfire configure`:
      // await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
      _ready = true;
      _logger.i('Firebase initialized');
    } catch (e, st) {
      _logger.e('Firebase init failed', error: e, stackTrace: st);
      _ready = false;
    }
  }
}

/// Push notification facade — wire FCM handlers when Firebase is configured.
class NotificationService {
  NotificationService({required this.demoMode});

  final bool demoMode;
  final _logger = Logger();

  Future<void> initialize() async {
    if (demoMode) {
      _logger.i('FCM skipped — demo mode');
      return;
    }
    // await FirebaseMessaging.instance.requestPermission();
    // FirebaseMessaging.onMessage.listen(...);
  }

  Future<String?> getDeviceToken() async {
    if (demoMode) return 'demo-fcm-token';
    return null;
  }
}
