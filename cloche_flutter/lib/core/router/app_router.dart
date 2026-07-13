import 'package:go_router/go_router.dart';

// Feature screens
import '../../features/splash/splash_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/signup_screen.dart';
import '../../features/auth/screens/forgot_password_screen.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/boutiques/screens/boutiques_screen.dart';
import '../../features/boutiques/screens/boutique_detail_screen.dart';
import '../../features/collections/screens/collections_screen.dart';
import '../../features/enquiry/screens/enquiry_screen.dart';
import '../../features/profile/screens/user_profile_screen.dart';
import '../../features/partner/screens/partner_login_screen.dart';
import '../../features/partner/screens/partner_dashboard_screen.dart';
import '../../features/partner/screens/manage_collections_screen.dart';
import '../../features/partner/screens/manage_profile_screen.dart';
import '../../features/partner/screens/view_leads_screen.dart';
import '../../features/search/screens/search_screen.dart';

class AppRouter {
  static const String splash = '/';
  static const String login = '/login';
  static const String signup = '/signup';
  static const String forgotPassword = '/forgot-password';
  static const String home = '/home';
  static const String boutiques = '/boutiques';
  static const String boutiqueDetail = '/boutiques/:id';
  static const String collections = '/collections';
  static const String enquiry = '/enquiry';
  static const String search = '/search';
  static const String userProfile = '/profile';
  static const String partnerLogin = '/partner/login';
  static const String partnerDashboard = '/partner/dashboard';
  static const String manageCollections = '/partner/collections';
  static const String manageProfile = '/partner/profile';
  static const String viewLeads = '/partner/leads';

  static final GoRouter router = GoRouter(
    initialLocation: splash,
    routes: [
      GoRoute(
        path: splash,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: login,
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: signup,
        builder: (context, state) => const SignupScreen(),
      ),
      GoRoute(
        path: forgotPassword,
        builder: (context, state) => const ForgotPasswordScreen(),
      ),
      GoRoute(
        path: home,
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: boutiques,
        builder: (context, state) => const BoutiquesScreen(),
      ),
      GoRoute(
        path: boutiqueDetail,
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return BoutiqueDetailScreen(boutiqueId: id);
        },
      ),
      GoRoute(
        path: collections,
        builder: (context, state) => const CollectionsScreen(),
      ),
      GoRoute(
        path: enquiry,
        builder: (context, state) {
          final boutiqueId = state.uri.queryParameters['boutiqueId'];
          final productName = state.uri.queryParameters['productName'];
          final productImage = state.uri.queryParameters['productImage'];
          return EnquiryScreen(
            boutiqueId: boutiqueId,
            productName: productName,
            productImage: productImage,
          );
        },
      ),
      GoRoute(
        path: search,
        builder: (context, state) => const SearchScreen(),
      ),
      GoRoute(
        path: userProfile,
        builder: (context, state) => const UserProfileScreen(),
      ),
      GoRoute(
        path: partnerLogin,
        builder: (context, state) => const PartnerLoginScreen(),
      ),
      GoRoute(
        path: partnerDashboard,
        builder: (context, state) => const PartnerDashboardScreen(),
      ),
      GoRoute(
        path: manageCollections,
        builder: (context, state) => const ManageCollectionsScreen(),
      ),
      GoRoute(
        path: manageProfile,
        builder: (context, state) => const ManageProfileScreen(),
      ),
      GoRoute(
        path: viewLeads,
        builder: (context, state) => const ViewLeadsScreen(),
      ),
    ],
  );
}
