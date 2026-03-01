import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Duck } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate("/");
    };
    checkSession();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "Successfully logged in." });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } }
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account."
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-duck-yellow via-duck-orange to-duck-teal flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card-tropical bg-card p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🦆</div>
            <h1 className="font-display text-4xl mb-2">
              {isLogin ? "Welcome Back!" : "Join the Island"}
            </h1>
            <p className="font-body text-muted-foreground">
              {isLogin
                ? "Log in to your JeepDuck account"
                : "Create your duck hunting profile"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="username" className="font-display text-lg">
                  Duck Name
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your hunter nickname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 border-4 border-outline"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="font-display text-lg">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-4 border-outline"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="font-display text-lg">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-4 border-outline pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full btn-primary text-lg py-6"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin">🦆</span>
              ) : isLogin ? (
                "Log In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-body text-duck-orange hover:text-duck-orange/80 underline"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
