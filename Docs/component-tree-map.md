# Component Tree Map

This document provides a complete map of all components in the PairUp Events application, organized by their hierarchy from routes to atoms.

## App Structure

```
App.tsx
└── BrowserRouter
    └── AuthErrorBoundary
        └── Suspense (with LoadingSpinner fallback)
            └── Routes
                └── NetworkStatus (global network status indicator)
```

## Entity Layer

Located in: `src/entities/`

### User Entity

- **File**: `src/entities/user.ts`
- **Purpose**: Core user data structure with validation and factory patterns
- **Features**:
  - TypeScript User interface
  - Zod validation schema
  - Factory function for user creation
  - Type guard for validation
  - Firebase Auth user conversion utility
- **Tests**: `src/entities/__tests__/user.test.ts` (17 tests)
- **Dependencies**: Zod for runtime validation

## Auth Components

Located in: `src/components/molecules/Auth/`

### AuthErrorDisplay

- **File**: `src/components/molecules/Auth/AuthErrorDisplay.tsx`
- **Purpose**: Displays authentication errors with contextual icons and retry options
- **Props**: error, onRetry, onClear, showRetry, className
- **Features**: Error type detection, retryable error handling, contextual messaging
- **Tests**: `src/components/molecules/Auth/__tests__/AuthErrorDisplay.test.tsx` (14 tests)

### AuthRetryButton

- **File**: `src/components/molecules/Auth/AuthRetryButton.tsx`
- **Purpose**: Provides retry functionality for authentication operations
- **Props**: onRetry, disabled, loading, children
- **Features**: Loading states, disabled states, customizable content

### NetworkStatus

- **File**: `src/components/molecules/Auth/NetworkStatus.tsx`
- **Purpose**: Global network status indicator
- **Features**: Online/offline detection, visual indicators, automatic updates
- **Tests**: `src/components/molecules/Auth/__tests__/NetworkStatus.test.tsx` (14 tests)

## Error Boundaries

Located in: `src/components/`

### AuthErrorBoundary

- **File**: `src/components/AuthErrorBoundary.tsx`
- **Purpose**: Catches authentication-related errors with specialized recovery options
- **Features**: Retry mechanisms, navigation to login, graceful fallbacks, development-only logging
- **Props**: children, fallback, onError, maxRetries
- **Tests**: `src/components/__tests__/AuthErrorBoundary.test.tsx` (13 tests)

### ErrorBoundary

- **File**: `src/components/ErrorBoundary.tsx`
- **Purpose**: General error boundary for application-wide error handling
- **Features**: Error catching, fallback UI, error reporting

## Hooks

Located in: `src/hooks/`

1. **useAuth** (`useAuth.ts`)
   - Firebase authentication state management
   - Functions: login, signup, logout, resetPassword
   - Returns: user, loading, auth functions

2. **useRequireAuth** (`useRequireAuth.ts`)
   - Authentication guard hook
   - Redirects unauthenticated users to login
   - Returns: user, loading

## Routes & Pages

### `/` (Index Page)

**File**: `src/pages/Index.tsx`

```
Index
└── LandingPageLayout
    ├── Navigation (showNavigation=true)
    │   ├── Logo (size="md")
    │   └── Button variations (Login, Signup, Navigation links)
    ├── SkipLink (targetId="main-content")
    ├── main
    │   ├── HeroSection
    │   │   └── Button-like CTA links (Create listing, Search listings)
    │   ├── HowItWorksSection
    │   ├── BenefitsSection
    │   └── EarlyAccessSection
    ├── Footer (showFooter=true)
    │   └── Multiple links and social icons
    └── MobileBottomNavigation
        └── Icon buttons (Home, Events, Messenger, Profile)
```

### `/signup` (Auth Page)

**File**: `src/pages/auth.tsx`

```
Auth
└── AuthLayout
    ├── Left Section (auth content)
    │   ├── img (Logo)
    │   ├── h1 (Title)
    │   └── EmailSignupForm
    │       ├── Form info note
    │       ├── FormField (First Name)
    │       ├── FormField (Last Name)
    │       ├── FormField (Email)
    │       ├── Password field with visibility toggle
    │       ├── Confirm password field
    │       ├── Date picker
    │       ├── Gender select
    │       ├── Button (Sign Up)
    │       └── Link (Login)
    └── Right Section (image)
        └── img (Header Logo)
```

### `/login` (Login Page)

**File**: `src/pages/login.tsx`

```
Login
└── AuthLayout
    ├── Left Section
    │   ├── img (Logo)
    │   ├── h1 (Title)
    │   └── EmailLoginForm
    │       ├── Form info note
    │       ├── FormField (Email)
    │       ├── Password field with visibility toggle
    │       ├── Button (Sign In)
    │       ├── Link (Sign Up)
    │       └── Button (Reset Password)
    └── Right Section
        └── img (Header Logo)
```

### `/profile` (Profile Page)

**File**: `src/pages/profile.tsx`

```
Profile
├── useRequireAuth (authentication guard)
├── LoadingSpinner (while auth loading)
└── div (container)
    ├── Navigation
    ├── div (main content)
    │   ├── h1 (Title)
    │   ├── Info card
    │   ├── ProfilePictureUpload
    │   │   ├── img (current photo or placeholder)
    │   │   └── Button (Upload)
    │   ├── ProfileDetailsForm
    │   │   ├── Input fields (First Name, Last Name, Email, Birth Date, Gender)
    │   │   └── textarea (Bio)
    │   └── ProfilePreferencesForm
    │       ├── Select fields (Hobbies, Likes, Dislikes)
    │       └── Input (Age Range)
    └── MobileBottomNavigation
```

**Note**: AccountControls was moved to `/settings` page.

### `/events` (Events Page)

**File**: `src/pages/events.tsx`

```
Events
├── useRequireAuth (authentication guard)
├── LoadingSpinner (while auth loading)
└── div (container)
    ├── Navigation
    ├── div (main content)
    │   └── h1 (Title)
    └── MobileBottomNavigation
```

### `/events/create` (Create Event Page)

**File**: `src/pages/events-create.tsx`

```
EventsCreate
├── useRequireAuth (authentication guard)
├── LoadingSpinner (while auth loading)
└── div (container)
    ├── Navigation
    ├── div (main content)
    │   ├── h1 (Title)
    │   └── p (Description)
    └── MobileBottomNavigation
```

### `/messenger` (Messenger Page)

**File**: `src/pages/messenger.tsx`

```
Messenger
├── useRequireAuth (authentication guard)
├── LoadingSpinner (while auth loading)
└── div (container)
    ├── Navigation
    ├── div (main content)
    │   ├── img (Logo)
    │   ├── h1 (Title with Construction icon)
    │   └── Construction message card
    │       ├── Construction icon
    │       ├── h2 (Title)
    │       ├── p (Description)
    │       └── ul (Features list)
    └── MobileBottomNavigation
```

### `/settings` (Settings Page)

**File**: `src/pages/settings.tsx`

```
Settings
├── useRequireAuth (authentication guard)
├── LoadingSpinner (while auth loading)
└── div (container)
    ├── Navigation
    ├── div (main content)
    │   ├── h1 (Title)
    │   ├── p (Description)
    │   └── AccountControls
    │       ├── Button (Sign Out)
    │       ├── Button (Reset Password)
    │       ├── Button (Delete Account)
    │       ├── Modal (Password Reset)
    │       │   ├── LabeledInput (Email)
    │       │   └── Button actions (Cancel, Send Reset Email)
    │       └── Modal (Delete Account Confirmation)
    │           ├── LabeledInput (Confirmation text)
    │           ├── Warning list
    │           └── Button actions (Cancel, Delete Account)
    └── MobileBottomNavigation
```

### `/invite` (Invite Page)

**File**: `src/pages/invite.tsx`

```
Invite
├── useRequireAuth (authentication guard)
├── LoadingSpinner (while auth loading)
└── div (container)
    ├── Navigation
    ├── div (main content)
    │   ├── h1 (Title)
    │   ├── p (Description)
    │   └── InviteFriendSection
    │       ├── InviteShareRow
    │       │   └── Button (Share)
    │       └── Info text
    └── MobileBottomNavigation
```

### `/contact-us` (Contact Us Page)

**File**: `src/pages/contact-us.tsx`

```
ContactUs
├── div (container)
│   ├── Navigation
│   ├── div (main content)
│   │   ├── h1 (Title)
│   │   └── p (Coming soon message)
│   └── MobileBottomNavigation
```

**Note**: Public page - no authentication required. Contact form UI is TODO.

### `/about` (About Page)

**File**: `src/pages/about.tsx`

```
About
├── div (container)
│   ├── Navigation
│   ├── div (main content)
│   │   ├── h1 (Title)
│   │   └── p (Coming soon message)
│   └── MobileBottomNavigation
```

**Note**: Public page - no authentication required. About us content is TODO.

### `/terms-of-service` (Terms Page)

**File**: `src/pages/terms-of-service.tsx`

```
TermsOfService
├── div (container)
│   ├── Navigation
│   ├── div (main content)
│   │   ├── Header
│   │   │   ├── img (Logo)
│   │   │   └── h1 (Title with FileText icon)
│   └── MobileBottomNavigation
```

### `/privacy-policy` (Privacy Page)

**File**: `src/pages/privacy-policy.tsx`

```
PrivacyPolicy
├── div (container)
│   ├── Navigation
│   ├── div (main content)
│   │   ├── Header
│   │   │   ├── img (Logo)
│   │   │   └── h1 (Title with Shield icon)
│   └── MobileBottomNavigation
```

**Note**: Both legal pages now include full navigation for consistency. Auth pages (`/signup`, `/login`) and error pages (`/404`) intentionally do not include navigation to keep them simple and focused.

### `/404` or `*` (Not Found Page)

**File**: `src/pages/NotFound.tsx`

```
NotFound
├── div (full screen container)
│   └── div (content card)
│       ├── h1 (404)
│       ├── h2 (Page Not Found)
│       ├── p (Description)
│       ├── p (Contact info with link)
│       └── Button (Return Home with Home icon)
```

## Component Categories

**Component Counts** (Verified December 2024):

- **Atoms**: 5 components
- **Molecules**: 13 components (organized in 5 feature folders: Auth, Profile, Events, Invite, Form)
- **Organisms**: 9 components (organized in 3 feature folders: Navigation, Landing, Events)
- **Templates**: 2 components
- **Pages**: 14 pages (Index, auth, login, profile, events, events-create, messenger, settings, invite, contact-us, about, NotFound, terms-of-service, privacy-policy)
- **Hooks**: 2 hooks (useAuth, useRequireAuth)
- **Error Boundaries**: 1 component (AuthErrorBoundary)

### Atoms (Basic Building Blocks)

Located in: `src/components/atoms/`

1. **Button** (`button.tsx`)
   - Variants: primary, secondary, outline, ghost, danger
   - Sizes: xs, sm, md, lg, xl
   - Features: loading state, icons, full-width

2. **LoadingSpinner** (`LoadingSpinner.tsx`)
   - Sizes: xs, sm, md, lg, xl, xxl, xxxl, hero
   - Uses lucide-react LoaderCircle icon

3. **Logo** (`Logo.tsx`)
   - Sizes: xs to hero
   - Can show/hide text

4. **SkipLink** (`skip-link.tsx`)
   - Accessibility component for keyboard navigation

5. **Tabs** (`tabs.tsx`)
   - TabButton component
   - Tabs component with keyboard navigation
   - Orientation: horizontal or vertical

6. **Modal** (`Modal.tsx`)
   - Reusable modal overlay component
   - Sizes: sm, md, lg
   - Features: optional icon, custom actions, backdrop blur
   - Uses portals for rendering outside DOM hierarchy
   - Full ARIA attributes for accessibility
   - Close on overlay click (configurable)

### Molecules (Component Groups)

Located in: `src/components/molecules/`

#### Auth Molecules (`src/components/molecules/Auth/`)

1. **EmailLoginForm** (`email-login-form.tsx`)
   - Uses useAuth hook for login functionality
   - Form validation and error handling
   - Single error display via AuthErrorDisplay component
   - Toast notifications for validation errors only

2. **EmailSignupForm** (`email-signup-form.tsx`)
   - Uses useAuth hook for signup functionality
   - Collects firstName, lastName, birthDate, gender
   - Single error display via AuthErrorDisplay component
   - TODO: Save profile data to Firestore

3. **AuthErrorDisplay** (`AuthErrorDisplay.tsx`)
   - Displays authentication errors with contextual icons
   - Error types: network, auth, config, unknown
   - Conditional retry button for retryable errors
   - Conditional descriptions to avoid redundancy

4. **AuthRetryButton** (`AuthRetryButton.tsx`)
   - Specialized retry button for authentication operations
   - Shows loading state and retry count
   - Integrated with AuthErrorDisplay component

5. **NetworkStatus** (`NetworkStatus.tsx`)
   - Displays offline status indicator only (no online indicator)
   - Shows warning message when network is disconnected
   - Non-blocking UI with pointer-events-none
   - Returns null when online to reduce visual noise

6. **AccountControls** (`account-controls.tsx`)
   - Uses useAuth hook for logout, resetPassword, and account deletion
   - Sign out functionality with redirect to login
   - Password reset modal with email input and validation
   - Account deletion with safety confirmation (must type "delete")
   - All buttons use Button atom component for consistency
   - Uses Modal atom component for overlays

#### Profile Molecules (`src/components/molecules/Profile/`)

1. **ProfilePictureUpload** (`profile-picture-upload.tsx`)
   - TODO: Implement Firebase Storage upload

2. **ProfileDetailsForm** (`profile-details-form.tsx`)
   - TODO: Save profile details to Firestore

3. **ProfilePreferencesForm** (`profile-preferences-form.tsx`)
   - TODO: Save preferences to Firestore

#### Events Molecules (`src/components/molecules/Events/`)

1. **EventPreviewCard** (`EventPreviewCard.tsx`)
   - Displays event data preview
   - Edit/Confirm action handlers

#### Invite Molecules (`src/components/molecules/Invite/`)

1. **InviteFriendSection** (`invite-friend-section.tsx`)
2. **InviteShareRow** (`invite-share-row.tsx`)

#### Form Molecules (`src/components/molecules/Form/`)

1. **FormFields** (`form-fields.tsx`)

### Organisms (Complex Components)

Located in: `src/components/organisms/`

#### Navigation Organisms (`src/components/organisms/Navigation/`)

1. **Navigation** (`Navigation.tsx`)
   - Logo
   - Desktop navigation menu
   - Action buttons (Login/Signup or Logout)
   - Uses LoadingSpinner for loading states
   - Integrates Sidebar component for logged-in users
   - Burger menu button opens Sidebar on click

2. **Sidebar** (`Sidebar.tsx`)
   - Sliding sidebar menu from right
   - Menu items: Settings, Invite a Friend, Contact Us, About Us, Privacy Policy, Terms and Conditions, Logout
   - Keyboard accessibility (ESC to close, Tab navigation)
   - Focus trapping when open
   - Backdrop click to close
   - Loading state during logout
   - Uses LoadingSpinner for logout operation
   - Z-index: z-20 (modal overlay - just above content)
   - Animation: Position-based slide animation (right-[-100%] to right-0)

3. **MobileBottomNavigation** (`MobileBottomNavigation.tsx`)
   - Icon buttons for mobile navigation

#### Landing Page Organisms (`src/components/organisms/Landing/`)

1. **HeroSection** (`HeroSection.tsx`)
   - Large title and description
   - CTA buttons
   - Hero image
   - Scroll indicator

2. **HowItWorksSection** (`HowItWorksSection.tsx`)
3. **BenefitsSection** (`BenefitsSection.tsx`)
4. **EarlyAccessSection** (`EarlyAccessSection.tsx`)
5. **Footer** (`Footer.tsx`)

#### Events Organisms (`src/components/organisms/Events/`)

1. **EventCreationForm** (`EventCreationForm.tsx`)

### Templates (Page Layouts)

Located in: `src/components/templates/`

1. **AuthLayout** (`auth-layout.tsx`)
   - Two-column layout
   - Left: Auth content
   - Right: Image

2. **LandingPageLayout** (`LandingPageLayout.tsx`)
   - Container for landing page
   - Includes Navigation, Footer, MobileBottomNavigation
   - Wraps page content

### Error Boundaries

Located in: `src/components/`

1. **AuthErrorBoundary** (`AuthErrorBoundary.tsx`)
   - Catches authentication-related errors
   - Provides retry mechanism with exponential backoff
   - Custom fallback UI with navigation options
   - Integrated with useAuth hook for error recovery

## Component Dependencies

### Authentication System

- **useAuth**: Used by EmailLoginForm, EmailSignupForm, AccountControls
- **useRequireAuth**: Used by Profile page for authentication guard
- **AuthErrorBoundary**: Catches authentication errors globally
- **AuthErrorDisplay**: Displays authentication errors in forms
- **NetworkStatus**: Shows offline status indicator only
- **Firebase Auth**: Integrated through useAuth hook

### Navigation System

- Used by: Almost all pages
- Contains: Logo, multiple Button instances, LoadingSpinner
- Auth state awareness: Shows Login/Signup or Logout based on user state

### Form Patterns

- EmailLoginForm and EmailSignupForm share similar input patterns
- Profile forms use inline inputs (opportunity for atomic Input component)
- All forms use LoadingSpinner for loading states
- Toast notifications for user feedback

### Button Usage

- Navigation: Uses inline button implementations
- HeroSection: Uses custom CTA buttons
- Forms: Uses inline button implementations
- Many places could benefit from using the Button atom

### Loading States

- LoadingSpinner is used consistently across loading states
- Navigation uses it for logout loading
- Forms use it for form submission loading
- Profile page uses it for authentication loading

## Current Implementation Status (December 2024)

### Completed Features

- ✅ Authentication system (login, signup, logout) with useAuth hook
- ✅ Authentication guard (useRequireAuth) for protected routes
- ✅ Authentication error handling with single display strategy
- ✅ Error boundaries for authentication failures with retry mechanisms
- ✅ Network status monitoring and user feedback
- ✅ Profile page with auth protection and loading states
- ✅ Settings page with account controls
- ✅ Sidebar navigation with logout functionality
- ✅ New pages: settings, invite, contact-us, about
- ✅ Consistent navigation across all non-auth, non-error pages
- ✅ Legal pages (terms-of-service, privacy-policy) with full navigation
- ✅ Error handling and user feedback with toast notifications
- ✅ E2E test coverage with Firebase Auth Emulator
- ✅ Comprehensive E2E tests for sidebar navigation flow
- ✅ Component tree organized following atomic design principles
- ✅ Test organization with **tests**/ pattern throughout

### TODO Features

See `TODO.md` for comprehensive list of pending work, including:

- Profile data persistence to Firestore
- Password reset flow
- Account deletion
- Profile picture upload
- Profile details and preferences save

## Identified Opportunities for Atomic Design

1. **Input Atom**: Many inline input fields could use a standardized Input atom
2. **Label Atom**: Repeated label patterns across forms
3. **Icon Wrapper**: Consistent icon handling (currently using lucide-react directly)
4. **Link Atom**: Styled link patterns for Language navigation
5. **FormField Molecule**: Combine Label + Input + error state
6. **NavigationLink Molecule**: Icon + text navigation button pattern
7. **CTAButton Molecule**: Specialized hero CTA button with consistent styling

## Testing Infrastructure

### Unit Tests

- **Coverage**: Components, hooks, utilities
- **Framework**: Vitest + React Testing Library
- **Location**: `src/components/__tests__/`, `src/hooks/__tests__/`
- **Test Files**:
  - `useAuth.test.ts` - Authentication hook testing
  - `AuthErrorBoundary.test.tsx` - Error boundary testing
  - `AuthErrorDisplay.test.tsx` - Error display component testing
  - `NetworkStatus.test.tsx` - Network status component testing

### E2E Tests

- **Coverage**: Complete user flows, authentication, navigation
- **Framework**: Playwright
- **Location**: `tests/e2e/`
- **Cross-Browser Support**:
  - **Desktop**: Chromium (Chrome), Firefox, WebKit (Safari)
  - **Mobile**: Android Pixel 5/7, iPhone 12/13
  - **Tablet**: Galaxy Tab S4, iPad Pro
- **Total Environments**: 9 testing configurations
- **Test Count**: 486 tests across all environments
- **Test Files**:
  - `auth.spec.ts` - Authentication flow testing
  - `auth-error-handling.spec.ts` - Error handling scenarios
  - `account-management.spec.ts` - Account management features
  - `sidebar.spec.ts` - Navigation and sidebar functionality
  - `page-snapshots.spec.ts` - Visual regression testing
  - `landing-page.spec.ts` - Landing page functionality
  - `login-page.spec.ts` - Login page testing

### Testing Commands

```bash
# Run all browsers and devices
npx playwright test

# Run specific browser
npx playwright test --project=firefox

# Run specific mobile device
npx playwright test --project=android-pixel5

# Run iOS simulation
npx playwright test --project=ios-iphone13

# Run tablet testing
npx playwright test --project=android-tablet
```

## Notes

- All components use Tailwind CSS for styling
- Color palette: pairup-darkBlue, pairup-cyan, pairup-yellow, pairup-cream
- Icons: lucide-react
- Form validation: Basic validation with error handling and toast notifications
- Firebase integration: Auth fully implemented, Firestore integration planned
- Authentication: Complete with useAuth hook and useRequireAuth guard
- Testing: Comprehensive E2E tests with Playwright across 9 environments, unit tests for components
- Responsive design: Mobile-first approach with md: breakpoints
- Architecture: Direct imports (no barrel exports), atomic design principles
