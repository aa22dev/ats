$('#inspections').DataTable({
    processing: true,
    serverSide: true,
    search: {
        caseInsensitive: true,
        return: true
    },
    ajax: {
        url: '/api/inspection-reports',
        type: 'POST',
    },
    columns: [
        { data: 'inspection_id' },
        { data: 'license_plate_number' },
        { data: 'username' },
        //{ data: 'comments' },
        { data: 'status' },
        { data: 'created_at' },
        {
            data: null, orderable: false,
            createdCell: function (td, cellData, rowData, row, col) {
                $(td).addClass('aa-group-action');
            },
            render: function (data, type, row) {
                return `<a href="/inspection-reports/view/${data.license_plate_number}/${data.inspection_id}" title="View" class="btn btn-primary btn-circle-lg action-btn"><i class="fas fa-eye"></i></a>
                        <a href="/inspection-reports/mark-fixed/${data.inspection_id}" title="Mark as Fixed" class="btn btn-success btn-circle-lg action-btn" onclick="return confirm('Are you sure you want to mark it as fixed and close it?');"><i class="fas fa-check"></i></a>`;
            }
        }
    ],
    order: [[0, 'desc']],
})

$('#inspectionHistory').DataTable({
    processing: true,
    serverSide: true,
    search: {
        caseInsensitive: true,
        return: true
    },
    ajax: {
        url: '/api/inspection-history',
        type: 'POST',
    },
    columns: [
        { data: 'inspection_id' },
        { data: 'license_plate_number' },
        { data: 'username' },
        //{ data: 'comments' },
        { data: 'status' },
        { data: 'created_at' },
        {
            data: null, orderable: false,
            createdCell: function (td, cellData, rowData, row, col) {
                $(td).addClass('aa-group-action');
            },
            render: function (data, type, row) {
                return `<a href="/inspection-history/view/${data.license_plate_number}/${data.inspection_id}" title="View" class="btn btn-primary btn-circle-lg action-btn"><i class="fas fa-eye"></i></a>
                        <a href="/inspection-history/mark-unfixed/${data.inspection_id}" title="Mark as Unfixed" class="btn btn-danger btn-circle-lg action-btn" onclick="return confirm('Are you sure you want to mark it as not fixed and open it?');"><i class="fas fa-times"></i></a>`;
            }
        }
    ],
    order: [[0, 'desc']],
})