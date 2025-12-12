import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axios";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // from context

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: e.target.username.value,
      password: e.target.password.value,
    };

    try {
      const res = await api.post("/accounts/login/", payload);
      const data = res.data;
      const usertype = data.user.usertype;
      console.log(usertype);

      // Save data to context + localStorage
      login(data.user, data.tokens);

      // Redirect to dashboard
      if (usertype == "student") {
        navigate("/student-dashboard");
      } else if (usertype == "staff") {
        navigate("/staff-dashboard");
      } else {
        navigate("dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data);
      alert(err.response?.data?.message || "Invalid credentials!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center">Welcome back</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Username</Label>
            <Input name="username" type="text" required />
          </div>

          <div className="space-y-1">
            <Label>Password</Label>
            <Input name="password" type="password" required />
          </div>

          <Button className="w-full" type="submit">
            Sign in
          </Button>
          <p>
            Don't have an account?
            <button
              className="text-indigo-600"
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
