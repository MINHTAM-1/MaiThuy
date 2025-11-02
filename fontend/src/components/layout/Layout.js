import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-20"> {/* pt-20 cho fixed header */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;