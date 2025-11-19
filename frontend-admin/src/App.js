import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import AdminLayout from './components/AdminLayout';
import { AuthProvider } from './contexts/AuthContext';
import ProductList from './pages/products/ProductList';
import ProtectedRoute from './components/ProtectedRoute';
import ROUTES from './routes';
import ProductEdit from './pages/products/ProductEdit';
import { Toaster } from 'react-hot-toast';
import ProductAdd from './pages/products/ProductAdd';
import OrderList from './pages/orders/OrderList';
import OrderDetail from './pages/orders/OrderDetail';
import CategoryList from './pages/categories/CategoryList';
import CategoryEdit from './pages/categories/CategoryEdit';
import CategoryAdd from './pages/categories/CategoryAdd';
import PromotionList from './pages/promotions/PromotionList';
import PromotionAdd from './pages/promotions/PromotionAdd';
import PromotionEdit from './pages/promotions/PromotionEdit';
import ReviewList from './pages/reviews/ReviewList';
import ContactList from './pages/contacts/ContactList';


function App() {
  return (
    <BrowserRouter>

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
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Route cần login */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OrderList />} />
            <Route path={ROUTES.PRODUCTS} element={<ProductList/>} />
            <Route path={ROUTES.ADD_PRODUCT} element={<ProductAdd/>} />
            <Route path={`${ROUTES.PRODUCTS}/:id`} element={<ProductEdit />} />

            <Route path={ROUTES.ORDERS} element={<OrderList/>} />
            <Route path={`${ROUTES.ORDERS}/:id`} element={<OrderDetail />} />

            <Route path={ROUTES.CATEGORIES} element={<CategoryList/>} />
            <Route path={ROUTES.ADD_CATEGORY} element={<CategoryAdd/>} />
            <Route path={`${ROUTES.CATEGORIES}/:id`} element={<CategoryEdit />} />

            <Route path={ROUTES.PROMOTIONS} element={<PromotionList/>} />
            <Route path={ROUTES.ADD_PROMOTION} element={<PromotionAdd/>} />
            <Route path={`${ROUTES.PROMOTIONS}/:id`} element={<PromotionEdit />} />            

            <Route path={ROUTES.REVIEWS} element={<ReviewList/>} />
            <Route path={ROUTES.CONTACTS} element={<ContactList/>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
