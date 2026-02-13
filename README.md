# Nexus Inventory Frontend

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-Development-blue.svg)](#)

A modern, responsive web application for IT Asset Management (ITAM) built with Next.js. Provides an intuitive user interface for managing hardware and software inventory, tracking asset lifecycles, and maintaining organizational accountability.

## 🚀 Features

### Dashboard & Overview
- **Dashboard**: Real-time overview of asset inventory with key metrics
- **Search & Filter**: Advanced search and filtering across all asset categories
- **Quick Actions**: Fast access to common operations

### Asset Management
- **Asset Listing**: Browse all hardware assets with detailed information
- **Asset Details**: View complete asset specifications, history, and associated software
- **Asset Creation**: Add new assets with category assignment and image upload
- **Asset Editing**: Update asset information and status
- **Asset Deletion**: Remove assets from inventory

### Employee Management
- **Employee Directory**: Manage organization employees
- **Asset Assignment**: Assign assets to employees
- **Employee Profiles**: View employee details and assigned assets
- **Hire Date Tracking**: Track employee tenure

### Category Management
- **Category Organization**: Define and manage asset categories
- **Category Hierarchy**: Organize assets by type and classification
- **Category Statistics**: View assets by category

### Software Management
- **Software Inventory**: Track all software licenses and installations
- **Software-Asset Mapping**: Link software to specific assets
- **License Tracking**: Monitor software distribution and usage

### Asset History & Audit Trail
- **Asset Lifecycle Tracking**: Complete history of asset check-in/check-out
- **Status Changes**: Track asset status modifications (active, maintenance, disposed)
- **Movement History**: Audit trail of asset assignments and ownership changes
- **Timestamp Records**: All changes timestamped for compliance

### Authentication & Security
- **JWT Authentication**: Secure login with JWT tokens
- **Session Management**: Automatic token refresh and logout
- **Role-Based Access**: Secure endpoints based on user permissions
- **Persistent Sessions**: Maintain login state across sessions

### User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Data Tables**: Paginated, sortable tables for large datasets
- **Image Previews**: Display asset images where available
- **Form Validation**: Client-side validation for data integrity

## 🛠 Tech Stack

- **Frontend Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks / Context API
- **HTTP Client**: Axios (or Fetch API)
- **Authentication**: JWT with localStorage/cookies
- **Form Handling**: React Hook Form (optional)
- **Validation**: Zod or Yup
- **UI Components**: Custom components or Shadcn/UI
- **Testing**: Jest + React Testing Library (optional)

## 📦 Getting Started

### Prerequisites

- Node.js 18+ or v20+
- npm, yarn, pnpm, or bun
- Nexus Inventory Backend running (`http://localhost:8000`)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/renato-chagas/nexus-inventory-frontend.git
   cd nexus-inventory-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_APP_NAME=Nexus Inventory
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## 📱 Pages & Routes

### Authentication
- `/login` - User login page
- `/logout` - Logout action

### Dashboard
- `/` - Main dashboard with overview and statistics

### Assets
- `/assets` - Asset listing page with search and filters
- `/assets/create` - Create new asset
- `/assets/[id]` - Asset detail view
- `/assets/[id]/edit` - Edit asset information

### Employees
- `/employees` - Employee directory
- `/employees/create` - Add new employee
- `/employees/[id]` - Employee profile with assigned assets
- `/employees/[id]/edit` - Edit employee information

### Categories
- `/categories` - Manage asset categories
- `/categories/create` - Create new category
- `/categories/[id]/edit` - Edit category

### Software
- `/software` - Software inventory
- `/software/create` - Add new software
- `/software/[id]/edit` - Edit software information

### Asset History
- `/asset-history` - View complete audit trail
- `/asset-history?asset=[id]` - Filter history by asset

## 🔌 API Integration

The frontend communicates with the Nexus Inventory Backend via REST API:

### Base URL
```
http://localhost:8000/api
```

### Key Endpoints

**Authentication:**
- `POST /token/` - Login and get JWT tokens
- `POST /token/refresh/` - Refresh access token

**Assets:**
- `GET /assets/` - List all assets
- `POST /assets/` - Create new asset
- `GET /assets/{id}/` - Get asset details
- `PATCH /assets/{id}/` - Update asset
- `DELETE /assets/{id}/` - Delete asset

**Employees:**
- `GET /employees/` - List all employees
- `POST /employees/` - Create new employee
- `GET /employees/{id}/` - Get employee details
- `PATCH /employees/{id}/` - Update employee
- `DELETE /employees/{id}/` - Delete employee

**Categories:**
- `GET /categories/` - List all categories
- `POST /categories/` - Create category
- `PATCH /categories/{id}/` - Update category
- `DELETE /categories/{id}/` - Delete category

**Software:**
- `GET /softwares/` - List all software
- `POST /softwares/` - Add software
- `PATCH /softwares/{id}/` - Update software
- `DELETE /softwares/{id}/` - Delete software

**Asset History:**
- `GET /asset-history/` - Get all asset history records
- `GET /asset-history/?asset={id}` - Filter by asset

**Images:**
- `POST /images/` - Upload asset image
- `DELETE /images/{id}/` - Delete image

## 🔐 Authentication Flow

1. User enters email and password on login page
2. Frontend sends credentials to `/api/token/`
3. Backend returns `access` and `refresh` tokens
4. Frontend stores tokens in localStorage/secure cookie
5. Subsequent requests include `Authorization: Bearer {token}` header
6. On token expiration, frontend requests new token from `/api/token/refresh/`
7. User can logout to clear tokens and redirect to login

## 🎨 Component Structure

```
components/
  ├── auth/
  │   ├── LoginForm.tsx
  │   └── LogoutButton.tsx
  ├── assets/
  │   ├── AssetList.tsx
  │   ├── AssetCard.tsx
  │   ├── AssetForm.tsx
  │   └── AssetDetail.tsx
  ├── employees/
  │   ├── EmployeeList.tsx
  │   ├── EmployeeCard.tsx
  │   ├── EmployeeForm.tsx
  │   └── EmployeeDetail.tsx
  ├── common/
  │   ├── Header.tsx
  │   ├── Sidebar.tsx
  │   ├── Footer.tsx
  │   └── SearchBar.tsx
  └── Layout.tsx

hooks/
  ├── useAuth.ts
  ├── useAssets.ts
  ├── useEmployees.ts
  ├── useCategories.ts
  └── useSoftware.ts

utils/
  ├── api.ts
  └── helpers.ts

styles/
  └── global.css
```

## 🚀 Key Features in Development

- [ ] Dashboard with asset statistics
- [ ] Advanced asset filtering and search
- [ ] Asset check-in/check-out workflow
- [ ] Bulk asset import from CSV
- [ ] Asset report generation
- [ ] Employee assignment history
- [ ] Software license tracking
- [ ] Mobile-responsive design
- [ ] Dark mode support
- [ ] Accessibility improvements (WCAG)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For questions or suggestions, reach out to [renatochagas.m@gmail.com](mailto:renatochagas.m@gmail.com) or open an issue.

---

**Backend Repository**: [Nexus Inventory Backend](https://github.com/renato-chagas/nexus-inventory-backend)

_Built as a portfolio project to demonstrate full-stack development skills with Next.js and Django._
