import { useEffect, useState } from "react";

const RegisterStep3 = ({ formData, updateFormData, prevStep, loading }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Load tỉnh khi mở Step 3
  useEffect(() => {
    fetch("https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1")
      .then(res => res.json())
      .then(data => setProvinces(data.data.data ?? []))
      .catch(err => console.error("Load provinces error:", err));
  }, []);

  // Khi chọn tỉnh → load quận
  useEffect(() => {
    if (!formData.province?.code) return;

    fetch(
      `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${formData.province.code}&limit=-1`
    )
      .then(res => res.json())
      .then(data => {
        setDistricts(data.data.data ?? []);
        setWards([]); // reset phường
        updateFormData("district", { code: "", name: "" });
        updateFormData("ward", { code: "", name: "" });
      })
      .catch(err => console.error("Load districts error:", err));
  }, [formData.province, updateFormData]);

  // Khi chọn quận → load phường
  useEffect(() => {
    if (!formData.district?.code) return;

    fetch(
      `https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${formData.district.code}&limit=-1`
    )
      .then(res => res.json())
      .then(data => {
        setWards(data.data.data ?? []);
        updateFormData("ward", { code: "", name: "" });
      })
      .catch(err => console.error("Load wards error:", err));
  }, [formData.district, updateFormData]);

  return (
    <div className="stage-no-3-content space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quốc gia */}
        <div>
          <label className="block text-gray-700 mb-1">Quốc gia</label>
          <input
            type="text"
            readOnly
            value="Việt Nam"
            className="w-full px-4 py-3 border rounded-lg bg-gray-100 text-gray-700"
          />
        </div>

        {/* Tỉnh / Thành phố */}
        <div>
          <label className="block text-gray-700 mb-1">Tỉnh / Thành phố</label>
          <select
            value={formData.province?.code || ""}
            onChange={(e) => {
              const selected = provinces.find((p) => p.code === e.target.value);
              updateFormData("province", selected || { code: "", name: "" });
            }}
            className="w-full px-4 py-3 border rounded-lg"
            required
          >
            <option value="">Chọn tỉnh</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quận / Huyện */}
        <div>
          <label className="block text-gray-700 mb-1">Quận / Huyện</label>
          <select
            value={formData.district?.code || ""}
            onChange={(e) => {
              const selected = districts.find((d) => d.code === e.target.value);
              updateFormData("district", selected || { code: "", name: "" });
            }}
            className="w-full px-4 py-3 border rounded-lg"
            required
            disabled={!formData.province?.code}
          >
            <option value="">Chọn quận / huyện</option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Phường / Xã */}
        <div>
          <label className="block text-gray-700 mb-1">Phường / Xã</label>
          <select
            value={formData.ward?.code || ""}
            onChange={(e) => {
              const selected = wards.find((w) => w.code === e.target.value);
              updateFormData("ward", selected || { code: "", name: "" });
            }}
            className="w-full px-4 py-3 border rounded-lg"
            required
            disabled={!formData.district?.code}
          >
            <option value="">Chọn phường / xã</option>
            {wards.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-1">Địa chỉ cụ thể (Số nhà,..)</label>
        <input
          value={formData.detail}
          onChange={(e) => updateFormData("detail", e.target.value)}
          className="w-full px-4 py-3 border rounded-lg text-gray-700"
        />
      </div>

      {/* Button */}
      <div className="pagination-btn flex justify-between pt-6">
        <button
          type="button"
          onClick={prevStep}
          disabled={loading}
          className="px-8 py-3 rounded-lg bg-gray-300 hover:bg-gray-400"
        >
          Quay lại
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </div>
    </div>
  );
};

export default RegisterStep3;
