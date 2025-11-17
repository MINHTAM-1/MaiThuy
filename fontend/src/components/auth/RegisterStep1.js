const RegisterStep1 = ({ formData, updateFormData, nextStep }) => {
  const handleNext = async () => {
    if (!formData.fname || !formData.lname || !formData.email) {
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
        <div className="text-fields email md:col-span-2">
          <label htmlFor="email" className="sr-only">Email</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              📧
            </span>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="abc@maithuycoffee.com"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="pagination-btn flex justify-end pt-6">
        <button
          type="button"
          onClick={handleNext}
          className={'px-8 py-3 rounded-lg font-semibold text-white transition-colors duration-200 bg-amber-600 hover:bg-amber-700'
            }
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default RegisterStep1;