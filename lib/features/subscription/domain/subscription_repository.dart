import 'package:dartz/dartz.dart';
import 'package:vibrant_lms/core/errors/failures.dart';
import 'package:vibrant_lms/features/subscription/domain/billing_service.dart';
import 'package:vibrant_lms/shared/models/entities.dart';

abstract class SubscriptionRepository {
  Future<Either<Failure, List<PlanEntity>>> getPlans();
  Future<Either<Failure, SubscriptionEntity>> getMine();
  Future<Either<Failure, SubscriptionEntity>> changePlan(String planId);
  Future<Either<Failure, void>> cancel();
}

class MockSubscriptionRepository implements SubscriptionRepository {
  SubscriptionEntity _current = const SubscriptionEntity(
    planId: 'pro',
    planName: 'Pro',
    status: 'active',
    priceMonthly: 19,
  );

  @override
  Future<Either<Failure, List<PlanEntity>>> getPlans() async {
    return const Right([
      PlanEntity(
        id: 'free',
        name: 'Free',
        priceMonthly: 0,
        description: 'Limited courses, limited AI questions, basic progress.',
        features: ['2 courses', '20 AI questions / month', 'Basic progress'],
      ),
      PlanEntity(
        id: 'pro',
        name: 'Pro',
        priceMonthly: 19,
        description: 'Unlimited courses, AI tutor, quizzes, personalized learning.',
        features: ['Unlimited courses', 'AI tutor', 'AI quizzes & materials', 'Personalized learning'],
      ),
      PlanEntity(
        id: 'premium',
        name: 'Premium',
        priceMonthly: 39,
        description: 'Everything in Pro plus plans, analytics, and certificates.',
        features: [
          'Everything in Pro',
          'AI learning plan',
          'Advanced analytics',
          'Certificates',
          'Priority tutor',
        ],
      ),
    ]);
  }

  @override
  Future<Either<Failure, SubscriptionEntity>> getMine() async => Right(_current);

  @override
  Future<Either<Failure, SubscriptionEntity>> changePlan(String planId) async {
    final plans = (await getPlans()).getOrElse(() => []);
    final plan = plans.firstWhere((p) => p.id == planId);
    _current = SubscriptionEntity(
      planId: plan.id,
      planName: plan.name,
      status: 'active',
      priceMonthly: plan.priceMonthly,
      renewsAt: DateTime.now().add(const Duration(days: 30)),
    );
    return Right(_current);
  }

  @override
  Future<Either<Failure, void>> cancel() async {
    _current = SubscriptionEntity(
      planId: _current.planId,
      planName: _current.planName,
      status: 'cancelled',
      priceMonthly: _current.priceMonthly,
    );
    return const Right(null);
  }
}

class BillingBackedSubscriptionRepository implements SubscriptionRepository {
  BillingBackedSubscriptionRepository(this._billing);

  final BillingService _billing;

  @override
  Future<Either<Failure, List<PlanEntity>>> getPlans() => _billing.getProducts();

  @override
  Future<Either<Failure, SubscriptionEntity>> getMine() =>
      _billing.getSubscriptionStatus();

  @override
  Future<Either<Failure, SubscriptionEntity>> changePlan(String planId) =>
      _billing.purchase(planId);

  @override
  Future<Either<Failure, void>> cancel() async {
    final info = await _billing.cancelInformation();
    return info.fold(Left.new, (_) => const Right(null));
  }
}

abstract class AssignmentRepository {
  Future<Either<Failure, List<AssignmentEntity>>> forCourse(String courseId);
}

class MockAssignmentRepository implements AssignmentRepository {
  @override
  Future<Either<Failure, List<AssignmentEntity>>> forCourse(String courseId) async {
    return Right([
      AssignmentEntity(
        id: '${courseId}_as1',
        courseId: courseId,
        title: 'Studio insight',
        brief: 'Apply this module to an app you use weekly. Submit a one-page insight.',
        criteria: const ['Clarity', 'Evidence', 'Next step'],
      ),
    ]);
  }
}
