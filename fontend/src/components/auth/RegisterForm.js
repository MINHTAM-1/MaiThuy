import { useState } from "react";
import RegisterStep1 from "./RegisterStep1";
import RegisterStep2 from "./RegisterStep2";
import RegisterStep3 from "./RegisterStep3";

const RegisterForm = ({ onSubmit, loading, error }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Personal Info
    fname: "",
    lname: "",
    dob: "",
    gender: "",
    
    // Step 2 - Contact Info
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Step 3 - Address Info
    address: "",
    city: "",
    country: "Việt Nam"
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep === 3) {
      onSubmit(formData);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Thông tin cá nhân";
      case 2:
        return "Thông tin liên lạc";
      case 3:
        return "Địa chỉ";
      default:
        return "Đăng ký tài khoản";
    }
  };

  const getProgressWidth = () => {
    return `${(currentStep / 3) * 100}%`;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <p className="text-3xl font-bold text-gray-900 mb-2">
          {getStepTitle()}
        </p>
        <p className="text-gray-600 mb-4">
          Bước {currentStep} của 3
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-amber-600 h-2 rounded-full transition-all duration-300"
            style={{ width: getProgressWidth() }}
          ></div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex flex-col items-center ${
                step <= currentStep ? 'text-amber-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step <= currentStep
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {step}
              </div>
              <span className="text-xs mt-1">
                {step === 1 && 'Cá nhân'}
                {step === 2 && 'Liên hệ'}
                {step === 3 && 'Địa chỉ'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[300px]">
        {currentStep === 1 && (
          <RegisterStep1
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        )}

        {currentStep === 2 && (
          <RegisterStep2
            formData={formData}
            updateFormData={updateFormData}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}

        {currentStep === 3 && (
          <RegisterStep3
            formData={formData}
            updateFormData={updateFormData}
            prevStep={prevStep}
            loading={loading}
          />
        )}
      </div>

      {/* Terms and Conditions */}
      {currentStep === 3 && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Bằng việc đăng ký, bạn đã đồng ý với{' '}
            <a href="/terms" className="text-amber-600 hover:text-amber-700">
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href="/privacy" className="text-amber-600 hover:text-amber-700">
              Chính sách bảo mật
            </a>{' '}
            của chúng tôi
          </p>
        </div>
      )}
    </form>
  );
};

export default RegisterForm;