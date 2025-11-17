import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Password states
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await usersAPI.getProfile();
      if (response.data) setUser(response.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const payload = {
        name: user.name,
        phone: user.phone,
        address: user.address,
      };
      await usersAPI.updateProfile(payload);
      setIsEditing(false);
      fetchUserData();
      toast.success("Thông tin đã được cập nhật!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi lưu");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      toast.error("Vui lòng điền đủ thông tin");
      return;
    }
    if (newPwd !== confirmPwd) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không trùng khớp");
      return;
    }

    try {
      await usersAPI.changePassword({ currentPassword: currentPwd, newPassword: newPwd, confirmPassword: confirmPwd });
      toast.success("Đổi mật khẩu thành công!");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi đổi mật khẩu");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Không tìm thấy thông tin người dùng</h2>
          <Link to="/login" className="text-amber-600 hover:text-amber-700">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-amber-800">
                {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Thành viên từ {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📝 Thông tin cá nhân
                </button>
                
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'password'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🔐 Đổi mật khẩu
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Chỉnh sửa
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={() => {
                setIsEditing(false);
                fetchUserData(); // reset data
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
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
            value={user.name || ''}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={user.email || ''}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại
          </label>
          <input
            type="tel"
            value={user.phone || ''}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        {/* Địa chỉ nâng cao */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tỉnh/Thành phố
            </label>
            <input
              type="text"
              value={user.address?.province?.name || ''}
              onChange={(e) =>
                setUser({
                  ...user,
                  address: { ...user.address, province: { ...user.address?.province, name: e.target.value } },
                })
              }
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quận/Huyện
            </label>
            <input
              type="text"
              value={user.address?.district?.name || ''}
              onChange={(e) =>
                setUser({
                  ...user,
                  address: { ...user.address, district: { ...user.address?.district, name: e.target.value } },
                })
              }
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phường/Xã
            </label>
            <input
              type="text"
              value={user.address?.ward?.name || ''}
              onChange={(e) =>
                setUser({
                  ...user,
                  address: { ...user.address, ward: { ...user.address?.ward, name: e.target.value } },
                })
              }
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số nhà, tên đường
            </label>
            <input
              type="text"
              value={user.address?.detail || ''}
              onChange={(e) =>
                setUser({
                  ...user,
                  address: { ...user.address, detail: e.target.value },
                })
              }
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
      </div>
    </div>

            )}

            {/* Password Tab */}
            {activeTab === "password" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Đổi mật khẩu</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <button
              onClick={handleChangePassword}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      )}
    
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;