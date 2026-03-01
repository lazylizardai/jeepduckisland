import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import {
  User, Camera, Trophy, Star, Zap, Shield, Crown,
  Edit3, Save, X, Upload, MapPin, Calendar, Duck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DUCK_AVATARS = [
  "🦆", "🐦", "🦢", "👑", "⭐", "🌟",
  "🍊", "🏆", "🔥", "⚡", "🌈", "💎"
];

const ACHIEVEMENTS = [
  { icon: Trophy, name: "First Duck", desc: "Spotted your first duck", earned: true, color: "text-yellow-500" },
  { icon: Star, name: "Star Spotter", desc: "50 ducks spotted", earned: true, color: "text-blue-500" },
  { icon: Zap, name: "Speed Quacker", desc: "10 ducks in one day", earned: true, color: "text-purple-500" },
  { icon: Shield, name: "Duck Guardian", desc: "100 total ducks", earned: false, color: "text-green-500" },
  { icon: Crown, name: "Duck King", desc: "Reach #1 leaderboard", earned: false, color: "text-orange-500" },
];

const RECENT_ACTIVITY = [
  { duck: "🦆", name: "Quacky McQuackface", location: "Beach Cove", time: "2h ago", rarity: "Common" },
  { duck: "⭐", name: "Legendary Larry", location: "Jeep Depot", time: "1d ago", rarity: "Legendary" },
  { duck: "🐦‍⬛", name: "Midnight Drake", location: "Mountain Pass", time: "3d ago", rarity: "Rare" },
  { duck: "🦢", name: "Tropical Teal", location: "Lagoon", time: "5d ago", rarity: "Uncommon" },
];

const rarityColors: Record<string, string> = {
  Common: "bg-gray-100 text-gray-800",
  Uncommon: "bg-green-100 text-green-800",
  Rare: "bg-blue-100 text-blue-800",
  Epic: "bg-purple-100 text-purple-800",
  Legendary: "bg-yellow-100 text-yellow-800",
};

const DuckProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [profile, setProfile] = useState({
    username: "QuackMaster9000",
    bio: "Passionate duck spotter from the island. On a quest to find every legendary duck!",
    location: "JeepDuck Island, Zone 7",
    joinDate: "January 2024",
    avatar: "🦆",
    stats: {
      ducksSpotted: 247,
      ducksOwned: 89,
      quackTokens: 15420,
      rank: 12,
      level: 8,
      xp: 7840,
      nextLevelXp: 10000,
    }
  });
  const [editForm, setEditForm] = useState({ ...profile });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = () => {
    setProfile({ ...editForm });
    setIsEditing(false);
    toast({ title: "Profile updated!", description: "Your changes have been saved." });
  };

  const handleAvatarSelect = (emoji: string) => {
    setEditForm(prev => ({ ...prev, avatar: emoji }));
    setShowAvatarPicker(false);
  };

  const xpProgress = (profile.stats.xp / profile.stats.nextLevelXp) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-duck-yellow/20 via-background to-duck-teal/20">
      <Navigation />
      <div className="pt-20 pb-10 container mx-auto px-4 max-w-4xl">
        
        {/* Profile Header */}
        <div className="card-tropical bg-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-duck-yellow rounded-3xl border-4 border-outline flex items-center justify-center text-5xl">
                {isEditing ? editForm.avatar : profile.avatar}
              </div>
              {isEditing && (
                <button
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-duck-orange rounded-full border-2 border-outline flex items-center justify-center"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              )}
              {showAvatarPicker && (
                <div className="absolute top-full mt-2 left-0 z-50 bg-card border-4 border-outline rounded-2xl p-3 shadow-xl grid grid-cols-4 gap-2">
                  {DUCK_AVATARS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleAvatarSelect(emoji)}
                      className="text-2xl p-2 hover:bg-muted rounded-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label className="font-display">Username</Label>
                    <Input
                      value={editForm.username}
                      onChange={e => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="border-2 border-outline"
                    />
                  </div>
                  <div>
                    <Label className="font-display">Bio</Label>
                    <Textarea
                      value={editForm.bio}
                      onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="border-2 border-outline"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="font-display">Location</Label>
                    <Input
                      value={editForm.location}
                      onChange={e => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="border-2 border-outline"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="font-display text-3xl">{profile.username}</h1>
                    <Badge className="bg-duck-orange text-white">Level {profile.stats.level}</Badge>
                  </div>
                  <p className="font-body text-muted-foreground mb-3">{profile.bio}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{profile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />Joined {profile.joinDate}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Edit Buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="btn-primary">
                    <Save className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button variant="outline" onClick={() => { setIsEditing(false); setEditForm({ ...profile }); }}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit3 className="w-4 h-4 mr-1" /> Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-display">XP Progress</span>
              <span className="font-body text-muted-foreground">{profile.stats.xp} / {profile.stats.nextLevelXp}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden border-2 border-outline">
              <div
                className="h-full bg-gradient-to-r from-duck-yellow to-duck-orange transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Ducks Spotted", value: profile.stats.ducksSpotted, emoji: "🦆" },
            { label: "Ducks Owned", value: profile.stats.ducksOwned, emoji: "🏷️" },
            { label: "QUACK Tokens", value: profile.stats.quackTokens.toLocaleString(), emoji: "💰" },
            { label: "Rank", value: `#${profile.stats.rank}`, emoji: "🏆" },
          ].map((stat, i) => (
            <div key={i} className="card-tropical bg-card p-4 text-center hover-lift">
              <div className="text-3xl mb-1">{stat.emoji}</div>
              <div className="font-display text-2xl">{stat.value}</div>
              <div className="font-body text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Achievements */}
          <div className="card-tropical bg-card p-6">
            <h2 className="font-display text-2xl mb-4">Achievements</h2>
            <div className="space-y-3">
              {ACHIEVEMENTS.map((achievement, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 ${
                    achievement.earned ? "border-duck-yellow bg-duck-yellow/10" : "border-muted bg-muted/30 opacity-50"
                  }`}
                >
                  <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                  <div>
                    <p className="font-display text-lg">{achievement.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{achievement.desc}</p>
                  </div>
                  {achievement.earned && <span className="ml-auto text-xl">✅</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card-tropical bg-card p-6">
            <h2 className="font-display text-2xl mb-4">Recent Ducks</h2>
            <div className="space-y-3">
              {RECENT_ACTIVITY.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border-2 border-muted">
                  <span className="text-3xl">{activity.duck}</span>
                  <div className="flex-1">
                    <p className="font-display">{activity.name}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 inline mr-1" />{activity.location} · {activity.time}
                    </p>
                  </div>
                  <Badge className={rarityColors[activity.rarity]}>{activity.rarity}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuckProfile;
