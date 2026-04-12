-- Schema bump (MVP unused column): validates migration runner applies ordered bumps on existing DBs.
ALTER TABLE todos ADD COLUMN client_sync_token TEXT;
