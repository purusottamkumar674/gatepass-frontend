import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const { login, user} = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: e.target.username.value,
      password: e.target.password.value,
    };

    try {
      setLoading(true);
      const res = await api.post("/accounts/login/", payload);

      const { tokens } = res.data;
      console.log(tokens);
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

    if (user.usertype === "student") navigate("/student", { replace: true });
    else if (user.usertype === "staff") navigate("/staff", { replace: true });
    else navigate("/admin", { replace: true });
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center">Welcome back</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Username</Label>
            <Input name="username" required />
          </div>

          <div className="space-y-1">
            <Label>Password</Label>
            <Input name="password" type="password" required />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <button
              type="button"
              className="text-indigo-600 hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
}
