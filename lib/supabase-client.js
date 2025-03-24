import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://oymcqpxqpnsczexqemec.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95bWNxcHhxcG5zY3pleHFlbWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3OTI5NDcsImV4cCI6MjA1ODM2ODk0N30.l7HF6f-jQNkUa24qQ-OiJdhBJ64rXR9nPcNKJmFq63A"

export const supabase = createClient(supabaseUrl, supabaseKey)

