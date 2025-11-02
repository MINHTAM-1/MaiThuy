const Map = () => {
  return (
    <section className="map mt-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Bản đồ vị trí</h2>
        <p className="text-gray-600 text-lg">Xác định vị trí cửa hàng chúng tôi nhanh chóng</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Google Map */}
          <div className="lg:col-span-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62708.61278617321!2d106.65666696476741!3d10.789217076106567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752efef82dcfcd%3A0x523550c70a8c31ea!2zQ0FUUCBQaMOybmcgQ-G6o25oIFPDoXQgxJBp4buBdSBUcmEgVOG7mWkgUGjhuqFtIFbhu4EgTWEgVMO6eQ!5e0!3m2!1svi!2s!4v1696740212187!5m2!1svi!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MAITHUY Coffee Location"
              className="w-full h-full min-h-[400px]"
            ></iframe>
          </div>
          
          {/* Store Info */}
          <div className="bg-amber-900 text-white p-8">
            <h3 className="text-2xl font-bold mb-6">Cửa hàng chính</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-amber-200 mb-2">Địa chỉ</h4>
                <p>34 Đ. An Bình, Phường 6, Quận 5, TP.HCM</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-amber-200 mb-2">Giờ mở cửa</h4>
                <p>Thứ 2 - Thứ 7: 7:00 - 22:00</p>
                <p>Chủ nhật: 8:00 - 18:00</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-amber-200 mb-2">Dịch vụ</h4>
                <ul className="space-y-1">
                  <li>• Mua mang về</li>
                  <li>• Ngồi tại chỗ</li>
                  <li>• Đặt hàng online</li>
                  <li>• Giao hàng tận nơi</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-amber-200 mb-2">Tiện ích</h4>
                <ul className="space-y-1">
                  <li>• WiFi miễn phí</li>
                  <li>• Chỗ đỗ xe</li>
                  <li>• Không gian làm việc</li>
                  <li>• Phục vụ tận bàn</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-amber-700">
                <button className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors font-semibold">
                  Chỉ đường với Google Maps
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;