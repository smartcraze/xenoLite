"use client";

import { useTheme } from "next-themes";
import { IconCircleHalf2 } from "@tabler/icons-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 hover:bg-muted/50 transition-colors rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground"
      aria-label="Toggle theme"
    >
      <IconCircleHalf2 stroke={1.5} className="h-5 w-5" />
    </button>
  );
}
