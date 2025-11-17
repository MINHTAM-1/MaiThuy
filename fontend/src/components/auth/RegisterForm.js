import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterStep1 from "./RegisterStep1";
import RegisterStep2 from "./RegisterStep2";
import RegisterStep3 from "./RegisterStep3";
import { authAPI } from "../../services/api";
import ROUTES from "../../routes";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Step 1
    fname: "",
    lname: "",
    email: "",

    // Step 2
    phone: "",
    password: "",
    confirmPassword: "",

    // Step 3 
    province: "",
    district: "",
    ward: "",
    detail: "",
  });


  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const nextStep = () => setCurrentStep((s) => s + 1);
  const prevStep = () => setCurrentStep((s) => s - 1);

  // SUBMIT đăng ký (khi ở step 3)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== 3) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: `${formData.fname} ${formData.lname}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: {
          province: formData.province || { code: "", name: "" },
          district: formData.district || { code: "", name: "" },
          ward: formData.ward || { code: "", name: "" },
          detail: formData.detail || "",
        },
      };

      const response = await authAPI.register(payload);

      if (response.data.success === true) {
        navigate(ROUTES.LOGIN);
      } else {
        // Nếu backend trả về lỗi validation theo field
        if (response.errors) {
          const messages = response.errors
            .map((e) => `${e.field}: ${e.messages.join(", ")}`)
            .join("\n");
          setError(messages);
        } else {
          setError(response.message || "Đăng ký thất bại.");
        }
      }
    } catch (err) {
      console.error("Register error:", err);
      // Nếu backend trả lỗi 400 validation
      if (err.response?.data?.errors) {
        const messages = err.response.data.errors
          .map((e) => `${e.field}: ${e.messages.join(", ")}`)
          .join("\n");
        setError(messages);
      } else {
        setError(
          err.response?.data?.message ||
          "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Thông tin cá nhân";
      case 2: return "Thông tin liên lạc";
      case 3: return "Địa chỉ";
      default: return "Đăng ký tài khoản";
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <p className="text-3xl font-bold text-gray-900 mb-2">
          {getStepTitle()}
        </p>
        <p className="text-gray-600 mb-4">Bước {currentStep} của 3</p>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-amber-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Steps */}
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

      {/* Footer */}
      {currentStep === 3 && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Bằng việc đăng ký, bạn đồng ý với{" "}
            <a href="/terms" className="text-amber-600 hover:text-amber-700">Điều khoản</a>{" "}
            và{" "}
            <a href="/privacy" className="text-amber-600 hover:text-amber-700">Chính sách bảo mật</a>
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 py-3 rounded-lg font-semibold 
              ${loading ? "bg-gray-400" : "bg-amber-600 hover:bg-amber-700 text-white"}`}
          >
            {loading ? "Đang tạo tài khoản..." : "Hoàn tất đăng ký"}
          </button>
        </div>
      )}
    </form>
  );
};

export default RegisterForm;
