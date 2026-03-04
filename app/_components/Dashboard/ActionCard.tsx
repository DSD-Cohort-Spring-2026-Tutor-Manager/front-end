import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export function ActionCard({ title, description, href, icon }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-[--Highlight] hover:shadow-md transition-all duration-200 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <span className="w-10 h-10 rounded-xl bg-[--Primary] flex items-center justify-center text-[--Outlines]">
          {icon}
        </span>
        <div>
          <p className="font-semibold text-[--Support] text-sm">{title}</p>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[--Highlight] transition-colors" />
    </Link>
  );
}
