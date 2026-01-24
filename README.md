# Bill Tracker

A modern, intuitive bill tracking and financial management application built with React, TypeScript, and Tailwind CSS.

## Features

### 📊 Dashboard
- Real-time balance tracking across multiple accounts
- Running balance calculations with payday integration
- Visual bill and payment management
- Sortable and filterable bill table

### 📅 Template Management
- Create recurring bill templates (weekly, bi-weekly, monthly, semi-monthly, yearly)
- Payday schedule templates
- Active/inactive status with optional end dates
- Automatic entry generation from templates

### 📈 Analytics
- Year-to-date paid vs planned tracking
- Bill amount change detection
- Historical year comparison
- One-time payment inclusion
- Status indicators and insights

### ⚙️ Account Management
- Multiple payment account support
- Account reordering
- Custom account names
- Balance tracking per account

### 🎨 User Experience
- Unified navigation system
- Responsive design for mobile and desktop
- Dark mode interface with gradient backgrounds
- Smooth transitions and animations

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Context API
- **Data Persistence**: localStorage (v0.3.0)

## Installation

### Local Development
```bash
# Clone the repository
git clone https://github.com/dmcguire80/Bill_Tracking_App.git
cd Bill_Tracking_App

# Install dependencies
npm install

# Start development server
npm run dev
```

### Proxmox VE Deployment
Automated scripts are provided for Proxmox LXC deployment:
1. Copy the raw link to [create_lxc.sh](https://raw.githubusercontent.com/dmcguire80/Bill_Tracking_App/main/proxmox/create_lxc.sh)
2. Run it on your Proxmox host: `curl -fsSL <link> | bash`
3. See [Proxmox Installation Guide](proxmox/README.md) for detailed instructions.

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── BillForm.tsx
│   ├── BillTable.tsx
│   ├── Layout.tsx
│   ├── Navigation.tsx
│   ├── PaydayForm.tsx
│   └── SettingsNav.tsx
├── context/          # React Context providers
│   └── DataContext.tsx
├── data/             # Initial data and constants
│   └── initialData.ts
├── hooks/            # Custom React hooks
│   └── useCalculations.ts
├── pages/            # Page components
│   ├── Analytics.tsx
│   ├── ManageAccounts.tsx
│   ├── ManageBills.tsx
│   └── ManagePaydays.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
│   ├── billAnalytics.ts
│   └── generator.ts
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## Usage

### Creating Bill Templates
1. Navigate to **Settings → Manage Bills**
2. Click **New Template**
3. Fill in bill details (name, recurrence, day, amounts)
4. Set active status and optional end month
5. Save to automatically generate entries

### Managing Paydays
1. Navigate to **Settings → Manage Paydays**
2. Create payday templates with balances
3. Entries are auto-generated based on schedule

### Tracking Payments
1. View all bills on the **Dashboard**
2. Click checkboxes to mark bills as paid
3. Add one-time payments with the **One-time Payment** button
4. Add deposits with the **Add Deposit** button

### Viewing Analytics
1. Navigate to **Analytics**
2. Select a year to view
3. Review paid vs planned amounts
4. Monitor bill amount changes

## Roadmap

### v0.4.0 (Planned)
- [ ] User authentication (Firebase/Supabase)
- [ ] Multi-device sync
- [ ] Cloud data storage
- [ ] Password reset and account recovery

### v0.5.0 (Planned)
- [ ] First-use setup wizard
- [ ] Guided onboarding
- [ ] Quick-start templates

### Future Enhancements
- [ ] Budget tracking
- [ ] Spending insights
- [ ] Export to CSV/PDF
- [ ] Recurring payment reminders
- [ ] Mobile app (React Native)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Changelog

### v0.3.0 (2026-01-24)
- Added active/inactive template status
- Implemented end month for automatic deactivation
- Created unified navigation system
- Improved UX consistency

### v0.2.0 (2026-01-24)
- Implemented bill analytics and tracking
- Added year-to-date insights
- Bill amount change detection
- One-time payment tracking in analytics

### v0.1.0 (2026-01-24)
- Initial release
- Bill and payday tracking
- Template management
- Balance calculations
- Account management
