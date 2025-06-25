# AI Prompt: QuickShip Courier Manager Application Development

## Objective
Generate the complete code structure, database schema, backend logic (Controllers, Models, Migrations), and frontend components for a comprehensive courier service management application named "QuickShip Courier Manager". The application **MUST** use the **official Laravel React Starter Kit** and strictly adhere to the specified technology stack.

## Critical Technology Stack Requirements

### Backend Framework
- **Laravel Framework:** Latest stable version (11.x or newer)
- **PHP:** Latest stable version compatible with Laravel
- **Database:** MySQL or PostgreSQL
- **Authentication:** Laravel's built-in authentication system
- **Authorization:** Spatie/laravel-permission package for Role-Based Access Control (RBAC)
- **Email System:** Laravel Mail with queue support
- **File Storage:** Laravel Storage with S3/local disk support
- **PDF Generation:** Laravel-Snappy (wkhtmltopdf) or DomPDF for reports and receipts

### Frontend Framework - **MANDATORY USE OF LARAVEL REACT STARTER KIT**
**CRITICAL:** This project MUST use the official Laravel React Starter Kit. Initialize the project using:
```bash
laravel new quickship-courier-manager
```
When prompted, select the **React** starter kit option.

The Laravel React starter kit provides:
- **Inertia 2:** Server-side routing with client-side React rendering  
- **React 19:** Latest React version with concurrent features
- **TypeScript:** Full TypeScript support for type safety
- **Tailwind 4:** Latest utility-first CSS framework
- **Shadcn/ui:** Modern, accessible component library
- **Vite:** Fast build tool and development server
- **Built-in Authentication:** Laravel's authentication system (not Sanctum API)

### Key Architectural Decisions
1. **Built-in Authentication:** Use the Laravel React Starter Kit's included authentication system
2. **Inertia 2 First:** All routes should return Inertia responses, not API endpoints
3. **TypeScript Everywhere:** All React components must be TypeScript (.tsx files)
4. **Shadcn/ui Components:** Use shadcn/ui for all UI components (buttons, forms, tables, etc.)
5. **Tailwind 4 Styling:** All custom styling must use Tailwind utility classes
6. **Sidebar Layout:** Use the default sidebar layout variant (can be customized)

## Database Schema Requirements

Design a normalized database with the following tables using Laravel Migrations:

### Core Tables
1. **users** (Laravel default, enhanced with additional fields)
2. **roles** (Spatie permission package)
3. **permissions** (Spatie permission package)
4. **locations** (shipping origins/destinations)
5. **shipments** (core shipment data)
6. **shipment_history** (tracking history)
7. **shipment_messages** (communication system)
8. **shipment_files** (document attachments)

### Detailed Schema Requirements
- **users:** Add fields for phone, address, company_name, user_type
- **locations:** street, city, state, postal_code, country, coordinates (lat/lng)
- **shipments:** tracking_id (unique), sender_id, recipient details, pricing, status, dimensions, weight
- **shipment_history:** status changes with timestamps and responsible user
- **shipment_messages:** threaded communication system
- **shipment_files:** file attachments (receipts, photos, documents)

## User Roles & Permissions (RBAC)

### Role Definitions
1. **Super Admin:** Complete system access
2. **System Admin:** User management, system settings
3. **Receptionist:** Shipment management, customer service
4. **Customer:** Own shipments only, tracking access

### Permission Structure
- **Shipment Management:** create, read, update, delete shipments
- **User Management:** manage users, assign roles
- **Reporting:** view reports, export data
- **System Settings:** configure system parameters
- **File Management:** upload, download, delete attachments

## Core Feature Implementation

### 1. Shipment Management System
- **CRUD Operations:** Full create, read, update, delete functionality
- **Unique Tracking:** Auto-generated tracking IDs (UUID-based)
- **Status Management:** Automated status transitions with history logging
- **Bulk Operations:** Mass status updates, bulk printing
- **Advanced Search:** Multi-criteria filtering and sorting

### 2. Real-time Tracking System
- **Public Tracking:** Guest access via tracking ID
- **Status History:** Complete audit trail of shipment progress
- **Location Updates:** Current location tracking
- **Estimated Delivery:** Dynamic delivery time calculation
- **Notification System:** Email alerts for status changes

### 3. Communication System
- **Message Threads:** Per-shipment communication channels
- **File Attachments:** Upload proof of delivery, photos, documents
- **Email Integration:** Automated email notifications
- **Internal Notes:** Staff-only communication system

### 4. Reporting & Analytics
- **Dashboard:** Key metrics and KPIs
- **Custom Reports:** Date range, status, user-based filtering
- **Export Options:** PDF, CSV, Excel formats
- **Revenue Tracking:** Payment status and financial reports
- **Performance Metrics:** Delivery times, success rates

### 5. Security & Validation
- **Input Validation:** Server-side validation with Laravel Form Requests
- **CSRF Protection:** Built-in CSRF token validation
- **Rate Limiting:** API rate limiting for public tracking
- **File Security:** Secure file upload with virus scanning
- **Data Encryption:** Sensitive data encryption at rest

## Code Generation Requirements

### Laravel Backend Components
1. **Migrations:** Complete database schema with foreign keys and indexes
2. **Models:** Eloquent models with relationships, accessors, mutators
3. **Controllers:** Resource controllers with proper validation and authorization
4. **Form Requests:** Validation classes for all form submissions
5. **Policies:** Authorization policies for each model
6. **Jobs:** Queue jobs for email sending and heavy operations
7. **Mail Classes:** Notification emails with templates
8. **Seeders:** Database seeders for roles, permissions, and test data

### React Frontend Components (TypeScript + Shadcn/ui)

#### File Structure (Following Laravel React Starter Kit)
The React starter kit organizes frontend code in the `resources/js` directory:
```
resources/js/
├── components/     # Reusable React components
│   └── ui/        # Shadcn/ui components
├── hooks/         # React hooks  
├── layouts/       # Application layouts
│   ├── app/       # App layouts (sidebar/header variants)
│   └── auth/      # Authentication layouts (simple/card/split)
├── lib/          # Utility functions and configuration
├── pages/        # Page components (Inertia pages)
└── types/        # TypeScript definitions
```

#### Component Requirements
1. **Pages:** Inertia page components for each major feature
2. **Components:** Reusable UI components using shadcn/ui
3. **Forms:** Type-safe forms with validation
4. **Tables:** Data tables with sorting, filtering, pagination
5. **Modals:** Dialog components for actions and confirmations
6. **Layouts:** 
   - Use default sidebar layout (`app-sidebar-layout`)
   - Consider header layout option (`app-header-layout`)
   - Choose from sidebar variants: default, inset, floating
7. **Types:** TypeScript interfaces for all data structures

#### Shadcn/ui Component Integration
Add additional shadcn/ui components as needed:
```bash
npx shadcn@latest add [component-name]
```
Components will be published to `resources/js/components/ui/[component-name].tsx`

### Integration Examples
1. **Inertia Responses:** Show how to pass data from controllers to React components
2. **Form Submissions:** Demonstrate Inertia form handling with validation
3. **File Uploads:** Show file upload implementation with progress tracking
4. **Real-time Updates:** WebSocket integration for live tracking updates

## Advanced Features

### Payment Integration (Minimal)
- **Payment Status:** Track payment status in database
- **Manual Payment:** Admin interface for payment confirmation
- **Invoice Generation:** PDF invoice creation
- **Payment History:** Track payment attempts and confirmations

### Hardware Integration (Preparation)
- **Barcode Scanning:** Input field preparation for scanner integration
- **File Upload:** Camera integration for proof of delivery
- **API Endpoints:** Prepare API endpoints for mobile scanner apps

### Performance Optimization
- **Database Indexing:** Optimize queries with proper indexes
- **Caching:** Redis caching for frequently accessed data
- **Queue System:** Async processing for heavy operations
- **API Optimization:** Efficient data loading and pagination

## Deployment Considerations
- **Environment Configuration:** Production-ready .env setup
- **Asset Compilation:** Vite build optimization (`npm run build`)
- **Database Migrations:** Safe migration deployment
- **Queue Workers:** Background job processing
- **File Storage:** Production file storage configuration
- **HTTPS Configuration:** SSL certificate setup
- **Performance Monitoring:** Error tracking and performance metrics
- **SSR Support:** Optional Inertia server-side rendering (`npm run build:ssr`)

## AI Output Requirements

### Code Structure
- **File Organization:** Clear file paths and organization
- **Naming Conventions:** Follow Laravel and React best practices
- **Comments:** Comprehensive code documentation
- **Error Handling:** Robust error handling throughout
- **Type Safety:** Full TypeScript implementation

### Quality Standards
- **Modern Syntax:** Use latest PHP and JavaScript features
- **Security First:** Implement security best practices
- **Performance:** Optimize for speed and efficiency
- **Accessibility:** Ensure UI accessibility compliance
- **Responsive Design:** Mobile-first responsive design

### Documentation
- **Code Examples:** Working code snippets with explanations
- **Setup Instructions:** Clear installation and configuration steps
- **API Documentation:** Endpoint documentation with examples
- **Component Usage:** React component usage examples
- **Deployment Guide:** Step-by-step deployment instructions

## Success Criteria
The generated code should:
1. **Compile Successfully:** All code should run without errors after `npm install && npm run build`
2. **Follow Conventions:** Adhere to Laravel and React best practices
3. **Be Production Ready:** Include proper error handling and validation
4. **Demonstrate Integration:** Show how Laravel and React work together via Inertia 2
5. **Include Tests:** Basic test examples for key functionality
6. **Be Scalable:** Design for future feature additions and growth
7. **Use Starter Kit Structure:** Follow the exact file structure provided by Laravel React Starter Kit
8. **Leverage Built-in Features:** Utilize the starter kit's authentication, layouts, and component system

## Constraints
- **No External APIs:** Minimize dependencies on external services
- **Official Starter Kit Only:** Use only the official Laravel React Starter Kit
- **Latest Versions:** Use Laravel 12.x with React 19, Tailwind 4, Inertia 2
- **TypeScript Mandatory:** All React code must be TypeScript
- **Shadcn/ui Required:** Use shadcn/ui components exclusively for UI elements
- **Starter Kit File Structure:** Maintain the exact directory structure provided by the starter kit
- **Built-in Authentication:** Use the starter kit's authentication system, not custom implementation
