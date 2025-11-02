//  import FormSearchSach from "./FormSearchSach";
//  function App() {
//    return <FormSearchSach />;
//  }
// export default App;

// import Category from "./components/categories/category";
// function App(){
//   return(<Category />)
// }
// export default App;

// import Products from "./components/products/products";
// function App() {
//   return(<Products/>)
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout'; // THÊM DÒNG NÀY
import ProtectedRoute from './components/auth/ProtectedRoute';

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
import Wishlist from './pages/wishlist/Wishlist';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-white">
          <Routes>
            {/* Public Routes với Layout */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/products" element={<Layout><Products /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            
            {/* Protected Routes với Layout */}
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <Layout><Cart /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Layout><Checkout /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Layout><Profile /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders/:orderId" 
              element={
                <ProtectedRoute>
                  <Layout><OrderDetail /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wishlist" 
              element={
                <ProtectedRoute>
                  <Layout><Wishlist /></Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Auth Routes không có Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes với AdminLayout và protection */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <ProductList />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products/add" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AddProduct />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products/edit/:id" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <EditProduct />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <OrderList />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/orders/:orderId" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout>
                    <AdminOrderDetail />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

// function App() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       <h1 className="text-4xl font-bold text-blue-600">
//         Tailwind CSS đang hoạt động 
//       </h1>
//       <p className="mt-4 text-gray-600 text-lg">
//         Nếu bạn thấy chữ này có màu và căn giữa — mọi thứ đã OK!
//       </p>
//       <button className="mt-6 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
//         Nút mẫu Tailwind
//       </button>
//     </div>
//   );
// }

// export default App;
