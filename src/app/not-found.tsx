"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route"
    );
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Oops! Page not found</h2>
          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Button onClick={() => router.push("/")} variant="divine" size="lg">
            <Home className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
