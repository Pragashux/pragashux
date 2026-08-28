import 'package:flutter_test/flutter_test.dart';
import 'package:vibrant_lms/features/subscription/domain/billing_service.dart';

void main() {
  test('Play billing fails closed instead of fake success', () async {
    final billing = PlayBillingService();
    final result = await billing.purchase('pro');
    expect(result.fold((_) => true, (_) => false), isTrue);
  });
}
