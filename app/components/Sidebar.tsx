"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  label: string;
  href: string;
  icon: string;
};

type SidebarProps = {
  name: string;
  email: string;
  menuItems: MenuItem[];
  onLogout: () => void;
};

export default function Sidebar({
  name,
  email,
  menuItems,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="logo">
        <span>🎓</span>
        <strong>
          SMART
          <br />
          CAMPUS
        </strong>
      </div>

      <div className="profile">
        <div className="profile-avatar">👨‍💼</div>

        <div>
          <strong>{name}</strong>
          <p>{email}</p>
          <span className="online">● Online</span>
        </div>
      </div>

      <nav className="menu">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`menu-item ${
              pathname === item.href ? "active" : ""
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="logout"
        onClick={onLogout}
      >
        🚪 <span>Sair</span>
      </button>
    </aside>
  );
}
