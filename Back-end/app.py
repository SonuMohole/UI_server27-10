import base64
import hashlib
import io
import math  # Added for pagination calculation
import os
import secrets
import subprocess
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import List, Optional

import psycopg2
import requests
# 🚀 FIX: Corrected the multi-line import syntax
from fastapi import Query  # Added Query
from fastapi import (Depends, FastAPI, Form, HTTPException, Request, Response,
                     status)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import (FileResponse, HTMLResponse, JSONResponse,
                               RedirectResponse)
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from psycopg2.extras import Json, RealDictCursor
from pydantic import BaseModel, Field

# --------------------------------------------------------------------------------------
# CONFIGURATION
# --------------------------------------------------------------------------------------

# --- Removed Security, JWT, reCAPTCHA, and User Config ---

# --- Directory Config ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILES_DIR = os.path.join(BASE_DIR, "files")
TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
STATIC_DIR = os.path.join(BASE_DIR, "static")

# Ensure folders exist
os.makedirs(FILES_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)


# --- App Logic Config ---
agent_ips = ["http://192.168.1.20:9000/report"]
ALLOWED_DOWNLOADS = {"windows": "QS-Setup.exe", "ubuntu": "qs-agent_1.0.0_all.deb", "mac": "mac_agent"}
DOWNLOAD_TOKENS = {}
DB_CONFIG = {"dbname": "assetdb", "user": "postgres", "password": "root", "host": "localhost", "port": 5432}
ACTIVE_THRESHOLD_SECONDS = 10


# --------------------------------------------------------------------------------------
# FASTAPI APP LIFESPAN & SETUP
# --------------------------------------------------------------------------------------

def init_db():
    """Create required tables if they don't exist."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS agents (
            agent_uuid TEXT PRIMARY KEY, hostname TEXT, os_name TEXT,
            machine_type TEXT, ip_address TEXT, first_seen TIMESTAMP NOT NULL DEFAULT NOW(),
            last_heartbeat TIMESTAMP NOT NULL
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS assets (
            hostname TEXT PRIMARY KEY, username TEXT, os TEXT, os_version TEXT,
            cpu TEXT, memory_gb DOUBLE PRECISION, disk_gb DOUBLE PRECISION,
            uptime_seconds BIGINT, ip_addresses TEXT, open_ports JSONB,
            software TEXT, vmware_vms JSONB, ip_reporter TEXT, collected_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    """)
    
    # --- MODIFIED MIGRATION BLOCK ---
    try:
        cur.execute("""
            ALTER TABLE agents
            ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'Medium';
        """)
        print("✅ Priority column migration checked/applied.")
        
        # ADDED: New columns for Internet Facing and Department
        cur.execute("""
            ALTER TABLE agents
            ADD COLUMN IF NOT EXISTS is_internet_facing BOOLEAN NOT NULL DEFAULT FALSE;
        """)
        print("✅ 'is_internet_facing' column migration checked/applied.")

        cur.execute("""
            ALTER TABLE agents
            ADD COLUMN IF NOT EXISTS department TEXT NOT NULL DEFAULT 'Unassigned';
        """)
        print("✅ 'department' column migration checked/applied.")
        
    except Exception as e:
        print(f"⚠️ Error adding new columns: {e}")
        conn.rollback()
    # --- END MODIFIED BLOCK ---

    conn.commit()
    cur.close()
    conn.close()
    print("✅ Database initialized.")
    
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Code to run on startup
    print("🚀 Server starting up...")
    init_db()
    yield
    # Code to run on shutdown
    print("🛑 Server shutting down...")

app = FastAPI(lifespan=lifespan)

# ==============================================================================
# CORS MIDDLEWARE
# ==============================================================================
# This allows your React app to make requests to this backend.
# ==============================================================================
# CORS MIDDLEWARE
# ==============================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # This is your React app
        "http://localhost:8080",  # Old port, good to keep
        "http://localhost:5173",  # Another common React port
    ],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)
# ==============================================================================


# Mount static files and templates
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=TEMPLATES_DIR)


# --------------------------------------------------------------------------------------
# PYDANTIC MODELS (FOR DATA VALIDATION)
# --------------------------------------------------------------------------------------
class HeartbeatPayload(BaseModel):
    agent_uuid: str
    hostname: Optional[str] = None
    os_name: Optional[str] = None
    machine_type: Optional[str] = None

class AssetPayload(BaseModel):
    hostname: Optional[str] = None
    username: Optional[str] = None
    os: Optional[str] = None
    os_version: Optional[str] = None
    cpu: Optional[str] = None
    memory_gb: Optional[float] = Field(None, alias='ram', alias_priority=2)
    disk_gb: Optional[float] = Field(None, alias='hdd', alias_priority=2)
    uptime_seconds: Optional[int] = 0
    ip_addresses: Optional[List[str]] = []
    software: Optional[List[str]] = []
    open_ports: Optional[list] = []
    vmware_vms: Optional[list] = []


# --------------------------------------------------------------------------------------
# DB & AUTH DEPENDENCIES
# --------------------------------------------------------------------------------------
def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

def get_db():
    db = get_db_connection()
    try:
        yield db
    finally:
        db.close()

# --- Removed create_access_token, get_current_user, and get_user_for_html ---


# --------------------------------------------------------------------------------------
# HELPER FUNCTIONS
# --------------------------------------------------------------------------------------
def sha256_of_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""): h.update(chunk)
    return h.hexdigest()

def flatten_agent_payload(data: AssetPayload) -> dict:
    """Normalize the agent JSON into the schema we store in `assets`."""
    return {
        "hostname": data.hostname, "username": data.username, "os": data.os,
        "os_version": data.os_version, "cpu": data.cpu,
        "memory_gb": data.memory_gb, "disk_gb": data.disk_gb,
        "uptime_seconds": data.uptime_seconds,
        "ip_addresses": ", ".join(data.ip_addresses) if data.ip_addresses else None,
        "software": ", ".join(data.software) if data.software else None,
        "open_ports_json": data.open_ports, "vmware_vms_json": data.vmware_vms,
    }

def upsert_asset_record(flat: dict, reporter_ip: Optional[str] = None, conn=Depends(get_db)):
    """Insert/update latest info for a hostname into `assets`."""
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO assets (hostname, username, os, os_version, cpu, memory_gb, disk_gb, uptime_seconds, ip_addresses, open_ports, software, vmware_vms, ip_reporter, collected_at)
        VALUES (%(hostname)s, %(username)s, %(os)s, %(os_version)s, %(cpu)s, %(memory_gb)s, %(disk_gb)s, %(uptime_seconds)s, %(ip_addresses)s, %(open_ports)s, %(software)s, %(vmware_vms)s, %(ip_reporter)s, NOW())
        ON CONFLICT (hostname) DO UPDATE SET
            username = EXCLUDED.username, os = EXCLUDED.os, os_version = EXCLUDED.os_version, cpu = EXCLUDED.cpu, memory_gb = EXCLUDED.memory_gb, disk_gb = EXCLUDED.disk_gb, uptime_seconds = EXCLUDED.uptime_seconds, ip_addresses = EXCLUDED.ip_addresses, open_ports = EXCLUDED.open_ports, software = EXCLUDED.software, vmware_vms = EXCLUDED.vmware_vms, ip_reporter = EXCLUDED.ip_reporter, collected_at = NOW();
    """, {
        "hostname": flat.get("hostname"), "username": flat.get("username"), "os": flat.get("os"),
        "os_version": flat.get("os_version"), "cpu": flat.get("cpu"), "memory_gb": flat.get("memory_gb"),
        "disk_gb": flat.get("disk_gb"), "uptime_seconds": flat.get("uptime_seconds"), "ip_addresses": flat.get("ip_addresses"),
        "open_ports": Json(flat.get("open_ports_json", [])), "software": flat.get("software"),
        "vmware_vms": Json(flat.get("vmware_vms_json", [])), "ip_reporter": reporter_ip,
    })
    conn.commit()
    cur.close()

# --------------------------------------------------------------------------------------
# AUTH & BASIC PAGE ROUTES
# --------------------------------------------------------------------------------------
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    # This route now redirects to your React App.
    # Change this URL if your React app runs on a different port.
    return RedirectResponse(url="http://localhost:3000") # 🚀 Pointed to your React port


# --- Removed /login and /logout routes ---


@app.get("/priority_dashboard", response_class=HTMLResponse)
def priority_dashboard(
    request: Request,
    # user: Optional[dict] = Depends(get_user_for_html), # Removed Auth
    conn=Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    sort_by: str = Query("priority", enum=["priority", "heartbeat", "hostname", "department", "is_internet_facing"]),
    sort_order: str = Query("asc", enum=["asc", "desc"])
):
    # if not user: return RedirectResponse(url="/") # Removed Auth
    
    offset = (page - 1) * limit
    cur = conn.cursor(cursor_factory=RealDictCursor)

    base_query = """
        FROM agents a INNER JOIN (
            SELECT hostname, MAX(last_heartbeat) AS max_hb FROM agents GROUP BY hostname
        ) b ON a.hostname = b.hostname AND a.last_heartbeat = b.max_hb
    """
    cur.execute(f"SELECT COUNT(a.agent_uuid) AS total {base_query};")
    total_records = cur.fetchone()['total']
    total_pages = math.ceil(total_records / limit) if total_records > 0 else 1
    sort_column_map = {
        "priority": "a.priority", "heartbeat": "a.last_heartbeat",
        "hostname": "a.hostname", "department": "a.department",
        "is_internet_facing": "a.is_internet_facing"
    }
    primary_sort = sort_column_map.get(sort_by, "a.priority")
    secondary_sort = "a.last_heartbeat DESC"
    if sort_by == "priority": secondary_sort = "a.last_heartbeat DESC"
    elif sort_by == "heartbeat": secondary_sort = "a.priority ASC"
    elif sort_by == "hostname": secondary_sort = "a.priority ASC"
    elif sort_by == "department": secondary_sort = "a.priority ASC"
    elif sort_by == "is_internet_facing": secondary_sort = "a.priority ASC"
    order = "ASC" if sort_order == "asc" else "DESC"
    order_by_clause = f"ORDER BY {primary_sort} {order}, {secondary_sort}"
    cur.execute(f"SELECT a.* {base_query} {order_by_clause} LIMIT %s OFFSET %s;", (limit, offset))
    agents = cur.fetchall()
    cur.close()
    now_utc = datetime.now(timezone.utc)
    for agent in agents:
        last_hb_aware = agent["last_heartbeat"].replace(tzinfo=timezone.utc)
        diff = (now_utc - last_hb_aware).total_seconds()
        agent["status"] = "Active" if diff <= ACTIVE_THRESHOLD_SECONDS else "Inactive"

    return templates.TemplateResponse(
        "priority_dashboard.html", {
            "request": request, "agents": agents,
            "current_page": page, "total_pages": total_pages,
            "limit": limit, "user": None, # Set user to None
            "sort_by": sort_by, "sort_order": sort_order
        })

@app.post("/update_agent_details")
def update_agent_details(
    request: Request,
    # user: Optional[dict] = Depends(get_current_user), # Removed Auth
    agent_uuid: str = Form(...),
    priority: str = Form(...),
    department: str = Form(...),
    is_internet_facing: str = Form(...), 
    conn=Depends(get_db)
):
    # if not user: return RedirectResponse(url="/") # Removed Auth

    if priority not in ['High', 'Medium', 'Low']:
        return RedirectResponse(url=request.headers.get("referer", "/priority_dashboard"), status_code=status.HTTP_303_SEE_OTHER)
    if is_internet_facing not in ['true', 'false']:
        return RedirectResponse(url=request.headers.get("referer", "/priority_dashboard"), status_code=status.HTTP_303_SEE_OTHER)

    is_facing_bool = is_internet_facing.lower() == 'true'
    clean_department = department.strip()
    if not clean_department:
        clean_department = "Unassigned"

    try:
        cur = conn.cursor()
        cur.execute(
            """
            UPDATE agents 
            SET priority = %s, department = %s, is_internet_facing = %s 
            WHERE agent_uuid = %s
            """,
            (priority, clean_department, is_facing_bool, agent_uuid)
        )
        conn.commit()
        cur.close()
    except Exception as e:
        print(f"Error updating agent details: {e}")
        conn.rollback()

    referer = request.headers.get("referer", "/priority_dashboard")
    return RedirectResponse(url=referer, status_code=status.HTTP_303_SEE_OTHER)

# --------------------------------------------------------------------------------------
# DASHBOARD & DATA ROUTES
# --------------------------------------------------------------------------------------
@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(
    request: Request,
    # user: Optional[dict] = Depends(get_user_for_html), # Removed Auth
    conn=Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200)
):
    # if not user: return RedirectResponse(url="/") # Removed Auth

    offset = (page - 1) * limit
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT COUNT(*) AS total FROM assets;")
    total_records = cur.fetchone()['total']
    total_pages = math.ceil(total_records / limit) if total_records > 0 else 1
    cur.execute(
        """
        SELECT hostname, username, os, os_version, cpu, memory_gb, disk_gb,
                uptime_seconds, ip_addresses, collected_at
        FROM assets ORDER BY hostname ASC LIMIT %s OFFSET %s;
        """,
        (limit, offset)
    )
    assets = cur.fetchall()
    cur.close()

    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request, "assets": assets,
            "user": None, # Set user to None
            "current_page": page, "total_pages": total_pages,
            "limit": limit
        }
    )

# 🚀 =============================================================================
# 🚀 MODIFIED API ENDPOINT
# 🚀 This now JOINS assets and agents to send the "risk" data your frontend needs.
# 🚀 =============================================================================
@app.get("/api/assets", response_class=JSONResponse)
def get_assets_data(
    # user: Optional[dict] = Depends(get_current_user), # Removed Auth
    conn=Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200)
):
    offset = (page - 1) * limit
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # First, get the total count of assets
    cur.execute("SELECT COUNT(*) AS total FROM assets;")
    total_records = cur.fetchone()['total']
    total_pages = math.ceil(total_records / limit) if total_records > 0 else 1
    
    # 🚀 MODIFIED QUERY:
    # This query joins the assets table with the latest priority from the agents table.
    # COALESCE is used to set a default 'risk' if no agent record is found.
    cur.execute(
        """
        SELECT 
            ast.hostname, ast.username, ast.os, ast.os_version, ast.cpu, 
            ast.memory_gb, ast.disk_gb, ast.uptime_seconds, ast.ip_addresses, 
            ast.collected_at,
            COALESCE(latest_agent.priority, 'Medium') AS risk 
        FROM 
            assets ast
        LEFT JOIN (
            -- Subquery to get only the latest priority for each hostname
            SELECT DISTINCT ON (hostname) 
                   hostname, priority
            FROM agents
            ORDER BY hostname, last_heartbeat DESC
        ) AS latest_agent ON ast.hostname = latest_agent.hostname
        ORDER BY 
            ast.hostname ASC 
        LIMIT %s OFFSET %s;
        """,
        (limit, offset)
    )
    assets = cur.fetchall()
    cur.close()

    return {
        "assets": assets,
        "current_page": page,
        "total_pages": total_pages,
    }
# 🚀 =============================================================================
# 🚀 END OF MODIFIED ENDPOINT
# 🚀 =============================================================================


@app.get("/server_dashboard", response_class=HTMLResponse)
def server_dashboard(
    request: Request,
    # user: Optional[dict] = Depends(get_user_for_html), # Removed Auth
    conn=Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200)
):
    # if not user: return RedirectResponse(url="/") # Removed Auth

    offset = (page - 1) * limit
    cur = conn.cursor(cursor_factory=RealDictCursor)
    base_query = """
        FROM agents a INNER JOIN (
            SELECT hostname, MAX(last_heartbeat) AS max_hb FROM agents GROUP BY hostname
        ) b ON a.hostname = b.hostname AND a.last_heartbeat = b.max_hb
    """
    cur.execute(f"SELECT COUNT(a.agent_uuid) AS total {base_query};")
    total_records = cur.fetchone()['total']
    total_pages = math.ceil(total_records / limit) if total_records > 0 else 1
    cur.execute(f"SELECT a.* {base_query} ORDER BY a.last_heartbeat DESC LIMIT %s OFFSET %s;", (limit, offset))
    agents = cur.fetchall()
    cur.execute("SELECT MAX(last_heartbeat) as latest_hb FROM agents;")
    latest_heartbeat_record = cur.fetchone()
    latest_heartbeat = latest_heartbeat_record['latest_hb'] if latest_heartbeat_record else None
    cur.execute("SELECT COUNT(DISTINCT ip_address) as unique_ips FROM agents;")
    unique_ips = cur.fetchone()['unique_ips']
    cur.close()
    now_utc = datetime.now(timezone.utc)
    for agent in agents:
        last_hb_aware = agent["last_heartbeat"].replace(tzinfo=timezone.utc)
        diff = (now_utc - last_hb_aware).total_seconds()
        agent["status"] = "Active" if diff <= ACTIVE_THRESHOLD_SECONDS else "Inactive"

    return templates.TemplateResponse(
        "server_dashboard.html", {
            "request": request, "logs": agents, "unique_ips": unique_ips,
            "latest_download_time": latest_heartbeat.strftime('%Y-%m-%d %H:%M:%S') if latest_heartbeat else "N/A",
            "current_page": page, "total_pages": total_pages, "limit": limit, "user": None # Set user to None
        })

@app.get("/server_dashboard/data", response_class=JSONResponse)
def server_dashboard_data(
    # user: Optional[dict] = Depends(get_current_user), # Removed Auth
    conn=Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200)
):
    offset = (page - 1) * limit
    cur = conn.cursor(cursor_factory=RealDictCursor)
    base_query = """
        FROM agents a INNER JOIN (
            SELECT hostname, MAX(last_heartbeat) AS max_hb FROM agents GROUP BY hostname
        ) b ON a.hostname = b.hostname AND a.last_heartbeat = b.max_hb
    """
    cur.execute(f"SELECT COUNT(a.agent_uuid) AS total {base_query};")
    total_records = cur.fetchone()['total']
    total_pages = math.ceil(total_records / limit) if total_records > 0 else 1
    cur.execute(f"SELECT a.* {base_query} ORDER BY a.last_heartbeat DESC LIMIT %s OFFSET %s;", (limit, offset))
    agents = cur.fetchall()
    cur.execute("SELECT MAX(last_heartbeat) as latest_hb FROM agents;")
    latest_heartbeat_record = cur.fetchone()
    latest_heartbeat = latest_heartbeat_record['latest_hb'] if latest_heartbeat_record else None
    cur.execute("SELECT COUNT(DISTINCT ip_address) as unique_ips FROM agents;")
    unique_ips = cur.fetchone()['unique_ips']
    cur.close()
    now_utc = datetime.now(timezone.utc)
    for agent in agents:
        agent["last_heartbeat_str"] = agent["last_heartbeat"].strftime('%Y-%m-%d %H:%M:%S')
        diff = (now_utc - agent["last_heartbeat"].replace(tzinfo=timezone.utc)).total_seconds()
        agent["status"] = "Active" if diff <= ACTIVE_THRESHOLD_SECONDS else "Inactive"

    return {
        "logs": agents,
        "total_downloads": total_records,
        "unique_ips": unique_ips,
        "latest_download_time": latest_heartbeat.strftime('%Y-%m-%d %H:%M:%S') if latest_heartbeat else "N/A",
        "current_page": page,
        "total_pages": total_pages,
    }


# --------------------------------------------------------------------------------------
# AGENT & ACTION ROUTES
# --------------------------------------------------------------------------------------
@app.get("/get_link/{os_name}", response_class=JSONResponse)
def get_link(os_name: str, request: Request): # Removed Auth
    # if not user: raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED) # Removed Auth
        
    if os_name not in ALLOWED_DOWNLOADS: 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="OS not found")

    filename = ALLOWED_DOWNLOADS[os_name]
    path = os.path.join(FILES_DIR, filename)
    if not os.path.exists(path): 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found. Make sure it's in the 'files' folder.")

    token = secrets.token_hex(8)
    DOWNLOAD_TOKENS[token] = filename

    download_url = request.url_for("download_file", filename=filename)
    return {"url": f"{download_url}?token={token}", "sha256": sha256_of_file(path)}

@app.get("/downloads/{filename:path}", name="download_file")
def download_file(filename: str, token: str):
    if not token or DOWNLOAD_TOKENS.get(token) != filename:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid or missing token")

    DOWNLOAD_TOKENS.pop(token, None) # Token is single-use
    
    filepath = os.path.join(FILES_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")
        
    return FileResponse(path=filepath, filename=filename, media_type='application/octet-stream')

@app.post("/agent_heartbeat")
def agent_heartbeat(payload: HeartbeatPayload, request: Request, conn=Depends(get_db)):
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO agents (agent_uuid, hostname, os_name, machine_type, ip_address, last_heartbeat)
        VALUES (%(uuid)s, %(host)s, %(os)s, %(type)s, %(ip)s, (NOW() at time zone 'utc'))
        ON CONFLICT (agent_uuid) DO UPDATE SET
            hostname = EXCLUDED.hostname, os_name = EXCLUDED.os_name, machine_type = EXCLUDED.machine_type,
            ip_address = EXCLUDED.ip_address, last_heartbeat = (NOW() at time zone 'utc');
    """, {
        "uuid": payload.agent_uuid, "host": payload.hostname, "os": payload.os_name,
        "type": payload.machine_type, "ip": request.client.host
    })
    conn.commit()
    cur.close()
    return {"status": "heartbeat received"}

@app.post("/agent_assets")
def agent_assets(payload: AssetPayload, request: Request, conn=Depends(get_db)):
    flat = flatten_agent_payload(payload)
    upsert_asset_record(flat, reporter_ip=request.client.host, conn=conn)
    print(f"[INFO] Asset data stored for {flat.get('hostname')}")
    return {"status": "asset stored"}

@app.post("/gather_assets")
def gather_assets(conn=Depends(get_db)): # Removed Auth
    # if not user: return RedirectResponse("/") # Removed Auth
        
    count_ok = 0
    for url in agent_ips:
        try:
            r = requests.get(url, timeout=15)
            if r.status_code == 200:
                payload = AssetPayload.model_validate(r.json())
                flat = flatten_agent_payload(payload)
                reporter_ip = url.split("://", 1)[1].split(":", 1)[0]
                upsert_asset_record(flat, reporter_ip=reporter_ip, conn=conn)
                count_ok += 1
        except Exception as e:
            print(f"[ERROR] Could not poll {url}: {e}")
    return RedirectResponse(url="/dashboard", status_code=status.HTTP_303_SEE_OTHER)

@app.post("/nmap_scan", response_class=HTMLResponse)
def nmap_scan(request: Request, subnet: str = Form("192.168.1.0/24"), conn=Depends(get_db)): # Removed Auth
    # if not user: return RedirectResponse("/") # Removed Auth
        
    try:
        result = subprocess.check_output(["nmap", "-sn", subnet], stderr=subprocess.STDOUT).decode()
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        result = f"Error running nmap: {e}"

    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM assets ORDER BY hostname ASC LIMIT 50 OFFSET 0;")
    assets = cur.fetchall()
    cur.close()
    return templates.TemplateResponse("dashboard.html", {"request": request, "assets": assets, "scan_result": result, "user": None}) # Set user to None

