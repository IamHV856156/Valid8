import pandas as pd
import uuid
import hashlib
import os
import qrcode
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
# Use your Project URL and service_role key from Supabase Settings
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
print(f"URL being used: {SUPABASE_URL}")
print(f"Key being used: {SUPABASE_KEY[:5]}... (truncated)")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Chnage FOSSHACK2026_OSM.csv to your participants csv file
CSV_FILE = "FOSSHACK2026_OSM.csv"

def generate_token(email, salt):
    # Keep this key consistent with your app if you do local validation
    SECRET_KEY = "your_secret_key"
    raw_str = f"{email.lower().strip()}{SECRET_KEY}{salt}"
    return hashlib.sha256(raw_str.encode()).hexdigest()
try:
    # Try to fetch one row from the table to test connectivity
    test_query = supabase.table("Participants").select("*").limit(1).execute()
    print("Successfully connected to Supabase!")
except Exception as e:
    print(f"Connection failed: {e}")
def main():
    # reads csv file
    df = pd.read_csv(CSV_FILE)
    # check if tickets folder exist if not it will create tickets folder on root directory
    if not os.path.exists('tickets'): os.makedirs('tickets')

    print(f"Processing {len(df)} attendees...")
    
    for index, row in df.iterrows():
        salt = str(uuid.uuid4())[:8]
        token = generate_token(row['Email'], salt)
        # generate QR code
        qr = qrcode.make(token)
        # saves qr code image of individual participants there name 
        qr.save(f"tickets/{index + 1}_{row['Name'].replace(' ', '_')}.png")
        # upload csv to Supabase
        data = {
            "unique_id": index + 1,
            "name": row['Name'],
            "email_id": row['Email'],
            "token": token,
            "unique_salt": salt,
            "Accepted": False
        }
        
        try:
            supabase.table("Participants").insert(data).execute()
            print(f"Uploaded: {row['Name']}")
        except Exception as e:
            print(f"Error uploading {row['Name']}: {e}")

if __name__ == "__main__":
    main()