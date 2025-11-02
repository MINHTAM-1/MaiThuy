import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call - có thể thay bằng API thực tế sau
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        content: ''
      });
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Cảm ơn bạn!</h3>
          <p className="text-gray-600 mb-4">
            Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Gửi tin nhắn khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-box-left bg-white p-8 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Nhập thông tin</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên của bạn"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(+84) 816232452"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="lienhe@maithuycoffee.vn"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Việt Nam"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        <div className="input-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung *</label>
          <textarea
            rows="5"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Nội dung của bạn"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-vertical"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200 text-lg disabled:bg-amber-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Đang gửi...
            </div>
          ) : (
            'GỬI'
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;