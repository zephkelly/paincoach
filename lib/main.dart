import 'package:flutter/material.dart';
import 'colors.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Pain Coach',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: AppColors.backgroundColour),
        useMaterial3: true,
        scaffoldBackgroundColor: AppColors.backgroundColour,
        appBarTheme: const AppBarTheme(
          foregroundColor: Colors.white,
          backgroundColor: AppColors.backgroundColour,
        )
      ),
      home: const MyHomePage(title: 'Pain Coach'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;
  String dropdownValue = '7 Days';

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: <Widget>[
          SliverToBoxAdapter(
            child: Container(
              height: 64.0,
              padding: EdgeInsets.all(16.0),
              alignment: Alignment.bottomCenter,
              // decoration: BoxDecoration(
              //   border: Border(
              //     bottom: BorderSide(color: Colors.white, width: 2.0),
              //   ),
              // ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween, // Space between elements vertically
                children: <Widget>[
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.panelColour, // Lighter black background color
                      borderRadius: BorderRadius.circular(8.0), // Rounded edges
                    ),
                    padding: EdgeInsets.symmetric(horizontal: 14.0, vertical: 0), // Optional: to add some padding inside the container
                    child: SizedBox(
                      height: 32.0,
                      width: 82.0 - 28.0, // Set the width to 82 pixels
                      child: DropdownButton<String>(
                        isExpanded: true, // Make sure the dropdown button fills the SizedBox
                        value: dropdownValue,
                        icon: const Icon(Icons.arrow_downward, color: Colors.white),
                        iconSize: 8,
                        elevation: 16,
                        style: const TextStyle(color: Colors.white),
                        dropdownColor: AppColors.panelColour,
                        underline: Container(
                          height: 2,
                          color: Colors.transparent,
                        ),
                        onChanged: (String? newValue) {
                          setState(() {
                            dropdownValue = newValue!;
                          });
                        },
                        items: <String>['7 Days', '14 Days', '30 Days']
                            .map<DropdownMenuItem<String>>((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Text(
                              value,
                              style: TextStyle(color: Colors.white, fontSize: 10),
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                  Expanded(
                    child: Center(
                      child: Text(
                        'Overview',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),
                  Container(
                    width: 82.0 - 28.0, // Assign a fixed width to the search icon container
                    alignment: Alignment.centerRight,
                    child: Image.asset('assets/search_icon.png', width: 16, height: 16),
                  ),
                  // Add more widgets here as needed, they will be spaced out
                ],

              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (BuildContext context, int index) {
                return ListTile(
                  title: Text(
                    'Item $index',
                    style: TextStyle(color: Colors.white)
                    ),
                );
              },
              childCount: 100,
            ),
          ),
        ],
      ),
    );
  }
}
