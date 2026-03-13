# ZeroDB Developer Guide

**Version:** 2.1.1
**Last Updated:** 2026-03-06
**Status:** ✅ Current & Production Ready

---

## Quick Start

### Production API
```bash
BASE_URL="https://api.ainative.studio"
```

### Authentication

#### Method 1: API Keys (Recommended)
```bash
curl -X GET "https://api.ainative.studio/v1/projects" \
  -H "X-API-Key: your-api-key-here"
```

#### Method 2: JWT Tokens
```bash
# Login to get token
TOKEN=$(curl -s -X POST "https://api.ainative.studio/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ainative.studio","password":"your-password"}' | \
  jq -r '.access_token')

# Use token
curl -X GET "https://api.ainative.studio/v1/projects" \
  -H "Authorization: Bearer $TOKEN"
```

### Create Project

```bash
# Using JWT Token
curl -X POST "https://api.ainative.studio/v1/projects" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My ZeroDB Project",
    "description": "AI memory storage",
    "tier": "free"
  }'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "My ZeroDB Project",
  "description": "AI memory storage",
  "tier": "free",
  "status": "ACTIVE",
  "database_enabled": true,
  "created_at": "2026-03-06T10:30:00Z"
}
```

---

Built Using AINative Studio
All Data Services Built on ZeroDB
