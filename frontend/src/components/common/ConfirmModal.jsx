import React from 'react';
import '../../css/Modal.css'; // Import CSS vừa tạo

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null; // Nếu chưa mở thì không render gì cả

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* onClick={e => e.stopPropagation()} để bấm vào hộp thoại không bị đóng */}
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-icon-wrapper">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </div>

                <h3 className="modal-title">{title || "Xác nhận xóa?"}</h3>
                <p className="modal-desc">
                    {message || "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?"}
                </p>

                <div className="modal-actions">
                    <button className="btn-modal-cancel" onClick={onClose}>
                        Hủy bỏ
                    </button>
                    <button className="btn-modal-delete" onClick={onConfirm}>
                        Xác nhận xóa
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmModal;