import 'package:flutter/material.dart';
import 'package:vibrant_lms/core/di/injection.dart';
import 'package:vibrant_lms/features/ai/domain/ai_repository.dart';
import 'package:vibrant_lms/features/auth/domain/repositories/repositories.dart';
import 'package:vibrant_lms/shared/models/entities.dart';
import 'package:vibrant_lms/shared/widgets/common_widgets.dart';

class AdminAssistantPage extends StatefulWidget {
  const AdminAssistantPage({super.key});

  @override
  State<AdminAssistantPage> createState() => _AdminAssistantPageState();
}

class _AdminAssistantPageState extends State<AdminAssistantPage> {
  final _controller = TextEditingController();
  final _log = <String>[
    'Ask about inactive students, struggling learners, course performance, or generate a course.',
  ];
  bool _busy = false;

  Future<void> _ask(String prompt) async {
    setState(() {
      _busy = true;
      _log.add('You: $prompt');
    });
    final result = await sl<AiRepository>().adminAssist(prompt);
    final reply = result.getOrElse(() => 'AI is temporarily unavailable. Please try again.');
    if (reply.startsWith('CONFIRM:')) {
      if (!mounted) return;
      final ok = await showDialog<bool>(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Confirm destructive action'),
          content: Text(reply),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
            FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Confirm')),
          ],
        ),
      );
      setState(() {
        _log.add(ok == true ? 'Action confirmed and queued.' : 'Cancelled. Nothing was deleted.');
        _busy = false;
      });
      return;
    }
    setState(() {
      _log.add(reply);
      _busy = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Admin AI')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _log.length,
              itemBuilder: (_, i) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Text(_log[i]),
              ),
            ),
          ),
          Wrap(
            spacing: 8,
            children: [
              for (final p in [
                'How many students are inactive?',
                'Which students are struggling?',
                'Which course is performing best?',
                'Generate a report for this month.',
                'Create a new course about Python.',
                'Delete inactive students',
              ])
                ActionChip(label: Text(p), onPressed: _busy ? null : () => _ask(p)),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(hintText: 'Ask the admin assistant'),
                    onSubmitted: (v) => _ask(v),
                  ),
                ),
                IconButton.filled(
                  onPressed: _busy ? null : () => _ask(_controller.text),
                  icon: const Icon(Icons.send_rounded),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class AdminCourseGeneratorPage extends StatefulWidget {
  const AdminCourseGeneratorPage({super.key});

  @override
  State<AdminCourseGeneratorPage> createState() => _AdminCourseGeneratorPageState();
}

class _AdminCourseGeneratorPageState extends State<AdminCourseGeneratorPage> {
  final _name = TextEditingController(text: 'UX Design for Beginners');
  final _description = TextEditingController(text: 'A beginner path through research and usability.');
  final _subject = TextEditingController(text: 'UX');
  final _audience = TextEditingController(text: 'Career changers');
  String _difficulty = 'beginner';
  Map<String, dynamic>? _draft;
  bool _busy = false;

  Future<void> _generate() async {
    setState(() => _busy = true);
    final result = await sl<AiRepository>().generateCourse(
      name: _name.text,
      description: _description.text,
      subject: _subject.text,
      difficulty: _difficulty,
      audience: _audience.text,
    );
    setState(() {
      _draft = result.getOrElse(() => {});
      _busy = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AI course generator')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          VTextField(controller: _name, label: 'Course name'),
          const SizedBox(height: 12),
          VTextField(controller: _description, label: 'Description'),
          const SizedBox(height: 12),
          VTextField(controller: _subject, label: 'Subject'),
          const SizedBox(height: 12),
          VTextField(controller: _audience, label: 'Target audience'),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            children: [
              for (final d in ['beginner', 'intermediate', 'advanced'])
                ChoiceChip(
                  label: Text(d),
                  selected: _difficulty == d,
                  onSelected: (_) => setState(() => _difficulty = d),
                ),
            ],
          ),
          const SizedBox(height: 16),
          VButton(
            label: 'Generate with AI',
            loading: _busy,
            onPressed: _generate,
            icon: Icons.auto_awesome_rounded,
          ),
          if (_draft != null) ...[
            const SizedBox(height: 20),
            Text('Review before publishing', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 8),
            for (final m in (_draft!['modules'] as List))
              Card(
                margin: const EdgeInsets.only(bottom: 10),
                child: ExpansionTile(
                  title: Text('${m['title']}'),
                  children: [
                    for (final l in (m['lessons'] as List))
                      ListTile(dense: true, title: Text('$l')),
                  ],
                ),
              ),
            VButton(
              label: 'Save as draft',
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Draft saved. Publish from Courses when ready.')),
                );
              },
            ),
          ],
        ],
      ),
    );
  }
}

class AdminStudentDetailPage extends StatelessWidget {
  const AdminStudentDetailPage({super.key, required this.student});

  final UserEntity student;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(student.displayName)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          ListTile(title: const Text('Email'), subtitle: Text(student.email)),
          ListTile(title: const Text('Skill'), subtitle: Text(student.skillLevel)),
          ListTile(title: const Text('Streak'), subtitle: Text('${student.streakDays} days')),
          ListTile(title: const Text('Status'), subtitle: Text(student.status)),
          const Divider(),
          const ListTile(title: Text('Learning history'), subtitle: Text('UX Design for Beginners · 22–65%')),
          const ListTile(title: Text('Assessments'), subtitle: Text('User Research check · 60%')),
          const ListTile(title: Text('Subscription'), subtitle: Text('Pro')),
          const ListTile(title: Text('AI interactions'), subtitle: Text('14 tutor sessions this month')),
        ],
      ),
    );
  }
}

class AssignmentPage extends StatefulWidget {
  const AssignmentPage({super.key, required this.courseId});

  final String courseId;

  @override
  State<AssignmentPage> createState() => _AssignmentPageState();
}

class _AssignmentPageState extends State<AssignmentPage> {
  final _text = TextEditingController();
  Map<String, dynamic>? _result;
  bool _busy = false;

  Future<void> _submit() async {
    setState(() => _busy = true);
    final result = await sl<AiRepository>().evaluateAssignment(_text.text);
    setState(() {
      _result = result.getOrElse(() => {});
      _busy = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Assignment')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('Studio insight — apply this module to an app you use weekly.'),
          const SizedBox(height: 12),
          TextField(
            controller: _text,
            minLines: 8,
            maxLines: 12,
            decoration: const InputDecoration(hintText: 'Write your submission, or describe an attached PDF/image.'),
          ),
          const SizedBox(height: 12),
          VButton(label: 'Submit for AI evaluation', loading: _busy, onPressed: _submit),
          if (_result != null) ...[
            const SizedBox(height: 16),
            Text('Score ${_result!['score']}', style: Theme.of(context).textTheme.headlineSmall),
            Text('${_result!['feedback']}'),
            Text('Strengths: ${(_result!['strengths'] as List).join(', ')}'),
            Text('Improve: ${(_result!['weaknesses'] as List).join(', ')}'),
            const SizedBox(height: 8),
            const Text('Admin can override this AI grade before it is final.'),
          ],
        ],
      ),
    );
  }
}

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final _q = TextEditingController();
  List<CourseEntity> _hits = [];

  Future<void> _run() async {
    final result = await sl<CourseRepository>().getCourses(query: _q.text);
    setState(() => _hits = result.getOrElse(() => []));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Search')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _q,
              onSubmitted: (_) => _run(),
              decoration: InputDecoration(
                hintText: 'Courses, lessons, topics…',
                suffixIcon: IconButton(onPressed: _run, icon: const Icon(Icons.search)),
              ),
            ),
          ),
          Expanded(
            child: _hits.isEmpty
                ? const EmptyState(
                    icon: Icons.search_rounded,
                    title: 'Search the catalog',
                    message: 'Keyword search now. Semantic ranking will use AIService.search.',
                  )
                : ListView(
                    children: [
                      for (final c in _hits)
                        ListTile(
                          title: Text(c.title),
                          subtitle: Text(c.category),
                        ),
                    ],
                  ),
          ),
        ],
      ),
    );
  }
}
