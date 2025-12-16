import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const payload = {
      username: e.target.username.value.trim(),
      password: e.target.password.value,
    };

    try {
      setLoading(true);

      const res = await api.post("/accounts/login/", payload);
      const { tokens } = res.data;

      login(tokens);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Invalid username or password";

      toast({
        variant: "destructive",
        title: "Login failed",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    toast({
      title: "Login successful",
      description: `Welcome back, ${user.username}`,
    });

    if (user.usertype === "student") {
      navigate("/student", { replace: true });
    } else if (user.usertype === "staff") {
      navigate("/staff", { replace: true });
    } else {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-sm">
        {/* HEADER */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="text-sm text-muted-foreground">
            Sign in to continue to the dashboard
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <button
            type="button"
            className="text-indigo-600 hover:underline font-medium"
            onClick={() => navigate("/signup")}
            disabled={loading}
          >
            Sign up
          </button>
        </p>
      </Card>
    </div>
  );
}

