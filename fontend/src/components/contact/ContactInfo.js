const ContactInfo = () => {
  const contactInfo = [
    {
      icon: '📧',
      label: 'Email',
      value: 'lienhe@maithuycoffee.vn',
      description: 'Gửi email cho chúng tôi'
    },
    {
      icon: '📞',
      label: 'Số điện thoại',
      value: '(+84) 816232452',
      description: 'Thứ 2 - Thứ 6: 8:00 - 17:00'
    },
    {
      icon: '📍',
      label: 'Địa chỉ',
      value: '34 Đ. An Bình, Phường 6, Quận 5, Thành phố Hồ Chí Minh',
      description: 'Đến thăm cửa hàng của chúng tôi'
    },
    {
      icon: '🌐',
      label: 'Website',
      value: 'www.maithuycoffee.vn',
      description: 'Truy cập website chính thức'
    },
    {
      icon: '📱',
      label: 'Facebook',
      value: 'Cà phê MAITHUY',
      description: 'Theo dõi chúng tôi trên Facebook'
    },
    {
      icon: '📷',
      label: 'Instagram',
      value: '@_maithuyCoffee',
      description: 'Theo dõi chúng tôi trên Instagram'
    }
  ];

  return (
    <div className="contact-box-right bg-amber-50 rounded-lg p-8 h-fit shadow-lg">
      <h4 className="text-lg font-semibold text-amber-800 mb-2">Thông tin về chúng tôi</h4>
      <h3 className="text-3xl font-bold text-gray-900 mb-6">MAITHUY COFFEE</h3>
      
      <div className="space-y-6">
        {contactInfo.map((item, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="bg-amber-100 p-3 rounded-lg flex-shrink-0">
              <span className="text-xl">{item.icon}</span>
            </div>
            <div className="flex-1">
              <span className="font-semibold text-gray-900 block">{item.label}</span>
              <p className="text-amber-700 font-medium">{item.value}</p>
              <p className="text-gray-600 text-sm mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Business Hours */}
      <div className="mt-8 pt-6 border-t border-amber-200">
        <h4 className="font-semibold text-gray-900 mb-4">Giờ làm việc</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Thứ 2 - Thứ 6</span>
            <span className="font-medium">8:00 - 17:00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Thứ 7</span>
            <span className="font-medium">8:00 - 12:00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Chủ nhật</span>
            <span className="font-medium text-amber-600">Nghỉ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;