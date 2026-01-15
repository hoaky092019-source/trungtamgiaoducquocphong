import React, { useEffect, useState } from 'react';
import { FullFileBrowser, ChonkyActions, setChonkyDefaults } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import fileManagerService from '../../../services/fileManagerService';

// Cấu hình Icon cho Chonky
setChonkyDefaults({ iconComponent: ChonkyIconFA });

const FileManagerPage = () => {
    // 1. Data cho Chonky
    const [files, setFiles] = useState([]);
    const [folderChain, setFolderChain] = useState([{ id: null, name: 'Thư mục gốc', isDir: true }]);
    const [currentFolderId, setCurrentFolderId] = useState(null);

    // 2. Load dữ liệu
    const loadFiles = async (parentId) => {
        try {
            const data = await fileManagerService.getNodes(parentId);

            // Map dữ liệu từ API sang chuẩn Chonky
            // API trả về: { id, name, isFolder, lastModified, size, path }
            const chonkyFiles = data.map(item => ({
                id: item.id.toString(),
                name: item.name,
                isDir: item.isFolder,
                modDate: item.lastModified,
                size: item.size,
                thumbnailUrl: item.path ? `http://localhost:5076${item.path}` : null,
            }));

            setFiles(chonkyFiles);
        } catch (error) {
            console.error("Lỗi load file:", error);
            alert("Không thể tải danh sách tài liệu.");
        }
    };

    useEffect(() => {
        loadFiles(currentFolderId);
    }, [currentFolderId]);

    // 3. Xử lý hành động (Click, Double Click, Toolbar)
    const handleFileAction = async (data) => {
        if (data.id === ChonkyActions.OpenFiles.id) {
            const { targetFile, files } = data.payload;
            const fileToOpen = targetFile || files[0];

            if (fileToOpen && fileToOpen.isDir) {
                // Vào thư mục
                setCurrentFolderId(fileToOpen.id);

                // Logic Breadcrumb:
                // Kiểm tra xem folder này đã có trong chain chưa (trường hợp click vào breadcrumb)
                const existingIndex = folderChain.findIndex(f => f.id === fileToOpen.id);
                if (existingIndex !== -1) {
                    // Nếu đã có, cắt chain về điểm đó
                    setFolderChain(prev => prev.slice(0, existingIndex + 1));
                } else {
                    // Nếu chưa, thêm vào
                    setFolderChain(prev => [...prev, { id: fileToOpen.id, name: fileToOpen.name, isDir: true }]);
                }
            } else if (fileToOpen) {
                // Mở file (Xem ảnh hoặc Tải về)
                if (fileToOpen.thumbnailUrl) {
                    window.open(fileToOpen.thumbnailUrl, '_blank');
                } else {
                    alert(`Đang mở file: ${fileToOpen.name}`);
                }
            }
        }
        else if (data.id === 'create_folder_vn') { // Custom Action ID
            const folderName = prompt("Nhập tên thư mục mới:");
            if (folderName) {
                try {
                    await fileManagerService.createFolder(folderName, currentFolderId);
                    loadFiles(currentFolderId);
                } catch (e) { alert("Lỗi tạo thư mục: " + e.message); }
            }
        }
        else if (data.id === 'upload_file_vn') {
            document.getElementById('upload-input').click();
        }
        else if (data.id === 'delete_file_vn') {
            const selectedFiles = data.state.selectedFiles;
            if (selectedFiles.length === 0) return;

            if (window.confirm(`Bạn có chắc muốn xóa ${selectedFiles.length} mục đã chọn?`)) {
                for (const file of selectedFiles) {
                    try {
                        await fileManagerService.delete(file.id);
                    } catch (e) {
                        console.error(e);
                        alert(`Không thể xóa ${file.name}`);
                    }
                }
                loadFiles(currentFolderId);
            }
        }
        // Xử lý click vào breadcrumb (folder chain) hoặc nút Back
        else if (data.id === ChonkyActions.OpenParentFolder.id) {
            // Logic quay lại thư mục cha
            if (folderChain.length > 1) {
                // Lấy thư mục cha (áp chót trong chain)
                const parentFolder = folderChain[folderChain.length - 2];
                // Cập nhật state
                setCurrentFolderId(parentFolder.id);
                // Cắt bớt phần tử cuối danh sách chain
                setFolderChain(prev => prev.slice(0, prev.length - 1));
            } else {
                // Đã ở root
                setCurrentFolderId(null);
            }
        }
    };

    // 4. Xử lý Upload thật
    const handleUploadInput = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            await fileManagerService.uploadFile(file, currentFolderId);
            loadFiles(currentFolderId);
            e.target.value = null; // Reset input
        } catch (e) { alert("Lỗi tải lên: " + e.message); }
    };

    // 5. Định nghĩa Action tiếng Việt (Overrides)
    const vietnameseActions = [
        { id: ChonkyActions.CreateFolder.id, name: 'Tạo thư mục', isHelper: true, icon: 'folder', hotkeys: ['ctrl+n'] },
        { id: 'upload_file_vn', name: 'Tải lên', isHelper: true, icon: 'upload', hotkeys: ['ctrl+u'] },
        { id: ChonkyActions.DeleteFiles.id, name: 'Xóa', hotkeys: ['delete'], icon: 'trash' },
        { id: ChonkyActions.DownloadFiles.id, name: 'Tải xuống', icon: 'download' },
        { id: ChonkyActions.ToggleHiddenFiles.id, name: 'Hiện file ẩn', icon: 'eye' },
        { id: ChonkyActions.EnableGridView.id, name: 'Lưới', icon: 'th' },
        { id: ChonkyActions.EnableListView.id, name: 'Danh sách', icon: 'list' },
        { id: ChonkyActions.SortFilesByName.id, name: 'Sắp xếp tên' },
        { id: ChonkyActions.SortFilesBySize.id, name: 'Sắp xếp kích thước' },
        { id: ChonkyActions.SortFilesByDate.id, name: 'Sắp xếp ngày' },
    ];
    // Cấu hình ngôn ngữ hiển thị
    const i18n = {
        locale: 'vi',
        formatters: {
            formatDate: (date) => new Date(date).toLocaleDateString('vi-VN'),
            formatFileSize: (size) => {
                if (size === null || size === undefined) return '0 B';
                if (size < 1024) return `${size} B`;
                if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
                return `${(size / (1024 * 1024)).toFixed(1)} MB`;
            },
        },
        messages: {
            'chonky.toolbar.searchPlaceholder': 'Tìm kiếm...',
            'chonky.fileList.nothingToShow': 'Thư mục trống',
            'chonky.contextMenu.createFolder': 'Tạo thư mục',
            'chonky.actionGroups.Actions': 'Hành động',
            'chonky.actionGroups.Options': 'Tùy chọn',
            'chonky.fileList.filesSelected': 'Đã chọn {count} mục',
        }
    };

    return (
        <div className="h-[80vh] p-6 bg-pro-light rounded-xl">
            <div className="h-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
                <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between">
                    <h5 className="m-0 text-pro-dark font-bold text-lg flex items-center gap-2">
                        <i className="fa fa-folder-open text-pro-primary"></i>
                        Quản lý Tài Liệu
                    </h5>
                    {/* Toolbar Placeholder if needed */}
                </div>

                <div className="flex-1 p-0 relative">
                    <input
                        type="file"
                        id="upload-input"
                        style={{ display: 'none' }}
                        onChange={handleUploadInput}
                    />

                    <FullFileBrowser
                        files={files}
                        folderChain={folderChain}
                        fileActions={vietnameseActions}
                        onFileAction={handleFileAction}
                        i18n={i18n}
                        disableDragAndDrop={false}
                        disableDraftSelection={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default FileManagerPage;
