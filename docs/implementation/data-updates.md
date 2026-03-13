# Required Update to lib/data.ts

To complete the session tracking implementation, the GameEvent interface needs to be updated with the session_id field.

## Required Change

In `/Users/aideveloper/AIGame-Master/lib/data.ts`, update the GameEvent interface (around line 65):

### Before:
```typescript
export interface GameEvent {
    id: string;
    player_id: string;
    event_type: string;
    location: string;
    metadata: Record<string, any>;
    created_at: string;
}
```

### After:
```typescript
export interface GameEvent {
    id: string;
    player_id: string;
    session_id?: string;  // Refs #5 - Game Session Tracking (optional for backward compatibility)
    event_type: string;
    location: string;
    metadata: Record<string, any>;
    created_at: string;
}
```

## Alternative: Use Extended Interface

If you prefer not to modify the existing GameEvent interface, you can use the GameEvent type from lib/types.ts which already includes sessionId field (note: uses camelCase instead of snake_case).

The data-session-extension.ts file is designed to work with the updated GameEvent interface that includes session_id.
