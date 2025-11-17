import { useEffect, useState } from "react";
import { promotionsAPI } from "../../services/api";
import toast from "react-hot-toast";
import { FaInfoCircle } from "react-icons/fa";

const PromotionModal = ({ open, onClose, orderValue, onApply, appliedPromotion }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) fetchPromotions();
  }, [open]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);

      const res = await promotionsAPI.getAll();
      const list = res.data.data.items || [];
      // Gọi checkValidate cho từng mã
      const results = await Promise.all(
        list.map(async (promo) => {
          try {
            const chk = await promotionsAPI.checkValidate(promo.code, orderValue);
            return {
              ...promo,
              check: chk.data.success ? chk.data.data : { valid: false }
            };
          } catch {
            return { ...promo, check: { valid: false } };
          }
        })
      );

      setPromotions(results);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Chọn mã giảm giá</h2>

        {loading ? "Đang tải..." : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {promotions.map((promo) => (
              <div
                key={promo._id}
                className={`p-4 border rounded-lg flex justify-between items-center ${promo.check.valid ? "" : "opacity-40 pointer-events-none"
                  }`}
              >
                <div>
                  <p className="font-bold">{promo.code}</p>
                  <p className="text-sm text-gray-600">{promo.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className={`px-3 py-2 rounded-lg ${appliedPromotion?.promotion?.code === promo.code
                        ? "bg-white text-amber-600 border-amber-600 hover:bg-amber-50"
                        : "bg-amber-600 text-white hover:bg-amber-700"
                      }`}
                    onClick={() => {
                      // Nếu nút của mã đang áp dụng → hủy
                      if (appliedPromotion?.promotion?.code === promo.code) {
                        onApply(null); 
                      }
                      // Nếu đã áp mã khác → hiện toast
                      else if (appliedPromotion) {
                        toast.error("Chỉ được dùng 1 mã giảm giá!");
                      }
                      // Áp mã mới
                      else {
                        onApply(promo.check, promo._id);
                      }
                    }}
                  >
                    {appliedPromotion?.promotion?.code === promo.code ? "Hủy áp mã" : "Áp mã"}
                  </button>
                  <FaInfoCircle
                    size={20}
                    className="text-gray-600 cursor-pointer"
                    onClick={() => onApply("INFO", promo._id)}
                  />
                </div>
              </div>
            ))}
          </div>
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

export default PromotionModal;
