import { redirect } from "next/navigation";

// Root "/" always redirects to "/login"
export default function RootPage() {
  redirect("/login");
}
