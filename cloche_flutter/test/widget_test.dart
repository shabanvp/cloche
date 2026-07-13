import 'package:flutter_test/flutter_test.dart';
import 'package:cloche_app/main.dart';

void main() {
  testWidgets('CLOCHE app smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const ClocheApp());
    expect(find.byType(ClocheApp), findsOneWidget);
  });
}
