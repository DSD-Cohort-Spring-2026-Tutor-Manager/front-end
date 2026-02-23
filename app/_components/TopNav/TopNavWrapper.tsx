"use client";
import TopNav from "./TopNav";
import { useAuth } from "../../context/AuthContext";

export default function TopNavWrapper() {
  const { user } = useAuth();

  if (!user) return null;

  return <TopNav name={user.name} avatarIconSrc={user.avatar} />;
}
