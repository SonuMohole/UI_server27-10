import { useState } from "react";
import {
  Edit3,
  Mail,
  Building2,
  Phone,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  interface UserProfile {
    name: string;
    email: string;
    phone: string;
    organization: string;
    role: string;
    joined: string;
  }

  const [profile, setProfile] = useState<UserProfile>({
    name: "Jayesh Gavit",
    email: "jayesh@example.com",
    phone: "+91 98765 43210",
    organization: "QCTPL Cyber Labs",
    role: "Security Engineer",
    joined: "July 2023",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof UserProfile
  ) => {
    setProfile({ ...profile, [key]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    console.log("Profile updated:", profile);
  };

  return (
    <div className="p-8 sm:p-12 w-full h-full bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal and organization-related details.
          </p>
        </div>

        
      </div>

      {/* Profile Card */}
      <div className="glass-panel rounded-xl p-8 shadow-md max-w-3xl mx-auto">
        {/* Avatar + Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-secondary/40 flex items-center justify-center font-bold text-2xl">
            {profile.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.role}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {profile.organization}
            </p>
          </div>
          <div className="sm:ml-auto">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md text-sm transition-all"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className="border-t border-border my-4"></div>

        {/* Profile Info */}
        {!isEditing ? (
          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{profile.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <div>
                <p className="text-muted-foreground">Organization</p>
                <p className="font-medium">{profile.organization}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="text-muted-foreground">Member Since</p>
                <p className="font-medium">{profile.joined}</p>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            className="grid sm:grid-cols-2 gap-6 text-sm"
          >
            <div>
              <label className="block text-muted-foreground mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange(e, "name")}
                className="w-full border border-border rounded-md p-2 bg-background text-sm"
              />
            </div>

            <div>
              <label className="block text-muted-foreground mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange(e, "email")}
                className="w-full border border-border rounded-md p-2 bg-background text-sm"
              />
            </div>

            <div>
              <label className="block text-muted-foreground mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => handleInputChange(e, "phone")}
                className="w-full border border-border rounded-md p-2 bg-background text-sm"
              />
            </div>

            <div>
              <label className="block text-muted-foreground mb-1">
                Organization
              </label>
              <input
                type="text"
                value={profile.organization}
                onChange={(e) => handleInputChange(e, "organization")}
                className="w-full border border-border rounded-md p-2 bg-background text-sm"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-md text-sm transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
