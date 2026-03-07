"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { logout } from "@/lib/authService";
import "./SideNav.css";

const parentNavItems = [
  { href: "/parent", label: "Home", icon: "/icons/home.svg", iconActive: "/icons/Home-act.svg" },
  { href: "/parent/tutoring", label: "Tutoring", icon: "/icons/tutor.svg", iconActive: "/icons/tutor-act.svg" },
  { href: "/parent/student", label: "Student", icon: "/icons/student.svg", iconActive: "/icons/student.svg" },
  { href: "/parent/credits", label: "Credits", icon: "/icons/shop.svg", iconActive: "/icons/Shop-act.svg" },
];

const adminNavItems = [
  { href: "/admin", label: "Home", icon: "/icons/home.svg", iconActive: "/icons/Home-act.svg" },
  { href: "/admin/tutoring", label: "Tutoring", icon: "/icons/tutor.svg", iconActive: "/icons/tutor-act.svg" },
  { href: "/admin/student", label: "Student", icon: "/icons/student.svg", iconActive: "/icons/student.svg" },
  { href: "/admin/credits", label: "Credits", icon: "/icons/shop.svg", iconActive: "/icons/Shop-act.svg" },
  { href: "/admin/classes", label: "Classes", icon: "/icons/tutor.svg", iconActive: "/icons/tutor-act.svg" },
];

const tutorNavItems = [
  { href: "/tutor", label: "Home", icon: "/icons/home.svg", iconActive: "/icons/Home-act.svg" },
  { href: "/tutor/classes", label: "Classes", icon: "/icons/tutor.svg", iconActive: "/icons/tutor-act.svg" },
  { href: "/tutor/students", label: "Students", icon: "/icons/student.svg", iconActive: "/icons/student.svg" },
];

function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  // ── Role resolution ──────────────────────────────────────────────────
  const derivedRoleFromPath =
    pathname.startsWith("/tutor")  ? "tutor"  :
    pathname.startsWith("/parent") ? "parent" :
    pathname.startsWith("/admin")  ? "admin"  : null;

  // user?.role is source of truth; path is fallback for edge cases
  const role = (user?.role ?? derivedRoleFromPath)?.toLowerCase() || null;

  const navItems =
    role === "tutor"  ? tutorNavItems  :
    role === "parent" ? parentNavItems :
    role === "admin"  ? adminNavItems  : [];

  // ── Logout ───────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="side-nav bg-(--Support)">
      <nav className="side-nav__container">

        {/* Logo */}
        <div className="side-nav__logo-container">
          <img
            className="side-nav__logo"
            src="/icons/tutortoise-logo.svg"
            alt="Tutortoise logo"
          />
        </div>

        {/* Nav items */}
        <ul className="side-nav__list">
          {navItems.map((item) => {
            // Active if exact match OR on a sub-route (but not "/" catch-all)
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href + "/"));

            return (
              <li key={item.href}>
                <Link
                  className={`side-nav__item ${isActive ? "side-nav__item--active" : ""}`}
                  href={item.href}
                >
                  <img
                    className="side-nav__icon-img"
                    src={isActive ? item.iconActive : item.icon}
                    alt={item.label}
                  />
                  <span className="side-nav__icon-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout — button for correct semantics + keyboard accessibility */}
        <button
          type="button"
          className="side-nav__logout"
          onClick={handleLogout}
        >
          <img
            className="side-nav__icon-img"
            src="/icons/logout.svg"
            alt="logout icon"
          />
          <span className="side-nav__icon-label">Logout</span>
        </button>

      </nav>
    </aside>
  );
}

export default SideNav;