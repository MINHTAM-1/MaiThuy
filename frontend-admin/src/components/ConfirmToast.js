import toast from "react-hot-toast";

const confirmToast = ({ textConfirm, textCancel = "Hủy", textConfirmButton = "Xác nhận" }) => {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="flex flex-col space-y-2">
          <span>{textConfirm}</span>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              onClick={() => { toast.dismiss(t.id); resolve(false); }}
            >
              {textCancel}
            </button>
            <button
              className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700"
              onClick={() => { toast.dismiss(t.id); resolve(true); }}
            >
              {textConfirmButton}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  });
};
export default confirmToast;