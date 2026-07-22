"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ProjectListItem } from "@/data/projects";
import { ProjectCard } from "./project-card";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface ProjectGridProps {
  projects: ProjectListItem[];
  categories?: { id: string; name: string; slug: string }[];
}

/**
 * ProjectGrid
 *
 * Premium filterable grid:
 * - Category filter pills with animated active indicator
 * - Floating search input with clear button
 * - Animated count badge
 * - AnimatePresence on card exit/enter
 * - Empty state with guidance
 */
export function ProjectGrid({ projects, categories = [] }: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (activeCategory && p.category?.slug !== activeCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [projects, activeCategory, searchQuery]);

  const clearFilters = () => {
    setActiveCategory(null);
    setSearchQuery("");
  };

  const hasFilters = activeCategory !== null || searchQuery !== "";

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">

        {/* Category pills */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button
            onClick={() => setActiveCategory(null)}
            aria-pressed={activeCategory === null}
            className={cn(
              "relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              activeCategory === null
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground bg-surface-secondary/60 hover:bg-surface-secondary"
            )}
          >
            {activeCategory === null && (
              <motion.span
                layoutId="category-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">All</span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              aria-pressed={activeCategory === cat.slug}
              className={cn(
                "relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                activeCategory === cat.slug
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground bg-surface-secondary/60 hover:bg-surface-secondary"
              )}
            >
              {activeCategory === cat.slug && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Search + clear */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
            <input
              type="search"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search projects"
              className={cn(
                "w-full pl-9 pr-9 py-2 rounded-xl text-sm",
                "bg-surface-secondary/50 border border-border/60",
                "text-foreground placeholder:text-muted-foreground/50",
                "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30",
                "transition-all duration-200"
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Clear all filters */}
          <AnimatePresence>
            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                aria-label="Clear all filters"
              >
                Clear all
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 mb-8">
        <motion.span
          key={filtered.length}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
        >
          {filtered.length}
        </motion.span>
        <span className="text-sm text-muted-foreground">
          of {projects.length} projects
        </span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] }}
              >
                <ProjectCard project={project} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-surface-secondary/60 flex items-center justify-center mb-4">
            <Search className="h-5 w-5 text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground text-sm font-medium mb-1">
            No projects found
          </p>
          <p className="text-muted-foreground/60 text-xs mb-4">
            Try adjusting your filters or search query
          </p>
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Clear filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
