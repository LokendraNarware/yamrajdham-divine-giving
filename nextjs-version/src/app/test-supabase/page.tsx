"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function TestSupabasePage() {
  const [status, setStatus] = useState<string>("Testing...");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const testSupabase = async () => {
      try {
        setStatus("Testing Supabase connection...");
        
        // Test 1: Check if we can connect to Supabase
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          setError(`Auth error: ${authError.message}`);
          setStatus("Failed");
          return;
        }

        setStatus("Auth check passed");

        // Test 2: Try to fetch users table
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .limit(5);

        if (usersError) {
          setError(`Users query error: ${usersError.message} (Code: ${usersError.code})`);
          setStatus("Failed");
          return;
        }

        setData(users);
        setStatus("Success");
        
      } catch (err) {
        setError(`Unexpected error: ${err}`);
        setStatus("Failed");
      }
    };

    testSupabase();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Status:</h2>
            <p className={`p-4 rounded-lg ${
              status === "Success" ? "bg-green-100 text-green-800" :
              status === "Failed" ? "bg-red-100 text-red-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {status}
            </p>
          </div>

          {error && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Error:</h2>
              <p className="p-4 bg-red-100 text-red-800 rounded-lg">
                {error}
              </p>
            </div>
          )}

          {data && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Data:</h2>
              <pre className="p-4 bg-gray-100 rounded-lg overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-2">Supabase Configuration:</h2>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p><strong>URL:</strong> https://dxdfgaymlhcqxjsuwhoi.supabase.co</p>
              <p><strong>Key:</strong> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4ZGZnYXltbGhjcXhqc3V3aG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NjA1NzYsImV4cCI6MjA3NDIzNjU3Nn0.nqFqNySt2GMN-LAqfDUiW-UtcpeF1iDAsF_T8SJeMSE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
