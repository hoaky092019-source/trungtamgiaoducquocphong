import React, { useEffect, useState } from 'react';
import unitService from '../../services/unitService';

const AdminUnitsPage = () => {
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form States
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [showBuildingModal, setShowBuildingModal] = useState(false);
    const [unitForm, setUnitForm] = useState({ name: '', code: '', type: 1, parentId: null });
    const [buildingForm, setBuildingForm] = useState({ name: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);

    const unitTypes = {
        0: 'Khối Phòng Ban',
        1: 'Tiểu đoàn',
        2: 'Đại đội',
        3: 'Trung đội'
    };

    useEffect(() => {
        fetchHierarchy();
    }, []);

    const fetchHierarchy = async () => {
        setLoading(true);
        try {
            const res = await unitService.getHierarchy();
            setUnits(res);
        } catch (error) {
            console.error("Error fetching units:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUnit = async (unit) => {
        setSelectedUnit(unit);
        // If it's a Battalion (Type 1) or Company (Type 2), fetch buildings
        if (unit.type === 1 || unit.type === 2) {
            try {
                const bRes = await unitService.getBuildings(unit.id);
                setBuildings(bRes);
            } catch (error) {
                console.error(error);
            }
        } else {
            setBuildings([]);
        }
    };

    // --- UNIT ACTIONS ---
    const handleAddUnit = (parentId = null, type = 1) => {
        setUnitForm({ name: '', code: '', type: type, parentId: parentId });
        setIsEditing(false);
        setShowUnitModal(true);
    };

    const handleEditUnit = (unit) => {
        setUnitForm({ ...unit });
        setIsEditing(true);
        setShowUnitModal(true);
    };

    const handleSaveUnit = async () => {
        try {
            if (isEditing) {
                await unitService.update(unitForm.id, unitForm);
            } else {
                await unitService.create(unitForm);
            }
            setShowUnitModal(false);
            fetchHierarchy();
            if (selectedUnit && selectedUnit.id === unitForm.id) setSelectedUnit(null); // Deselect to refresh
        } catch (error) {
            alert("Lỗi lưu đơn vị");
        }
    };

    const handleDeleteUnit = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa đơn vị này?")) return;
        try {
            await unitService.delete(id);
            fetchHierarchy();
            setSelectedUnit(null);
        } catch (error) {
            alert("Không thể xóa (có thể do còn dữ liệu con).");
        }
    };

    // --- BUILDING ACTIONS ---
    const handleAddBuilding = () => {
        setBuildingForm({ name: '', description: '' });
        setIsEditing(false);
        setShowBuildingModal(true);
    };

    const handleSaveBuilding = async () => {
        try {
            if (isEditing) {
                await unitService.updateBuilding(buildingForm.id, buildingForm);
            } else {
                await unitService.addBuilding(selectedUnit.id, buildingForm);
            }
            setShowBuildingModal(false);
            // Refresh buildings
            const bRes = await unitService.getBuildings(selectedUnit.id);
            setBuildings(bRes);
        } catch (error) {
            alert("Lỗi lưu dãy nhà");
        }
    };

    const handleDeleteBuilding = async (id) => {
        if (!window.confirm("Xóa dãy nhà này?")) return;
        try {
            await unitService.deleteBuilding(id);
            const bRes = await unitService.getBuildings(selectedUnit.id);
            setBuildings(bRes);
        } catch (error) {
            alert("Lỗi xóa dãy nhà");
        }
    };

    // Render Tree Recursively
    const renderTree = (nodes, level = 0) => {
        return nodes.map(node => (
            <div key={node.id} className="mb-1">
                <div
                    className={`d-flex align-items-center p-2 rounded cursor-pointer ${selectedUnit?.id === node.id ? 'bg-primary text-white' : 'bg-light hover-bg-gray'}`}
                    style={{ marginLeft: `${level * 20}px` }}
                    onClick={() => handleSelectUnit(node)}
                >
                    <i className={`fa-solid ${node.type === 0 ? 'fa-building-columns' : node.type === 1 ? 'fa-sitemap' : 'fa-users'} me-2`}></i>
                    <span className="flex-grow-1 fw-bold">{node.name} <small className="opacity-75">({unitTypes[node.type]})</small></span>

                    <div className="btn-group btn-group-sm">
                        {/* Add Child Button (Only for Battalion adding Company) */}
                        {node.type === 1 && (
                            <button className="btn btn-sm btn-light text-primary" title="Thêm Đại đội"
                                onClick={(e) => { e.stopPropagation(); handleAddUnit(node.id, 2); }}>
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        )}
                        <button className="btn btn-sm btn-light text-dark" onClick={(e) => { e.stopPropagation(); handleEditUnit(node); }}>
                            <i className="fa-solid fa-pen"></i>
                        </button>
                        <button className="btn btn-sm btn-light text-danger" onClick={(e) => { e.stopPropagation(); handleDeleteUnit(node.id); }}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
                {node.children && node.children.length > 0 && (
                    <div className="mt-1">
                        {renderTree(node.children, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className="container-fluid p-4">
            <h4 className="fw-bold mb-4"><i className="fa-solid fa-network-wired me-2"></i>Quản lý Cơ cấu Tổ chức & Đơn vị</h4>

            <div className="row">
                {/* LEFT: Organization Tree */}
                <div className="col-md-5">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h6 className="m-0 fw-bold text-primary">Cây Tổ chức</h6>
                            <div>
                                <button className="btn btn-sm btn-outline-success me-1" onClick={() => handleAddUnit(null, 0)}>
                                    <i className="fa-solid fa-plus me-1"></i>Phòng ban
                                </button>
                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleAddUnit(null, 1)}>
                                    <i className="fa-solid fa-plus me-1"></i>Tiểu đoàn
                                </button>
                            </div>
                        </div>
                        <div className="card-body overflow-auto" style={{ maxHeight: '70vh' }}>
                            {loading ? <p>Đang tải...</p> : renderTree(units)}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Details & Buildings */}
                <div className="col-md-7">
                    {selectedUnit ? (
                        <div className="card shadow-sm h-100">
                            <div className="card-header bg-primary text-white">
                                <h6 className="m-0 fw-bold">{selectedUnit.name} - Chi tiết</h6>
                            </div>
                            <div className="card-body">
                                <div className="mb-4">
                                    <label className="fw-bold me-2">Mã đơn vị:</label> <span className="badge bg-light text-dark border">{selectedUnit.code || 'N/A'}</span>
                                    <span className="mx-3">|</span>
                                    <label className="fw-bold me-2">Loại:</label> <span className="badge bg-warning text-dark">{unitTypes[selectedUnit.type]}</span>
                                    {selectedUnit.description && <p className="mt-2 text-muted fst-italic">{selectedUnit.description}</p>}
                                </div>

                                {/* Buildings Section (Only for Battalion/Company) */}
                                {(selectedUnit.type === 1 || selectedUnit.type === 2) && (
                                    <>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-bold text-success m-0"><i className="fa-solid fa-hotel me-2"></i>Danh sách Dãy nhà / Phòng</h6>
                                            <button className="btn btn-sm btn-success" onClick={handleAddBuilding}>
                                                <i className="fa-solid fa-plus me-1"></i>Thêm Nhà
                                            </button>
                                        </div>
                                        <table className="table table-bordered table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Tên Nhà</th>
                                                    <th>Mô tả</th>
                                                    <th className="text-end">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {buildings.length === 0 ? (
                                                    <tr><td colSpan="3" className="text-center text-muted">Chưa có dãy nhà nào được gán.</td></tr>
                                                ) : (
                                                    buildings.map(b => (
                                                        <tr key={b.id}>
                                                            <td className="fw-bold">{b.name}</td>
                                                            <td className="small">{b.description}</td>
                                                            <td className="text-end">
                                                                <button className="btn btn-sm btn-link text-primary p-0 me-2" onClick={() => { setBuildingForm(b); setIsEditing(true); setShowBuildingModal(true); }}>Sửa</button>
                                                                <button className="btn btn-sm btn-link text-danger p-0" onClick={() => handleDeleteBuilding(b.id)}>Xóa</button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-info">
                            <i className="fa-solid fa-arrow-left me-2"></i>Chọn một đơn vị bên trái để xem chi tiết và quản lý dãy nhà.
                        </div>
                    )}
                </div>
            </div>

            {/* UNIT MODAL */}
            {showUnitModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Cập nhật Đơn vị' : 'Thêm Đơn vị Mới'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowUnitModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Tên Đơn vị</label>
                                    <input type="text" className="form-control" value={unitForm.name} onChange={e => setUnitForm({ ...unitForm, name: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Mã (Viết tắt)</label>
                                    <input type="text" className="form-control" value={unitForm.code} onChange={e => setUnitForm({ ...unitForm, code: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Loại Đơn vị</label>
                                    <select className="form-select" value={unitForm.type} onChange={e => setUnitForm({ ...unitForm, type: parseInt(e.target.value) })} disabled={unitForm.parentId !== null}>
                                        <option value={0}>Khối Phòng Ban</option>
                                        <option value={1}>Tiểu đoàn</option>
                                        <option value={2}>Đại đội</option>
                                    </select>
                                    {unitForm.parentId && <small className="text-muted">Đơn vị con sẽ tự động kế thừa loại phù hợp.</small>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Mô tả</label>
                                    <textarea className="form-control" rows="2" value={unitForm.description || ''} onChange={e => setUnitForm({ ...unitForm, description: e.target.value })}></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowUnitModal(false)}>Hủy</button>
                                <button className="btn btn-primary" onClick={handleSaveUnit}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* BUILDING MODAL */}
            {showBuildingModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Cập nhật Dãy nhà' : 'Thêm Dãy nhà'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowBuildingModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Tên Dãy nhà / Phòng</label>
                                    <input type="text" className="form-control" placeholder="Ví dụ: A1, C2, P.102"
                                        value={buildingForm.name} onChange={e => setBuildingForm({ ...buildingForm, name: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Mô tả (Sức chứa, ghi chú...)</label>
                                    <textarea className="form-control" rows="2" value={buildingForm.description || ''} onChange={e => setBuildingForm({ ...buildingForm, description: e.target.value })}></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowBuildingModal(false)}>Hủy</button>
                                <button className="btn btn-primary" onClick={handleSaveBuilding}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUnitsPage;
