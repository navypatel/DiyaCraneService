import express from 'express';
import path from 'path';
import fs from 'fs';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables with override
dotenv.config({ override: true });

// Robust fallback: if process.env.GOOGLE_SHEETS_KEY is still not valid JSON, parse .env file manually
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const equalIndex = trimmed.indexOf('=');
      if (equalIndex !== -1) {
        const key = trimmed.slice(0, equalIndex).trim();
        let val = trimmed.slice(equalIndex + 1).trim();
        
        // Clean matching outer quotes
        if (
          (val.startsWith("'") && val.endsWith("'")) ||
          (val.startsWith('"') && val.endsWith('"'))
        ) {
          val = val.slice(1, -1);
        }
        
        // Unescape escaped newlines safely
        val = val.replace(/\\n/g, '\n');
        
        if (key === 'GOOGLE_SHEETS_KEY' && (!process.env.GOOGLE_SHEETS_KEY || !process.env.GOOGLE_SHEETS_KEY.trim().startsWith('{'))) {
          process.env.GOOGLE_SHEETS_KEY = val;
          console.log("🔒 Google Sheets credentials key manually updated with local .env JSON.");
        }
        if (key === 'GOOGLE_SHEETS_ID' && (!process.env.GOOGLE_SHEETS_ID || process.env.GOOGLE_SHEETS_ID.includes('@') || process.env.GOOGLE_SHEETS_ID.length < 20)) {
          process.env.GOOGLE_SHEETS_ID = val;
          console.log("📊 Google Sheets ID manually updated with local .env spreadsheet ID.");
        }
      }
    }
  }
} catch (e) {
  console.error("⚠️ Error reading or manual parsing of alternative .env config:", e);
}

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json());

// Path to local server DB for fallback/robust default storage
let DB_FILE_PATH = path.join(process.cwd(), 'server_db.json');

// Serverless / Read-only filesystem mitigation (e.g., Vercel / AWS Lambda)
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  const tmpPath = path.join('/tmp', 'server_db.json');
  try {
    if (!fs.existsSync(tmpPath)) {
      if (fs.existsSync(DB_FILE_PATH)) {
        fs.copyFileSync(DB_FILE_PATH, tmpPath);
        console.log("📁 Writable database seeded successfully at /tmp/server_db.json");
      } else {
        const initialStructure = {
          entries: [],
          enquiries: [],
          failedLoginAttempts: {}
        };
        fs.writeFileSync(tmpPath, JSON.stringify(initialStructure, null, 2), 'utf-8');
        console.log("📁 Empty database structure initialized at /tmp/server_db.json");
      }
    }
    DB_FILE_PATH = tmpPath;
  } catch (err) {
    console.error("⚠️ Failed to set up serverless writable database path at /tmp/server_db.json:", err);
  }
}

// Types for DB
interface EntryRecord {
  id: string;
  projectName: string;
  serviceType: 'HYDRA' | 'FARANA';
  craneNumber: string;
  clientName: string;
  clientCompanyName: string;
  location: string;
  dateOfOperation: string;
  timeOfOperation: string;
  shiftEndTime: string;
  duration: number;
  amount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  status: 'Active' | 'Deleted';
}

interface EnquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: 'General Inquiry' | 'HYDRA' | 'FARANA';
  projectDetails: string;
  submissionDate: string;
  status: 'New' | 'In Progress' | 'Closed';
}

interface DBStructure {
  entries: EntryRecord[];
  enquiries: EnquiryRecord[];
  failedLoginAttempts: { [key: string]: { count: number; lastAttempt: number } };
}

// Initial seed data
const DEFAULT_ENTRIES: EntryRecord[] = [
  {
    id: "rec-1",
    projectName: "Atul Chemical Pipeline Shift",
    serviceType: "HYDRA",
    craneNumber: "GJ-15-Y-1201 (Hydra 12T)",
    clientName: "Mr. Rajesh Patel",
    clientCompanyName: "Atul Ltd",
    location: "Atul, Valsad",
    dateOfOperation: "2026-06-10",
    timeOfOperation: "09:30",
    shiftEndTime: "15:30",
    duration: 6,
    amount: 18000,
    notes: "Pipeline assembly shift. Safe lift completed with dual rigging.",
    createdAt: "2026-06-10T10:00:00.000Z",
    updatedAt: "2026-06-10T11:00:00.000Z",
    status: "Active"
  },
  {
    id: "rec-2",
    projectName: "Gundlav GI Truss Installs",
    serviceType: "FARANA",
    craneNumber: "GJ-15-X-1501 (Farana 15T)",
    clientName: "Mr. Ketan Mehta",
    clientCompanyName: "Shree Rama Builders",
    location: "Gundlav GIDC",
    dateOfOperation: "2026-06-12",
    timeOfOperation: "08:00",
    shiftEndTime: "18:00",
    duration: 10,
    amount: 32000,
    notes: "Erection of 6 GI Roof Trusses. FARANA F-17 used with boom extension.",
    createdAt: "2026-06-12T12:00:00.000Z",
    updatedAt: "2026-06-12T12:00:00.000Z",
    status: "Active"
  },
  {
    id: "rec-3",
    projectName: "Pardi Power Substation Upgrade",
    serviceType: "HYDRA",
    craneNumber: "GJ-15-Y-1603 (Hydra 16T)",
    clientName: "Mr. Navneet Shah",
    clientCompanyName: "GE T&D India",
    location: "Pardi, Valsad",
    dateOfOperation: "2026-06-14",
    timeOfOperation: "13:45",
    shiftEndTime: "17:45",
    duration: 4,
    amount: 15000,
    notes: "Transformer swap. Heavy-lift safety clearances validated prior to maneuver.",
    createdAt: "2026-06-14T14:00:00.000Z",
    updatedAt: "2026-06-14T14:30:00.000Z",
    status: "Active"
  },
  {
    id: "rec-4",
    projectName: "Valsad Overbridge Girder Yard Shifting",
    serviceType: "FARANA",
    craneNumber: "GJ-15-X-2003 (Farana 20T)",
    clientName: "Mr. Manish Solanki",
    clientCompanyName: "L&T Infrastructure",
    location: "Valsad Halar Road",
    dateOfOperation: "2026-06-16",
    timeOfOperation: "21:00",
    shiftEndTime: "05:00",
    duration: 8,
    amount: 45000,
    notes: "Night operations shift. Shifting 3 girder slabs to concrete beds.",
    createdAt: "2026-06-16T22:00:00.000Z",
    updatedAt: "2026-06-16T22:00:00.000Z",
    status: "Active"
  }
];

const DEFAULT_ENQUIRIES: EnquiryRecord[] = [
  {
    id: "enq-1",
    name: "Manish Solanki",
    email: "manish.s@solarfield.com",
    phone: "9824996999",
    service: "FARANA",
    projectDetails: "Need 20T FARANA crane for unloading machine containers inside factory shed from June 24th.",
    submissionDate: "2026-06-11T11:20:00.000Z",
    status: "New"
  },
  {
    id: "enq-2",
    name: "Ketan Mehta",
    email: "kmehta@mehtaconstruction.co.in",
    phone: "9124455823",
    service: "HYDRA",
    projectDetails: "General steel truss structure setup in Pardi. Estimate required for 3 days of booking.",
    submissionDate: "2026-06-15T15:40:00.000Z",
    status: "In Progress"
  },
  {
    id: "enq-3",
    name: "Ramesh Bhai",
    email: "ramesh@suratceramics.net",
    phone: "9879051632",
    service: "HYDRA",
    projectDetails: "Need regular crane for shifting raw clay bags in GIDC area.",
    submissionDate: "2026-06-16T09:12:00.000Z",
    status: "Closed"
  }
];

// Initialize JSON database helper
function loadDB(): DBStructure {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const loaded = JSON.parse(content);
      // Ensure necessary fields exist with seed fallback
      if (!loaded.entries || loaded.entries.length === 0) loaded.entries = DEFAULT_ENTRIES;
      if (!loaded.enquiries || loaded.enquiries.length === 0) loaded.enquiries = DEFAULT_ENQUIRIES;
      if (!loaded.failedLoginAttempts) loaded.failedLoginAttempts = {};

      // Auto schema migration for new fields (clientCompanyName, shiftEndTime, craneNumber)
      let isMigrated = false;
      loaded.entries = loaded.entries.map((e: any) => {
        let isChanged = false;
        if (!e.clientCompanyName) {
          if (e.clientName) {
            e.clientCompanyName = e.clientName;
            e.clientName = "Mr. Rajesh Patel"; // local contact default
          } else {
            e.clientCompanyName = "Atul Ltd";
            e.clientName = "Mr. Rajesh Patel";
          }
          isChanged = true;
        }
        if (!e.shiftEndTime) {
          e.shiftEndTime = "17:00";
          isChanged = true;
        }
        if (!e.craneNumber) {
          e.craneNumber = e.serviceType === "FARANA" ? "GJ-15-X-1501 (Farana 15T)" : "GJ-15-Y-1201 (Hydra 12T)";
          isChanged = true;
        }
        if (isChanged) isMigrated = true;
        return e;
      });
      if (isMigrated) {
        saveDB(loaded);
      }

      return loaded;
    }
  } catch (error) {
    console.error("Failed to read server_db.json, falling back to seed", error);
  }

  // Seed default DB structure if file doesn't exist or is invalid
  const initialStructure: DBStructure = {
    entries: DEFAULT_ENTRIES,
    enquiries: DEFAULT_ENQUIRIES,
    failedLoginAttempts: {}
  };
  saveDB(initialStructure);
  return initialStructure;
}

function saveDB(data: DBStructure) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Failed to write to server_db.json", error);
  }
}

// Lazy loaded Google Sheets client initialization
let sheetsInstance: any = null;
async function getSheetsService() {
  if (sheetsInstance) return sheetsInstance;
  
  const gSheetsKeyEnv = process.env.GOOGLE_SHEETS_KEY;
  const gSheetsIdEnv = process.env.GOOGLE_SHEETS_ID;
  
  if (!gSheetsKeyEnv || !gSheetsIdEnv) {
    console.log("🟡 Google Sheets variables not fully configured (GOOGLE_SHEETS_KEY or GOOGLE_SHEETS_ID missing). App will fall back to server_db.json local transactions.");
    return null;
  }

  // Fail-safe protection against non-JSON format credentials (such as raw fingerprints/placeholders)
  if (!gSheetsKeyEnv.trim().startsWith('{')) {
    console.log("ℹ️ GOOGLE_SHEETS_KEY is not a JSON object, falling back safely to local server_db.json.");
    return null;
  }

  try {
    const creds = JSON.parse(gSheetsKeyEnv);
    const auth = new google.auth.JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    sheetsInstance = google.sheets({ version: 'v4', auth });
    return sheetsInstance;
  } catch (error) {
    console.log("ℹ️ Failed to parse Google Sheets credentials JSON, falling back safely to local server_db.json.");
    return null;
  }
}

// Google Sheets Self-Healing Table Initialization
async function initializeSheetsIfEmpty() {
  const service = await getSheetsService();
  if (!service) return;

  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  
  // Check Entries sheet
  try {
    await service.spreadsheets.values.get({
      spreadsheetId,
      range: 'Entries!A1:B1'
    });
  } catch (err: any) {
    console.log("Entries sheet not found or empty, attempting automatic database tab schema bootstrap...");
    try {
      await service.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            { addSheet: { properties: { title: 'Entries' } } },
            { addSheet: { properties: { title: 'Enquiries' } } }
          ]
        }
      });
    } catch (e) {
      console.log("Sheet names might already exist, continuing to write entries headers...");
    }

    try {
      await service.spreadsheets.values.update({
        spreadsheetId,
        range: 'Entries!A1:P1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            'id', 'projectName', 'serviceType', 'craneNumber', 'clientName',
            'clientCompanyName', 'location', 'dateOfOperation', 'timeOfOperation',
            'shiftEndTime', 'duration', 'amount', 'notes', 'createdAt', 'updatedAt', 'status'
          ]]
        }
      });

      // Write default entries as initial seeds
      const seedRows = DEFAULT_ENTRIES.map(record => [
        record.id,
        record.projectName,
        record.serviceType,
        record.craneNumber || 'N/A',
        record.clientName,
        record.clientCompanyName,
        record.location,
        record.dateOfOperation,
        record.timeOfOperation,
        record.shiftEndTime,
        record.duration,
        record.amount || '',
        record.notes || '',
        record.createdAt,
        record.updatedAt,
        record.status
      ]);

      await service.spreadsheets.values.append({
        spreadsheetId,
        range: 'Entries!A2',
        valueInputOption: 'RAW',
        requestBody: { values: seedRows }
      });
    } catch (writeErr) {
      console.error("Failed to seed default database entries list:", writeErr);
    }
  }

  // Check Enquiries sheet
  try {
    await service.spreadsheets.values.get({
      spreadsheetId,
      range: 'Enquiries!A1:B1'
    });
  } catch (err: any) {
    console.log("Enquiries sheet not found or empty, initiating enquiries tab structural configuration...");
    try {
      await service.spreadsheets.values.update({
        spreadsheetId,
        range: 'Enquiries!A1:H1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[
            'id', 'name', 'email', 'phone', 'service', 'projectDetails', 'submissionDate', 'status'
          ]]
        }
      });

      const seedEnquiries = DEFAULT_ENQUIRIES.map(record => [
        record.id,
        record.name,
        record.email,
        record.phone,
        record.service,
        record.projectDetails,
        record.submissionDate,
        record.status
      ]);

      await service.spreadsheets.values.append({
        spreadsheetId,
        range: 'Enquiries!A2',
        valueInputOption: 'RAW',
        requestBody: { values: seedEnquiries }
      });
    } catch (writeErr) {
      console.error("Failed to seed default queries enquiries record list:", writeErr);
    }
  }
}

// Fetch Entries directly from Google Sheets rows
async function fetchEntriesFromSheets(): Promise<EntryRecord[]> {
  const service = await getSheetsService();
  if (!service) return [];
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  try {
    const response = await service.spreadsheets.values.get({
      spreadsheetId,
      range: 'Entries!A2:P1000'
    });
    const rows = response.data.values || [];
    return rows.map((row: any) => ({
      id: row[0] || '',
      projectName: row[1] || '',
      serviceType: (row[2] || 'HYDRA') as 'HYDRA' | 'FARANA',
      craneNumber: row[3] === 'N/A' ? '' : (row[3] || ''),
      clientName: row[4] || '',
      clientCompanyName: row[5] || '',
      location: row[6] || '',
      dateOfOperation: row[7] || '',
      timeOfOperation: row[8] || '',
      shiftEndTime: row[9] || '',
      duration: parseFloat(row[10]) || 0,
      amount: row[11] ? parseFloat(row[11]) : undefined,
      notes: row[12] || '',
      createdAt: row[13] || new Date().toISOString(),
      updatedAt: row[14] || new Date().toISOString(),
      status: (row[15] || 'Active') as 'Active' | 'Deleted'
    })).filter(e => e.id); // Guard empty rows
  } catch (error) {
    console.error("Error loading entries list from Google Sheets:", error);
    return [];
  }
}

// Fetch Enquiries directly from Google Sheets rows
async function fetchEnquiriesFromSheets(): Promise<EnquiryRecord[]> {
  const service = await getSheetsService();
  if (!service) return [];
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  try {
    const response = await service.spreadsheets.values.get({
      spreadsheetId,
      range: 'Enquiries!A2:H1000'
    });
    const rows = response.data.values || [];
    return rows.map((row: any) => ({
      id: row[0] || '',
      name: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      service: row[4] || '',
      projectDetails: row[5] || '',
      submissionDate: row[6] || new Date().toISOString(),
      status: (row[7] || 'New') as 'New' | 'In Progress' | 'Closed'
    })).filter(e => e.id); // Guard empty rows
  } catch (error) {
    console.error("Error loading enquiries list from Google Sheets:", error);
    return [];
  }
}

// Save complete Entries back to Google Sheets (Overwrite logic to maintain safe deletes/updates)
async function saveEntriesToSheets(entries: EntryRecord[]) {
  const service = await getSheetsService();
  if (!service) return;
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  try {
    const rows = [
      ['id', 'projectName', 'serviceType', 'craneNumber', 'clientName',
       'clientCompanyName', 'location', 'dateOfOperation', 'timeOfOperation',
       'shiftEndTime', 'duration', 'amount', 'notes', 'createdAt', 'updatedAt', 'status'],
      ...entries.map(record => [
        record.id,
        record.projectName,
        record.serviceType,
        record.craneNumber || 'N/A',
        record.clientName,
        record.clientCompanyName,
        record.location,
        record.dateOfOperation,
        record.timeOfOperation,
        record.shiftEndTime,
        record.duration,
        record.amount || '',
        record.notes || '',
        record.createdAt,
        record.updatedAt,
        record.status
      ])
    ];

    await service.spreadsheets.values.clear({
      spreadsheetId,
      range: 'Entries!A1:P1000'
    });

    await service.spreadsheets.values.update({
      spreadsheetId,
      range: 'Entries!A1',
      valueInputOption: 'RAW',
      requestBody: { values: rows }
    });
    console.log("Successfully rewrote entries list onto Google Sheets");
  } catch (error) {
    console.error("Error saving rewrite records entries list to Google Sheets:", error);
  }
}

// Save complete Enquiries back to Google Sheets
async function saveEnquiriesToSheets(enquiries: EnquiryRecord[]) {
  const service = await getSheetsService();
  if (!service) return;
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  try {
    const rows = [
      ['id', 'name', 'email', 'phone', 'service', 'projectDetails', 'submissionDate', 'status'],
      ...enquiries.map(record => [
        record.id,
        record.name,
        record.email,
        record.phone,
        record.service,
        record.projectDetails,
        record.submissionDate,
        record.status
      ])
    ];

    await service.spreadsheets.values.clear({
      spreadsheetId,
      range: 'Enquiries!A1:H1000'
    });

    await service.spreadsheets.values.update({
      spreadsheetId,
      range: 'Enquiries!A1',
      valueInputOption: 'RAW',
      requestBody: { values: rows }
    });
    console.log("Successfully rewrote enquiries queries database to Google Sheets");
  } catch (error) {
    console.error("Error saving rewrite enquiries record list to Google Sheets:", error);
  }
}

// Combined Sync Source-Of-Truth Interface
let memoizedDB: DBStructure | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 3000; // 3 seconds cached to prevent API rate exhaustion over rapid client actions

async function getCombinedDB(): Promise<DBStructure> {
  const service = await getSheetsService();
  if (!service) {
    return loadDB();
  }

  const now = Date.now();
  if (memoizedDB && (now - lastFetchTime < CACHE_TTL)) {
    return memoizedDB;
  }

  await initializeSheetsIfEmpty();

  const [entries, enquiries] = await Promise.all([
    fetchEntriesFromSheets(),
    fetchEnquiriesFromSheets()
  ]);

  const localDB = loadDB(); // keeps failed login rate limiter logs persistent locally
  
  memoizedDB = {
    entries: entries.length > 0 ? entries : localDB.entries,
    enquiries: enquiries.length > 0 ? enquiries : localDB.enquiries,
    failedLoginAttempts: localDB.failedLoginAttempts || {}
  };
  lastFetchTime = now;

  return memoizedDB;
}

async function writeDB(db: DBStructure) {
  memoizedDB = db;
  lastFetchTime = Date.now();

  const service = await getSheetsService();
  if (!service) {
    saveDB(db);
    return;
  }

  // Backup rate limit logins state locally
  saveDB({
    entries: db.entries,
    enquiries: db.enquiries,
    failedLoginAttempts: db.failedLoginAttempts
  });

  // Complete asynchronous parallel storage back onto sheets
  await Promise.all([
    saveEntriesToSheets(db.entries),
    saveEnquiriesToSheets(db.enquiries)
  ]);
}


// Middleware: Session Check
// Simple cookie-based mock session for reliability in IFRAME
app.use((req, res, next) => {
  // Simple cookie parsing
  const cookieHeader = req.headers.cookie || '';
  const dcsAdminSession = cookieHeader
    .split('; ')
    .find(row => row.startsWith('dcs_admin_session='));
  
  if (dcsAdminSession) {
    (req as any).isAdmin = dcsAdminSession.split('=')[1] === 'active_session_dataentry';
  } else {
    (req as any).isAdmin = false;
  }
  next();
});

// Admin Auth Guards
const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!(req as any).isAdmin) {
    return res.status(401).json({ error: "Access denied. Private resource. Please authenticate." });
  }
  next();
};

// ---------------- API ENDPOINTS ----------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get Session Status
app.get('/api/auth/session', (req, res) => {
  if ((req as any).isAdmin) {
    res.json({
      authenticated: true,
      user: {
        username: "dataentry",
        name: "Data Entry Staff",
        role: "Operator"
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip || 'unknown';

  const db = await getCombinedDB();
  const attemptRecord = db.failedLoginAttempts[ip] || { count: 0, lastAttempt: 0 };
  const currentTime = Date.now();

  // Rate limit: 5 failed attempts per 15 minutes (900000ms)
  if (attemptRecord.count >= 5 && currentTime - attemptRecord.lastAttempt < 900000) {
    const minutesLeft = Math.ceil((900000 - (currentTime - attemptRecord.lastAttempt)) / 60000);
    return res.status(429).json({ 
      error: `Too many login attempts. Please try again in ${minutesLeft} minutes.` 
    });
  }

  if (username === 'dataentry' && password === 'dcs1234') {
    // Correct login - Clear failed attempts
    db.failedLoginAttempts[ip] = { count: 0, lastAttempt: 0 };
    await writeDB(db);

    // Set secure session cookie
    res.setHeader('Set-Cookie', 'dcs_admin_session=active_session_dataentry; HttpOnly; Path=/; Max-Age=604800; SameSite=None; Secure');
    return res.json({
      success: true,
      user: {
        username: "dataentry",
        name: "Data Entry Staff",
        role: "Operator"
      }
    });
  } else {
    // Failed logic - Increment rate limiting Counter
    attemptRecord.count += 1;
    attemptRecord.lastAttempt = currentTime;
    db.failedLoginAttempts[ip] = attemptRecord;
    await writeDB(db);

    const attemptsRemaining = Math.max(0, 5 - attemptRecord.count);
    return res.status(400).json({ 
      error: `Invalid username or password. ${attemptsRemaining} attempts remaining.` 
    });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'dcs_admin_session=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure');
  res.json({ success: true });
});

// Contact - Submit Enquiry
app.post('/api/sheets/submit-enquiry', async (req, res) => {
  const { name, email, phone, service, projectDetails } = req.body;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({ error: "Name is required (minimum 3 characters)" });
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "A valid email format is required" });
  }
  // Accepts 10 digits as is, or optionally with '+' or '91' prefix
  if (!phone || !/^(?:\+?91)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ''))) {
    return res.status(400).json({ error: "Please enter a valid 10-digit Indian phone number" });
  }
  if (!service || !['General Inquiry', 'HYDRA', 'FARANA'].includes(service)) {
    return res.status(400).json({ error: "Select a valid Service requested" });
  }
  if (!projectDetails || projectDetails.trim().length < 10) {
    return res.status(400).json({ error: "Please write project details (minimum 10 characters)" });
  }

  const db = await getCombinedDB();
  const newEnquiry: EnquiryRecord = {
    id: `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    service,
    projectDetails: projectDetails.trim(),
    submissionDate: new Date().toISOString(),
    status: 'New'
  };

  db.enquiries.unshift(newEnquiry); // pre-pend to show first
  await writeDB(db);

  res.json({ success: true, message: "Enquiry submitted successfully!", id: newEnquiry.id });
});

// Admin Panel: Get Dashboard Stats
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  const db = await getCombinedDB();
  const entriesList = db.entries.filter(e => e.status !== 'Deleted');
  
  // Calculate stats
  const totalEnquiries = db.enquiries.length;
  const totalEntries = entriesList.length;

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthlyOps = entriesList.filter(e => e.dateOfOperation.startsWith(currentMonthStr)).length;

  // Last 7 days enquiries
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentEnqs = db.enquiries.filter(e => new Date(e.submissionDate).getTime() > sevenDaysAgo).length;

  res.json({
    totalEnquiries,
    totalEntries,
    monthlyOperations: monthlyOps,
    recentEnquiriesCount: recentEnqs,
    recentEnquiries: db.enquiries.slice(0, 5)
  });
});

// Admin Panel: Get Entries
app.get('/api/sheets/get-entries', requireAdmin, async (req, res) => {
  const db = await getCombinedDB();
  // Filter out deleted
  let results = db.entries.filter(e => e.status !== 'Deleted');

  const filter = req.query.filter as string;
  const search = req.query.search as string;

  if (filter && filter !== 'all') {
    results = results.filter(e => e.serviceType === filter);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(e => 
      e.projectName.toLowerCase().includes(q) || 
      e.clientName.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q)
    );
  }

  res.json({
    entries: results,
    total: results.length
  });
});

// Admin Panel: Get Enquiries
app.get('/api/sheets/get-enquiries', requireAdmin, async (req, res) => {
  const db = await getCombinedDB();
  let results = [...db.enquiries];

  const status = req.query.status as string;
  const search = req.query.search as string;

  if (status && status !== 'all') {
    results = results.filter(e => e.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(e => 
      e.name.toLowerCase().includes(q) || 
      e.email.toLowerCase().includes(q) ||
      e.phone.includes(q) ||
      e.projectDetails.toLowerCase().includes(q)
    );
  }

  res.json({
    enquiries: results,
    total: results.length
  });
});

// Admin Panel: Add Entry
app.post('/api/sheets/add-entry', requireAdmin, async (req, res) => {
  const { projectName, serviceType, craneNumber, clientName, clientCompanyName, location, dateOfOperation, timeOfOperation, shiftEndTime, duration, amount, notes } = req.body;

  if (!projectName || projectName.trim().length < 3) {
    return res.status(400).json({ error: "Project Name must be at least 3 characters" });
  }
  if (!serviceType || !['HYDRA', 'FARANA'].includes(serviceType)) {
    return res.status(400).json({ error: "Service Type must be either HYDRA or FARANA" });
  }
  if (!craneNumber || craneNumber.trim().length < 2) {
    return res.status(400).json({ error: "Crane Number is required (minimum 2 characters)" });
  }
  if (!clientName || clientName.trim().length < 2) {
    return res.status(400).json({ error: "Client Name must be at least 2 characters" });
  }
  if (!clientCompanyName || clientCompanyName.trim().length < 2) {
    return res.status(400).json({ error: "Client Company Name must be at least 2 characters" });
  }
  if (!location || location.trim().length < 2) {
    return res.status(400).json({ error: "Location must be at least 2 characters" });
  }
  if (!dateOfOperation) {
    return res.status(400).json({ error: "Date of Operation is required" });
  }
  if (!timeOfOperation) {
    return res.status(400).json({ error: "Shift Start Time is required" });
  }
  if (!shiftEndTime) {
    return res.status(400).json({ error: "Shift End Time is required" });
  }
  if (!duration || duration < 0.1 || duration > 24) {
    return res.status(400).json({ error: "Duration must be between 0.1 and 24 hours" });
  }

  const db = await getCombinedDB();
  const newEntry: EntryRecord = {
    id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    projectName: projectName.trim(),
    serviceType,
    craneNumber: craneNumber.trim(),
    clientName: clientName.trim(),
    clientCompanyName: clientCompanyName.trim(),
    location: location.trim(),
    dateOfOperation,
    timeOfOperation,
    shiftEndTime,
    duration: parseFloat(duration),
    amount: amount ? parseFloat(amount) : undefined,
    notes: notes ? notes.trim() : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'Active'
  };

  db.entries.unshift(newEntry);
  await writeDB(db);

  res.json({ success: true, message: "Entry added successfully!", id: newEntry.id });
});

// Admin Panel: Update Entry
app.patch('/api/sheets/update-entry', requireAdmin, async (req, res) => {
  const { id, projectName, serviceType, craneNumber, clientName, clientCompanyName, location, dateOfOperation, timeOfOperation, shiftEndTime, duration, amount, notes } = req.body;

  if (!id) return res.status(400).json({ error: "Record ID is required for updating" });

  const db = await getCombinedDB();
  const entryIndex = db.entries.findIndex(e => e.id === id);

  if (entryIndex === -1) {
    return res.status(404).json({ error: "Entry not found" });
  }

  if (projectName && projectName.trim().length < 3) {
    return res.status(400).json({ error: "Project Name must be at least 3 characters" });
  }
  if (serviceType && !['HYDRA', 'FARANA'].includes(serviceType)) {
    return res.status(400).json({ error: "Service Type must be either HYDRA or FARANA" });
  }
  if (craneNumber && craneNumber.trim().length < 2) {
    return res.status(400).json({ error: "Crane Number must be at least 2 characters" });
  }
  if (clientName && clientName.trim().length < 2) {
    return res.status(400).json({ error: "Client Name must be at least 2 characters" });
  }
  if (clientCompanyName && clientCompanyName.trim().length < 2) {
    return res.status(400).json({ error: "Client Company Name must be at least 2 characters" });
  }
  if (location && location.trim().length < 2) {
    return res.status(400).json({ error: "Location must be at least 2 characters" });
  }
  if (duration && (duration < 0.1 || duration > 24)) {
    return res.status(400).json({ error: "Duration must be between 0.1 and 24 hours" });
  }

  const oldEntry = db.entries[entryIndex];
  const updatedEntry: EntryRecord = {
    ...oldEntry,
    projectName: projectName ? projectName.trim() : oldEntry.projectName,
    serviceType: serviceType || oldEntry.serviceType,
    craneNumber: craneNumber ? craneNumber.trim() : (oldEntry.craneNumber || (serviceType === 'FARANA' ? 'GJ-15-X-1501 (Farana 15T)' : 'GJ-15-Y-1201 (Hydra 12T)')),
    clientName: clientName ? clientName.trim() : oldEntry.clientName,
    clientCompanyName: clientCompanyName ? clientCompanyName.trim() : oldEntry.clientCompanyName,
    location: location ? location.trim() : oldEntry.location,
    dateOfOperation: dateOfOperation || oldEntry.dateOfOperation,
    timeOfOperation: timeOfOperation || oldEntry.timeOfOperation,
    shiftEndTime: shiftEndTime || oldEntry.shiftEndTime,
    duration: duration ? parseFloat(duration) : oldEntry.duration,
    amount: amount !== undefined ? (amount ? parseFloat(amount) : undefined) : oldEntry.amount,
    notes: notes !== undefined ? notes.trim() : oldEntry.notes,
    updatedAt: new Date().toISOString()
  };

  db.entries[entryIndex] = updatedEntry;
  await writeDB(db);

  res.json({ success: true, message: "Entry updated successfully!" });
});

// Admin Panel: Delete Entry
app.delete('/api/sheets/delete-entry', requireAdmin, async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Record ID is required for deletion" });

  const db = await getCombinedDB();
  const entryIndex = db.entries.findIndex(e => e.id === id);

  if (entryIndex === -1) {
    return res.status(404).json({ error: "Entry not found" });
  }

  // Soft delete as requested optionally, or physical deletion. Soft delete ensures historical audit logs function:
  db.entries[entryIndex].status = 'Deleted';
  db.entries[entryIndex].updatedAt = new Date().toISOString();
  await writeDB(db);

  res.json({ success: true, message: "Entry successfully deleted" });
});

// Admin Panel: Update Enquiry Status
app.patch('/api/sheets/update-entry-status', requireAdmin, async (req, res) => {
  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ error: "ID and Status are required" });
  }
  if (!['New', 'In Progress', 'Closed'].includes(status)) {
    return res.status(400).json({ error: "Invalid status code" });
  }

  const db = await getCombinedDB();
  const eqIndex = db.enquiries.findIndex(e => e.id === id);

  if (eqIndex === -1) {
    return res.status(404).json({ error: "Enquiry not found" });
  }

  db.enquiries[eqIndex].status = status;
  await writeDB(db);

  res.json({ success: true, message: "Enquiry status updated successfully" });
});

// Admin Panel: Delete Enquiry (Physical/Soft delete)
app.delete('/api/sheets/delete-enquiry', requireAdmin, async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Enquiry ID is required" });

  const db = await getCombinedDB();
  const eqIndex = db.enquiries.findIndex(e => e.id === id);

  if (eqIndex === -1) {
    return res.status(404).json({ error: "Enquiry not found" });
  }

  db.enquiries.splice(eqIndex, 1);
  await writeDB(db);

  res.json({ success: true, message: "Enquiry successfully deleted" });
});


// ---------------- CLIENT ROUTE SERVING ----------------

const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for smooth developer mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production ready static outputs from built dist file
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // Serve index.html under spa fallback routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Diya Crane Service backend standing by at http://0.0.0.0:${PORT}`);
  });
};

if (!process.env.VERCEL) {
  startServer().catch(err => {
    console.error("Critical server bootstrap collapse:", err);
  });
}

export default app;
