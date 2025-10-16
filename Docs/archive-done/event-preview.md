# Event Preview Feature

## Overview

The Event Preview feature displays a formatted card with collected event data once the AI assistant has gathered all necessary information for event creation. This provides users with a clear visual summary before finalizing their event.

## Architecture

### Components

#### EventPreviewCard (Molecule)

**Location**: `src/components/molecules/EventPreviewCard.tsx`

A presentational component that displays event data in a formatted card with the following sections:

- **Header**: Event title/activity with icon
- **Description**: Optional event description
- **Activity**: Activity type
- **Date & Time**: Formatted date and time (or "Date/Time TBD")
- **Location**: Address and city (or "Location TBD")
- **Preferences**: Duo type, vibes, age range

**Props**:

```typescript
interface EventPreviewCardProps {
  eventData: EventPreviewData
  onEdit?: () => void // Optional edit handler
  onConfirm?: () => void // Optional confirm handler
}

interface EventPreviewData {
  title: string
  description?: string
  activity: string
  date?: string // YYYY-MM-DD format
  time?: string // HH:MM format (24-hour)
  location?: {
    address?: string
    city?: string
  }
  preferences?: {
    duoType?: string
    desiredVibes?: string[]
    ageRange?: { min?: number; max?: number }
  }
}
```

**Features**:

- Conditional rendering for optional fields
- "TBD" fallbacks for missing data
- Emoji icons for visual appeal
- Action buttons (Edit/Confirm) when handlers provided
- Responsive design with max-width constraint

### Hook Integration

#### useChat Hook Updates

**Location**: `src/hooks/useChat.ts`

The hook has been enhanced with:

1. **Event Data Extraction**

   ```typescript
   const extractEventData = (text: string): EventPreviewData | null
   ```

   - Parses AI responses for structured event data
   - Looks for `EVENT_DATA_START` and `EVENT_DATA_END` markers
   - Extracts JSON between markers
   - Returns null if no valid data found

2. **Response Text Cleaning**

   ```typescript
   const cleanResponseText = (text: string): string
   ```

   - Removes JSON data blocks from display text
   - Keeps surrounding friendly messages
   - Prevents raw JSON from showing in chat

3. **Event Preview State**

   ```typescript
   const [eventPreview, setEventPreview] = useState<EventPreviewData | null>(null)
   ```

   - Stores the extracted event data
   - Displayed in ChatInterface
   - Persists until edited or cleared

4. **Event Management Handlers**

   ```typescript
   const handleEditEvent = () => void
   const handleConfirmEvent = () => void
   ```

   - **handleEditEvent**: Clears preview, prompts AI to help edit
   - **handleConfirmEvent**: Will create actual event (TODO: implementation)

5. **Updated Return Type**
   ```typescript
   export interface UseChatReturn {
     // ... existing fields
     eventPreview: EventPreviewData | null
     handleEditEvent: () => void
     handleConfirmEvent: () => void
   }
   ```

### AI Prompt Strategy

#### System Prompt Updates

**Location**: `src/constants/aiPrompts.ts`

The AI is instructed to output structured event data when all information is collected:

```
## Completing Event Creation
Once you have gathered all essential information (activity, date/time, location),
you MUST output the event data in this EXACT JSON format:

EVENT_DATA_START
{
  "title": "Brief event title",
  "activity": "Activity type",
  "description": "Optional description",
  "date": "YYYY-MM-DD format",
  "time": "HH:MM format (24-hour)",
  "location": {
    "address": "Street address",
    "city": "City name"
  },
  "preferences": {
    "duoType": "friends|couples|family|roommates|colleagues",
    "desiredVibes": ["adventurous", "chill", etc.],
    "ageRange": { "min": 18, "max": 99 }
  }
}
EVENT_DATA_END
```

**AI Response Pattern**:

```
Great! Here's your event preview:

EVENT_DATA_START
{ ... JSON data ... }
EVENT_DATA_END

Does this look good? I can help you adjust anything!
```

**Benefits**:

- Clear markers for reliable parsing
- Structured format ensures consistency
- Friendly messages maintain conversational tone
- JSON hidden from user, only formatted card shown

## User Flow

### Happy Path

1. **User starts conversation**
   - AI greets and asks about activity

2. **Data collection**
   - AI asks about: activity, date, time, location, preferences
   - User provides information conversationally

3. **Event preview generation**
   - AI determines all essential data collected
   - Outputs structured JSON with markers
   - System extracts and displays EventPreviewCard

4. **Preview display**
   - User sees formatted card with all details
   - Two action buttons: "Edit Details" and "Create Event"

5. **User options**:
   - **Edit**: Clears preview, AI asks what to change
   - **Confirm**: Creates actual event (TODO: implementation)

### Edge Cases

#### Missing Data

- Card displays "TBD" for missing fields
- Still allows creation with partial data
- User can edit to add missing information

#### Invalid JSON

- `extractEventData` catches parse errors
- Logs error to console
- Returns null (no preview shown)
- Chat continues normally

#### AI Doesn't Follow Format

- No markers = no extraction
- Chat continues until AI outputs correct format
- System is resilient to AI variations

## Integration

### ChatInterface Updates

**Location**: `src/components/organisms/ChatInterface.tsx`

```typescript
export interface ChatInterfaceProps {
  // ... existing props
  eventPreview?: EventPreviewData | null
  onEditEvent?: () => void
  onConfirmEvent?: () => void
}
```

**Rendering**:

- Event preview card displayed between messages and typing indicator
- Centered for visual prominence
- Auto-scrolls into view when shown

### Page Integration

**Location**: `src/pages/events-create.tsx`

```typescript
const {
  messages,
  inputValue,
  isAiResponding,
  eventPreview,        // New
  handleEditEvent,     // New
  handleConfirmEvent   // New
} = useChat();

<ChatInterface
  messages={messages}
  eventPreview={eventPreview}
  onEditEvent={handleEditEvent}
  onConfirmEvent={handleConfirmEvent}
  // ... other props
/>
```

## Testing

### EventPreviewCard Tests

**Location**: `src/components/molecules/__tests__/EventPreviewCard.test.tsx`

**Coverage**:

- ✅ Renders all event data correctly
- ✅ Handles missing optional fields
- ✅ Formats date/time and location
- ✅ Displays preferences (duo type, vibes, age range)
- ✅ Shows "TBD" fallbacks appropriately
- ✅ Calls handlers when buttons clicked
- ✅ Hides buttons when handlers not provided
- ✅ Handles partial data gracefully

### Integration Testing (TODO)

- [ ] End-to-end flow: conversation → preview → create
- [ ] Event data extraction from various AI responses
- [ ] Edit flow: preview → edit → updated preview
- [ ] Error handling when JSON parsing fails

## Future Enhancements

### Immediate (TODO)

1. **Event Creation**
   - Implement `handleConfirmEvent` to create Firestore event
   - Map `EventPreviewData` to `Event` document structure
   - Handle validation and error cases
   - Clear conversation after successful creation
   - Redirect to new event page

2. **Data Validation**
   - Validate date is in future
   - Validate time format
   - Validate location completeness
   - Show warnings for incomplete data

3. **Rich Editing**
   - Allow inline editing of specific fields
   - Update preview in real-time
   - Keep conversation context

### Long-term

1. **Image Upload**
   - Add cover image to event
   - Upload to Firebase Storage
   - Display in preview card

2. **Location Autocomplete**
   - Integrate Google Places API
   - Geocode address to lat/lng
   - Generate geohash for queries

3. **AI-Suggested Improvements**
   - AI suggests better titles
   - Recommends relevant vibes
   - Proposes alternative times/locations

4. **Preview Sharing**
   - Generate shareable preview link
   - Send to friend for feedback
   - Co-create events together

## Cost Optimization

### Firebase Considerations

- Event data stored in message (no extra writes)
- Preview state is local (React state)
- No additional Firestore queries
- Batched message saving continues to work

### Performance

- JSON parsing is synchronous but lightweight
- Regex/indexOf operations are fast
- Component renders only when preview changes
- No unnecessary re-renders

## Related Documentation

- [AI Prompt Strategy](./ai-prompt-strategy.md)
- [Conversation Storage](./conversation-storage.md)
- [Data Model](./data-model.md)
- [Chat Refactoring](../CHAT_REFACTORING.md)
