---
name: Web UI Design System
description: Design system and UI patterns from Bill Tracking App - dark theme, glassmorphism, responsive layouts
---

# Web UI Design System Skill

## Overview

This skill captures the design system and UI patterns used in the Bill Tracking App, providing a consistent, modern, and beautiful interface foundation for all projects.

## Design Philosophy

- **Dark-first design** - Optimized for dark mode
- **Glassmorphism** - Subtle transparency and blur effects
- **Minimalist** - Clean, focused interfaces
- **Responsive** - Mobile-first approach
- **Accessible** - WCAG 2.1 AA compliance

## Color System

### Primary Palette

```css
/* Dark Theme Base */
--bg-primary: #0f172a;      /* slate-900 */
--bg-secondary: #1e293b;    /* slate-800 */
--bg-tertiary: #334155;     /* slate-700 */

/* Accent Colors */
--accent-primary: #3b82f6;  /* blue-500 */
--accent-hover: #2563eb;    /* blue-600 */
--accent-light: #60a5fa;    /* blue-400 */

/* Text Colors */
--text-primary: #f1f5f9;    /* slate-100 */
--text-secondary: #cbd5e1;  /* slate-300 */
--text-muted: #94a3b8;      /* slate-400 */

/* Semantic Colors */
--success: #10b981;         /* green-500 */
--warning: #f59e0b;         /* amber-500 */
--error: #ef4444;           /* red-500 */
--info: #3b82f6;            /* blue-500 */

/* Borders & Dividers */
--border-color: #334155;    /* slate-700 */
--border-subtle: #1e293b;   /* slate-800 */
```

### Gradient Backgrounds

```css
/* Page Background */
background: linear-gradient(to bottom right, #0f172a, #1e293b);

/* Card Highlight */
background: linear-gradient(135deg, #1e293b 0%, #334155 100%);

/* Button Gradient */
background: linear-gradient(to right, #3b82f6, #2563eb);
```

## Typography

### Font Stack

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale

```css
/* Headings */
--text-4xl: 2.25rem;  /* 36px - Page titles */
--text-3xl: 1.875rem; /* 30px - Section headers */
--text-2xl: 1.5rem;   /* 24px - Card titles */
--text-xl: 1.25rem;   /* 20px - Subsections */
--text-lg: 1.125rem;  /* 18px - Large body */

/* Body */
--text-base: 1rem;    /* 16px - Default */
--text-sm: 0.875rem;  /* 14px - Small text */
--text-xs: 0.75rem;   /* 12px - Captions */
```

### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Component Patterns

### Card Component

```tsx
// Standard card with glassmorphism
<div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
  {/* Card content */}
</div>

// Hover effect card
<div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6
                hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-200">
  {/* Interactive card content */}
</div>
```

### Button Patterns

```tsx
// Primary button
<button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 
                   rounded-lg transition-colors duration-200">
  Primary Action
</button>

// Secondary button
<button className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium px-4 py-2 
                   rounded-lg transition-colors duration-200">
  Secondary Action
</button>

// Danger button
<button className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 
                   rounded-lg transition-colors duration-200">
  Delete
</button>

// Ghost button
<button className="text-slate-300 hover:text-white hover:bg-slate-700/50 font-medium px-4 py-2 
                   rounded-lg transition-all duration-200">
  Cancel
</button>
```

### Input Fields

```tsx
<input
  type="text"
  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2
             text-slate-100 placeholder-slate-400
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
             transition-all duration-200"
  placeholder="Enter value..."
/>
```

### Modal/Dialog

```tsx
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 max-w-md w-full mx-4
                  shadow-2xl">
    {/* Modal content */}
  </div>
</div>
```

## Layout Patterns

### Page Layout

```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
  {/* Header */}
  <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
    {/* Navigation */}
  </header>
  
  {/* Main Content */}
  <main className="container mx-auto px-4 py-8 max-w-7xl">
    {/* Page content */}
  </main>
</div>
```

### Grid Layouts

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>

// Dashboard layout
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">
    {/* Main content */}
  </div>
  <div>
    {/* Sidebar */}
  </div>
</div>
```

## Icon Usage

### Lucide React Icons

```tsx
import { Home, Settings, User, LogOut, Plus, Edit, Trash } from 'lucide-react';

// Icon with text
<button className="flex items-center gap-2">
  <Plus className="w-5 h-5" />
  <span>Add New</span>
</button>

// Icon button
<button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
  <Settings className="w-5 h-5" />
</button>
```

## Animation Patterns

### Transitions

```css
/* Standard transition */
transition: all 0.2s ease-in-out;

/* Color transition */
transition: background-color 0.2s, border-color 0.2s;

/* Transform transition */
transition: transform 0.2s ease-in-out;
```

### Hover Effects

```tsx
// Scale on hover
<div className="hover:scale-105 transition-transform duration-200">

// Lift on hover
<div className="hover:-translate-y-1 hover:shadow-lg transition-all duration-200">

// Glow on hover
<div className="hover:shadow-blue-500/50 hover:shadow-lg transition-shadow duration-200">
```

## Responsive Design

### Breakpoints

```css
/* Mobile first */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Responsive Patterns

```tsx
// Hide on mobile
<div className="hidden md:block">

// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">

// Full width on mobile, fixed on desktop
<div className="w-full md:w-96">

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">
```

## Accessibility

### Focus States

```tsx
// Keyboard focus
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                   focus:ring-offset-slate-900">
```

### ARIA Labels

```tsx
<button aria-label="Close dialog">
  <X className="w-5 h-5" />
</button>

<input aria-label="Search bills" placeholder="Search..." />
```

### Semantic HTML

```tsx
<nav aria-label="Main navigation">
<main aria-label="Main content">
<aside aria-label="Sidebar">
```

## Form Patterns

### Form Layout

```tsx
<form className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">
      Label
    </label>
    <input className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2..." />
  </div>
  
  <div className="flex gap-3 justify-end">
    <button type="button" className="...">Cancel</button>
    <button type="submit" className="...">Save</button>
  </div>
</form>
```

### Validation States

```tsx
// Error state
<input className="border-red-500 focus:ring-red-500" />
<p className="text-red-400 text-sm mt-1">Error message</p>

// Success state
<input className="border-green-500 focus:ring-green-500" />
<p className="text-green-400 text-sm mt-1">Success message</p>
```

## Loading States

```tsx
// Skeleton loader
<div className="animate-pulse bg-slate-700 rounded h-4 w-3/4"></div>

// Spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>

// Loading button
<button disabled className="opacity-50 cursor-not-allowed">
  <div className="animate-spin ..."></div>
  Loading...
</button>
```

## Best Practices

1. **Consistency** - Use the same patterns across the app
2. **Spacing** - Use consistent spacing scale (4px, 8px, 16px, 24px, 32px)
3. **Contrast** - Ensure text meets WCAG AA standards (4.5:1 ratio)
4. **Touch targets** - Minimum 44x44px for interactive elements
5. **Feedback** - Provide visual feedback for all interactions
6. **Performance** - Minimize animations, use CSS transforms
7. **Dark mode** - Design for dark mode first, light mode optional

## Quick Reference

### Common Class Combinations

```tsx
// Page container
className="container mx-auto px-4 py-8 max-w-7xl"

// Card
className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-6"

// Button
className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"

// Input
className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-blue-500"

// Text
className="text-slate-100 font-medium"
```

## Resources

- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev
- **Inter Font:** https://fonts.google.com/specimen/Inter
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
