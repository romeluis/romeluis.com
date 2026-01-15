# Database Architecture Specification
## Portfolio Website - romeluis.com

**Last Updated:** 2025-12-20
**Database System:** MariaDB (MySQL-compatible)
**Access Layer:** mysql2/promise (Direct SQL with Promises)
**API Framework:** Express.js + TypeScript

---

## Table of Contents
1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Projects Section](#projects-section)
4. [Resume Section](#resume-section)
5. [Image Storage Strategy](#image-storage-strategy)
6. [Extensibility Considerations](#extensibility-considerations)
7. [SQL Table Definitions](#sql-table-definitions)
8. [Example Queries](#example-queries)

---

## Overview

This database architecture supports two main sections of the portfolio website:

1. **Projects** - Dynamic project pages with configurable components
2. **Resume** - Procedurally-built resume with sections and entries

### Design Principles
- **Flexibility**: Easy to add new component types and resume sections
- **Order Preservation**: Explicit ordering for components and entries
- **Type Safety**: Enum-based component types for validation
- **Scalability**: Cloud-based image storage via URLs
- **Simplicity**: Direct SQL approach without ORM abstraction

---

## Database Schema

### Entity Relationship Overview

```
PROJECTS SECTION:
projects (1) ──→ (N) project_components
         └──→ (N) project_tech_stack

RESUME SECTION:
resume_basic_info (1)
resume_sections (N) ──→ (N) resume_entries
                              └─→ (N) resume_entry_bullets
```

---

## Projects Section

### Core Tables

#### 1. `projects`
Stores project metadata and basic information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique project identifier |
| `name` | VARCHAR(255) | NOT NULL | Project name |
| `color` | VARCHAR(7) | NULL | Hex color code (e.g., #FF5733) |
| `subheading` | VARCHAR(500) | NULL | Brief project description |
| `date_started` | DATE | NOT NULL | Project start date |
| `date_ended` | DATE | NULL | Project end date (NULL if in progress) |
| `is_pinned` | BOOLEAN | DEFAULT FALSE | Whether project appears in pinned section |
| `display_order` | INT | NOT NULL, DEFAULT 0 | Order for displaying projects |
| `poster_image_url` | VARCHAR(500) | NULL | URL to project poster/thumbnail image |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- Primary: `id`
- Index: `is_pinned, display_order` (for efficient querying of pinned projects)

---

#### 2. `tech_stack`
Master table of all available technologies with colors and icons.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique technology identifier |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Technology name (e.g., "React", "Node.js") |
| `color` | VARCHAR(7) | NULL | Hex color code (e.g., #61DAFB) |
| `image_url` | VARCHAR(500) | NULL | URL to technology icon/logo |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- Primary: `id`
- Index: `name` (for lookups and uniqueness)

---

#### 3. `project_tech_stack`
Junction table linking projects to tech stack items (many-to-many relationship).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique junction record identifier |
| `project_id` | INT | NOT NULL, FOREIGN KEY → projects(id) ON DELETE CASCADE | Associated project |
| `tech_id` | INT | NOT NULL, FOREIGN KEY → tech_stack(id) ON DELETE CASCADE | Associated technology |
| `display_order` | INT | NOT NULL | Order in the tech stack list for this project |

**Indexes:**
- Primary: `id`
- Unique: `project_id, tech_id` (prevents duplicate tech assignments)
- Unique: `project_id, display_order` (ensures unique ordering per project)
- Index: `project_id` (for querying tech by project)
- Index: `tech_id` (for querying projects by tech)

---

#### 4. `tags`
Master table of all available tags with color assignments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique tag identifier |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Tag name (e.g., "Web Development", "Machine Learning") |
| `color` | VARCHAR(7) | NULL | Hex color code (e.g., #10B981) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- Primary: `id`
- Index: `name` (for lookups and uniqueness)

---

#### 5. `project_metadata_tags`
Junction table linking projects to tags (many-to-many relationship).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique junction record identifier |
| `project_id` | INT | NOT NULL, FOREIGN KEY → projects(id) ON DELETE CASCADE | Associated project |
| `tag_id` | INT | NOT NULL, FOREIGN KEY → tags(id) ON DELETE CASCADE | Associated tag |

**Indexes:**
- Primary: `id`
- Unique: `project_id, tag_id` (prevents duplicate tag assignments)
- Index: `project_id` (for querying tags by project)
- Index: `tag_id` (for querying projects by tag)

---

#### 6. `project_components`
Ordered components that make up a project page. Each component stores its data as JSON.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique component identifier |
| `project_id` | INT | NOT NULL, FOREIGN KEY → projects(id) ON DELETE CASCADE | Associated project |
| `component_type` | ENUM | NOT NULL | Component type (see enum values below) |
| `component_data` | JSON | NOT NULL | Component-specific data (structure varies by type) |
| `display_order` | INT | NOT NULL | Order of component on page (0-indexed) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Component Type Enum Values:**
- `'title'` - Displays project metadata
- `'about'` - About section with description
- `'tech_stack'` - List of technologies (references project_tech_stack table)
- `'image_carousel'` - Image carousel with captions
- `'text'` - Plain text block
- `'text_with_title'` - Text block with heading
- `'video'` - Embedded YouTube video
- `'text_with_image'` - Text with image
- `'text_image_title'` - Text with image and title
- `'repository_links'` - List of repository links
- `'related_projects'` - List of related project links

**Indexes:**
- Primary: `id`
- Unique: `project_id, display_order` (ensures no duplicate ordering)
- Index: `project_id, component_type`

**JSON Data Structures by Component Type:**

```javascript
// title - No data needed, uses project metadata
{}

// about
{
  "description": "This project is about..."
}

// tech_stack - No data needed, references project_tech_stack table
{}

// image_carousel
{
  "images": [
    {
      "url": "https://cdn.example.com/image1.jpg",
      "caption": "Optional caption"
    },
    {
      "url": "https://cdn.example.com/image2.jpg",
      "caption": null
    }
  ]
}

// text
{
  "body": "Text content goes here..."
}

// text_with_title
{
  "title": "Section Title",
  "body": "Text content goes here..."
}

// video
{
  "youtube_url": "https://www.youtube.com/watch?v=...",
  "title": "Optional video title"
}

// text_with_image
{
  "body": "Text content goes here...",
  "image_url": "https://cdn.example.com/image.jpg",
  "image_position": "left" // or "right"
}

// text_image_title
{
  "title": "Section Title",
  "body": "Text content goes here...",
  "image_url": "https://cdn.example.com/image.jpg",
  "image_position": "right" // or "left"
}

// repository_links
{
  "links": [
    {
      "name": "Frontend Repo",
      "url": "https://github.com/user/frontend"
    },
    {
      "name": "Backend Repo",
      "url": "https://github.com/user/backend"
    }
  ]
}

// related_projects
{
  "projects": [
    {
      "name": "Related Project 1",
      "url": "/projects/other-project"
    },
    {
      "name": "External Project",
      "url": "https://example.com"
    }
  ]
}
```

---

## Resume Section

### Core Tables

#### 7. `resume_basic_info`
Single-row table storing personal information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, DEFAULT 1 | Always 1 (single row table) |
| `full_name` | VARCHAR(255) | NOT NULL | Your full name |
| `email` | VARCHAR(255) | NULL | Contact email |
| `phone` | VARCHAR(50) | NULL | Contact phone |
| `linkedin_url` | VARCHAR(500) | NULL | LinkedIn profile URL |
| `github_url` | VARCHAR(500) | NULL | GitHub profile URL |
| `website_url` | VARCHAR(500) | NULL | Personal website URL |
| `location` | VARCHAR(255) | NULL | Current location |
| `summary` | TEXT | NULL | Professional summary/bio |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Note:** This table should only ever have one row (id = 1).

---

#### 8. `resume_sections`
Dynamic sections in the resume (e.g., Experience, Education, Projects).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique section identifier |
| `title` | VARCHAR(255) | NOT NULL | Section title (e.g., "Work Experience") |
| `section_type` | VARCHAR(100) | NOT NULL | Type identifier for rendering |
| `display_order` | INT | NOT NULL, UNIQUE | Order of section in resume |
| `is_visible` | BOOLEAN | DEFAULT TRUE | Whether section is shown |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- Primary: `id`
- Unique: `display_order`

---

#### 9. `resume_entries`
Individual entries within resume sections.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique entry identifier |
| `section_id` | INT | NOT NULL, FOREIGN KEY → resume_sections(id) ON DELETE CASCADE | Associated section |
| `title` | VARCHAR(255) | NOT NULL | Entry title (e.g., company name, school name) |
| `subtitle` | VARCHAR(255) | NULL | Subtitle (e.g., position, degree) |
| `location` | VARCHAR(255) | NULL | Location |
| `start_date` | DATE | NULL | Start date |
| `end_date` | DATE | NULL | End date (NULL if current) |
| `is_current` | BOOLEAN | DEFAULT FALSE | Whether this is a current position/enrollment |
| `description` | TEXT | NULL | Optional description text |
| `display_order` | INT | NOT NULL | Order within the section |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- Primary: `id`
- Unique: `section_id, display_order`
- Index: `section_id`

---

#### 10. `resume_entry_bullets`
Bullet points for resume entries.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique bullet identifier |
| `entry_id` | INT | NOT NULL, FOREIGN KEY → resume_entries(id) ON DELETE CASCADE | Associated entry |
| `content` | TEXT | NOT NULL | Bullet point content |
| `display_order` | INT | NOT NULL | Order of bullet point |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation time |

**Indexes:**
- Primary: `id`
- Unique: `entry_id, display_order`
- Index: `entry_id`

---

## Extensibility Considerations

### Adding New Component Types

The JSON-based architecture makes adding new components extremely easy. To add a new component type:

1. **Add to ENUM** in `project_components.component_type`
2. **Define JSON structure** for the component data
3. **Update frontend** renderer to handle new type
4. **Add validation** in your API to ensure correct JSON structure

**Example: Adding a "Code Snippet" Component**

```sql
-- 1. Alter enum (MariaDB 10.3+)
ALTER TABLE project_components
MODIFY COLUMN component_type ENUM(
  'title', 'about', 'tech_stack', 'image_carousel',
  'text', 'text_with_title', 'video', 'text_with_image',
  'text_image_title', 'repository_links', 'related_projects',
  'code_snippet'  -- NEW
);
```

**2. Define JSON structure in your API:**
```typescript
// code_snippet component data
{
  "language": "javascript",
  "code": "const hello = 'world';",
  "caption": "Optional caption"
}
```

**3. Insert new component:**
```sql
INSERT INTO project_components (project_id, component_type, component_data, display_order)
VALUES (
  1,
  'code_snippet',
  '{"language": "javascript", "code": "const hello = \'world\';", "caption": null}',
  3
);
```

### Adding New Resume Section Types

Resume sections are completely dynamic via `resume_sections.section_type`:

```sql
-- No schema change needed! Just insert new section:
INSERT INTO resume_sections (title, section_type, display_order)
VALUES ('Certifications', 'certifications', 4);
```

The frontend can render sections differently based on `section_type`.

---

## SQL Table Definitions

### Complete Schema Creation Script

```sql
-- ============================================
-- PROJECTS SECTION
-- ============================================

-- 1. Projects metadata
CREATE TABLE projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7) NULL COMMENT 'Hex color code (e.g., #FF5733)',
  subheading VARCHAR(500) NULL,
  date_started DATE NOT NULL,
  date_ended DATE NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0,
  poster_image_url VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_pinned_order (is_pinned, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tech stack master table
CREATE TABLE tech_stack (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) NULL COMMENT 'Hex color code (e.g., #61DAFB)',
  image_url VARCHAR(500) NULL COMMENT 'URL to technology icon/logo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Project tech stack (junction table)
CREATE TABLE project_tech_stack (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  tech_id INT NOT NULL,
  display_order INT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (tech_id) REFERENCES tech_stack(id) ON DELETE CASCADE,
  UNIQUE KEY unique_project_tech (project_id, tech_id),
  UNIQUE KEY unique_project_order (project_id, display_order),
  INDEX idx_project_id (project_id),
  INDEX idx_tech_id (tech_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tags master table
CREATE TABLE tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) NULL COMMENT 'Hex color code (e.g., #10B981)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Project metadata tags (junction table)
CREATE TABLE project_metadata_tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  tag_id INT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE KEY unique_project_tag (project_id, tag_id),
  INDEX idx_project_id (project_id),
  INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Project components (JSON-based)
CREATE TABLE project_components (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  component_type ENUM(
    'title',
    'about',
    'tech_stack',
    'image_carousel',
    'text',
    'text_with_title',
    'video',
    'text_with_image',
    'text_image_title',
    'repository_links',
    'related_projects'
  ) NOT NULL,
  component_data JSON NOT NULL,
  display_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE KEY unique_project_order (project_id, display_order),
  INDEX idx_project_type (project_id, component_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- RESUME SECTION
-- ============================================

-- 7. Resume basic info (single row)
CREATE TABLE resume_basic_info (
  id INT PRIMARY KEY DEFAULT 1,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  linkedin_url VARCHAR(500) NULL,
  github_url VARCHAR(500) NULL,
  website_url VARCHAR(500) NULL,
  location VARCHAR(255) NULL,
  summary TEXT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Resume sections
CREATE TABLE resume_sections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  section_type VARCHAR(100) NOT NULL,
  display_order INT NOT NULL UNIQUE,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Resume entries
CREATE TABLE resume_entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  section_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NULL,
  location VARCHAR(255) NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT NULL,
  display_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES resume_sections(id) ON DELETE CASCADE,
  UNIQUE KEY unique_section_order (section_id, display_order),
  INDEX idx_section_id (section_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Resume entry bullet points
CREATE TABLE resume_entry_bullets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  entry_id INT NOT NULL,
  content TEXT NOT NULL,
  display_order INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (entry_id) REFERENCES resume_entries(id) ON DELETE CASCADE,
  UNIQUE KEY unique_entry_order (entry_id, display_order),
  INDEX idx_entry_id (entry_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```