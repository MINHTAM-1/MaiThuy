import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nsp: 'N001',
    lsp: 'L001',
    name: '',
    price: '',
    madein: 'Việt Nam',
    note: '',
    img: null
  });

  const nhomSanPham = [
    { value: 'N001', label: 'N001 - Arabica' },
    { value: 'N002', label: 'N002 - Robusta' },
    { value: 'N003', label: 'N003 - Blend' },
    { value: 'N004', label: 'N004 - Đặc biệt' }
  ];

  const loaiSanPham = [
    { value: 'L001', label: 'L001 - Cà Phê Bột' },
    { value: 'L002', label: 'L002 - Cà Phê Hạt' },
    { value: 'L003', label: 'L003 - Cà Phê Túi Lọc' }
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'img') {
      setFormData(prev => ({ ...prev, img: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.price) {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm');
      return;
    }

    // Generate product code (mock)
    const newProductCode = `SP${Date.now().toString().slice(-4)}`;
    
    console.log('New product data:', {
      ...formData,
      ma_sp: newProductCode
    });

    alert('Thêm sản phẩm thành công!');
    navigate('/admin/products');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
            <button
              onClick={() => navigate('/admin/products')}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="add-pro bg-white rounded-lg shadow p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Thông tin sản phẩm</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nhóm sản phẩm */}
            <div className="select-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nhóm sản phẩm</label>
              <select
                name="nsp"
                value={formData.nsp}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {nhomSanPham.map((nsp) => (
                  <option key={nsp.value} value={nsp.value}>
                    {nsp.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Loại sản phẩm */}
            <div className="select-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Loại sản phẩm</label>
              <select
                name="lsp"
                value={formData.lsp}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {loaiSanPham.map((lsp) => (
                  <option key={lsp.value} value={lsp.value}>
                    {lsp.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tên sản phẩm */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="MAITHUY1: Arabica Mật Ong"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            {/* Giá sản phẩm */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Giá sản phẩm</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="100.000 (VNĐ)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                required
              />
            </div>

            {/* Xuất xứ */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Xuất xứ</label>
              <input
                type="text"
                name="madein"
                value={formData.madein}
                onChange={handleChange}
                placeholder="Việt Nam"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Ghi chú */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
              <textarea
                rows="5"
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Miêu tả sản phẩm,..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-vertical"
              ></textarea>
            </div>

            {/* Hình ảnh */}
            <div className="input-row">
              <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
              <input
                type="file"
                name="img"
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200 text-lg"
            >
              Thêm sản phẩm
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AddProduct;









