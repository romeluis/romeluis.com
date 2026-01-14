// Simple local dev server for database operations
// Run this with: npm run server
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { Client } from 'ssh2';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for image uploads

// Cloudflare R2 Client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// SSH and Database configuration
const SSH_CONFIG = {
  host: process.env.SSH_HOST,
  port: parseInt(process.env.SSH_PORT),
  username: process.env.SSH_USER,
  password: process.env.SSH_PASSWORD,
  readyTimeout: 20000,
};

const DB_CONFIG = {
  host: '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Create SSH tunnel and database connection
let dbConnection = null;
let sshClient = null;

async function connectToDatabase() {
  return new Promise((resolve, reject) => {
    sshClient = new Client();

    sshClient.on('ready', () => {
      console.log('SSH Connection established');

      sshClient.forwardOut(
        '127.0.0.1',
        0,
        '127.0.0.1',
        3306,
        async (err, stream) => {
          if (err) {
            reject(err);
            return;
          }

          try {
            dbConnection = await mysql.createConnection({
              ...DB_CONFIG,
              stream,
            });
            console.log('Database connection established');
            resolve(dbConnection);
          } catch (error) {
            reject(error);
          }
        }
      );
    });

    sshClient.on('error', (err) => {
      console.error('SSH connection error:', err);
      reject(err);
    });

    sshClient.connect(SSH_CONFIG);
  });
}

// Initialize connection
connectToDatabase().catch(console.error);

// Middleware to check database connection
const requireDB = (req, res, next) => {
  if (!dbConnection) {
    return res.status(503).json({
      success: false,
      error: 'Database not connected. Please wait for SSH tunnel to establish.'
    });
  }
  next();
};

// Apply middleware to all admin routes
app.use('/api/admin', requireDB);

// Basic Info endpoints
app.put('/api/admin/resume/basic-info', async (req, res) => {
  try {
    const { full_name, email, phone, linkedin_url, github_url, website_url, location, summary } = req.body;

    await dbConnection.execute(
      `UPDATE resume_basic_info
       SET full_name = ?, email = ?, phone = ?, linkedin_url = ?,
           github_url = ?, website_url = ?, location = ?, summary = ?
       WHERE id = 1`,
      [full_name, email, phone, linkedin_url, github_url, website_url, location, summary]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating basic info:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Section endpoints
app.post('/api/admin/resume/sections', async (req, res) => {
  try {
    const { title, section_type, is_visible } = req.body;

    const [rows] = await dbConnection.execute(
      'SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM resume_sections'
    );
    const nextOrder = rows[0].next_order;

    const [result] = await dbConnection.execute(
      'INSERT INTO resume_sections (title, section_type, display_order, is_visible) VALUES (?, ?, ?, ?)',
      [title, section_type, nextOrder, is_visible ? 1 : 0]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/resume/sections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, section_type, is_visible } = req.body;

    await dbConnection.execute(
      'UPDATE resume_sections SET title = ?, section_type = ?, is_visible = ? WHERE id = ?',
      [title, section_type, is_visible ? 1 : 0, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/resume/sections/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await dbConnection.execute('DELETE FROM resume_sections WHERE id = ?', [id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Entry endpoints
app.post('/api/admin/resume/entries', async (req, res) => {
  try {
    const { section_id, title, subtitle, location, start_date, end_date, is_current, description } = req.body;

    const [rows] = await dbConnection.execute(
      'SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM resume_entries WHERE section_id = ?',
      [section_id]
    );
    const nextOrder = rows[0].next_order;

    const [result] = await dbConnection.execute(
      `INSERT INTO resume_entries (section_id, title, subtitle, location, start_date, end_date, is_current, description, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [section_id, title, subtitle, location, start_date, end_date, is_current ? 1 : 0, description, nextOrder]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/resume/entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, location, start_date, end_date, is_current, description } = req.body;

    await dbConnection.execute(
      `UPDATE resume_entries
       SET title = ?, subtitle = ?, location = ?, start_date = ?, end_date = ?, is_current = ?, description = ?
       WHERE id = ?`,
      [title, subtitle, location, start_date, end_date, is_current ? 1 : 0, description, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/resume/entries/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await dbConnection.execute('DELETE FROM resume_entries WHERE id = ?', [id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bullet endpoints
app.post('/api/admin/resume/bullets', async (req, res) => {
  try {
    const { entry_id, content } = req.body;

    const [rows] = await dbConnection.execute(
      'SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM resume_entry_bullets WHERE entry_id = ?',
      [entry_id]
    );
    const nextOrder = rows[0].next_order;

    const [result] = await dbConnection.execute(
      'INSERT INTO resume_entry_bullets (entry_id, content, display_order) VALUES (?, ?, ?)',
      [entry_id, content, nextOrder]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating bullet:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/resume/bullets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    await dbConnection.execute(
      'UPDATE resume_entry_bullets SET content = ? WHERE id = ?',
      [content, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating bullet:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/resume/bullets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await dbConnection.execute('DELETE FROM resume_entry_bullets WHERE id = ?', [id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting bullet:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reorder endpoint
app.put('/api/admin/resume/reorder', async (req, res) => {
  try {
    if (!dbConnection) {
      return res.status(503).json({ success: false, error: 'Database not connected' });
    }

    const { type, items } = req.body;

    const tableName = {
      sections: 'resume_sections',
      entries: 'resume_entries',
      bullets: 'resume_entry_bullets',
      projects: 'projects',
      tech_stack: 'project_tech_stack',
      components: 'project_components',
    }[type];

    if (!tableName) {
      return res.status(400).json({ success: false, error: 'Invalid type' });
    }

    await dbConnection.beginTransaction();

    // First, set all display_order to negative values to avoid conflicts
    for (const item of items) {
      await dbConnection.execute(
        `UPDATE ${tableName} SET display_order = ? WHERE id = ?`,
        [-(item.display_order + 1), item.id]
      );
    }

    // Then update to the actual positive values
    for (const item of items) {
      await dbConnection.execute(
        `UPDATE ${tableName} SET display_order = ? WHERE id = ?`,
        [item.display_order, item.id]
      );
    }

    await dbConnection.commit();

    res.json({ success: true });
  } catch (error) {
    if (dbConnection) {
      await dbConnection.rollback();
    }
    console.error('Error reordering items:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Image upload endpoint
app.post('/api/admin/upload-image', async (req, res) => {
  try {
    const { image, filename } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    // Generate unique filename
    const ext = filename ? filename.split('.').pop() : 'jpg';
    const uniqueFilename = `${crypto.randomUUID()}.${ext}`;

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueFilename,
      Body: buffer,
      ContentType: `image/${ext}`,
    });

    await r2Client.send(command);

    // Return public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${uniqueFilename}`;
    res.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Project endpoints
app.post('/api/admin/projects', async (req, res) => {
  try {
    const { name, subheading, date_started, date_ended, is_pinned, poster_image_url } = req.body;

    const [rows] = await dbConnection.execute(
      'SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM projects'
    );
    const nextOrder = rows[0].next_order;

    const [result] = await dbConnection.execute(
      `INSERT INTO projects (name, subheading, date_started, date_ended, is_pinned, poster_image_url, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, subheading, date_started, date_ended, is_pinned ? 1 : 0, poster_image_url, nextOrder]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subheading, date_started, date_ended, is_pinned, poster_image_url } = req.body;

    await dbConnection.execute(
      `UPDATE projects
       SET name = ?, subheading = ?, date_started = ?, date_ended = ?, is_pinned = ?, poster_image_url = ?
       WHERE id = ?`,
      [name, subheading, date_started, date_ended, is_pinned ? 1 : 0, poster_image_url, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, get all image URLs from this project
    const [projects] = await dbConnection.execute(
      'SELECT poster_image_url FROM projects WHERE id = ?',
      [id]
    );
    
    const [components] = await dbConnection.execute(
      'SELECT component_data FROM project_components WHERE project_id = ?',
      [id]
    );
    
    // Collect all image URLs to delete
    const imageUrls = [];
    
    // Add poster image if it exists
    if (projects[0]?.poster_image_url) {
      imageUrls.push(projects[0].poster_image_url);
    }
    
    // Extract images from components
    for (const component of components) {
      const data = component.component_data;
      
      // Check for various component types that may contain images
      if (data.image_url) {
        imageUrls.push(data.image_url);
      }
      
      if (data.images && Array.isArray(data.images)) {
        for (const img of data.images) {
          if (img.url) {
            imageUrls.push(img.url);
          }
        }
      }
    }
    
    // Delete images from R2
    for (const url of imageUrls) {
      try {
        // Extract the key from the URL (filename)
        // URL format: https://assets.romeluis.com/filename.ext
        const key = url.split('/').pop();
        
        await r2Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
          })
        );
      } catch (error) {
        console.error(`Failed to delete image ${url}:`, error);
        // Continue even if image deletion fails
      }
    }
    
    // Delete the project (CASCADE will delete related records)
    await dbConnection.execute('DELETE FROM projects WHERE id = ?', [id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tech stack endpoints
app.post('/api/admin/projects/tech-stack', async (req, res) => {
  try {
    const { project_id, name } = req.body;

    const [rows] = await dbConnection.execute(
      'SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM project_tech_stack WHERE project_id = ?',
      [project_id]
    );
    const nextOrder = rows[0].next_order;

    const [result] = await dbConnection.execute(
      'INSERT INTO project_tech_stack (project_id, name, display_order) VALUES (?, ?, ?)',
      [project_id, name, nextOrder]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating tech stack item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/projects/tech-stack/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    await dbConnection.execute(
      'UPDATE project_tech_stack SET name = ? WHERE id = ?',
      [name, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating tech stack item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/projects/tech-stack/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbConnection.execute('DELETE FROM project_tech_stack WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting tech stack item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tags endpoints
app.post('/api/admin/projects/tags', async (req, res) => {
  try {
    const { project_id, tag } = req.body;

    const [result] = await dbConnection.execute(
      'INSERT INTO project_metadata_tags (project_id, tag) VALUES (?, ?)',
      [project_id, tag]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/projects/tags/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbConnection.execute('DELETE FROM project_metadata_tags WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Component endpoints
app.post('/api/admin/projects/components', async (req, res) => {
  try {
    const { project_id, component_type, component_data } = req.body;

    const [rows] = await dbConnection.execute(
      'SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM project_components WHERE project_id = ?',
      [project_id]
    );
    const nextOrder = rows[0].next_order;

    const [result] = await dbConnection.execute(
      'INSERT INTO project_components (project_id, component_type, component_data, display_order) VALUES (?, ?, ?, ?)',
      [project_id, component_type, JSON.stringify(component_data), nextOrder]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating component:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/projects/components/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { component_type, component_data } = req.body;

    await dbConnection.execute(
      'UPDATE project_components SET component_type = ?, component_data = ? WHERE id = ?',
      [component_type, JSON.stringify(component_data), id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating component:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/projects/components/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbConnection.execute('DELETE FROM project_components WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting component:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Admin server running on http://localhost:${PORT}`);
  console.log('This server handles database operations for the configuration page');
});

// Handle cleanup
process.on('SIGINT', async () => {
  console.log('\nClosing connections...');
  if (dbConnection) await dbConnection.end();
  if (sshClient) sshClient.end();
  process.exit(0);
});
