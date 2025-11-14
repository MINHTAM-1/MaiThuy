const RegisterStep3 = ({ formData, updateFormData, prevStep, loading }) => {
  return (
    <div className="stage-no-3-content space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-fields address">
          <label htmlFor="address" className="sr-only">Địa chỉ</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </span>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              placeholder="1 Đ.Cộng Hòa, Tân Bình"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
              autoComplete="on"
              disabled={loading}
            />
          </div>
        </div>

        <div className="text-fields city">
          <label htmlFor="city" className="sr-only">Thành phố</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </span>
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
              placeholder="Thành phố Hồ Chí Minh"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
          </span>
          <input
            type="text"
            name="country"
            id="country"
            value={formData.country}
            onChange={(e) => updateFormData('country', e.target.value)}
            placeholder="Việt Nam"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
              <svg xmlns="http://www.w3.org/2000/svg" className="animate-spin h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
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