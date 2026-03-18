CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    token TEXT NOT NULL,              
    is_checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    
    UNIQUE(email, event_slug)
);

-- Create an index on the token for fast QR scans
CREATE INDEX IF NOT EXISTS idx_participants_token ON participants(token);