#!/bin/bash
docker exec dancemotion-web node -e '
const { createClient } = require("@supabase/supabase-js");
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await s.from("tickets").select("attachments").limit(1);
  if (error && error.message.includes("attachments")) {
    console.log("ERROR: Column attachments does not exist. Run SQL in Supabase dashboard.");
  } else {
    console.log("OK: attachments column exists");
    console.log("Data:", JSON.stringify(data));
  }
}
run();
'
