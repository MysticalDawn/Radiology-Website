'use client'
import { Brain, Home, Clock, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800 bg-stone flex justify-center items-center">
      <div className="flex items-center justify-between h-14 w-full max-w-5xl">
        <div className="flex items-center space-x-4">
          <Brain className="h-6 w-6 text-slate-200" />
          <h1 className="text-lg font-semibold">MWI Dashboard</h1>
        </div>
        <nav className="flex items-center space-x-4">
          <Link
            href="/"
            className={`flex items-center space-x-1 px-3 py-2 rounded-md ${pathname === "/" ? "bg-slate-900 text-white" : "hover:bg-slate-900 text-slate-400"}`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link
            href="/history"
            className={`flex items-center space-x-1 px-3 py-2 rounded-md ${pathname === "/history" ? "bg-slate-900 text-white" : "hover:bg-slate-900 text-slate-400"}`}
          >
            <Clock className="h-4 w-4" />
            <span>History</span>
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white"
                >
                  <User size={64} color="#000000" />
                  <span className="sr-only">User settings</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Dr. Abo Almotaz</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}