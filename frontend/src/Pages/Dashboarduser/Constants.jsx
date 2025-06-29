import {
  CalendarDays,
  LogOut,
  Bell,
  Settings,
  MessageSquare,
  History,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Camera,
  Share2,
  Image,
  Video,
  FileText,
  User,
  Type,
  Lightbulb,
  CalendarCheck,
  Pencil
} from "lucide-react";

export const initialPosts = [
  {
    title: "Welcome Post",
    content: "Welcome to our social media journey!",
    platforms: "",
    customPlatform: "",
    color: "#e11d48",
    mediaType: "image"
  },
];

// Platform color configuration
export const platformColors = {
  tiktok: "#000000",
  instagram: "#E4405F",
  facebook: "#1877F2",
  youtube: "#FF0000",
  linkedin: "#0A66C2",
  x: "#1DA1F2",
  snapchat: "#FFFC00",
  pinterest: "#BD081C",
  other: "#6B7280"
};

// Dynamic sidebar menu items
export const sidebarItems = [
  { id: "calendar", icon: CalendarDays, label: "Calendar", color: "blue" },
  { id: "profile", icon: User, label: "Profile", color: "blue" },
  { id: "CalendarIdeas", icon: CalendarCheck, label: "Calendar Ideas", color: "blue" },
  // { id: "strategytips", icon: Lightbulb, label: "Strategy Tips", color: "blue" },
  { id: "scriptgenerator", icon: Pencil, label: "Script", color: "blue" },
  { id: "captiongenerator", icon: Type, label: "Caption", color: "blue" },
  { id: "chatbot", icon: MessageSquare, label: "ChatBot", color: "blue" },
  { id: "history", icon: History, label: "History", color: "green" },
  { id: "alerts", icon: Bell, label: "NotificationsPage", color: "blue" },
  { id: "settings", icon: Settings, label: "Settings", color: "blue" },
  { id: "logout", icon: LogOut, label: "Logout", color: "red" }
];

// Utility function to get platform icons
export const getPlatformIcon = (platform) => {
  switch (platform) {
    case "tiktok":
    case "snapchat":
      return <Camera className="w-4 h-4" />;
    case "instagram":
      return <Instagram className="w-4 h-4" />;
    case "facebook":
      return <Facebook className="w-4 h-4" />;
    case "youtube":
      return <Youtube className="w-4 h-4" />;
    case "linkedin":
      return <Linkedin className="w-4 h-4" />;
    case "x":
      return <Twitter className="w-4 h-4" />;
    case "pinterest":
    case "other":
    default:
      return <Share2 className="w-4 h-4" />;
  }
};

// Utility function to get media type icons
export const getMediaIcon = (mediaType) => {
  switch (mediaType) {
    case "image":
      return <Image className="w-3 h-3" />;
    case "video":
      return <Video className="w-3 h-3" />;
    case "text":
      return <FileText className="w-3 h-3" />;
    default:
      return <Image className="w-3 h-3" />;
  }
};
