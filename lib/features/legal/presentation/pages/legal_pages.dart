import 'package:flutter/material.dart';
import 'package:vibrant_lms/core/config/app_config.dart';
import 'package:vibrant_lms/themes/app_tokens.dart';

class LegalDocumentPage extends StatelessWidget {
  const LegalDocumentPage({
    super.key,
    required this.title,
    required this.body,
  });

  final String title;
  final String body;

  factory LegalDocumentPage.privacy() {
    return const LegalDocumentPage(
      title: 'Privacy policy',
      body: _privacy,
    );
  }

  factory LegalDocumentPage.terms() {
    return const LegalDocumentPage(
      title: 'Terms of service',
      body: _terms,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        children: [
          Text(body, style: Theme.of(context).textTheme.bodyMedium),
          const SizedBox(height: 24),
          Text(
            AppConfig.aiDisclaimer,
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ],
      ),
    );
  }
}

const _privacy = '''
AI LearnOS (“the app”) is an educational product. This in-app summary matches PRIVACY_POLICY.md in the repository. Host a full policy at a public URL before Play submission.

We collect account information you provide (name, email, password hash on the server), learning progress, assessment and assignment results, subscription status, notification preferences, and AI tutor messages so we can teach and support you.

We do not collect contacts, SMS, call logs, precise location, microphone, or camera data in this version.

AI messages are sent to our backend, not directly to a third-party LLM from the device. The backend may call an LLM provider you configure. Do not put provider API keys in the Android app.

You can request account deletion in Settings. See the full PRIVACY_POLICY.md for retention and Data Safety details.

This app is not directed at children under 13.
''';

const _terms = '''
By creating an account you agree to use AI LearnOS for lawful learning. Course content and AI output are for education. AI may be wrong — verify important information.

Android digital subscriptions, when enabled, are sold through Google Play Billing. Manage or cancel them in Google Play.

We may suspend accounts that abuse the AI or other learners.

These terms are a product draft and require legal review before you rely on them. See TERMS_OF_SERVICE.md.
''';
