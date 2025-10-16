# Google Analytics Setup Guide

## Overview
Google Analytics has been re-enabled in the PairUp Events application using Google Tag Manager (GTM). This provides comprehensive tracking of user interactions, page views, and custom events.

## Implementation Details

### 1. Google Tag Manager Integration
- **GTM Container ID**: `GTM-PFHVCZSB` (configurable via environment variable)
- **Implementation**: Both head script and noscript fallback in `index.html`
- **Environment Variable**: `VITE_GTM_ID` (defaults to `GTM-PFHVCZSB` if not set)

### 2. Analytics Utility (`src/lib/analytics.ts`)
Provides a clean interface for tracking events:

```typescript
import { trackEvent, trackPageView, trackAuthEvent } from '@/lib/analytics';

// Track custom events
trackEvent('button_click', { button_name: 'signup' });

// Track page views
trackPageView('/profile', 'User Profile');

// Track authentication events
trackAuthEvent('login', 'email');
```

### 3. Available Tracking Functions

#### General Events
- `trackEvent(eventName, parameters)` - Track any custom event
- `trackPageView(pagePath, pageTitle)` - Track page views

#### Specific Event Types
- `trackAuthEvent(action, method)` - Authentication events (login, signup, logout)
- `trackProfileEvent(action, field)` - Profile-related events
- `trackFormEvent(formName, action)` - Form interactions
- `trackPWAEvent(action)` - PWA events (install, prompt, dismiss)
- `trackNotificationEvent(action)` - Push notification events

### 4. Environment Configuration

Add to your `.env` file:
```env
# Google Tag Manager ID (optional - defaults to GTM-PFHVCZSB)
VITE_GTM_ID=GTM-PFHVCZSB
```

### 5. GTM Configuration

In your Google Tag Manager container, you can set up:

#### Tags
- **Google Analytics 4** - For page views and standard events
- **Custom HTML** - For custom event tracking
- **Conversion Tracking** - For signup/login conversions

#### Triggers
- **Page View** - All pages
- **Custom Events** - Based on dataLayer events
- **Form Submissions** - Profile forms, auth forms
- **User Engagement** - Scroll depth, time on page

#### Variables
- **Page Path** - Current page URL
- **User ID** - Firebase Auth UID (when available)
- **Event Parameters** - Custom event data

### 6. Privacy Considerations

- **GDPR Compliance**: Ensure proper consent management
- **Data Retention**: Configure appropriate retention periods in GA4
- **IP Anonymization**: Enable IP anonymization in GTM/GA4
- **User Consent**: Implement consent banner if required

### 7. Testing

#### Development Testing
1. Use GTM Preview mode to test events
2. Check browser console for dataLayer pushes
3. Verify events in GA4 Real-time reports

#### Production Monitoring
1. Set up GA4 goals and conversions
2. Monitor bounce rate and user engagement
3. Track conversion funnels (signup → profile completion)

### 8. Common Events to Track

#### User Journey
- Page views (automatic via GTM)
- Authentication events (login, signup, logout)
- Profile completion events
- Form submissions and errors

#### Engagement
- PWA install prompts and installations
- Push notification interactions
- Feature usage (invite friends, etc.)

#### Performance
- Page load times
- Error rates
- User session duration

### 9. Troubleshooting

#### Events Not Appearing
1. Check GTM container is published
2. Verify GTM ID is correct
3. Check browser console for errors
4. Ensure dataLayer is being populated

#### Development vs Production
- GTM works in both environments
- Use GTM Preview mode for testing
- Set up separate GA4 properties for dev/prod if needed

### 10. Next Steps

1. **Set up GA4 Goals** - Define conversion goals
2. **Create Custom Dashboards** - Monitor key metrics
3. **Set up Alerts** - Get notified of issues
4. **Implement Enhanced Ecommerce** - If applicable
5. **Add User ID Tracking** - Link authenticated users

## Security Notes

- GTM script is loaded from Google's CDN
- No sensitive user data is sent to analytics
- User IDs are hashed/anonymized as needed
- Follow privacy regulations in your jurisdiction
