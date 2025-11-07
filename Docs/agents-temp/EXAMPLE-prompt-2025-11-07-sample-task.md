# EXAMPLE: Remove Last Name Field from User Profile

> **Note**: This is an example output from `@prompt-generator` to demonstrate the format.

## Overview

Remove the lastName field from user profiles throughout the application, simplifying user registration and enhancing privacy. This includes UI updates, type modifications, and migration strategy for existing data.

## User Story

**As a** new user
**I want to** register with only my first name
**So that** the signup process is simpler and I maintain more privacy

## Acceptance Criteria

- [ ] SignUp form (`email-signup-form.tsx`) no longer includes lastName input
- [ ] Profile edit form (`profile.tsx`) no longer includes lastName field
- [ ] `UserProfile` type updated to make lastName optional with deprecation notice
- [ ] `displayName` generation uses firstName only
- [ ] All user display components show firstName only
- [ ] Unit tests updated for new user model
- [ ] E2E tests pass with updated flow
- [ ] Migration strategy documented for existing users with lastName data
- [ ] `npm run ci` passes

## Technical Context

### Affected Areas

**Files to Modify**:

- `src/types/user.ts` - Make lastName optional, add deprecation comment
- `src/entities/user/user-service.ts` - Update user creation logic
- `src/components/molecules/Auth/email-signup-form.tsx` - Remove lastName field
- `src/pages/profile.tsx` - Remove lastName from edit form
- `src/components/organisms/Navigation/Navigation.tsx` - Verify displayName usage
- `Docs/data-model.md` - Update user schema documentation

**New Files to Create**: None

**Key Types**:

```typescript
// Current (src/types/user.ts)
export interface UserProfile {
  userId: string
  email: string
  firstName: string
  lastName: string // ← Remove required constraint
  displayName: string
  // ...
}
```

### Architecture Patterns

**Component Structure**:

- Forms are molecules: `src/components/molecules/Auth/`
- Profile page is in: `src/pages/`
- Follow atomic design hierarchy

**State Management**:

- User context: `src/contexts/UserContext.tsx`
- Auth hook: `src/hooks/useAuth.ts`
- No changes needed - operates on UserProfile type

**Data Flow**:

- User creation: `src/entities/user/user-service.ts`
- Firestore schema must remain backward compatible
- Existing documents keep lastName if present (just not required)

**Styling**:

- Use Tailwind utilities exclusively
- Follow form field patterns in existing auth forms
- Maintain consistent spacing: `mb-4` between fields

### Code References

**Current SignUp Form Pattern** (`email-signup-form.tsx`):

```tsx
<div className="mb-4">
  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
    First Name
  </label>
  <input
    id="firstName"
    type="text"
    value={formData.firstName}
    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
    className="w-full px-3 py-2 border rounded-lg"
  />
</div>
// Remove similar block for lastName
```

**Current User Type** (`src/types/user.ts`):

```typescript
export interface UserProfile {
  userId: string
  email: string
  firstName: string
  lastName: string // Make optional: lastName?: string
  displayName: string
  photoURL?: string
  bio?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Data Model Impact

**Firestore Schema** (`users/{userId}` document):

- Current: All fields including lastName
- After: lastName becomes optional field
- **Migration**: Existing documents untouched (backward compatible)
- New users: lastName field omitted entirely

**Security Rules**: No changes needed (field-level rules not used)

## Implementation Steps

1. **Update Types** (`src/types/user.ts`)
   - Change `lastName: string` to `lastName?: string`
   - Add JSDoc comment: `@deprecated lastName is optional, prefer firstName + displayName`

2. **Update User Service** (`src/entities/user/user-service.ts`)
   - Update `createPublicUserData` to omit lastName if not provided
   - Update `createPrivateUserData` similarly
   - Ensure displayName generation handles missing lastName

3. **Remove from SignUp Form** (`src/components/molecules/Auth/email-signup-form.tsx`)
   - Remove lastName field from form state
   - Remove lastName input JSX
   - Remove lastName validation
   - Update form submission to not include lastName

4. **Remove from Profile Edit** (`src/pages/profile.tsx`)
   - Remove lastName field from edit form
   - Update save handler to omit lastName

5. **Verify User Display Components**
   - Check `Navigation.tsx` - should already use displayName
   - Check any other components showing user names
   - Ensure none directly concatenate firstName + lastName

6. **Update Documentation** (`Docs/data-model.md`)
   - Update UserProfile schema diagram
   - Add note about lastName being optional/deprecated

7. **Update Tests**
   - `src/components/molecules/Auth/__tests__/` - Update signup tests
   - `src/pages/__tests__/profile.test.tsx` - Update profile tests
   - Ensure test factories handle optional lastName

8. **Run Validation**
   ```bash
   npm run format
   npm run ci
   ```

## Testing Requirements

### Unit Tests

**SignUp Form** (`email-signup-form.test.tsx`):

```typescript
it('should submit form with only firstName', async () => {
  const mockSubmit = vi.fn()
  render(<EmailSignupForm onSubmit={mockSubmit} />)

  fireEvent.change(screen.getByLabelText(/first name/i), {
    target: { value: 'John' }
  })
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'john@example.com' }
  })

  fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

  expect(mockSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      firstName: 'John',
      email: 'john@example.com'
    })
  )
  expect(mockSubmit).not.toHaveBeenCalledWith(
    expect.objectContaining({ lastName: expect.anything() })
  )
})
```

**Profile Page** (`profile.test.tsx`):

- Test that lastName field is not rendered
- Test save functionality without lastName
- Test existing user with lastName displays correctly (no errors)

### E2E Tests

**Auth Flow** (`tests/e2e/e2e-flow.spec.ts`):

- Update signup flow to only fill firstName (not lastName)
- Verify signup completes successfully
- Verify profile shows user with firstName only

### Manual Testing

- [ ] Sign up new user with only first name
- [ ] Check Firestore document - confirm no lastName field
- [ ] Edit profile - confirm no lastName field
- [ ] Check Navigation display name - should show correctly
- [ ] Test with existing user who has lastName - should still work

## Migration Strategy

**For Existing Users**:

- No immediate action required
- lastName data preserved in Firestore
- Display logic already uses displayName (not firstName + lastName)
- Future: Could add data cleanup script to remove lastName from old profiles (optional)

**Backward Compatibility**:

- Code handles both `lastName?: string` and `lastName: string` documents
- No breaking changes to existing data
- Gradual migration as users update profiles

## Definition of Done

- [ ] All code changes implemented following atomic design patterns
- [ ] lastName field removed from signup and profile forms
- [ ] UserProfile type updated with optional lastName
- [ ] All affected files use direct imports (no barrel exports)
- [ ] Unit tests written and passing (minimum: render, behavior)
- [ ] E2E tests updated and passing
- [ ] Documentation updated (`data-model.md`)
- [ ] Code formatted: `npm run format`
- [ ] Linting passes: `npm run lint`
- [ ] All tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] `npm run ci` completes successfully
- [ ] Manual testing completed
- [ ] No console errors or warnings
- [ ] Self-reviewed for DRY compliance

## Complexity: Medium

**Reasoning**:

- Affects 6 files across multiple layers (types, services, components, pages)
- Requires type system changes with backward compatibility
- Multiple test files need updates
- Low risk as it's additive/optional change (not breaking existing data)

## Estimated Files: 6-8 files

---

**Generated by**: `@prompt-generator`
**Date**: 2025-11-07
**For**: PairUp Events Implementation
