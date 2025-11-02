const RegisterStep3 = ({ formData, updateFormData, prevStep, loading }) => {
  return (
    <div className="stage-no-3-content space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-fields address">
          <label htmlFor="address" className="sr-only">Địa chỉ</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              🏠
            </span>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              placeholder="1 Đ.Cộng Hòa, Tân Bình"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
              autoComplete="on"
              disabled={loading}
            />
          </div>
        </div>

        <div className="text-fields city">
          <label htmlFor="city" className="sr-only">Thành phố</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              🏙️
            </span>
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
              placeholder="Thành phố Hồ Chí Minh"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
              autoComplete="on"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="text-fields country">
        <label htmlFor="country" className="sr-only">Quốc gia</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
            🌎
          </span>
          <input
            type="text"
            name="country"
            id="country"
            value={formData.country}
            onChange={(e) => updateFormData('country', e.target.value)}
            placeholder="Việt Nam"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
            autoComplete="country"
            disabled={loading}
          />
        </div>
      </div>

      <div className="pagination-btn flex justify-between pt-6">
        <button
          type="button"
          onClick={prevStep}
          disabled={loading}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${
            loading 
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Quay lại
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-200 ${
            loading 
              ? 'bg-amber-400 cursor-not-allowed text-white' 
              : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Đang đăng ký...
            </div>
          ) : (
            'Đăng kí'
          )}
        </button>
      </div>
    </div>
  );
};

export default RegisterStep3;