import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

const apiBase = String.fromEnvironment('API_BASE', defaultValue: 'http://localhost:8000');

void main() => runApp(const CodenaApp());

class CodenaApp extends StatelessWidget {
  const CodenaApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(title: 'Codéna', theme: ThemeData(useMaterial3: true), home: const LoginPage());
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final phoneCtrl = TextEditingController();
  final codeCtrl = TextEditingController();
  String debug = '';

  Future<void> sendOtp() async {
    final res = await http.post(Uri.parse('$apiBase/auth/otp/send'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'phone': phoneCtrl.text}));
    final data = jsonDecode(res.body);
    setState(() => debug = data['debug_code']?.toString() ?? '');
  }

  Future<void> verifyOtp() async {
    final res = await http.post(Uri.parse('$apiBase/auth/otp/verify'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'phone': phoneCtrl.text, 'code': codeCtrl.text}));
    final data = jsonDecode(res.body);
    final access = data['access_token'] ?? '';
    if (access.isNotEmpty && context.mounted) {
      Navigator.push(context, MaterialPageRoute(builder: (_) => LessonsPage()));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Codéna — OTP')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(children: [
          TextField(controller: phoneCtrl, decoration: const InputDecoration(labelText: 'Téléphone')),
          const SizedBox(height: 8),
          ElevatedButton(onPressed: sendOtp, child: const Text('Envoyer OTP')),
          if (debug.isNotEmpty) Text('debug_code: $debug'),
          const Divider(),
          TextField(controller: codeCtrl, decoration: const InputDecoration(labelText: 'Code')),
          const SizedBox(height: 8),
          ElevatedButton(onPressed: verifyOtp, child: const Text('Vérifier')),
        ]),
      ),
    );
  }
}

class LessonsPage extends StatefulWidget {
  @override
  State<LessonsPage> createState() => _LessonsPageState();
}

class _LessonsPageState extends State<LessonsPage> {
  List lessons = [];
  @override
  void initState() { super.initState(); load(); }
  Future<void> load() async {
    final res = await http.get(Uri.parse('$apiBase/content/lessons'));
    final data = jsonDecode(res.body);
    setState(() => lessons = data is List ? data : []);
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cours')),
      body: ListView.builder(
        itemCount: lessons.length,
        itemBuilder: (_, i) => ListTile(
          title: Text(lessons[i]['title'] ?? ''),
          subtitle: Text(lessons[i]['chapter'] ?? ''),
        ),
      ),
    );
  }
}
