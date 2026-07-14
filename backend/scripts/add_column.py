import sqlite3

def upgrade_db():
    try:
        conn = sqlite3.connect('support_crm.db')
        cursor = conn.cursor()
        
        # Check if assigned_to_id exists
        cursor.execute("PRAGMA table_info(tickets);")
        columns = [info[1] for info in cursor.fetchall()]
        
        if 'assigned_to_id' not in columns:
            print("Adding assigned_to_id to tickets table...")
            cursor.execute("ALTER TABLE tickets ADD COLUMN assigned_to_id INTEGER REFERENCES users(id);")
            conn.commit()
            print("Column added successfully.")
        else:
            print("Column assigned_to_id already exists.")
            
    except Exception as e:
        print(f"Error upgrading database: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    upgrade_db()
