import sqlite3
from pathlib import Path

db_path = Path("d:/Projects/wedding-planner-local/data/database/wedding_planner.db")
if not db_path.exists():
    print(f"DB not found at {db_path}")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("ALTER TABLE events ADD COLUMN event_date DATE;")
        conn.commit()
        print("Column event_date added successfully.")
    except Exception as e:
        print(f"Error (maybe column already exists?): {e}")
    conn.close()

import sys
sys.path.append("d:/Projects/wedding-planner-local")
from backend.app.db import init_db
init_db()
print("init_db completed.")
