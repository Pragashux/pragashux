import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import 'package:vibrant_lms/core/di/injection.dart';
import 'package:vibrant_lms/features/ai/domain/ai_repository.dart';
import 'package:vibrant_lms/shared/models/entities.dart';
import 'package:vibrant_lms/themes/app_tokens.dart';

class AiTutorPage extends StatefulWidget {
  const AiTutorPage({super.key, this.seed, this.lessonTitle, this.courseTitle});

  final String? seed;
  final String? lessonTitle;
  final String? courseTitle;

  @override
  State<AiTutorPage> createState() => _AiTutorPageState();
}

class _AiTutorPageState extends State<AiTutorPage> {
  final _controller = TextEditingController();
  final _messages = <ChatMessageEntity>[];
  bool _busy = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _messages.add(
      ChatMessageEntity(
        id: 'intro',
        role: 'assistant',
        text:
            'I’m your tutor for ${widget.courseTitle ?? 'UX Design for Beginners'}. '
            'We are on ${widget.lessonTitle ?? 'User Research'}. Ask me anything — or tap a prompt below.',
        createdAt: DateTime.now(),
      ),
    );
    if (widget.seed != null) {
      _send(widget.seed!);
    }
  }

  Future<void> _send(String raw) async {
    final text = raw.trim();
    if (text.isEmpty || _busy) return;
    setState(() {
      _busy = true;
      _error = null;
      _messages.add(
        ChatMessageEntity(
          id: const Uuid().v4(),
          role: 'user',
          text: text,
          createdAt: DateTime.now(),
        ),
      );
      _controller.clear();
    });
    final result = await sl<AiRepository>().chat(
      message: text,
      courseTitle: widget.courseTitle,
      lessonTitle: widget.lessonTitle,
    );
    result.fold(
      (f) => setState(() {
        _error = 'AI is temporarily unavailable. Please try again.';
        _busy = false;
      }),
      (reply) => setState(() {
        _messages.add(
          ChatMessageEntity(
            id: const Uuid().v4(),
            role: 'assistant',
            text: reply,
            createdAt: DateTime.now(),
          ),
        );
        _busy = false;
      }),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('AI Tutor'),
            Text(
              widget.lessonTitle ?? 'Personal teacher',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Container(
            width: double.infinity,
            margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.aiSoft,
              borderRadius: BorderRadius.circular(AppRadius.md),
            ),
            child: Text(
              '${widget.courseTitle ?? 'UX Design for Beginners'} · ${widget.lessonTitle ?? 'User Research'} · intermediate',
              style: theme.textTheme.labelMedium?.copyWith(color: AppColors.ai),
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(AppSpacing.md),
              itemCount: _messages.length,
              itemBuilder: (context, i) {
                final m = _messages[i];
                final mine = m.isUser;
                return Align(
                  alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      maxWidth: MediaQuery.sizeOf(context).width * 0.82,
                    ),
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(
                        color: mine
                            ? theme.colorScheme.primary
                            : theme.colorScheme.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: mine
                            ? null
                            : Border.all(color: AppColors.ai.withValues(alpha: 0.18)),
                      ),
                      child: Text(
                        m.text,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: mine ? theme.colorScheme.onPrimary : null,
                          height: 1.45,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          if (_error != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(_error!, style: TextStyle(color: theme.colorScheme.error)),
            ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              children: [
                for (final p in [
                  'Explain it simply',
                  'Give me an example',
                  'Give me a quiz',
                  'Why is my answer wrong?',
                  'Teach me from the beginning',
                ])
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ActionChip(
                      label: Text(p),
                      onPressed: _busy ? null : () => _send(p),
                    ),
                  ),
              ],
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      textInputAction: TextInputAction.send,
                      onSubmitted: _send,
                      decoration: const InputDecoration(
                        hintText: 'Ask your tutor…',
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton.filled(
                    onPressed: _busy ? null : () => _send(_controller.text),
                    icon: _busy
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Icon(Icons.send_rounded),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
