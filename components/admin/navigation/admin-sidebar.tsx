'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Calendar,
  Twitter,
  Layers,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import GoogleColorsBar from '@/components/shared/google-colors-bar';

const navItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    color: 'text-gdg-blue',
  },
  {
    name: 'Members',
    href: '/admin/members',
    icon: Users,
    color: 'text-gdg-blue',
  },
  {
    name: 'Events',
    href: '/admin/events',
    icon: Calendar,
    color: 'text-gdg-yellow',
  },
  {
    name: 'Tweets',
    href: '/admin/tweets',
    icon: Twitter,
    color: 'text-gdg-red',
  },
  {
    name: 'Projects',
    href: '/admin/publish-projects',
    icon: Layers,
    color: 'text-gdg-green',
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    color: 'text-gray-500',
  },
];

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 transition-all duration-300',
          collapsed ? 'w-[70px]' : 'w-[250px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          className
        )}
      >
        {/* Logo Area */}
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-4 border-b">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gdg-blue flex items-center justify-center">
                  <span className="text-white font-bold">G</span>
                </div>
                <span className="font-bold text-lg">GDSC Admin</span>
              </div>
            )}
            {collapsed && (
              <div className="w-8 h-8 mx-auto rounded-full bg-gdg-blue flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
            )}
          </div>

          <div className={cn('p-1', collapsed ? '' : 'px-3')}>
            <GoogleColorsBar />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md transition-colors',
                    isActive ? 'bg-gray-100' : 'hover:bg-gray-50',
                    collapsed ? 'justify-center' : ''
                  )}
                >
                  <item.icon className={cn('h-5 w-5', item.color)} />
                  {!collapsed && (
                    <span
                      className={cn(
                        'ml-3 text-sm font-medium',
                        isActive ? 'text-gray-900' : 'text-gray-600'
                      )}
                    >
                      {item.name}
                    </span>
                  )}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-5 rounded-full bg-gdg-blue" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Collapse Button */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              {!collapsed && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">U</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Admin User</span>
                    <Link
                      href="/logout"
                      className="flex items-center text-xs text-gray-500 hover:text-red-500"
                    >
                      <LogOut className="h-3 w-3 mr-1" />
                      Log out
                    </Link>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                  'h-8 w-8 rounded-full',
                  collapsed ? 'mx-auto' : ''
                )}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
