const SocialLogin = () => {
  return (
    <div className="social-link-btn flex justify-center space-x-4 mb-6">
      <button className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
        <i className="bx bxl-facebook text-xl"></i>
      </button>
      <button className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
        <i className="bx bxl-twitter text-xl"></i>
      </button>
      <button className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors">
        <i className="bx bxl-github text-xl"></i>
      </button>
    </div>
  );
};

export default SocialLogin;