$('#qr').DataTable({
    processing: true,
    serverSide: true,
    search: {
        caseInsensitive: true,
        return: true
    },
    ajax: {
        url: '/api/allQR',
        type: 'POST',
    },
    columns: [
        { data: 'qrcode_id' },
        { data: 'qr_code', orderable: false,
            createdCell: function (td, cellData, rowData, row, col) {
                $(td).addClass('aa-qr-code');
            },
            render: function (data, type, row) {
                return `<img src="${data}" alt="QR Code" class="qr-code">`;
            }
        },
        { data: 'license_plate_number' },
        { data: 'created_at' },
        {
            data: null, orderable: false,
            createdCell: function (td, cellData, rowData, row, col) {
                $(td).addClass('aa-group-action');
            },
            render: function (data, type, row) {
                return `<a href="/qr/download/${data.vehicle_id}" title="Download QR Code" class="btn btn-sm btn-primary btn-shadow">Download QR</a>`
            }
        }
    ],
    order: [[0, 'desc']],
})