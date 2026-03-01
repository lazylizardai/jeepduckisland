import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { User, LogOut, Trophy, Camera, Edit3, Save, X, Coins } from "lucide-react";

const DUCK_AVATARS = ["🦆", "🐦", "🦢", "👑", "⭐", "🌟", "🍊", "🏆"];

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [editForm, setEditForm] = useState({ username: "", avatar_emoji: "🦆" });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUser(session.user);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (data) {
        setProfile(data);
        setEditForm({ username: data.username || "", avatar_emoji: data.avatar_emoji || "🦆" });
      }
      setLoading(false);
    };
    loadProfile();
  }, [navigate]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ username: editForm.username, avatar_emoji: editForm.avatar_emoji })
      .eq("id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProfile((prev: any) => ({ ...prev, ...editForm }));
      setIsEditing(false);
      toast({ title: "Profile updated!" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🦆</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-duck-yellow/20 via-background to-duck-teal/20">
      <Navigation />
      <div className="pt-20 pb-10 container mx-auto px-4 max-w-2xl">
        <div className="card-tropical bg-card p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="font-display text-3xl">My Profile</h1>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>

          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 bg-duck-yellow rounded-2xl border-4 border-outline flex items-center justify-center text-4xl">
                {isEditing ? editForm.avatar_emoji : (profile?.avatar_emoji || "🦆")}
              </div>
              {isEditing && (
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-duck-orange rounded-full border-2 border-outline flex items-center justify-center"
                >
                  <Camera className="w-3 h-3 text-white" />
                </button>
              )}
              {showAvatarPicker && (
                <div className="absolute top-full mt-2 left-0 z-50 bg-card border-4 border-outline rounded-2xl p-3 shadow-xl grid grid-cols-4 gap-2">
                  {DUCK_AVATARS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => { setEditForm(prev => ({ ...prev, avatar_emoji: emoji })); setShowAvatarPicker(false); }}
                      className="text-2xl p-2 hover:bg-muted rounded-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label className="font-display">Username</Label>
                    <Input
                      value={editForm.username}
                      onChange={e => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="border-2 border-outline mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="btn-primary">
                      <Save className="w-4 h-4 mr-1" /> Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-display text-2xl">{profile?.username || "Anonymous Duck"}</h2>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="font-body text-muted-foreground text-sm">{user?.email}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Ducks Spotted", value: profile?.ducks_spotted || 0, emoji: "🦆" },
            { label: "QUACK Tokens", value: (profile?.quack_tokens || 0).toLocaleString(), emoji: "💰" },
            { label: "Rank", value: `#${profile?.rank || "?"}`, emoji: "🏆" },
          ].map((stat, i) => (
            <div key={i} className="card-tropical bg-card p-4 text-center hover-lift">
              <div className="text-3xl mb-1">{stat.emoji}</div>
              <div className="font-display text-xl">{stat.value}</div>
              <div className="font-body text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Level/XP */}
        <div className="card-tropical bg-card p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl">Level Progress</h2>
            <Badge className="bg-duck-orange text-white">Level {profile?.level || 1}</Badge>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden border-2 border-outline">
            <div
              className="h-full bg-gradient-to-r from-duck-yellow to-duck-orange"
              style={{ width: `${((profile?.xp || 0) % 1000) / 10}%` }}
            />
          </div>
          <p className="font-body text-xs text-muted-foreground mt-1">
            {(profile?.xp || 0) % 1000} / 1000 XP to next level
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
