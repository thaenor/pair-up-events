# Firebase Configuration

This folder contains all Firebase-related configuration files for the Pair Up Events application.

## Files

### Security Rules

- **`firestore.rules`** - Firestore database security rules
  - Controls access to user profiles, events, drafts, and conversations
  - Ensures users can only access their own data
  - Allows authenticated users to read published events

- **`storage.rules`** - Firebase Storage security rules
  - Controls access to uploaded files (profile pictures)
  - Each user can upload one profile picture
  - Profile pictures are visible to all authenticated users
  - Maximum file size: 5MB, images only

### Indexes

- **`firestore.indexes.json`** - Firestore database indexes
  - Optimizes query performance for common queries
  - Includes indexes for events by status, date, and creator

## Deployment

### Deploy All Firebase Rules

```bash
firebase deploy
```

### Deploy Specific Services

```bash
# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Storage rules
firebase deploy --only storage

# Deploy only hosting
firebase deploy --only hosting
```

## Testing Rules Locally

You can test the rules locally using the Firebase Emulator Suite:

```bash
# Start emulators
firebase emulators:start

# Run with specific emulators
firebase emulators:start --only firestore,storage
```

## Rule Validation

Before deploying, you can validate your rules:

```bash
# Check Firestore rules syntax
firebase firestore:rules:validate

# Check Storage rules syntax
firebase storage:rules:validate
```

## Security Best Practices

1. **Never allow unauthenticated access** to user data
2. **Always validate data types and required fields** in rules
3. **Use helper functions** to keep rules DRY and maintainable
4. **Test rules thoroughly** before deploying to production
5. **Monitor security rule usage** in Firebase Console

## Related Documentation

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules Documentation](https://firebase.google.com/docs/storage/security)
- [Full setup guide](../Docs/firebase-storage-setup.md)
