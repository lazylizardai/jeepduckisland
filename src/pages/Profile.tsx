import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Camera, Save, LogOut, User, MapPin, Mail, Loader2 } from "lucide-react";

interface ProfileData {
  username: string;
  full_name: string;
  bio: string;
  location: string;
  avatar_url: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    username: "",
    full_name: "",
    bio: "",
    location: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error);
    } else if (data) {
      setProfile({
        username: data.username || "",
        full_name: data.full_name || "",
        bio: data.bio || "",
        location: data.location || "",
        avatar_url: data.avatar_url || "",
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });
    
    if (error) {
      toast.error("Kon profiel niet opslaan: " + error.message);
    } else {
      toast.success("Profiel opgeslagen!");
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setUploadingAvatar(true);
    
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) {
      toast.error("Kon avatar niet uploaden");
      setUploadingAvatar(false);
      return;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    
    setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
    setUploadingAvatar(false);
    toast.success("Avatar geüpload!");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 via-secondary/10 to-accent/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-card rounded-3xl p-8 border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-4xl">Mijn Profiel</h1>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Uitloggen
              </Button>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-display text-3xl">
                    {profile.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary/80 transition-colors"
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
              <div>
                <p className="font-display text-2xl">{profile.username || "Geen username"}</p>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="bg-card rounded-3xl p-8 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-display text-2xl mb-6">Profiel bewerken</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="font-display text-lg">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="jouw_username"
                  className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="full_name" className="font-display text-lg">Volledige naam</Label>
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => setProfile((prev) => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Jan de Vries"
                  className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="location" className="font-display text-lg">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Locatie
                </Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Amsterdam, NL"
                  className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="bio" className="font-display text-lg">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Vertel iets over jezelf..."
                  className="border-4 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mt-1"
                  rows={3}
                />
              </div>
              
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full font-display text-xl py-6 bg-primary hover:bg-primary/90 text-primary-foreground border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                {saving ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Opslaan...</>
                ) : (
                  <><Save className="mr-2 h-5 w-5" /> Profiel Opslaan</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
