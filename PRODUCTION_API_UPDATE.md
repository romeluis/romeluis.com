# Production API Update Required

## Issue
The public-facing API at `https://api.romeluis.com/api/projects` needs to be updated to return the new tag structure.

## Current Behavior
- Returns tags as: `tags: ["Web Development", "Frontend"]`
- Frontend now expects: `tags: [{id: 1, name: "Web Development", color: "#91bf4b"}]`

## Required Changes on Production Server

### 1. Update the GET /api/projects endpoint

**Find this query:**
```sql
SELECT id, project_id, tag FROM project_metadata_tags WHERE project_id = ?
```

**Replace with:**
```sql
SELECT t.id, t.name, t.color
FROM project_metadata_tags pmt
JOIN tags t ON pmt.tag_id = t.id
WHERE pmt.project_id = ?
ORDER BY t.name
```

### 2. Verify Database Schema

Make sure your production database has:
- `tags` table with columns: `id`, `name`, `color`
- `project_metadata_tags` table with columns: `id`, `project_id`, `tag_id`
- Foreign key: `tag_id` references `tags(id)`

### 3. Test the Response

After updating, the API should return:
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": 1,
        "name": "Project Name",
        "tags": [
          {"id": 1, "name": "Web Development", "color": "#91bf4b"},
          {"id": 2, "name": "Frontend", "color": "#02a6ff"}
        ]
      }
    ]
  }
}
```

## Alternative: Test Locally

To test the full flow locally before deploying to production:

1. Update `src/components/projects/ProjectBrowser.tsx` line 41:
   ```typescript
   // Change from:
   ? `https://api.romeluis.com/api/projects?${params}`
   : 'https://api.romeluis.com/api/projects';

   // To:
   ? `http://localhost:3001/api/admin/projects?${params}`
   : 'http://localhost:3001/api/admin/projects';
   ```

2. Run `npm run server` to start the local admin server
3. Test the tag filtering

4. **Remember to change it back** before deploying!
