import 'package:dartz/dartz.dart';
import 'package:vibrant_lms/core/errors/failures.dart';
import 'package:vibrant_lms/shared/models/entities.dart';

/// Google Play Billing abstraction.
/// Production must not complete a digital subscription without Play Billing.
abstract class BillingService {
  Future<Either<Failure, List<PlanEntity>>> getProducts();
  Future<Either<Failure, SubscriptionEntity>> purchase(String productId);
  Future<Either<Failure, SubscriptionEntity>> restorePurchases();
  Future<Either<Failure, SubscriptionEntity>> getSubscriptionStatus();
  Future<Either<Failure, String>> cancelInformation();
}

/// Debug-only catalog. Never registered in release.
class MockBillingService implements BillingService {
  SubscriptionEntity _status = const SubscriptionEntity(
    planId: 'free',
    planName: 'Free',
    status: 'active',
  );

  @override
  Future<Either<Failure, List<PlanEntity>>> getProducts() async {
    return const Right([
      PlanEntity(
        id: 'free',
        name: 'Free',
        priceMonthly: 0,
        description: 'Limited courses and AI questions.',
        features: ['2 courses', 'Basic progress'],
      ),
      PlanEntity(
        id: 'pro',
        name: 'Pro',
        priceMonthly: 19,
        description: 'Unlimited courses and AI tutor.',
        features: ['Unlimited courses', 'AI tutor'],
      ),
      PlanEntity(
        id: 'premium',
        name: 'Premium',
        priceMonthly: 39,
        description: 'Pro plus certificates and advanced analytics.',
        features: ['Certificates', 'Priority tutor'],
      ),
    ]);
  }

  @override
  Future<Either<Failure, SubscriptionEntity>> purchase(String productId) async {
    final plans = (await getProducts()).getOrElse(() => []);
    final plan = plans.firstWhere((p) => p.id == productId);
    _status = SubscriptionEntity(
      planId: plan.id,
      planName: plan.name,
      status: 'active',
      priceMonthly: plan.priceMonthly,
      renewsAt: DateTime.now().add(const Duration(days: 30)),
    );
    return Right(_status);
  }

  @override
  Future<Either<Failure, SubscriptionEntity>> restorePurchases() async =>
      Right(_status);

  @override
  Future<Either<Failure, SubscriptionEntity>> getSubscriptionStatus() async =>
      Right(_status);

  @override
  Future<Either<Failure, String>> cancelInformation() async {
    return const Right(
      'Manage or cancel subscriptions in Google Play → Payments & subscriptions.',
    );
  }
}

/// Production billing. Wire [in_app_purchase] / Play Billing Library here.
/// Until Play Console products exist, purchases fail closed (no fake success).
class PlayBillingService implements BillingService {
  @override
  Future<Either<Failure, List<PlanEntity>>> getProducts() async {
    return const Right([
      PlanEntity(
        id: 'pro',
        name: 'Pro',
        priceMonthly: 19,
        description: 'Sold through Google Play Billing once products are configured.',
        features: ['Unlimited courses', 'AI tutor'],
      ),
      PlanEntity(
        id: 'premium',
        name: 'Premium',
        priceMonthly: 39,
        description: 'Sold through Google Play Billing once products are configured.',
        features: ['Certificates', 'Priority tutor'],
      ),
    ]);
  }

  @override
  Future<Either<Failure, SubscriptionEntity>> purchase(String productId) async {
    return const Left(
      ServerFailure(
        'Subscriptions are sold through Google Play. Connect Play Billing products in Play Console before enabling purchases.',
      ),
    );
  }

  @override
  Future<Either<Failure, SubscriptionEntity>> restorePurchases() async {
    return const Left(
      ServerFailure('No Google Play purchases to restore yet.'),
    );
  }

  @override
  Future<Either<Failure, SubscriptionEntity>> getSubscriptionStatus() async {
    return const Right(
      SubscriptionEntity(planId: 'free', planName: 'Free', status: 'active'),
    );
  }

  @override
  Future<Either<Failure, String>> cancelInformation() async {
    return const Right(
      'Cancel auto-renewing subscriptions in Google Play → Payments & subscriptions. '
      'AI LearnOS does not process digital course payments outside Google Play on Android.',
    );
  }
}
