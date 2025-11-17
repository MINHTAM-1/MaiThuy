import { useEffect, useState } from "react";
import { promotionsAPI } from "../../services/api";

const PromotionDetailModal = ({ id, open, onClose }) => {
  const [promo, setPromo] = useState(null);

  useEffect(() => {
    if (open && id) fetchDetail();
  }, [open]);

  const fetchDetail = async () => {
    const res = await promotionsAPI.getById(id);
    setPromo(res.data.data);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl">
        {!promo ? "Đang tải..." : (
          <>
            <h2 className="text-xl font-semibold mb-4">{promo.code}</h2>

            <p><b>Mô tả:</b> {promo.description}</p>
            <p><b>Loại giảm:</b> {promo.discountType}</p>
            <p><b>Giá trị giảm:</b> {promo.discountValue}</p>
            <p><b>Áp dụng từ:</b> {new Date(promo.startDate).toLocaleString()}</p>
            <p><b>Đến hết:</b> {new Date(promo.endDate).toLocaleString()}</p>
            <p><b>Đơn tối thiểu:</b> {promo.minOrderValue.toLocaleString()}₫</p>
            <p><b>Trạng thái:</b> {promo.active ? "Đang hoạt động" : "Không hoạt động"}</p>
          </>
        )}

        <button
          className="mt-6 w-full bg-gray-300 py-2 rounded-lg"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default PromotionDetailModal;
