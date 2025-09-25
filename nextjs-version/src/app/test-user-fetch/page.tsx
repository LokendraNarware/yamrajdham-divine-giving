"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getUserById } from "@/services/donations";

export default function TestUserFetchPage() {
  const [status, setStatus] = useState<string>("Testing...");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [testUserId] = useState("1331d7cf-60cc-4b85-b9f8-8d73f05a92e6");

  useEffect(() => {
    const testUserFetch = async () => {
      try {
        setStatus("Testing user fetch...");
        
        // Test 1: Direct Supabase query
        console.log("Testing direct Supabase query...");
        const { data: directData, error: directError } = await supabase
          .from('users')
          .select('*')
          .eq('id', testUserId)
          .maybeSingle();

        if (directError) {
          setError(`Direct query error: ${directError.message} (Code: ${directError.code})`);
          setStatus("Failed");
          return;
        }

        console.log("Direct query result:", directData);

        // Test 2: Using getUserById function
        console.log("Testing getUserById function...");
        const result = await getUserById(testUserId);
        
        if (!result.success) {
          setError(`getUserById error: ${result.error?.message || result.error}`);
          setStatus("Failed");
          return;
        }

        setData({
          directQuery: directData,
          getUserByIdResult: result.data
        });
        setStatus("Success");
        
      } catch (err) {
        setError(`Unexpected error: ${err}`);
        setStatus("Failed");
      }
    };

    testUserFetch();
  }, [testUserId]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">User Fetch Test</h1>
        
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
            <h2 className="text-xl font-semibold mb-2">Test User ID:</h2>
            <p className="p-4 bg-gray-100 rounded-lg font-mono">
              {testUserId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
