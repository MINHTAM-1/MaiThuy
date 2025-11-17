const RegisterStep2 = ({ formData, updateFormData, prevStep, nextStep }) => {
  const handleNext = () => {
    if (!formData.phone || !formData.email || !formData.password || !formData.confirmPassword) {
      alert('Vui lòng điền đầy đủ thông tin liên lạc');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }
    nextStep();
  };

  return (
    <div className="stage-no-2-content space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="text-fields phone">
          <label htmlFor="phone" className="sr-only">Số điện thoại</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              📱
            </span>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              placeholder="0823458321"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
        </div>

        <div className="text-fields password">
          <label htmlFor="password" className="sr-only">Mật khẩu</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              🔒
            </span>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
        </div>

        <div className="text-fields confirm-password">
          <label htmlFor="confirm-password" className="sr-only">Xác nhận mật khẩu</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              🔒
            </span>
            <input
              type="password"
              name="confirmPassword"
              id="confirm-password"
              value={formData.confirmPassword}
              onChange={(e) => updateFormData('confirmPassword', e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="pagination-btn flex justify-between pt-6">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200"
        >
          Quay lại
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default RegisterStep2;