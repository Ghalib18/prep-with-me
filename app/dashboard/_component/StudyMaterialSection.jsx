"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ExternalLink,
  Code2,
  Database,
  Cpu,
  Globe,
  Layers,
  MessageSquare,
  Search,
  Sparkles,
  Award,
  CheckCircle2,
  Bookmark,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STUDY_MATERIALS = [
  // 1. DSA
  {
    id: "strivers-sde-sheet",
    title: "Striver's SDE Sheet (Top Coding Problems)",
    platform: "TakeUforward (Raj Vikramaditya)",
    category: "DSA",
    icon: Code2,
    badge: "180+ Problems",
    difficulty: "Beginner to Advanced",
    color: "from-blue-600 to-indigo-600",
    bgLight: "bg-blue-50/50 border-blue-200/70",
    description:
      "The most trusted roadmap by product-based companies and FAANG aspirants covering Arrays, Linked Lists, Trees, DP, Graphs, and Greedy algorithms.",
    url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/",
    highlights: ["Arrays & Matrix", "Dynamic Programming", "Graphs & Trees", "Recursion & Backtracking"],
  },
  {
    id: "neetcode-150",
    title: "NeetCode 150 Practice Roadmap",
    platform: "NeetCode.io",
    category: "DSA",
    icon: Code2,
    badge: "150 Questions",
    difficulty: "All Levels",
    color: "from-cyan-600 to-blue-600",
    bgLight: "bg-cyan-50/50 border-cyan-200/70",
    description:
      "A structured algorithmic curriculum categorizing LeetCode questions by pattern (Two Pointers, Sliding Window, Heap, Trie, DP) with comprehensive video breakdowns.",
    url: "https://neetcode.io/practice",
    highlights: ["Pattern-based Learning", "Sliding Window", "Binary Search", "Intervals"],
  },
  {
    id: "blind-75",
    title: "Blind 75 LeetCode Essentials",
    platform: "LeetCode Classic",
    category: "DSA",
    icon: Code2,
    badge: "75 Curated",
    difficulty: "Intermediate",
    color: "from-indigo-600 to-purple-600",
    bgLight: "bg-indigo-50/50 border-indigo-200/70",
    description:
      "The legendary 75 questions compiled by a Facebook tech lead covering all core algorithmic fundamentals required for high-stakes technical interviews.",
    url: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions",
    highlights: ["High ROI Problems", "Array & Hashing", "Tree Traversal", "Graph Algorithms"],
  },

  // 2. SQL & Databases
  {
    id: "leetcode-sql-50",
    title: "LeetCode Top SQL 50 Study Plan",
    platform: "LeetCode",
    category: "SQL",
    icon: Database,
    badge: "Top 50 Queries",
    difficulty: "Easy to Hard",
    color: "from-emerald-600 to-teal-600",
    bgLight: "bg-emerald-50/50 border-emerald-200/70",
    description:
      "Master essential database query patterns: Joins, Aggregations, Window Functions, Subqueries, and Complex CTEs frequently asked in backend & data interviews.",
    url: "https://leetcode.com/studyplan/top-sql-50/",
    highlights: ["Window Functions (RANK, DENSE_RANK)", "Self & Outer Joins", "GROUP BY & HAVING", "Subqueries & CTEs"],
  },
  {
    id: "mode-sql-tutorial",
    title: "Mode Interactive SQL Tutorial",
    platform: "Mode Analytics",
    category: "SQL",
    icon: Database,
    badge: "Comprehensive",
    difficulty: "All Levels",
    color: "from-teal-600 to-emerald-600",
    bgLight: "bg-teal-50/50 border-teal-200/70",
    description:
      "Hands-on interactive database course with real analytical queries, business case studies, and advanced data manipulation techniques.",
    url: "https://mode.com/sql-tutorial/",
    highlights: ["Interactive Sandbox", "Data Wrangling", "Analytical Windows", "Business Case Studies"],
  },

  // 3. System Design
  {
    id: "system-design-primer",
    title: "System Design Primer",
    platform: "Donne Martin (GitHub #1 Guide)",
    category: "System Design",
    icon: Cpu,
    badge: "260k+ Stars",
    difficulty: "Mid to Senior",
    color: "from-amber-600 to-orange-600",
    bgLight: "bg-amber-50/50 border-amber-200/70",
    description:
      "An immense open-source repository teaching how to design large-scale distributed systems, load balancers, caching, microservices, and databases at scale.",
    url: "https://github.com/donnemartin/system-design-primer",
    highlights: ["Horizontal Scaling", "Sharding & Caching", "CAP Theorem", "Microservices Architecture"],
  },
  {
    id: "bytebytego-system-design",
    title: "ByteByteGo Visual System Design",
    platform: "Alex Xu",
    category: "System Design",
    icon: Cpu,
    badge: "Illustrated",
    difficulty: "All Levels",
    color: "from-orange-600 to-rose-600",
    bgLight: "bg-orange-50/50 border-orange-200/70",
    description:
      "Rich visual diagrams and architectural deep-dives breaking down URL shorteners, chat systems, rate limiters, payment platforms, and notification services.",
    url: "https://bytebytego.com/",
    highlights: ["Visual Diagrams", "Real World Case Studies", "Rate Limiting", "Message Brokers (Kafka/RabbitMQ)"],
  },

  // 4. Frontend Engineering
  {
    id: "greatfrontend-75",
    title: "GreatFrontEnd 75 UI Practice",
    platform: "GreatFrontEnd",
    category: "Frontend",
    icon: Globe,
    badge: "UI & JS Coding",
    difficulty: "Junior to Staff",
    color: "from-violet-600 to-purple-600",
    bgLight: "bg-violet-50/50 border-violet-200/70",
    description:
      "The definitive frontend interview preparation platform created by ex-FAANG engineers covering JavaScript polyfills, DOM challenges, and UI components.",
    url: "https://www.greatfrontend.com/prepare",
    highlights: ["Debounce & Throttle", "Promise Polyfills", "Virtual DOM & State", "Component Architecture"],
  },
  {
    id: "leetcode-30-days-js",
    title: "30 Days of JavaScript Challenge",
    platform: "LeetCode",
    category: "Frontend",
    icon: Globe,
    badge: "30 Core Challenges",
    difficulty: "Essential",
    color: "from-purple-600 to-pink-600",
    bgLight: "bg-purple-50/50 border-purple-200/70",
    description:
      "Reinforce core JavaScript mechanics: Closures, Currying, Function Composition, Async/Await, Generators, and JSON transformations.",
    url: "https://leetcode.com/studyplan/30-days-of-javascript/",
    highlights: ["Closures & Scope", "Promises & Async", "Function Transforms", "JSON & Objects"],
  },

  // 5. CS Core Fundamentals
  {
    id: "cs-fundamentals-gfg",
    title: "OS, DBMS & Computer Networks Revision",
    platform: "GeeksforGeeks",
    category: "CS Core",
    icon: Layers,
    badge: "Core Subjects",
    difficulty: "Revision",
    color: "from-emerald-700 to-cyan-700",
    bgLight: "bg-emerald-50/50 border-emerald-200/70",
    description:
      "Last minute high-yield revision notes for Operating Systems (Process Scheduling, Deadlocks, Threads), DBMS (ACID, Normalization), and Computer Networks (OSI, TCP/IP, DNS).",
    url: "https://www.geeksforgeeks.org/last-minute-notes-operating-systems/",
    highlights: ["Deadlocks & Memory Management", "ACID Properties & B-Trees", "TCP vs UDP & Sockets", "Process vs Thread"],
  },
  {
    id: "oops-interview-guide",
    title: "Top 50 OOPs Concepts & Design Patterns",
    platform: "GeeksforGeeks",
    category: "CS Core",
    icon: Layers,
    badge: "Object Oriented",
    difficulty: "Foundation",
    color: "from-blue-700 to-indigo-700",
    bgLight: "bg-blue-50/50 border-blue-200/70",
    description:
      "Master Polymorphism, Encapsulation, Inheritance, Abstraction, along with Singleton, Factory, and Observer design patterns with concrete code examples.",
    url: "https://www.geeksforgeeks.org/oops-interview-questions/",
    highlights: ["SOLID Principles", "Inheritance vs Composition", "Design Patterns", "Virtual Functions & Overriding"],
  },

  // 6. Behavioral & HR
  {
    id: "star-method-framework",
    title: "The STAR Method & Top 30 HR Questions",
    platform: "The Muse",
    category: "Behavioral",
    icon: MessageSquare,
    badge: "HR & Leadership",
    difficulty: "All Roles",
    color: "from-rose-600 to-pink-600",
    bgLight: "bg-rose-50/50 border-rose-200/70",
    description:
      "Framework for structuring situation, task, action, and result responses to effortlessly answer 'Tell me about a time you had a conflict' and leadership scenarios.",
    url: "https://www.themuse.com/advice/star-interview-method",
    highlights: ["Situation-Task-Action-Result", "Conflict Resolution", "Failure & Learning Stories", "Leadership Impact"],
  },
  {
    id: "tech-interview-handbook",
    title: "Tech Interview Handbook",
    platform: "Yangshun Tay (ex-Meta)",
    category: "Behavioral",
    icon: MessageSquare,
    badge: "Complete Playbook",
    difficulty: "All Roles",
    color: "from-pink-600 to-rose-600",
    bgLight: "bg-pink-50/50 border-pink-200/70",
    description:
      "Free curated interview preparation guidebook covering algorithmic strategies, questions to ask interviewers, negotiation tactics, and behavioral question banks.",
    url: "https://www.techinterviewhandbook.org/",
    highlights: ["Reverse Interview Questions", "Offer Negotiation", "Resume Dos and Don'ts", "Coding Cheatsheets"],
  },
];

const CATEGORIES = [
  "All",
  "DSA",
  "SQL",
  "System Design",
  "Frontend",
  "CS Core",
  "Behavioral",
];

export default function StudyMaterialSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMaterials = STUDY_MATERIALS.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="my-10 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Curated Study Materials & Question Sheets
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Top industry sheets, roadmaps & resources. Click any topic to open the official resource in a new tab.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search sheets, Striver, SQL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 text-xs h-9 rounded-xl"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Study Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div>
                {/* Header row with Icon, Category & Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${item.color} text-white shadow-sm group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                        {item.category}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {item.platform}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-bold text-foreground/80 border border-border/60">
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm text-foreground group-hover:text-blue-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {/* Topic Highlights Chips */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.highlights.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-foreground/80 border border-border/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-border/70">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-50/80 hover:bg-blue-600 text-blue-700 hover:text-white px-3 py-2 text-xs font-semibold transition-all duration-200 border border-blue-200/80 group-hover:border-blue-600"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
