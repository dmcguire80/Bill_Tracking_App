# Findings & Decisions
<!-- 
  WHAT: Your knowledge base for the task. Stores everything you discover and decide.
  WHY: Context windows are limited. This file is your "external memory" - persistent and unlimited.
  WHEN: Update after ANY discovery, especially after 2 view/browser/search operations (2-Action Rule).
-->

## Requirements
<!-- 
  WHAT: What the user asked for, broken down into specific requirements.
  WHY: Keeps requirements visible so you don't forget what you're building.
  WHEN: Fill this in during Phase 1 (Requirements & Discovery).
-->
<!-- Captured from user request -->
- Web app version of Bill Payment Tracker.
- Inspired by existing Apple Numbers document.
- List view of all bills.
- Check boxes for paid bills.
- Amount trackers.
- Paydates.
- Modern, premium design ("wowed at first glance", "vibrant colors", "smooth gradients").
- **CRUD Operations:** Add/Edit/Remove Bills, Due Dates, Amounts, Payment Accounts.
- **Adhoc Bills:** Ability to add one-off/extra bill payments (Adhoc lines).
- **Administrative Pages:** Dedicated interface to setup bills and payment accounts.
- **Bill Templates:** Define bills with recurrence rules (Bi-weekly, Monthly, Yearly).
- **Auto-Population:** Generate a full year of records based on templates.
- **Auto-Update:** App updates list automatically when data changes.
- **Dynamic Logic:** Bill rows subtract from Payday accounts as marked complete.
- **Pay Period Totals:** Maintain running total for the pay period.

## Research Findings
<!-- 
  WHAT: Key discoveries from web searches, documentation reading, or exploration.
  WHY: Multimodal content (images, browser results) doesn't persist. Write it down immediately.
  WHEN: After EVERY 2 view/browser/search operations, update this section (2-Action Rule).
-->
<!-- Key discoveries during exploration -->
- **Screenshot Analysis:**
    - The tracker is row-based, sorted by date.
    - Start Date: Jan '26.
    - Columns: Month, Date, Bill, Paid (Checkbox), CFCU, Apple, Venmo, Cap1, Ally, Biz, Mom Auto, Mom Manual.
    - "Payday" is a special row type.
    - Payday rows have colored cells (Green for positive/available?, Red/Pink for maybe negative or outgoing?).
    - Bills have specific amounts in specific 'Account' columns (e.g., Wowway pays from CFCU?).
    - Some bills have amounts in multiple columns? No, seems one column per bill usually.
    - "Apple Card CC" is listed on the same date as Wowway, and has amounts in CFCU and Cap1.

## Technical Decisions
<!-- 
  WHAT: Architecture and implementation choices you've made, with reasoning.
  WHY: You'll forget why you chose a technology or approach. This table preserves that knowledge.
  WHEN: Update whenever you make a significant technical choice.
-->
<!-- Decisions made with rationale -->
| Decision | Rationale |
|----------|-----------|
| React + Vite | Best for interactive, single-page web apps. |
| Tailwind CSS | Efficient styling, easy to implement modern, premium designs. |

## Issues Encountered
<!-- 
  WHAT: Problems you ran into and how you solved them.
  WHY: Similar to errors in task_plan.md, but focused on broader issues (not just code errors).
  WHEN: Document when you encounter blockers or unexpected challenges.
-->
<!-- Errors and how they were resolved -->
| Issue | Resolution |
|-------|------------|
|       |            |

## Resources
<!-- 
  WHAT: URLs, file paths, API references, documentation links you've found useful.
  WHY: Easy reference for later. Don't lose important links in context.
  WHEN: Add as you discover useful resources.
-->
<!-- URLs, file paths, API references -->
- Screenshots: `/screenshots/Screenshot 2026-01-23 at 2.31.55 PM.png`, `/screenshots/Screenshot 2026-01-23 at 2.32.35 PM.png`

## Visual/Browser Findings
<!-- 
  WHAT: Information you learned from viewing images, PDFs, or browser results.
  WHY: CRITICAL - Visual/multimodal content doesn't persist in context. Must be captured as text.
  WHEN: IMMEDIATELY after viewing images or browser results. Don't wait!
-->
<!-- CRITICAL: Update after every 2 view/browser operations -->
<!-- Multimodal content must be captured as text immediately -->
- **Spreadsheet Structure:**
    - Header: Teal background, white text.
    - Rows: Alternating colors? Or just white.
    - Payday Row: Distinctive. Bold text "Payday". Green background for positive values.
    - Paid Checkbox: Simple square box.
    - Date Column: Just the day number (e.g., "7", "8").
    - Bill Column: Name of the bill or payee.
    - Account Columns: Tracking balances or payments from specific sources.
