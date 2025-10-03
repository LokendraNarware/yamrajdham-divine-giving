"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createAdmin } from "@/services/donations";
import { Shield, User, Mail, Phone } from "lucide-react";

export default function CreateAdminPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "admin"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await createAdmin(formData);
      
      if (result.success) {
        setSuccess("Admin user created successfully!");
        setFormData({ name: "", email: "", mobile: "", role: "admin" });
      } else {
        setError(result.error?.message || "Failed to create admin user");
      }
    } catch {
      setError("An unexpected error occurred");
    }
    
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-background">
        {/* Header removed - using global layout */}
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Create Admin User</CardTitle>
              <CardDescription>
                Add a new administrator to the system. The admin must first register as a regular user with the same email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter admin's full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter admin's email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    placeholder="Enter mobile number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Admin...' : 'Create Admin User'}
                </Button>
              </form>
              
              <div className="mt-6 space-y-2">
                <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                  <p><strong>Important:</strong> Before creating an admin user:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>First register as a regular user at <a href="/register" className="text-primary underline">/register</a></li>
                    <li>Use the same email address here</li>
                    <li>Then sign in with your email and password</li>
                  </ol>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/register')}
                    className="flex-1"
                  >
                    Register First
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/admin/donations')}
                    className="flex-1"
                  >
                    Admin Panel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
