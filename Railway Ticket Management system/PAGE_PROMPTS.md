# Railway Ticket Management System - Page-by-Page Prompt Engineering

**For AI Assistant Review & Design Implementation**

---

# 🏠 PAGE 1: HOME PAGE (Public Landing Page)

**File:** `frontend/src/pages/Home.jsx`
**Role:** Public/All Users

## PROMPT:

```
You are a UI/UX expert reviewing the Home page of a Railway Ticket Management System.

OBJECTIVE: Design and implement a professional, modern landing page that:
1. Provides clear value proposition for railway ticket booking
2. Includes call-to-action buttons for Login/Register
3. Showcases key features (quick booking, real-time tracking, secure payment)
4. Has responsive design for mobile, tablet, desktop
5. Includes search functionality preview (from-to station, date picker)

DESIGN REQUIREMENTS:
- Hero section with compelling headline and background image
- Feature cards highlighting key capabilities
- Search bar for quick ticket search (non-functional preview)
- Testimonials or statistics section
- Clear navigation to Login/Register
- Footer with links and contact info

FUNCTIONALITY CHECKLIST:
✓ Responsive navigation bar
✓ Smooth scrolling sections
✓ Mobile-optimized layout
✓ Accessibility compliant (WCAG 2.1 AA)
✓ Fast load times
✓ SEO-friendly structure

DELIVERABLE: 
- Review the current Home.jsx design
- Identify gaps in UX/UI
- Recommend improvements for responsiveness and user engagement
- Provide code suggestions for missing components
```

---

# 🔐 PAGE 2: LOGIN PAGE

**File:** `frontend/src/pages/Login.jsx`
**Role:** All Users (Passenger/Staff/Admin)

## PROMPT:

```
You are a full-stack security and UX expert designing the Login page for Railway Ticket Management.

OBJECTIVE: Create a secure, user-friendly login page that:
1. Supports role-based login (passenger, staff, admin)
2. Displays appropriate UI elements based on user type
3. Includes form validation and error messages
4. Shows password strength indicator
5. Provides "Forgot Password" link placeholder
6. Includes security measures

DESIGN REQUIREMENTS:
- Clean, centered login form with email/password fields
- Role selector (dropdown or tabs: Passenger/Staff/Admin)
- Remember me checkbox
- Submit button with loading state
- Link to Register page
- Error message display
- Security indicators

FUNCTIONALITY CHECKLIST:
✓ Client-side form validation (email format, password length)
✓ Server-side validation integration
✓ JWT token storage after successful login
✓ Error handling (invalid email, wrong password)
✓ Redirect to appropriate dashboard based on role
✓ Prevent logged-in users from accessing login page
✓ Show loading spinner during authentication
✓ Remember me functionality (optional)

DELIVERABLE:
- Review Login.jsx current implementation
- Check form validation logic
- Verify JWT token handling
- Ensure role-based redirect works correctly
- Suggest UI/UX improvements
- Add missing error handling
```

---

# 📝 PAGE 3: REGISTER PAGE

**File:** `frontend/src/pages/Register.jsx`
**Role:** New Users (Public)

## PROMPT:

```
You are a UX expert and form designer creating the Registration page.

OBJECTIVE: Design a registration form that:
1. Collects: name, email, password, confirm password
2. Provides role selection (default: passenger, optional: staff/admin with validation)
3. Shows real-time password strength validation
4. Includes terms & conditions acceptance
5. Handles duplicate email detection
6. Provides smooth onboarding experience

DESIGN REQUIREMENTS:
- Multi-step or single-step form (determine best UX)
- Input field validation with visual feedback
- Password strength meter (weak/medium/strong)
- Show/hide password toggles
- Confirm password matching validation
- Terms & conditions checkbox
- Submit and "Back to Login" buttons
- Progress indicator (if multi-step)

FUNCTIONALITY CHECKLIST:
✓ Email format validation (real-time)
✓ Password requirements: min 8 chars, uppercase, number, special char
✓ Confirm password matching
✓ Duplicate email detection (call backend)
✓ Role validation (prevent invalid role selection)
✓ Terms acceptance required
✓ Successful registration message
✓ Auto-redirect to login or auto-login
✓ Error message display
✓ Loading state during submission

DELIVERABLE:
- Review Register.jsx implementation
- Check all validation rules
- Verify API integration
- Ensure role assignment works
- Suggest password strength improvements
- Test duplicate email handling
```

---

# 👤 PAGE 4: PASSENGER DASHBOARD

**File:** `frontend/src/pages/passenger/PassengerDashboard.jsx`
**Role:** Passenger Only

## PROMPT:

```
You are a dashboard design expert creating the Passenger Dashboard - the main hub for regular users.

OBJECTIVE: Create a comprehensive dashboard that:
1. Shows welcome message with user name
2. Displays quick access buttons (Book Ticket, My Bookings, Notifications, Support)
3. Shows recent bookings summary
4. Displays upcoming trips
5. Shows account information
6. Includes search functionality for trains

DESIGN REQUIREMENTS:
- Welcome header with greeting
- Quick action cards/buttons
- Recent bookings table/list
- Upcoming trips timeline or list
- Account summary card
- Quick search bar for trains
- Notifications badge
- Logout button in top-right

FUNCTIONALITY CHECKLIST:
✓ Fetch and display user information from token
✓ Load recent bookings (last 5-10)
✓ Load upcoming trips (sorted by date)
✓ Display unread notifications count
✓ Quick navigation to all sub-pages
✓ Refresh data functionality
✓ Loading states
✓ Error handling
✓ Responsive layout

DELIVERABLE:
- Review PassengerDashboard.jsx
- Check data fetching and display
- Verify user information display
- Ensure all quick actions work
- Optimize performance
- Add missing sections if needed
```

---

# 🎫 PAGE 5: BOOK TICKET (Passenger)

**File:** `frontend/src/pages/passenger/BookTicket.jsx`
**Role:** Passenger Only

## PROMPT:

```
You are a travel booking specialist designing the "Book Ticket" page for railway reservations.

OBJECTIVE: Create an intuitive ticket booking flow that:
1. Search trains by: from station, to station, date, passenger count
2. Display available trains with price, duration, departure time
3. Allow seat/coach selection with seat map visualization
4. Show fare details and payment summary
5. Complete booking with payment integration
6. Show confirmation

DESIGN REQUIREMENTS:
- Search form (From, To, Date, Passengers)
- Search results showing available trains
- Train detail view with coaches and seats
- Seat map visualization with seat selection
- Passenger details form
- Price breakdown
- Payment method selection
- Confirmation page

FUNCTIONALITY CHECKLIST:
✓ Search form validation
✓ API call to fetch trains
✓ Display trains sorted by price/duration
✓ Interactive seat map (show available/booked/selected)
✓ Real-time seat availability
✓ Passenger information collection
✓ Price calculation with discounts
✓ Payment gateway integration (Razorpay/Stripe)
✓ Booking confirmation with ticket generation
✓ Email confirmation
✓ Error handling for out-of-stock seats
✓ Session timeout handling

DELIVERABLE:
- Review BookTicket.jsx implementation
- Check search functionality
- Verify seat map component (SeatMap.jsx)
- Ensure price calculation accuracy
- Validate payment integration
- Test booking confirmation flow
- Add loading states and error messages
```

---

# 📅 PAGE 6: MY BOOKINGS (Passenger)

**File:** `frontend/src/pages/passenger/MyBookings.jsx`
**Role:** Passenger Only

## PROMPT:

```
You are a data management expert designing the "My Bookings" page.

OBJECTIVE: Create a comprehensive bookings management page that:
1. List all passenger's bookings (active, past, cancelled)
2. Show booking details: ticket number, train, date, seats, price
3. Allow filtering by status (upcoming, completed, cancelled)
4. Enable ticket download/print
5. Allow cancellation with refund calculation
6. Show booking QR code
7. Enable seat modification (if allowed)

DESIGN REQUIREMENTS:
- Filter tabs (All, Upcoming, Completed, Cancelled)
- Booking cards with key information
- Expandable booking details
- Download/Print button
- Cancel booking button (with confirmation)
- QR code display
- Timeline view or list view toggle
- Search/sort functionality

FUNCTIONALITY CHECKLIST:
✓ Fetch bookings from API based on user ID
✓ Filter bookings by status
✓ Show booking details modal
✓ Download ticket as PDF
✓ Print ticket functionality
✓ Cancel booking with confirmation
✓ Refund calculation and display
✓ QR code generation (use qrcode.react)
✓ Responsive design
✓ Empty state message
✓ Loading and error states

DELIVERABLE:
- Review MyBookings.jsx
- Check booking fetching logic
- Verify filter functionality
- Ensure PDF download works
- Test cancellation flow
- Verify QR code display
- Add missing features
```

---

# 🔔 PAGE 7: NOTIFICATIONS (Passenger)

**File:** `frontend/src/pages/passenger/Notifications.jsx`
**Role:** Passenger Only

## PROMPT:

```
You are a notification system designer creating the Notifications page.

OBJECTIVE: Design a notification center that:
1. Displays all notifications (booking, payment, train delays, etc.)
2. Shows notification status (read/unread)
3. Allows marking as read/unread
4. Filter notifications by type
5. Delete individual or bulk notifications
6. Show notification details
7. Real-time notification updates

DESIGN REQUIREMENTS:
- Notification list with timestamps
- Unread badge indicators
- Notification type badges (info, warning, success, error)
- Mark as read/unread buttons
- Delete button with confirmation
- Filter by type (Booking, Payment, Travel Info)
- Clear all button
- "No notifications" empty state
- Pagination if many notifications

FUNCTIONALITY CHECKLIST:
✓ Fetch notifications from API
✓ Display in reverse chronological order
✓ Show read/unread status
✓ Mark single notification as read
✓ Mark all as read functionality
✓ Delete notifications with confirmation
✓ Filter by notification type
✓ Real-time notifications (WebSocket if available)
✓ Notification count badge in navbar
✓ Pagination or infinite scroll
✓ Empty state handling

DELIVERABLE:
- Review Notifications.jsx
- Check notification fetching
- Verify read/unread toggle
- Test delete functionality
- Ensure real-time updates if implemented
- Optimize for performance
```

---

# 💬 PAGE 8: SUPPORT/COMPLAINTS (Passenger)

**File:** `frontend/src/pages/passenger/Support.jsx`
**Role:** Passenger Only

## PROMPT:

```
You are a customer support system designer creating the Support/Complaints page.

OBJECTIVE: Design a support ticket system that:
1. Allow passengers to create support tickets
2. Select issue category (ticket issue, payment issue, train delay, etc.)
3. Attach screenshots/files
4. Track ticket status
5. View support history
6. Real-time chat or messaging with support
7. FAQ section
8. Estimated resolution time

DESIGN REQUIREMENTS:
- New ticket form with subject, category, description
- File upload capability
- Ticket list showing status and timestamp
- Ticket detail view with messages
- Chat interface for support communication
- FAQ accordion section
- Priority level selector
- Ticket status timeline
- Contact information

FUNCTIONALITY CHECKLIST:
✓ Create support ticket with validation
✓ Select category from predefined list
✓ File upload (images, documents)
✓ File size and type validation
✓ List all user's support tickets
✓ Display ticket status (open, in-progress, resolved, closed)
✓ Real-time messaging with support team
✓ Email notifications on ticket update
✓ Search/filter tickets
✓ Close ticket functionality
✓ Rate support interaction (if resolved)
✓ Show FAQ section

DELIVERABLE:
- Review Support.jsx
- Check ticket creation form
- Verify file upload functionality
- Test ticket status tracking
- Ensure messaging works
- Add FAQ section
- Optimize UI/UX
```

---

# 📊 PAGE 9: ADMIN DASHBOARD

**File:** `frontend/src/pages/admin/AdminDashboard.jsx`
**Role:** Admin Only

## PROMPT:

```
You are a business intelligence expert designing the Admin Dashboard.

OBJECTIVE: Create a comprehensive admin dashboard that:
1. Show system overview (total users, bookings, revenue, trains)
2. Display key metrics and KPIs
3. Show real-time statistics
4. Revenue charts and graphs
5. Recent activities log
6. System health status
7. Quick action buttons
8. Navigation to all admin functions

DESIGN REQUIREMENTS:
- Welcome section for admin
- KPI cards (Total Users, Total Bookings, Revenue, Active Trains)
- Charts: Revenue trend, Booking trend, Popular routes
- Recent activities table
- System health indicator
- Quick action buttons
- Navigation sidebar/menu
- Analytics overview
- Date range picker for reports

FUNCTIONALITY CHECKLIST:
✓ Fetch dashboard statistics
✓ Calculate KPIs (total revenue, bookings count, etc.)
✓ Display charts using Chart.js or Recharts
✓ Show real-time data updates
✓ Recent activities feed
✓ System health checks
✓ Permission checks (admin only)
✓ Loading states
✓ Error handling
✓ Responsive layout
✓ Export functionality

DELIVERABLE:
- Review AdminDashboard.jsx
- Check data fetching
- Verify chart display
- Ensure KPI calculations
- Test real-time updates
- Add missing statistics
- Optimize performance
```

---

# 👥 PAGE 10: MANAGE USERS (Admin)

**File:** `frontend/src/pages/admin/ManageUsers.jsx`
**Role:** Admin Only

## PROMPT:

```
You are a user management system expert designing the Manage Users page.

OBJECTIVE: Create a user management interface that:
1. List all users with filters (role, status, registration date)
2. Search users by name, email
3. View user details
4. Edit user information
5. Change user role (passenger/staff/admin)
6. Activate/deactivate users
7. Delete users (with confirmation)
8. Bulk actions
9. Export user list

DESIGN REQUIREMENTS:
- User table with sorting and pagination
- Search bar
- Filter options (by role, status, date range)
- User detail modal
- Edit user form
- Role selector dropdown
- Activate/Deactivate toggle
- Delete button with confirmation
- Bulk action checkboxes
- Bulk delete/export buttons
- Export to CSV button

FUNCTIONALITY CHECKLIST:
✓ Fetch all users from API
✓ Search users by name/email
✓ Filter by role (admin, staff, passenger)
✓ Filter by status (active, inactive)
✓ Display user details in modal
✓ Edit user information
✓ Change user role
✓ Activate/deactivate user
✓ Delete user with confirmation
✓ Bulk actions (delete, role change)
✓ Pagination (limit per page)
✓ Sort by any column
✓ Export to CSV
✓ Permission checks

DELIVERABLE:
- Review ManageUsers.jsx
- Check user fetching and display
- Verify search functionality
- Test filter options
- Ensure edit/delete operations work
- Add bulk action functionality
- Test permissions
```

---

# 🚂 PAGE 11: MANAGE TRAINS (Admin)

**File:** `frontend/src/pages/admin/ManageTrains.jsx`
**Role:** Admin Only

## PROMPT:

```
You are a train inventory management expert designing the Manage Trains page.

OBJECTIVE: Create a train management interface that:
1. List all trains with details
2. Create new train entry
3. Edit train information
4. Delete trains
5. Manage coaches and seats per train
6. Set train status (active, inactive, maintenance)
7. View train capacity and seat availability
8. Manage train schedules
9. Bulk import trains (CSV)

DESIGN REQUIREMENTS:
- Train table with all details (name, number, route, capacity, status)
- Add new train button
- Edit train form modal
- Delete train button with confirmation
- Coach and seat management view
- Status toggle (active/inactive/maintenance)
- Schedule management
- Bulk import CSV functionality
- Search and filter options

FUNCTIONALITY CHECKLIST:
✓ Fetch all trains from API
✓ Create new train with validation
✓ Edit train details
✓ Delete train (check for active bookings)
✓ Manage coaches and seats
✓ Set seat prices and types
✓ Toggle train status
✓ View seat availability
✓ Add train schedules
✓ Bulk import from CSV
✓ Form validation
✓ Error handling
✓ Success notifications

DELIVERABLE:
- Review ManageTrains.jsx
- Check train listing and CRUD operations
- Verify seat management functionality
- Test bulk import
- Ensure validation works
- Add missing features
```

---

# 📋 PAGE 12: BOOKINGS (Admin)

**File:** `frontend/src/pages/admin/Bookings.jsx`
**Role:** Admin Only

## PROMPT:

```
You are an order management expert designing the Admin Bookings page.

OBJECTIVE: Create a bookings management interface that:
1. View all bookings across system
2. Filter by status (pending, confirmed, cancelled)
3. Search bookings by ticket number, passenger name
4. View booking details
5. Modify booking if needed
6. Refund functionality
7. Cancel booking with reason
8. Export booking reports
9. Analytics on bookings

DESIGN REQUIREMENTS:
- Bookings table with all details
- Filter by status and date range
- Search functionality
- Booking detail modal
- Refund form with amount and reason
- Cancel booking form
- Payment status display
- Passenger information
- Train and seat details
- Export to PDF/CSV

FUNCTIONALITY CHECKLIST:
✓ Fetch all bookings
✓ Search by ticket number or passenger name
✓ Filter by status (pending, confirmed, cancelled)
✓ Filter by date range
✓ Display booking details
✓ Process refunds
✓ Cancel booking with reason logging
✓ Update booking status
✓ Send notifications to passengers
✓ Export booking report
✓ Calculate revenue from bookings
✓ Pagination and sorting

DELIVERABLE:
- Review Bookings.jsx
- Check booking fetching
- Verify filter functionality
- Test refund processing
- Ensure status updates work
- Add export functionality
- Test notifications
```

---

# 📊 PAGE 13: REPORTS & ANALYTICS (Admin)

**File:** `frontend/src/pages/admin/ReportsAnalytics.jsx`
**Role:** Admin Only

## PROMPT:

```
You are a business analytics expert designing the Reports & Analytics page.

OBJECTIVE: Create comprehensive analytics that:
1. Revenue reports (daily, weekly, monthly, yearly)
2. Passenger statistics (new, returning, churn)
3. Train performance (occupancy rate, most popular routes)
4. Booking trends
5. Payment analytics
6. Refund analysis
7. Custom date range reports
8. Data visualization with charts
9. Export reports
10. KPI tracking

DESIGN REQUIREMENTS:
- Date range picker
- Multiple chart types (line, bar, pie, area)
- Revenue statistics
- Passenger growth chart
- Train occupancy rate
- Popular routes ranking
- Payment method distribution
- Refund reason breakdown
- Top performing trains
- Report export buttons
- Filter options

FUNCTIONALITY CHECKLIST:
✓ Fetch booking data for analysis
✓ Calculate revenue metrics
✓ Generate charts using Chart.js/Recharts
✓ Date range filtering
✓ Year-over-year comparison
✓ Export reports to PDF/CSV
✓ Real-time data updates
✓ Custom date range selection
✓ Multiple report views
✓ KPI cards with trends
✓ Data caching for performance
✓ Download functionality

DELIVERABLE:
- Review ReportsAnalytics.jsx
- Check data fetching and calculations
- Verify chart rendering
- Test export functionality
- Ensure date filtering works
- Add missing metrics
- Optimize performance
```

---

# 👔 PAGE 14: STAFF DASHBOARD

**File:** `frontend/src/pages/staff/StaffDashboard.jsx`
**Role:** Staff Only

## PROMPT:

```
You are a staff operations expert designing the Staff Dashboard.

OBJECTIVE: Create a staff-focused dashboard that:
1. Show assigned trains and schedules
2. Display upcoming trips
3. Show staffing overview
4. Important announcements
5. Quick access to daily tasks
6. Performance metrics
7. Support tickets assigned to staff
8. Recent activities

DESIGN REQUIREMENTS:
- Welcome section for staff member
- Today's schedule
- Assigned trains list
- Quick action buttons
- Important announcements/alerts
- Performance statistics
- Task list (TODO items)
- Recent activities feed
- Shift information

FUNCTIONALITY CHECKLIST:
✓ Fetch staff member information
✓ Load assigned trains
✓ Display schedule/shift details
✓ Show upcoming duties
✓ Display announcements
✓ Performance metrics
✓ Task management
✓ Quick navigation to all staff functions
✓ Real-time updates
✓ Responsive layout

DELIVERABLE:
- Review StaffDashboard.jsx
- Check data fetching
- Verify schedule display
- Ensure all quick actions work
- Add missing sections
- Optimize layout
```

---

# 🎫 PAGE 15: VERIFY TICKETS (Staff)

**File:** `frontend/src/pages/staff/VerifyTickets.jsx`
**Role:** Staff Only

## PROMPT:

```
You are a ticket verification system expert designing the Verify Tickets page.

OBJECTIVE: Create a ticket verification interface that:
1. Scan QR code from passenger ticket
2. Verify ticket authenticity
3. Check passenger name and ID
4. Confirm boarding status
5. Mark passenger as boarded
6. Handle expired/invalid tickets
7. Generate boarding pass
8. Log verification records
9. Offline mode support

DESIGN REQUIREMENTS:
- QR code scanner input (camera integration)
- Manual ticket number input option
- Ticket verification results display
- Passenger information verification
- Boarding status toggle
- Ticket validity indicator
- Error messages for invalid tickets
- Boarding confirmation button
- Boarding log history
- Print boarding pass button

FUNCTIONALITY CHECKLIST:
✓ QR code scanning (use jsQR or similar)
✓ Manual ticket number input
✓ Verify ticket with API
✓ Display ticket details
✓ Verify passenger identity
✓ Check ticket validity (date, time)
✓ Mark as boarded (status update)
✓ Generate boarding pass
✓ Log boarding records
✓ Handle expired tickets
✓ Handle invalid/duplicate tickets
✓ Offline mode (cache data)
✓ Print functionality

DELIVERABLE:
- Review VerifyTickets.jsx
- Check QR code scanning
- Verify ticket verification logic
- Test boarding status update
- Ensure offline mode works
- Add print functionality
```

---

# 🛠️ PAGE 16: MANAGE SEATS (Staff)

**File:** `frontend/src/pages/staff/ManageSeats.jsx`
**Role:** Staff Only

## PROMPT:

```
You are a seat management expert designing the Manage Seats page.

OBJECTIVE: Create a seat management interface that:
1. Display seat map for trains
2. View seat status (available, booked, blocked)
3. Manually block/unblock seats
4. Reassign seats if needed
5. Handle seat maintenance/cleaning
6. Update seat pricing
7. View seat occupancy per train
8. Generate occupancy reports

DESIGN REQUIREMENTS:
- Interactive seat map visualization
- Seat status legend (available, booked, blocked, maintenance)
- Seat detail modal
- Block/unblock seat functionality
- Seat reassignment form
- Pricing adjustment per seat
- Occupancy statistics
- Coach selector
- Maintenance marking
- Status update buttons

FUNCTIONALITY CHECKLIST:
✓ Fetch seat data from API
✓ Display interactive seat map (use SeatMap.jsx component)
✓ Show seat status with color coding
✓ Block/unblock seats
✓ Reassign seats (if booking cancelled)
✓ Mark seats for maintenance
✓ Update seat prices
✓ Calculate occupancy rate
✓ View multiple coaches
✓ Real-time updates
✓ Permission checks

DELIVERABLE:
- Review ManageSeats.jsx
- Check seat map display
- Verify block/unblock functionality
- Test seat reassignment
- Ensure occupancy calculations
- Test maintenance marking
```

---

# 🚂 PAGE 17: MANAGE TRAIN STATUS (Staff)

**File:** `frontend/src/pages/staff/ManageTrainStatus.jsx`
**Role:** Staff Only

## PROMPT:

```
You are a train operations expert designing the Manage Train Status page.

OBJECTIVE: Create train status management interface that:
1. Display all trains and current status
2. Update train status (on-time, delayed, cancelled, maintenance)
3. Log delay reasons and duration
4. Send notifications to passengers
5. View train location (if GPS available)
6. Manage train announcements
7. Track maintenance schedules
8. View delay history

DESIGN REQUIREMENTS:
- Train list with current status
- Status selector dropdown (on-time, delayed, cancelled, maintenance)
- Delay reason form
- Estimated delay input
- Passenger notification toggle
- Announcement text area
- Map view of train location (if available)
- Maintenance schedule calendar
- Delay history log
- Status change audit trail

FUNCTIONALITY CHECKLIST:
✓ Fetch all trains and their status
✓ Update train status
✓ Log delay information (reason, duration)
✓ Send notifications to booked passengers
✓ Display current train location (if GPS)
✓ Manage announcements
✓ Schedule maintenance
✓ View delay history
✓ Audit trail of status changes
✓ Real-time status updates
✓ Notification preferences

DELIVERABLE:
- Review ManageTrainStatus.jsx
- Check status update functionality
- Verify passenger notifications
- Test delay logging
- Ensure maintenance scheduling works
- Add GPS tracking if available
```

---

# 📋 PAGE 18: STAFF BOOKINGS

**File:** `frontend/src/pages/staff/StaffBookings.jsx`
**Role:** Staff Only

## PROMPT:

```
You are a staff booking management expert designing the Staff Bookings page.

OBJECTIVE: Create a booking management interface for staff that:
1. View all bookings for assigned trains
2. Create manual bookings for passengers
3. Modify bookings if needed
4. Process cancellations and refunds
5. Handle special requests
6. View passenger manifests
7. Manage waitlist
8. Generate travel documents

DESIGN REQUIREMENTS:
- Bookings list filtered by assigned trains
- Booking detail view
- Manual booking creation form
- Modify booking form
- Cancellation with refund form
- Passenger manifest export
- Waitlist management
- Special requests section
- Print ticket/confirmation
- Bulk actions

FUNCTIONALITY CHECKLIST:
✓ Fetch bookings for staff's assigned trains
✓ Display booking details
✓ Create manual booking
✓ Edit booking information
✓ Cancel booking and process refund
✓ Handle special requests
✓ Generate passenger manifest
✓ Manage waitlist
✓ Print confirmation/ticket
✓ Email confirmation to passengers
✓ Validation and error handling

DELIVERABLE:
- Review StaffBookings.jsx
- Check booking display
- Verify manual booking creation
- Test modification and cancellation
- Ensure refund processing
- Test document generation
```

---

# 🎫 PAGE 19: BOOKING RECORDS (Staff)

**File:** `frontend/src/pages/staff/BookingRecords.jsx`
**Role:** Staff Only

## PROMPT:

```
You are a records management expert designing the Booking Records page.

OBJECTIVE: Create a booking records management interface that:
1. Access historical booking records
2. Search by various criteria (date, passenger, ticket number)
3. Filter by status and train
4. Generate reports
5. Export records
6. Archive old records
7. View record details
8. Audit trail

DESIGN REQUIREMENTS:
- Records table with all details
- Advanced search functionality
- Filter by date range, status, train
- Record detail view
- Export to PDF/CSV
- Archive functionality
- Audit log
- Record count statistics
- Sorting options

FUNCTIONALITY CHECKLIST:
✓ Fetch historical booking records
✓ Search by multiple criteria
✓ Filter by date range
✓ Filter by status
✓ Display detailed records
✓ Export records to CSV/PDF
✓ Archive old records
✓ View audit trail
✓ Pagination
✓ Sorting

DELIVERABLE:
- Review BookingRecords.jsx
- Check record fetching
- Verify search functionality
- Test filters
- Ensure export works
- Add archive functionality
```

---

# 💬 PAGE 20: SUPPORT REQUESTS (Staff)

**File:** `frontend/src/pages/staff/SupportRequests.jsx`
**Role:** Staff Only

## PROMPT:

```
You are a customer support specialist designing the Support Requests page.

OBJECTIVE: Create support request management interface that:
1. View assigned support tickets
2. Filter by priority, status, category
3. Real-time messaging with passengers
4. Update ticket status
5. Assign to team members
6. Add internal notes
7. Add attachments
8. Generate knowledge base articles
9. Track resolution time

DESIGN REQUIREMENTS:
- Support requests list
- Filter by priority (low, medium, high, urgent)
- Filter by status (open, in-progress, resolved, closed)
- Ticket detail view
- Chat interface for communication
- Status update dropdown
- Priority selector
- Assign to team member
- Internal notes section
- Attachments
- Resolution timer

FUNCTIONALITY CHECKLIST:
✓ Fetch assigned support tickets
✓ Display ticket details
✓ Real-time chat messaging
✓ Update ticket status
✓ Change priority
✓ Assign to team member
✓ Add internal notes
✓ Upload attachments
✓ Send notifications to passenger
✓ Track resolution time
✓ Close ticket
✓ Rate ticket handling

DELIVERABLE:
- Review SupportRequests.jsx
- Check ticket fetching
- Verify messaging functionality
- Test status updates
- Ensure assignment works
- Add internal notes feature
- Optimize UI
```

---

# 📋 SUMMARY & NEXT STEPS

These 20 page-specific prompts cover:
- **3 Public Pages** (Home, Login, Register)
- **5 Passenger Pages** (Dashboard, Book Ticket, My Bookings, Notifications, Support)
- **6 Admin Pages** (Dashboard, Manage Users, Manage Trains, Bookings, Reports, Analytics)
- **6 Staff Pages** (Dashboard, Verify Tickets, Manage Seats, Train Status, Bookings, Support)

Each prompt is engineered to:
✓ Specify exact design requirements
✓ List all functionality needed
✓ Identify potential issues
✓ Guide implementation
✓ Ensure quality review

**USAGE:**
Use one prompt at a time when working on each page. Share with AI assistant for review and implementation guidance.

