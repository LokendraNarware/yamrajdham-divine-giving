import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SupabaseTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<string>("");
  const { toast } = useToast();

  const testConnection = async () => {
    setTesting(true);
    setResult("");
    
    try {
      // Test basic connection by trying to select from donations table
      const { data, error } = await supabase
        .from('donations')
        .select('count')
        .limit(1);
      
      if (error) {
        setResult(`❌ Connection failed: ${error.message}`);
        toast({
          title: "Connection Test Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setResult("✅ Supabase connection successful!");
        toast({
          title: "Connection Test Passed",
          description: "Successfully connected to Supabase database",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setResult(`❌ Connection error: ${errorMessage}`);
      toast({
        title: "Connection Test Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>
          Test your Supabase database connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnection} 
          disabled={testing}
          className="w-full"
        >
          {testing ? "Testing..." : "Test Connection"}
        </Button>
        
        {result && (
          <div className="p-3 bg-muted rounded-md">
            <pre className="text-sm">{result}</pre>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p><strong>Project:</strong> dxdfgaymlhcqxjsuwhoi</p>
          <p><strong>URL:</strong> https://dxdfgaymlhcqxjsuwhoi.supabase.co</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseTest;
