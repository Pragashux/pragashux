import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vibrant_lms/core/di/injection.dart';
import 'package:vibrant_lms/main.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUpAll(() async {
    SharedPreferences.setMockInitialValues({});
    await configureDependencies(demoMode: true);
  });

  testWidgets('AI LearnOS boots to splash / login flow', (tester) async {
    await tester.pumpWidget(const VibrantLmsApp());
    await tester.pump();
    expect(find.textContaining('LearnOS'), findsWidgets);
    await tester.pump(const Duration(milliseconds: 800));
  });
}
