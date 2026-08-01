# Majestic Rabab Fine Dining 🎻

A premium, full-stack web application built for **Majestic Rabab Fine Dining** – a royal aesthetic dining spot located in Rayya, Punjab. This project aims to bring the rich, authentic, and royal experience of the restaurant to the digital world.

## 🌟 Features (Phase 1)
- **Royal Aesthetic UI**: Custom glassmorphism design with burgundy and gold accents, matching the brand's Instagram identity.
- **Fully Responsive**: Mobile-first design that looks stunning on all devices.
- **Cinematic Experience**: Framer Motion animations, parallax scrolling, and dynamic hero sections.
- **Comprehensive Menu**: Categorized menu with search, veg/non-veg toggles, and spice level filters.
- **Booking & Contact**: Fully functional reservation form and contact page with exact Google Maps integration.
- **SEO Optimized**: Pre-configured meta tags for search engines and social media sharing.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, React Router, Framer Motion, Vanilla CSS
- **Backend**: Node.js, Express.js (REST API)
- **Database**: MongoDB & Mongoose

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/i-shubham24/The-Rabab.git
   cd The-Rabab
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Environment Variables**
   Create a `.env` file in the `server` directory based on the `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/rabab
   NODE_ENV=development
   ```

### Running the App Locally

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the Frontend Client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## 🔮 Upcoming Features
- Online Ordering with Cart & Checkout
- Payment Gateway Integration (Razorpay)
- AI Chat Agents for Booking & Support
- Admin Dashboard for Order & Reservation Management
