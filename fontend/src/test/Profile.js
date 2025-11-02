import { useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0123 456 789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    birthday: '1990-01-01'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Ở đây sẽ gọi API để lưu thông tin
    alert('Thông tin đã được cập nhật!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-amber-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-amber-800">NV</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-amber-100">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200"
                >
                  Chỉnh sửa
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => setUser({...user, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={user.birthday}
                  onChange={(e) => setUser({...user, birthday: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  value={user.address}
                  onChange={(e) => setUser({...user, address: e.target.value})}
                  disabled={!isEditing}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-6">Lịch sử đơn hàng</h2>
          <div className="text-center text-gray-500 py-8">
            <p>Chưa có đơn hàng nào</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;