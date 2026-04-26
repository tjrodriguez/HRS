# Next Phase Development Guide

This guide consolidates implementation status, technical decisions, validation evidence, rollout steps, and development priorities for the upcoming phase.

## 1. Current Implementation Status

### Completed
- Caption regeneration hardening in `src/app/api/generate-content/route.ts`.
- Strict caption parsing for caption mode (expects valid JSON array output).
- Retry loop for invalid/duplicate regenerated captions (`GROQ_CAPTION_RETRY_LIMIT`, default `3`).
- Similarity and duplicate rejection against `previousCaptions`.
- Dynamic retry prompt variation to push distinct outputs.
- Safe fallback caption generation only after retry exhaustion.
- Regeneration cache bypass so retry attempts are always fresh.
- Logging for raw responses, parse failures, duplicate retries, and fallback activation.

### Verified
- `npx eslint src/app/api/generate-content/route.ts` passed.
- `npm run build` passed.

## 2. Caption Regeneration Design

### Flow
1. Receive caption request (`mode: caption`) with optional `previousCaptions`.
2. Normalize previous captions and detect regeneration mode.
3. Skip cache reads/writes for regeneration requests.
4. Generate caption via Groq with strict JSON-array output prompt.
5. Parse response strictly:
   - If invalid JSON array: retry.
   - If empty caption: retry.
6. Compare candidate caption to previous captions:
   - Reject exact match.
   - Reject semantically too-similar output (token similarity threshold).
7. Retry with stronger variation instructions until limit reached.
8. If all attempts fail, emit a distinct fallback caption template.

### Environment Variables
- `GROQ_API_KEY` (required)
- `GROQ_MODEL` (optional)
- `GROQ_FALLBACK_MODELS` (optional)
- `GROQ_MAX_COMPLETION_TOKENS` (optional)
- `GROQ_CAPTION_RETRY_LIMIT` (optional, default `3`)

## 3. API Contract (Caption Mode)

### Request
```json
{
  "mode": "caption",
  "stream": false,
  "holidayName": "Earth Day",
  "eventDate": "2026-04-26",
  "businessName": "Green Grove Cafe",
  "businessType": "Cafe",
  "businessNiche": "Coffee",
  "tone": "Friendly",
  "targetAudience": "local customers",
  "platform": "instagram",
  "previousCaptions": ["Earlier generated caption"]
}
```

### Response
```json
{
  "success": true,
  "captions": ["Distinct generated caption"],
  "retriesAttempted": 3,
  "isFallback": false
}
```

## 4. Operational Notes

### Authentication Boundary
- Route-level implementation is complete.
- Anonymous terminal requests can still be redirected by auth middleware in local testing contexts.
- For API-only diagnostics, test through an authenticated app session.

### Caching
- Non-regeneration caption requests can still use cache.
- Regeneration requests (`previousCaptions` present) intentionally bypass cache.

## 5. QA Checklist For This Phase

### Functional
- Initial caption generation returns one caption.
- Regenerate with `previousCaptions` returns a different caption.
- Repeated regenerate calls continue producing non-duplicate results.
- `isFallback` is `true` only when retry limit is exhausted.

### Robustness
- Malformed model output triggers retry, not immediate acceptance.
- Duplicate/near-duplicate output triggers retry.
- Endpoint returns stable error response for missing required fields.

### Regression
- Full mode generation (`mode: full`) still returns instagram/email/engagement/platformTips.
- Existing dashboard pages and API routes compile and build.

## 6. Upcoming Development Priorities

1. Add authenticated API test script for regeneration scenarios (happy-path and duplicate-path).
2. Add request-level telemetry IDs to correlate retries in logs.
3. Add lightweight evaluation dataset for caption uniqueness checks.
4. Introduce alerting for repeated fallback spikes (indicates upstream model quality issues).
5. Add unit tests for parser, similarity guard, and fallback selector utilities.

## 7. Suggested Task Breakdown (Next Sprint)

### Backend
- Build automated regression test for `/api/generate-content` caption mode.
- Add explicit metric counters for parse failures and duplicate retries.

### Product Quality
- Define acceptance threshold for semantic uniqueness in generated captions.
- Create QA script with 10+ regeneration scenarios across niches and tones.

### Documentation
- Keep this guide updated as the source-of-truth for regeneration logic changes.
- Mirror key API contract changes in `README.md` and `docs/backend-integration.md`.

## 8. Related Documentation
- `README.md`
- `CHANGELOG.md`
- `docs/backend-integration.md`
- `docs/IMPLEMENTATION_SUMMARY.md`
- `docs/LAUNCH_CHECKLIST.md`
