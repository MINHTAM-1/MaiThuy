const RegisterStep1 = ({ formData, updateFormData, nextStep }) => {
  const handleNext = () => {
    if (!formData.fname || !formData.lname || !formData.dob || !formData.gender) {
      alert('Vui lòng điền đầy đủ thông tin cá nhân');
      return;
    }
    nextStep();
  };

  return (
    <div className="stage-no-1-content space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-fields fname">
          <label htmlFor="fname" className="sr-only">Họ</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              👤
            </span>
            <input
              type="text"
              name="fname"
              id="fname"
              value={formData.fname}
              onChange={(e) => updateFormData('fname', e.target.value)}
              placeholder="Nguyễn"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
        </div>

        <div className="text-fields lname">
          <label htmlFor="lname" className="sr-only">Tên</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              👤
            </span>
            <input
              type="text"
              name="lname"
              id="lname"
              value={formData.lname}
              onChange={(e) => updateFormData('lname', e.target.value)}
              placeholder="Lê Thuỳ Linh"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-fields dob">
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              🎂
            </span>
            <input
              type="date"
              name="dob"
              id="dob"
              value={formData.dob}
              onChange={(e) => updateFormData('dob', e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
        </div>

        <div className="gender-selection">
          <p className="field-heading text-sm font-medium text-gray-700 mb-3">Giới tính: </p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gender"
                value="0"
                checked={formData.gender === '0'}
                onChange={(e) => updateFormData('gender', e.target.value)}
                className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                required
              />
              <span>Nam</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gender"
                value="1"
                checked={formData.gender === '1'}
                onChange={(e) => updateFormData('gender', e.target.value)}
                className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
              />
              <span>Nữ</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gender"
                value="2"
                checked={formData.gender === '2'}
                onChange={(e) => updateFormData('gender', e.target.value)}
                className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
              />
              <span>Khác</span>
            </label>
          </div>
        </div>
      </div>

      <div className="pagination-btn flex justify-end pt-6">
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

export default RegisterStep1;