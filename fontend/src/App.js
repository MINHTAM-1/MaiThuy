import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout'; // THÊM DÒNG NÀY

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Products from './pages/public/Products';
import Contact from './pages/public/Contact';

// Cart & Checkout Pages
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import OrderList from './pages/admin/OrderList';
import AdminOrderDetail from './pages/admin/OrderDetail';

// User Pages
import Profile from './pages/user/Profile';
import OrderDetail from './pages/user/OrderDetail';
import ROUTES from './routes';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import { Toaster } from 'react-hot-toast';
import OrderReturn from './pages/checkout/OrderReturn';
import Orders from './pages/user/Orders';
import PaymentReturn from './pages/checkout/PaymentReturn';
import ProductDetail from './components/products/ProductDetail';
import Review from './pages/review/Review';
import ValidateOTP from './pages/auth/ValidateOTP';
import ScrollToTop from './ScrollToTop';
import NotFoundPage from './pages/public/NotFound';

function AppContent() {
  return (
    // <AuthProvider>
    //   <Router>
    //     <div className="App min-h-screen bg-white">
    //       <Routes>
    //         {/* Public Routes với Layout */}
    //         <Route path="/" element={<Layout><Home /></Layout>} />
    //         <Route path="/about" element={<Layout><About /></Layout>} />
    //         <Route path="/products" element={<Layout><Products /></Layout>} />
    //         <Route path="/contact" element={<Layout><Contact /></Layout>} />

    //         {/* Protected Routes với Layout */}
    //         <Route 
    //           path="/cart" 
    //           element={
    //             <ProtectedRoute>
    //               <Layout><Cart /></Layout>
    //             </ProtectedRoute>
    //           } 
    //         />
    //         <Route 
    //           path="/checkout" 
    //           element={
    //             <ProtectedRoute>
    //               <Layout><Checkout /></Layout>
    //             </ProtectedRoute>
    //           } 
    //         />
    //         <Route 
    //           path="/profile" 
    //           element={
    //             <ProtectedRoute>
    //               <Layout><Profile /></Layout>
    //             </ProtectedRoute>
    //           } 
    //         />
    //         <Route 
    //           path="/orders/:orderId" 
    //           element={
    //             <ProtectedRoute>
    //               <Layout><OrderDetail /></Layout>
    //             </ProtectedRoute>
    //           } 
    //         />
    //         <Route 
    //           path="/wishlist" 
    //           element={
    //             <ProtectedRoute>
    //               <Layout><Wishlist /></Layout>
    //             </ProtectedRoute>
    //           } 
    //         />

    //         {/* Auth Routes không có Layout */}
    //         <Route path="/login" element={<Login />} />
    //         <Route path="/register" element={<Register />} />

    //         {/* Admin Routes với AdminLayout và protection */}
    //         <Route 
    //           path="/admin" 
    //           element={
    //             <ProtectedRoute adminOnly={true}>
    //               <AdminLayout>
    //                 <Dashboard />
    //               </AdminLayout>
    //             </ProtectedRoute>
    //           } 
    //         />
    //         <Route 
    //           path="/admin/dashboard" 
    //           element={
    //             <ProtectedRoute adminOnly={true}>
    //               <AdminLayout>
    //                 <Dashboard />
    //               </AdminLayout>
    //             </ProtectedRoute>
    //           } 
    //         />
    //         <Route 
    //           path="/admin/products" 
    //           element={
    //             <ProtectedRoute adminOnly={true}>
    //               <AdminLayout>
    //                 <ProductList />
    //               </AdminLayout>
    //             </ProtectedRoute>
    //           } 
    //         />
    //         <Route 
    //           path="/admin/products/add" 
    //           element={
    //             <ProtectedRoute adminOnly={true}>
    //               <AdminLayout>
    //                 <AddProduct />
    //               </AdminLayout>
    //             </ProtectedRoute>
    //           } 
    //         />
    //         <Route 
    //           path="/admin/products/edit/:id" 
    //           element={
    //             <ProtectedRoute adminOnly={true}>
    //               <AdminLayout>
    //                 <EditProduct />
    //               </AdminLayout>
    //             </ProtectedRoute>
    //           } 
    //         />
    //         <Route 
    //           path="/admin/orders" 
    //           element={
    //             <ProtectedRoute adminOnly={true}>
    //               <AdminLayout>
    //                 <OrderList />
    //               </AdminLayout>
    //             </ProtectedRoute>
    //           } 
    //         />
    //         <Route 
    //           path="/admin/orders/:orderId" 
    //           element={
    //             <ProtectedRoute adminOnly={true}>
    //               <AdminLayout>
    //                 <AdminOrderDetail />
    //               </AdminLayout>
    //             </ProtectedRoute>
    //           } 
    //         />
    //       </Routes>
    //     </div>
    //   </Router>
    // </AuthProvider>

    <>
      <Toaster
        position="top-right"
        reverseOrder={false}  // thông báo mới thêm vào dưới
        toastOptions={{
          duration: 3000, // 3 giây
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
          },
        }}
      />

      <AuthProvider>
        <Layout>
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.CONTACT} element={<Contact />} />
            <Route path={ROUTES.PRODUCTS} element={<Products />} />
            <Route path={`${ROUTES.PRODUCTSBYCATEGORY}/:id`} element={<Products />} />
            <Route path={`${ROUTES.PRODUCTS}/:id`} element={<ProductDetail />} />

            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            <Route path={ROUTES.FORGOTPASSWORD} element={<ForgotPassword />} />
            <Route path={ROUTES.RESETPASSWORD} element={<ResetPassword />} />
            <Route path={ROUTES.VALIDATE_RESETCODE} element={<ValidateOTP />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />

            <Route path={ROUTES.CART} element={<Cart />} />
            <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
            <Route path={ROUTES.ORDERS} element={<Orders />} />
            <Route path={`${ROUTES.ORDERRETURN}/:id`} element={<OrderReturn />} />
            <Route path={`${ROUTES.ORDERS}/:id`} element={<OrderDetail />} />
            <Route path={ROUTES.PAYMENTRETURN} element={<PaymentReturn />} />
            <Route path={`${ROUTES.REVIEW}/:orderId/:productId`} element={<Review />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
