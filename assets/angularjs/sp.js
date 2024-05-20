let openExel = function () {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
    // Lắng nghe sự kiện change trên input file
    fileInput.addEventListener('change', function () {
        const selectedFile = fileInput.files[0]; // Lấy tệp đã chọn

        if (selectedFile) {
            document.getElementById('uploadButton').textContent = selectedFile.name; // Cập nhật nội dung nút thành tên tệp đã chọn
        }
    });
}



