# 🎨 Pair Up Events — Design Document

This document defines the **design vision**, **user experience principles**, and **UI/UX structure** of the Pair Up Events application.
It serves as the foundation for consistent interface design, component hierarchy, and interaction patterns across the platform.

---

## 📘 **Table of Contents**

1. [Product Overview](#-product-overview)
2. [Design Principles](#-design-principles)
3. [User Personas](#-user-personas)
4. [User Journey & Flows](#-user-journey--flows)
5. [Information Architecture](#-information-architecture)
6. [Component Design System](#-component-design-system)
7. [Visual Design](#-visual-design)
8. [Accessibility & UX](#-accessibility--ux)
9. [Responsive Design](#-responsive-design)
10. [Animations & Micro-interactions](#-animations--micro-interactions)
11. [Design Tokens & Theming](#-design-tokens--theming)
12. [Branding Guidelines](#-branding-guidelines)
13. [Future Improvements](#-future-improvements)

---

# **1. Product Overview**
Pair Up Events is a social event platform that allows two pairs of people to connect and meet through shared activities.
Each "pair" represents two users who join the platform together (friends, couple, family duo, etc.).
The core system enables users to create, share, and join events, encouraging real-world interaction through fun, curiosity-driven activities.

**Goal:**
The goal of Pair Up Events is to facilitate real-world social connections by matching pairs of users who want to attend or host events together.

Functional objectives:

Enable users to create, browse, and join events with minimal friction.

Connect two pairs based on shared interests, location, and availability.

Encourage activity-based, non-romantic interactions.

Support event discovery, lightweight in-app messaging, and invitations in one unified experience.

Provide a mobile-first, responsive platform emphasizing usability and clarity.

Outcome goal:
Increase the number of meaningful real-world interactions by matching pairs for curated or user-created activities.

**Key Differentiator:**
2-Meets-2 Model

Core matching logic connects two pairs (2x2) instead of individuals or large groups.

This structure creates more comfortable and balanced social encounters.

Reduces awkwardness and encourages natural group conversation.

User-Driven Event Creation

Users can choose from platform-recommended events (based on interest tags) or create their own custom events.

Event creators define activity type, location, date/time, and capacity (2 pairs).

Excitement and Exploration Focus

The system promotes events that encourage learning, discovery, movement, or play.

No dating or networking focus — only curiosity-driven social engagement.

Inclusive Pair Types

Supported pair types:

Friends

Couples

Family pairs (parent-child, siblings, twins, etc.)

Roommates or colleagues

Matching logic remains pair-based, not individual-based.

**Target Users:**
| User Segment                    | Description                                          | Motivation                          |
| ------------------------------- | ---------------------------------------------------- | ----------------------------------- |
| **Young Professionals (20–35)** | People seeking new experiences outside their routine | Fun, novelty, social discovery      |
| **Friends or Couples**          | Duos looking to meet others with similar energy      | Shared adventures, mutual interests |
| **Expats & Newcomers**          | People integrating into a new city or culture        | Authentic, local experiences        |
| **Families & Themed Pairs**     | Parent-child, siblings, twins, etc.                  | Playful learning and shared bonding |
| **Activity Enthusiasts**        | Users who enjoy active, experiential socializing     | Real-world engagement               |

## 🤝 Pair Up Events — Primary Use Cases

Pair Up Events is a web platform that connects two pairs (duos) of people to attend events or experiences together.  
The core user experience is centered around **exploring**, **creating**, **joining**, and **chatting** around shared experiences.  
There are no individual participants — every confirmed event involves **two duos (four people total)**.

---

## 👥 User Roles

| Label | Description |
|--------|--------------|
| **User A** | Creator of a new event or experience. Starts the process by choosing an activity idea, location, and date. |
| **User B** | The first invited user who joins User A’s event to form a confirmed duo. |
| **User C** | A user who discovers a live event (created by A + B) through the Explore page and decides to join it with their own duo. |
| **User D** | The partner of User C — confirms participation, finalizing the group of four. |

Each confirmed event = **1 Duo (A+B)** + **1 Duo (C+D)**.

---

## 🧩 Primary Use Cases

### **Use Case 1 — Explore Experiences**
- Users (logged-in or logged-out) browse activity cards in their city.
- Two types of cards exist:
  1. **Default PairUp Templates** → inspire users to create a new event.
  2. **User-Created Events** → represent real events by existing duos.
- Logged-out users see blurred date and location details and are prompted to sign up.

**Goal:** Inspire new sign-ups and encourage event creation.

---

### **Use Case 2 — Create an Event (User A Flow)**
1. User A chooses a default template or starts from scratch.
2. Completes event form (activity, date, city, vibe, etc.).
3. Invites a partner (User B) via a unique link.
4. Event appears in **Pending** state until User B accepts.
5. Once User B confirms → Event becomes **Live** and visible in Explore.

**Goal:** Enable User A to easily create an activity and form a duo.

---

### **Use Case 3 — Join an Event as Duo (User C + D Flow)**
1. User C discovers a live event (A+B) in Explore.
2. Sends a “Join Request” for their duo.
3. Invites their own partner (User D) via link.
4. First User D to accept → pair is locked (C+D confirmed).
5. A+B receive a notification to accept or decline.
6. Once approved → event becomes confirmed and visible to all 4 participants.

**Goal:** Allow new duos to join live experiences and form complete event groups.

---

### **Use Case 4 — Event Confirmation and Group Chat**
- When both duos (A+B and C+D) are confirmed, a **group chat** is automatically created.
- All four participants can communicate to plan details.
- Chat includes a built-in **report** feature for users or events.

**Goal:** Facilitate safe, easy coordination and connection between participants.

---

### **Use Case 5 — Event Completion and Feedback**
- After the event date passes:
  - System prompts all participants to rate the other duo and leave feedback.
  - Message displayed in chat:

    > “Hope you had a great experience! 🌟  
    > You can rate the other duo and leave a short comment.  
    > Want to keep this chat open or archive it? Archived chats will be muted.”

- Users can **keep** or **archive** chats:
  - Archived chats move under “Past Events” (collapsible section).
  - Notifications muted but chat remains accessible.
  - Chats can be reopened at any time.

**Goal:** Close the loop after the event, collect feedback, and maintain a positive post-event experience.

---

### **Use Case 6 — Automatic Chat Lifecycle**
- Chats inactive for **30 days** automatically move to “Archived.”
- This keeps the chat list clean while preserving history.
- Users can reopen archived chats at any time.

**Goal:** Maintain a tidy interface and support natural social rhythm.

---

### **Use Case 7 — Reporting and Moderation**
- Users can report:
  - An event  
  - Another user  
- Accessible from:
  - Direct chat
  - Event detail page
  - User profile
- Reports include category selection (harassment, spam, etc.) and optional comments.
- Reports are sent to the moderation system for internal review.

**Goal:** Provide safety, trust, and accountability across all interactions.

---

### **Use Case 8 — Notifications**
Triggered across web and email:
- Event invites (B and D)
- Join requests (A+B)
- Confirmations, acceptances, declines
- Event reminders (24h before)
- Chat messages
- Feedback prompts (after event)
- System updates (cancellations, reports)

**Goal:** Keep users informed about event progress and communication updates.

---

### **Use Case 9 — Profile and Settings**
- Users manage profile info, language, and privacy preferences.
- Access support, guides, and feedback.
- Log out and data privacy options included.

**Goal:** Provide users control, personalization, and transparency.

---

## ⚙️ Platform Characteristics

- **Platform Type:** Web (desktop + mobile browser responsive)
- **Access Levels:**  
  - Logged-out users → limited visibility (blurred details)  
  - Logged-in users → full access  
- **Moderation:**  
  - Self-service creation (no manual approval, similar to Meetup)  
  - Admin dashboard for user/event reports  
- **Data Fencing:**  
  - Location & date blurred for logged-out users (city visible)  
  - Clear “Visible to logged-in users” indicator improves UX transparency  

---

**Summary:**
Pair Up Events enables users to:
1. Discover experiences in their city.  
2. Create or join an event as a duo.  
3. Meet another duo to share that experience.  
4. Chat, rate, and optionally stay connected afterward — all within a safe, intuitive flow.

---


**Supported Platforms:**
- Web (PWA-first, responsive)
- Mobile Web (installable via “Add to Home Screen”)
- Desktop (for event management)

---

# **2. Design Principles**

1. **Clarity** — Every screen should communicate its purpose at a glance.
2. **Speed** — Optimize for performance and perceived speed.
3. **Trust** — Transparent feedback, privacy emphasis, and safety by design.
4. **Delight** — Micro-interactions, animated feedback, and a friendly tone.
5. **Accessibility** — Inclusive design meeting WCAG 2.2 AAA standards.
6. **Scalability** — Components and tokens should adapt as features expand.

---

# **3. User Personas**

| **Persona Name** | **Profile Summary** | **Example Pair** | **Goals** | **Pain Points** |
|------------------|--------------------|------------------|------------|-----------------|
| **1. The Curious Duo (Friends)** | Two friends in their mid-20s who love exploring new activities and meeting interesting people. They seek spontaneous, real-world experiences beyond typical nightlife or dating apps. | Lena (25, graphic designer) & Amira (26, student) | - Discover unique, local activities beyond bars or parties.<br>- Meet other friendly pairs to expand their social circle.<br>- Plan and coordinate fun weekends easily.<br>- Feel safe and comfortable meeting new people as a pair. | - Existing social apps focus on dating or large groups.<br>- Event platforms feel impersonal or cluttered.<br>- Hard to find events matching both friends’ interests.<br>- Time wasted on planning across multiple apps. |
| **2. The Adventurous Couple** | A couple in their late 20s–30s who want to add novelty to their shared time together. They’re not seeking romance elsewhere but want to connect with other couples for shared adventures or creative activities. | Marco (31, engineer) & Sophie (29, marketing manager) | - Discover other couples with similar energy.<br>- Find creative weekend ideas and new activities.<br>- Host or join double-date-style experiences naturally. | - Hard to meet other couples organically.<br>- Most couple apps focus on parenting or advice, not social fun.<br>- Organizing meetups feels like too much effort. |
| **3. The Newcomer Pair (Expats or New Locals)** | Two friends or flatmates who have moved to a new city and want to build a social circle. They’re eager to meet locals through authentic, low-pressure experiences. | Carlos (27, architect) & Diego (28, product designer) | - Meet locals naturally.<br>- Explore the city through shared activities.<br>- Build a genuine, lasting social circle. | - Cultural and language barriers make meeting people hard.<br>- Local event options feel impersonal or untrustworthy.<br>- Fear of attending large or mismatched events. |
| **4. The Parent & Child Duo** | A parent with a young child seeking social, family-oriented meetups where the **child is the main focus**. The parent’s goal is to connect with other parents while giving their child social experiences with peers. | Julia (34, mother) & Mia (8, daughter) | - Find playdates or family events where children can interact.<br>- Connect with other parents in similar life stages.<br>- Discover weekend or outdoor activities for kids.<br>- Create lasting friendships through shared family time. | - Most family platforms are child-focused but lack parent-to-parent socialization.<br>- Hard to find age-matching children for playdates.<br>- Scheduling or safety concerns with unfamiliar families.<br>- Limited family events outside playgrounds or schools. |
| **5. The Sibling / Twin Duo** | Two siblings or twins looking to meet **other sibling pairs** for unique “duo-to-duo” experiences. They’re curious about connecting with others who share similar family dynamics or sibling energy. | Anna (24) & Lara (24), identical twins | - Meet other twins or siblings for group activities.<br>- Explore “duo energy” through team or partner-based events.<br>- Create a sense of community around sibling experiences.<br>- Participate in playful or competitive pair events (e.g., escape rooms, sports, trivia). | - Very few opportunities to meet other sibling pairs.<br>- Mainstream events aren’t designed for “pair identity.”<br>- Hard to find experiences celebrating sibling connection.<br>- Lack of platforms promoting twin/sibling meetups. |


---

# **4. User Journey & Flows (Web Platform)**

### Core Journeys
 
## 🧭 Primary Navigation (for logged-in users)
1. **Explore** — Browse and search events  
2. **Events** — Manage created and joined events  
3. **Chat** — Interact with other duos  
4. **Profile** — Edit user info, access settings & feedback  

---

## 🧱 a) Landing Page (Logged-out Users)

### Main Goals
- Inspire users to explore events.
- Convert visitors to sign-ups.

### Visible Elements
- **Search bar:** Search by city.  
- **Activity cards:**
  - Image + title  
  - Date → “Visible to logged-in users” (blurred)  
  - Location → City visible, exact place blurred  
  - If user-created: “Created by [Firstname]”  
  - If default listing: “Create this experience” button  
  - If user-created: “View event” button  
  - **Share button:** Always functional  

### Interactions
| Action | Behavior |
|--------|-----------|
| Click any CTA | Redirects to sign-up page |
| Click Share | Copies event link |

---

## 🧩 b) Sign-Up Flow

### Methods
- Facebook  
- Apple  
- Google  
- Email + password  

After sign-up → redirected to **Profile page (first-time setup)**.

---

## 🧍‍♀️ c) Profile Page

### Fields
- Profile picture  
- First name  
- Age  
- Gender  
- “Fun fact about me”  
- “I like”  
- “I dislike”  
- “Hobbies”  

### Extended Navigation
Accessible via burger menu:
- Settings  
- Privacy Policy  
- Location  
- Language  
- Support Center  
- Feedback  
- Guide  
- Log out  

---

## 🔍 d) Explore Page (Logged-in Users)

### Search Functionality
- **City and activity type** .
- Shows:
  - Default PairUp templates  
  - Real (live) events created by user duos  

### Card Types

#### - Default PairUp Templates
- No duo yet (only concept)
- **CTA:** “Create this experience”  
- Opens pre-filled “Create Event” form  
- **Share:** Always functional  

#### - Real User-Created Events
- Duo confirmed (User A + B)
- **CTA:** “View event”  
- **Share:** Always functional  
- Date & location → blurred (“Visible to logged-in users”)

### Event Card Interactions
| User State | Interaction | Behavior |
|-------------|--------------|-----------|
| Logged out | Any interaction | Redirects to Sign Up |
| Logged in | Click CTA | Opens event details |
| Logged in | Click Share | Copies link |

---

## 🎟️ e) Events Page

### State A: Empty
> “No events yet. Create your first experience!”  
[**CTA → Create Event**]

---

### Create Event Flow

#### Page 1: Event Details
- Upload image  
- Activity (text input/dropdown)  
- Date (exact or flexible + comment)  
- Suggested location (city + place)  
- Country  
- Cost indicator (optional)  
- **Next → Who do you want to meet?**

#### Page 2: Who do you want to meet?
- Duo type (Friends, Couples, etc.)  
- Preferred age range  
- Preferred gender  
- Desired vibe(s):  
  - Adventurous  
  - Chill & Relaxed  
  - Funny & Playful  
  - Curious & Open-Minded  
  - Outgoing & Social  
  - Creative  
  - Foodies  
  - Active & Sporty  
  - Culture Lovers  
  - Family-Friendly  
  - Organizers  
  - Nightlife Lovers  
  - Mindful & Calm  

#### Duo Info
- Who is your duo? (names)  
- Relationship type  
- Comfortable languages  
- Duo vibe (multi-select)  
- Connection intention:
  - Just making new friends  
  - Sharing an experience  
  - Networking  
  - Open to romantic sparks  
  - Just curious  

#### Final Step
> “Copy link and invite your duo to join this event.”  
[**Copy Invite Link**]

User A → Event appears in **Events tab (Pending)**.

---

## 🔗 f) Invite Flow

- User A can share the link with multiple potential User Bs.  
- **First to accept** = official User B.  
- Later invitees see:
  > “This event already has a duo. Create this as a new experience and make it your own!”  
  [**CTA → Create this experience**]

---

## ✅ g) Event Confirmation Flow

### When User B accepts
- Event = **Live**  
- Notifications:
  - Browser  
  - In-app  
  - Email  

### When User B declines
- User A notified  
- Option to invite another duo (auto-filled form)

---

## 🌍 h) User C (Joining a Live Event)

- Sees listings in Explore (city-based)  
- Blurred date & location until logged in  
- CTA: “View event” → triggers sign-up if not logged in  

### Event Details (for User C)
- Full details visible  
- “Request to join” → invite their duo (User D)  
- First D to accept = confirmed pair  
- Request sent to A + B  

### User A + B Review
- Notification + alert  
- Can approve or decline  

If approved →  
> “🎉 The 4 of you are going to [activity-name]!”  
Chat auto-created.

---

## 💬 i) Chat System Flow

### Chat Creation
- Trigger: Event confirmed (A+B+C+D)  
- System message:
  > “Welcome [A], [B], [C], and [D]! Has anyone done this activity before? 😊”  

**Chat Features**
- Text + emojis (files optional later)
- Report user/event
- Mute notifications

---

### Chat Navigation

#### - Active Chats
- List of active event chats:
  - Activity name  
  - City  
  - Last message preview (bold if unread)  
  - Timestamp  

**Empty State:**
> “No active chats yet. Start exploring or create a new experience here!”  
[**CTA → Create Experience**]

#### - Archived Chats (collapsible)
- Label: “Past Events ▼”
- Collapsed by default  

Each archived chat shows:
- Activity name  
- **Date (dimmed)** → visually lighter text = past event indicator  
- Last message preview  
- **Button:** “Reopen chat”

**Reopen Chat →**
- Moves to *Active Chats*  
- Notifications reactivated  
- Full message history visible

---

### After Event Completion
- System message:
  > “Hope you had a great experience! 🌟  
  > You can rate the other duo and leave a short comment.  
  > Want to keep this chat open or archive it? Archived chats will be muted.”

**Buttons:**
- Keep Chat Open → stays active  
- Archive Chat → moves to “Past Events,” muted  

*Archiving is silent (no notification to others).*

---

### Automatic Archiving (Soft Expiration)
- Chats inactive for **30 days** → auto-archived  
- Keeps chat overview tidy  
- Archived chats always retrievable  
- No notifications sent

---

### Before Event
Chat tab visible but empty.  
> “No active chats yet. Start exploring or create a new experience here!”

---

## ⚠️ j) Reporting System

### Users can report:
- An **event**
- An **individual user**

**Flow:**
1. Click “Report”  
2. Choose reason (harassment, spam, etc.)  
3. Optional comment  
4. Sent to moderation dashboard  
5. Confirmation message:
   > “Thanks for letting us know — our team will review this shortly.”

---

## 🔔 k) Notifications

- Bell icon → new invites, confirmations, updates  
- Browser push notifications for changes  
- Email for confirmed matches + reminders  

---

## 🗂️ l) System States Overview

| State | Description | Visibility |
|--------|--------------|-------------|
| Logged out | Sees blurred events | Landing page |
| Logged in, no events | Explore + empty Events & Chat | All tabs visible |
| Event pending | A created event, B not yet joined | Events tab |
| Event live | A+B confirmed | Explore & Events |
| Event joined | A+B+C+D confirmed | Chat active |
| Event completed | Past event date | Archive prompt |
| Chat inactive 30+ days | Auto-archived | “Past Events” section |
| Reported | Hidden for reporter, flagged for moderation | Admin only |

---

---

# **5. Information Architecture**

**High-level structure:**

High-Level Structure

**- Explore**
  - Default Activity Cards
      - Card Preview (CTA: "Create this experience")
      - Share Link (always active)
  - User-Generated Events
    - Event Card (CTA: "View event")
    - Blurred Date + Location (logged-out users)
    - Share Link (always active)
  - Filters
    - City (initial scope)
  - States
    - Logged-out View (restricted visibility)
    - Logged-in View (full interaction)
**- Events**
  - My Events
    - Upcoming Events
    - Past Events
  - Create Event Flow
    - Select Template or Custom
    - Add Title, Description, Date, City
    - Invite User(s) via share link
    - Confirm Duo (User B accepts)
    - Publish (visible to Users C + D)
  - Event States
    - Draft
    - Awaiting Duo Confirmation
    - Active Event
    - Completed Event
    - Cancelled
  - Reporting
    - Report Event (for moderation)
**- Chat**
- Active Chats
   - Group Chat (A+B and C+D)
   - System Messages (reminders, event updates)
   - Post-Event Prompt
   - Options: Keep Chat Open / Archive Chat
- Empty State
   - Message: “No active chats yet. Start exploring or create a new experience here!”
   - CTA: Create an experience
- Archived Chats (collapsible)
  - Label: Past Events ▼
  - Chat Card
    - Activity Name
    - Date (dimmed = visually de-emphasized)
    - Last Message Preview (bold if unread)
    - Button: Reopen Chat
  - Reopen Chat → moves to Active Chats, notifications reactivated
- Soft Expiration
  - After 30 days inactivity → Moves to Archived
**- Profile**
- My Profile
  - Name, Picture, Bio, What I like, What I don't like, Hobbies
  - Settings & Support
    - Language
    - Location
    - Privacy Policy
    - Support Center
    - Feedback
    - How PairUp Works Guide
    - Log Out
  - Reporting
    - Report User (from profile or chat)
**- System-Level Elements**
  - Top Navigation Bar
    - Explore
    - Events
    - Chat
    - Profile
  - Floating Action Button (FAB)
    - Create Experience Shortcut
  - Notifications Panel
    - Invites
    - Confirmations
    - Reminders
    - Chat Notifications
  - Admin / Moderation Layer
    - Event Reports
    - User Reports

Navigation uses a responsive `Navigation` organism with adaptive links and user state awareness.

---

# **6. Component Design System**

---
meta:
  section: "Component Design System"
  version: "1.0"
  related_sections: ["Design Tokens & Theming", "Accessibility & UX", "Animations & Micro-interactions"]
  updated: "2025-10-16"
---

## Component Design System – Pair Up Events

### Design Principles
- Components are **modular and reusable** across web and future mobile platforms.
- Design is **playful, inviting, and warm-organic**, aligned with brand tone.
- All components reference **design tokens** (colors, typography, spacing) from the Design Tokens & Theming section.
- Interaction logic (hover, focus, pressed states) is **defined per component**, while detailed accessibility and animations are handled in their respective guideline sections.
- Naming conventions follow **semantic clarity**, e.g., `ButtonPrimaryCreate`, `EventCardBasic`.

---

### Component Naming Conventions
- **Base Components:** Use descriptive, generic names for reusability (e.g., `ButtonPrimary`, `CardBasic`).
- **Feature Components:** Include purpose in name (e.g., `EventCard`, `PairProfileCard`).
- **Variants:** Append variant descriptor (e.g., `ButtonPrimaryCreate`, `ButtonSecondaryFind`).
- **States:** Defined within JSON `states` array (default, hover, pressed, disabled, focus).

---

### Components

#### Component: Button
```json
{
  "category": "UI element",
  "description": "Triggers actions. Used for primary, secondary, and neutral actions.",
  "dependencies": ["ColorTokens", "TypographyTokens"],
  "variants": [
    {
      "name": "PrimaryCreate",
      "purpose": "Trigger creation of a new experience",
      "color": "#27E9F3",
      "stroke": "#1A2A33"
    },
    {
      "name": "PrimaryFind",
      "purpose": "Trigger searching for existing experiences",
      "color": "#FECC08",
      "stroke": "#1A2A33"
    },
    {
      "name": "Neutral",
      "purpose": "General navigation or secondary action",
      "color": "#1A2A33",
      "stroke": null
    }
  ],
  "states": ["default", "hover", "pressed", "disabled", "focus"],
  "properties": {
    "size": "small|medium|large",
    "icon": "optional",
    "width": "auto|full"
  },
  "behavior": {
    "hover": "Slightly darker shade of base color",
    "pressed": "Apply 90% opacity",
    "focus": "Add 2px outline using accent color"
  },
  "semantic_usage": "Used for primary and secondary actions across web and future mobile interfaces, e.g., creating or searching experiences."
}

{
  "category": "UI element",
  "description": "Text input fields for forms, search, or filters.",
  "dependencies": ["ColorTokens", "TypographyTokens"],
  "variants": ["default", "withIcon", "textarea"],
  "states": ["default", "hover", "focus", "disabled", "error"],
  "properties": {
    "size": "small|medium|large",
    "placeholder": "text",
    "icon": "optional",
    "validationState": "none|error|success"
  },
  "behavior": {
    "focus": "Apply primary accent outline",
    "error": "Change border to error color and show tooltip",
    "disabled": "Reduce opacity to 50%"
  },
  "semantic_usage": "Used for creating events, searching experiences, or filtering lists."
}

{
  "category": "UI element",
  "description": "Container for content blocks with optional actions.",
  "dependencies": ["ColorTokens", "TypographyTokens", "Button"],
  "variants": ["Basic", "Elevated", "Interactive"],
  "states": ["default", "hover", "selected"],
  "properties": {
    "cornerRadius": "16px",
    "shadow": "subtle",
    "padding": "medium",
    "width": "auto|fixed"
  },
  "behavior": {
    "hover": "Slight shadow increase to indicate interactivity",
    "clickable": "Optional, depending on child elements"
  },
  "semantic_usage": "Base container used by EventCard, PairProfileCard, or other content blocks."
}

{
  "category": "UI element",
  "description": "Top navigation bar including logo, navigation links, and actions.",
  "dependencies": ["Button", "Avatar", "ColorTokens", "TypographyTokens"],
  "variants": ["Default", "Sticky"],
  "states": ["default", "hover"],
  "properties": {
    "height": "64px",
    "backgroundColor": "#1A2A33",
    "logoPosition": "left|center",
    "menuItems": "array of link objects"
  },
  "behavior": {
    "hover": "Buttons change background or stroke on hover",
    "sticky": "Remain visible on scroll"
  },
  "semantic_usage": "Main navigation container for web interface; houses primary actions and global navigation links."
}

{
  "category": "UI element",
  "description": "Overlay container to display content requiring focused attention.",
  "dependencies": ["Card", "Button", "ColorTokens", "TypographyTokens"],
  "variants": ["Small", "Medium", "Large", "FullScreen"],
  "states": ["open", "closed"],
  "properties": {
    "size": "small|medium|large|fullscreen",
    "overlayOpacity": 0.5,
    "dismissible": true
  },
  "behavior": {
    "open": "Fade in overlay and scale content",
    "close": "Fade out overlay and scale content down",
    "focusTrap": "Maintain keyboard focus inside modal"
  },
  "semantic_usage": "Used for confirmation, match details, or event creation forms."
}

{
  "category": "UI element",
  "description": "Small label used to indicate activity types, status, or categories.",
  "dependencies": ["ColorTokens", "TypographyTokens"],
  "variants": ["Default", "Rounded", "Outlined"],
  "states": ["default", "hover"],
  "properties": {
    "size": "small|medium",
    "color": "semantic based on type",
    "icon": "optional"
  },
  "behavior": {
    "hover": "Slight scale or shadow to indicate interactivity"
  },
  "semantic_usage": "Used for activity tags on EventCards or status labels for pairs."
}

{
  "category": "UI element",
  "description": "Circular user or pair profile image.",
  "dependencies": ["ColorTokens", "TypographyTokens"],
  "variants": ["Small", "Medium", "Large"],
  "states": ["default", "hover"],
  "properties": {
    "size": "small|medium|large",
    "fallbackInitials": "string",
    "border": "optional"
  },
  "behavior": {
    "hover": "Optional outline or shadow to indicate interactivity"
  },
  "semantic_usage": "Used in Navbar, PairProfileCard, and EventCard to represent users or pairs."
}

{
  "category": "Feature component",
  "description": "Displays event information, participants, and call-to-action buttons.",
  "dependencies": ["Card", "Tag", "Button", "Avatar", "ColorTokens", "TypographyTokens"],
  "variants": ["Basic", "Interactive"],
  "states": ["default", "hover", "selected"],
  "properties": {
    "title": "string",
    "activityType": "Tag object",
    "participants": "array of Avatar objects",
    "dateTime": "datetime string",
    "location": "string",
    "ctaButton": "Button object"
  },
  "behavior": {
    "hover": "Elevate card and reveal secondary actions",
    "click": "Navigate to detailed event page"
  },
  "semantic_usage": "Represents individual events in feeds or search results; used for joining or viewing event details."
}

{
  "category": "Feature component",
  "description": "Displays a pair’s profile information including avatars, interests, and social tags.",
  "dependencies": ["Card", "Avatar", "Tag", "Button", "ColorTokens", "TypographyTokens"],
  "variants": ["Basic", "Interactive"],
  "states": ["default", "hover", "selected"],
  "properties": {
    "pairName": "string",
    "avatars": "array of Avatar objects",
    "tags": "array of Tag objects",
    "ctaButton": "Button object"
  },
  "behavior": {
    "hover": "Elevate card and reveal secondary actions",
    "click": "Open Pair details modal"
  },
  "semantic_usage": "Represents a pair in feeds or search results; used to learn about other pairs and connect."
}


---

# **7. Visual Design**
## 🎨 Visual Design

The visual identity of **Pair Up Events** reflects *warmth, trust, and curiosity*.  
It invites users to explore real-world experiences in a *modern, organic* interface that feels both *encouraging and authentic*.  
The system combines photography of real people in motion with card-based floating UI elements to create a natural flow between digital and human interaction.

```json
{
  "visual_design": {
    "core_attributes": {
      "tone": ["trustworthy", "encouraging", "modern", "warm", "organic"],
      "keywords": ["connection", "movement", "balance", "real", "light depth"]
    },
    "layout_style": {
      "structure": "card-based floating layers",
      "visual_depth": {
        "elevation_levels": 3,
        "shadow_softness": "medium",
        "corner_radius": "16px",
        "border_stroke": "1px solid #1A2A33"
      },
      "white_space": "generous",
      "alignment": "grid-based with organic rhythm"
    },
    "photography_style": {
      "type": "real_people_in_motion",
      "lighting": "natural daylight or warm interior tones",
      "composition": "candid, unposed, relational moments",
      "color_harmony": "aligned with brand primaries and natural tones",
      "background_depth": "soft blur or environmental context (e.g., city, park, home)"
    },
    "hero_image_reference": {
      "composition": "4-photo collage representing diverse pair dynamics",
      "images": [
        {
          "id": "img_top_left",
          "description": "Two female friends with one arm over the other’s shoulder, harbor background.",
          "color_palette": ["#EEF5C8", "#C8D7F5"]
        },
        {
          "id": "img_top_right",
          "description": "Couple taking a selfie in front of the Eiffel Tower in Paris.",
          "color_palette": ["#F5D0C8", "#EDD29D"]
        },
        {
          "id": "img_bottom_left",
          "description": "Twins hugging at home, wearing identical sweaters.",
          "color_palette": ["#C8F5D0"]
        },
        {
          "id": "img_bottom_right",
          "description": "Father walking hand-in-hand with child toward a playground.",
          "color_palette": ["#EDD29D", "#F5C8EE"]
        }
      ],
      "visual_balance": "top-heavy symmetry with bottom grounding imagery",
      "emotion": ["connection", "comfort", "playfulness", "shared experience"]
    },
    "cta_style": {
      "type": "filled",
      "shape": "rounded",
      "colors": {
        "primary_create": "#27E9F3",
        "primary_join": "#FECC08",
        "base_dark": "#1A2A33"
      },
      "contrast_ratio_minimum": "4.5:1",
      "text_treatment": "bold uppercase Manrope",
      "interaction_feedback": {
        "hover_state": "light brightness shift + subtle elevation increase",
        "active_state": "pressed effect with reduced elevation"
      }
    },
    "color_behavior": {
      "primary_usage": {
        "create_events": "#27E9F3",
        "find_events": "#FECC08",
        "background": "#F5E6C8",
        "accent_dark": "#1A2A33"
      },
      "contrast_management": "Maintain readable contrast against warm backgrounds",
      "emotion_balance": "Cool tones for energy, warm tones for comfort"
    },
    "visual_hierarchy": {
      "headlines": {
        "font": "Outfit",
        "weight": "700",
        "intent": "confidence, clarity"
      },
      "body_text": {
        "font": "Manrope",
        "weight": "400",
        "intent": "approachable readability"
      },
      "cta_text": {
        "font": "Manrope",
        "weight": "600",
        "intent": "inviting action"
      }
    },
    "cross_references": {
      "design_tokens": "Color variables and typography scales defined in Design Tokens & Theming.",
      "accessibility": "All contrast, color, and size rules are validated per WCAG 2.2 AA.",
      "animations": "Layer transitions and hover states defined in Animations & Micro-interactions."
    }
  }
}

---

# **8. Accessibility & UX**

Accessibility and usability are at the core of **Pair Up Events**, ensuring that every user — regardless of ability, device, or comfort level — can enjoy seamless, inclusive interaction.  
The system adheres to **WCAG 2.2 AA standards**, prioritizing clarity, control, and comfort.  
It’s designed to feel **warm, trustworthy, and supportive**, helping users focus on connection, not complexity.

```json
{
  "accessibility_ux": {
    "conformance_level": "WCAG 2.2 AA",
    "core_principles": {
      "perceivable": "All text, icons, and media maintain adequate contrast and provide alternatives (alt-text, ARIA labels).",
      "operable": "All controls are keyboard-accessible with visible focus states.",
      "understandable": "Microcopy and system feedback use friendly, consistent language.",
      "robust": "Fully compatible with screen readers, assistive technologies, and device settings."
    },
    "motion_policy": {
      "default_behavior": "Subtle organic animations for depth and flow (card elevation, fade, slide).",
      "prefers_reduced_motion": {
        "detected_via": "CSS media query prefers-reduced-motion",
        "behavior": "Disable parallax and bouncing animations, retain fade-only transitions.",
        "user_toggle_available": true
      },
      "transition_timing": "150–250ms, ease-out",
      "motion_tone": "Calm and natural — no abrupt or flashing movement."
    },
    "text_and_readability": {
      "base_font_size": "16px minimum",
      "scaling": "Up to 200% without breaking layout",
      "contrast_ratio_minimum": "4.5:1",
      "high_contrast_mode": "Available as a toggle under user settings",
      "line_spacing": "1.5x font size",
      "font_family": {
        "headlines": "Outfit",
        "body": "Manrope"
      }
    },
    "interaction_design": {
      "keyboard_navigation": {
        "tab_index_order": "Logical and consistent with visual flow",
        "focus_state_style": "1px outline with 4px offset, #27E9F3 glow",
        "skip_links": "Enabled for major layout sections"
      },
      "touch_targets": {
        "min_size": "44x44px",
        "spacing": "8px minimum between interactive elements"
      },
      "feedback": {
        "visual": "Hover, press, and focus feedback on all buttons and links.",
        "auditory": "Optional subtle sound feedback for actions (toggleable)."
      }
    },
    "pair_safety_features": {
      "privacy_defaults": "Event locations visible only to confirmed pairs.",
      "pre_meet_confirmation": "Both pairs must confirm attendance before seeing exact address.",
      "report_feature": "Every event card includes 'Report Event' button.",
      "post_event_feedback": "Simple, friendly UX for rating experiences.",
      "emotional_safety_tone": "Encouraging, reassuring, non-judgmental microcopy."
    },
    "microcopy_tone": {
      "tone_keywords": ["warm", "trustworthy", "encouraging", "clear"],
      "examples": {
        "empty_state": "No pair-ups yet — ready to start something new?",
        "form_hint": "Keep it short and friendly — others will see your event title!",
        "confirmation_message": "You’re all set! Time to discover your next shared moment."
      }
    },
    "assistive_technologies_support": {
      "screen_reader_labels": "All interactive and visual elements include descriptive ARIA labels.",
      "semantic_html_usage": "Use of native HTML5 landmarks for navigation.",
      "voice_control": "Tested for speech recognition compatibility (Apple Voice Control, Dragon)."
    },
    "cross_references": {
      "visual_design": "Contrast and spacing rules align with visual design tone.",
      "animations": "Motion rules defined in Animations & Micro-interactions.",
      "design_tokens": "Accessible color and typography tokens referenced for consistency."
    }
  }
}

---

# **9. Responsive Design**

**Approach:**
Mobile-first layouts that gracefully expand to tablet and desktop.

| Breakpoint | Width | Description |
|-------------|--------|-------------|
| `sm` | 640px | Mobile |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |

**Responsive Patterns:**
- Hamburger navigation for mobile
- Collapsible sidebars
- Stacked forms and cards
- Adaptive grid with auto-fit columns

---

# **10. Animations & Micro-interactions**

- **Page transitions:** `framer-motion` fade + slide-in effects
- **Button feedback:** subtle scale + shadow on press
- **Toast notifications:** smooth entrance / exit animations
- **Hero section:** scroll-triggered fade-in
- **Error boundaries:** animated recovery prompt

**Philosophy:**
Use motion to reinforce state changes, not distract.
Animations should enhance comprehension and delight without slowing performance.

---

# **11. Design Tokens & Theming**

- **Colors:** defined in `tailwind.config.ts` via custom palette
- **Typography:** configured in global styles (`index.css`)
- **Spacing units:** multiples of 4 for visual consistency
- **Dark Mode:** toggled via `data-theme="dark"` and persisted in localStorage

Example:
```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #9333ea;
}
[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-background: #0f172a;
}
```

# **12. Branding Guidelines**

### 🎭 Tone & Voice
Pair Up Events speaks with **warmth, energy, and inclusivity**.
We want users to feel like they’re part of something active and welcoming — a social brand built around real-world connection.

**Voice Attributes:**
- Friendly, conversational, and human
- Confident but never corporate
- Encouraging rather than directive
- Honest and transparent about privacy and safety

**Examples:**
- ✅ “Let’s make something fun happen.”
- ✅ “Invite your friends — they’ll love it.”
- ❌ “Submit your request to organize an event.”

---

### 🖋️ Logo Usage

**Primary Logo:**
- The full “Pair Up Events” logotype with icon.
- Preferred placement: top-left corner of navigation bar.
- Clear space: maintain padding equal to the logo height on all sides.
- Minimum size: 24px height for mobile, 40px for desktop.

**Variants:**
- **Light Mode:** Use the colored logo.
- **Dark Mode:** Use the white or monochrome variant.
- **Icon-only:** Use only the mark (without text) for compact spaces, favicons, or app icons.

**File Formats:**
SVG preferred for web. PNG for fallbacks.

---

### 🧭 Color Usage

| Color | Hex | Purpose |
|--------|-----|----------|
| Primary | `#3B82F6` | Action buttons, links |
| Secondary | `#9333EA` | Highlights, decorative accents |
| Accent | `#FBBF24` | Toasts, interactive highlights |
| Background | `#FFFFFF` / `#0F172A` | Light / Dark mode backgrounds |
| Neutral | `#F3F4F6` | Card backgrounds, surfaces |
| Success | `#16A34A` | Confirmations and positive messages |
| Error | `#DC2626` | Errors, alerts, validation feedback |

> Always maintain **4.5:1 contrast ratio** for text and interactive elements.

---

### 🧩 Iconography

- Icon set: **Lucide** (outline-based)
- Stroke width: consistent `1.5px`
- Style: rounded corners, open shapes, minimal fills
- Size range: 16–32px depending on context
- Icons should **enhance meaning**, not decorate

---

### 🖼️ Imagery & Illustration

- **Style:** Minimal, bright, and people-centric
- **Tone:** Optimistic, approachable, authentic
- **Subjects:** Small social groups, casual gatherings, relatable real-life settings
- **Illustrations:** Use sparingly for onboarding, empty states, or legal pages
- **Avoid:** Overly corporate stock photos or abstract 3D renders

---

### 💬 Copywriting Guidelines

- Keep sentences short and actionable.
- Use **you/we** language — speak directly to the user.
- Prefer verbs over nouns (“Join an event” instead of “Event participation”).
- Always end critical actions (delete, logout) with confirmation feedback (toast).

---

### 🧠 Brand Personality Summary

| Trait | Description |
|--------|--------------|
| **Friendly** | Feels like a helpful friend, not a company. |
| **Energetic** | Encourages action and fun. |
| **Trustworthy** | Privacy-first, clear about what happens with user data. |
| **Simple** | Removes friction and avoids clutter. |
| **Optimistic** | Makes users feel like socializing is easy and rewarding. |

---

# **13. Future Improvements**

The following improvements are planned to evolve both product design and brand maturity:

### 🌈 Visual & UX Enhancements
- Dynamic theme editor (user-chosen color palettes or accessibility presets)
- Animated onboarding flow with motion-driven storytelling
- Enhanced event discovery with tags, filters, and location cues
- Realtime UI feedback for invitations and group chat reactions

### ⚙️ Design System Evolution
- Introduce Figma → Tailwind design token sync
- Expand `useAccessibility` and `useErrorReporting` hooks to UI system level
- Create a shared component library (`@pairup/ui`) for web and internal tools

### 📱 Cross-Platform Consistency
- Introduce mobile-native design tokens
- Implement adaptive layouts for foldable and tablet devices
- Unify iconography and color behavior between PWA and native builds

### ♿ Accessibility Roadmap
- Integrate automated accessibility audits (axe-core CI pipeline)
- Live-region announcements for navigation and content changes
- Keyboard shortcuts for power users and screen-reader optimizations

---

**Last Updated:** October 2025
**Design Lead:** _[Your Name]_
**Version:** 1.0
**Status:** Active Design Framework for Pair Up Events Web Platform
