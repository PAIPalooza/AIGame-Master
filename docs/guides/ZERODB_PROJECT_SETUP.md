# ZeroDB Project Setup for AIGame-Master

**Date:** March 13, 2026
**Status:** ⚠️ Pending Manual Creation
**Issue:** ZeroDB API project creation returning database error

---

## Current Situation

The ZeroDB production API (`https://api.ainative.studio`) is currently returning a database error when attempting to create new projects via the `/api/v1/projects` endpoint.

**Error Details:**
```json
{
  "error": "Database Error",
  "detail": "An error occurred while accessing the database.",
  "path": "/api/v1/projects"
}
```

**Authentication:** Working correctly ✅
- Login endpoint: `/api/v1/auth/login`
- Credentials verified successfully
- JWT token generated

**Project Creation:** Failing ❌
- Endpoint: `POST /api/v1/projects`
- Multiple attempts with different payloads
- All return 500 Database Error

---

## Required Project Configuration

When the API is available, create a project with these details:

```json
{
  "name": "AIGame-Master",
  "description": "AI Game Master - Waitlist and narrative infrastructure for AI-native game worlds",
  "tier": "free"
}
```

---

## Manual Creation Steps

### Option 1: Via Dashboard (Recommended)

1. Go to https://api.ainative.studio/dashboard (or correct dashboard URL)
2. Login with:
   - Email: `admin@ainative.studio`
   - Password: `H%dJcjSwLZIe1%9u`
3. Navigate to "Projects" section
4. Click "Create New Project"
5. Enter:
   - **Name:** AIGame-Master
   - **Description:** AI Game Master - Waitlist and narrative infrastructure for AI-native game worlds
   - **Tier:** Free
6. Copy the generated Project ID
7. Update `.env` file:
   ```bash
   ZERODB_PROJECT_ID="<paste-project-id-here>"
   ```

### Option 2: Contact Support

If dashboard access is not available:
1. Email: support@ainative.studio
2. Subject: "Create ZeroDB Project - AIGame-Master"
3. Include:
   - Account: admin@ainative.studio
   - Project Name: AIGame-Master
   - Description: Waitlist and narrative infrastructure
   - Tier: Free

---

## What We Tried

### Attempt 1: JWT Token Auth
```bash
curl -X POST "https://api.ainative.studio/api/v1/projects" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "AIGame-Master", "description": "...", "tier": "free"}'
```
**Result:** 500 Database Error

### Attempt 2: API Key Auth
```bash
curl -X POST "https://api.ainative.studio/api/v1/projects" \
  -H "X-API-Key: kLPiP0bzgKJ0CnNYVt1wq3qxbs2QgDeF2XwyUnxBEOM" \
  -H "Content-Type: application/json" \
  -d '{"name": "AIGame-Master"}'
```
**Result:** 401 Invalid API key

### Attempt 3: Minimal Payload
```bash
# Only name + description, no tier
```
**Result:** 500 Database Error

### Attempt 4: Alternate Endpoint
```bash
# Tried /v1/projects instead of /api/v1/projects
```
**Result:** 404 Not Found

---

## Once Project is Created

After you have the Project ID, update the .env file and proceed with:

1. **Create Waitlist Table:**
   ```bash
   curl -X POST "https://api.ainative.studio/api/v1/projects/$PROJECT_ID/database/tables" \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "table_name": "waitlist_signups",
       "description": "GameMaster waitlist submissions"
     }'
   ```

2. **Test Table Creation:**
   ```bash
   curl -X POST "https://api.ainative.studio/api/v1/projects/$PROJECT_ID/database/tables/waitlist_signups/rows" \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "row_data": {
         "email": "test@example.com",
         "role": "Test User",
         "company": "Test Co",
         "interested_in_paid": false,
         "created_at": "2026-03-13T23:00:00Z"
       }
     }'
   ```

3. **Update GameMasterV1 Form:**
   - Replace Supabase client with ZeroDB API calls
   - Use project ID from .env
   - Implement proper error handling

---

## Existing Projects

The admin account currently has one project:

```json
{
  "id": "e4f3d95f-593f-4ae6-9017-24bff5f72c5e",
  "name": "WWMAA",
  "description": "WWMAA Database Project",
  "tier": "free",
  "status": "ACTIVE",
  "database_enabled": true
}
```

**Note:** We need a separate project for AIGame-Master, not using WWMAA.

---

## Next Steps

1. ✅ Document the issue (this file)
2. ✅ Add placeholder to .env
3. ⏳ Wait for API fix or create via dashboard
4. ⏳ Update .env with real project ID
5. ⏳ Create waitlist table
6. ⏳ Integrate with GameMasterV1 form

---

## Credentials Reference

**Login:**
- Email: `admin@ainative.studio`
- Password: `H%dJcjSwLZIe1%9u`

**API:**
- URL: `https://api.ainative.studio`
- Auth Endpoint: `/api/v1/auth/login`
- Projects Endpoint: `/api/v1/projects`

**Current .env:**
```bash
ZERODB_PROJECT_ID="PENDING_CREATION"  # Replace after manual creation
ZERODB_PROJECT_NAME="AIGame-Master"
AINATIVE_API_URL="https://api.ainative.studio/"
AINATIVE_API_TOKEN="kLPiP0bzgKJ0CnNYVt1wq3qxbs2QgDeF2XwyUnxBEOM"
```

---

Built Using AINative Studio
All Data Services Built on ZeroDB
