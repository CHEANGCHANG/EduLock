
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.45.4';

// Updated with user-provided Supabase project credentials
const supabaseUrl = 'https://attjczmjtezvfqkjrqsa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0dGpjem1qdGV6dmZxa2pycXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjM2NzgsImV4cCI6MjA4MTE5OTY3OH0.pLN2LpvAS4NvQAWdIeM1OamGVWJx54czZ6oVET1ekXk';

export const supabase = createClient(supabaseUrl, supabaseKey);
