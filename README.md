# Library Management System (LMS) Frontend

This is the frontend application for the Library Management System (LMS), built using React and Vite. It provides an intuitive user interface for managing books, members, transactions, fines, and notifications.

## Features

### Dashboard
- Displays key statistics such as total books, active members, borrowed books, and overdue books.
- Shows recent transactions and overdue books.

### Book Management
- Add, edit, and delete books.
- Manage book details such as title, author, genre, ISBN, year published, and available copies.

### Member Management
- Add, edit, and delete members.
- Manage member details such as name, email, phone, address, and status.

### Borrow/Return
- Record book borrowing and returning transactions.
- Automatically calculate return dates based on borrowing date.
- View recent and all transactions.

### Overdue & Fines
- Manage overdue books and fines.
- Add new fines for members.
- View fines summary and mark fines as paid.

### Notifications
- Configure notification settings for due date reminders, overdue alerts, and fine notifications.
- View notification history.
- Send custom notifications to members.

## Project Structure

```
lms-app/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── vite.config.js
├── public/
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── api/
│   │   ├── bookService.js
│   │   ├── fineService.js
│   │   ├── memberService.js
│   │   ├── notificationService.js
│   │   ├── transactionService.js
│   ├── components/
│   │   ├── BookManagement.jsx
│   │   ├── BorrowReturn.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MemberManagement.jsx
│   │   ├── NavItem.jsx
│   │   ├── Notifications.jsx
│   │   ├── NotificationsIcon.jsx
│   │   ├── OverdueFines.jsx
```
---

## UI Section 
![Dashboard](/assets/dashboard.png)

![Book Management](/assets/book_management.png)

![Member Management](/assets/member_management.png)

![Transaction Management](/assets/transaction.png)

![Notification Management](/assets/notification.png)

---
## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd lms-app
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. Open the application in your browser at `http://localhost:3000`.

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run preview`: Preview the production build.
- `npm run lint`: Run ESLint to check for code quality issues.

## Technologies Used

- **React**: For building the user interface.
- **Vite**: For fast development and build tooling.
- **Tailwind CSS**: For styling the application.
- **Axios**: For making API requests.
- **React Router**: For routing between pages.

## API Integration

The application integrates with backend services using Axios. The following API modules are available:

- `bookService.js`: Manage books.
- `memberService.js`: Manage members.
- `transactionService.js`: Manage transactions.
- `fineService.js`: Manage fines.
- `notificationService.js`: Manage notifications.

## Customization

You can customize the application by modifying the components in the `src/components/` directory or the API modules in the `src/api/` directory.

## License

This project is licensed under the MIT License.
