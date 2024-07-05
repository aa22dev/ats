$('#alljobs').DataTable({
    processing: true,
    serverSide: true,
    search: {
        caseInsensitive: true,
        return: true
    },
    ajax: {
        url: '/applicant/jobs',
        type: 'POST',
    },
    columns: [
        { data: 'job_id' },
        { data: 'title' },
        { data: 'description' },
        { data: 'requirements' },
        { data: 'experience' },
        { data: 'education' },
        { data: 'salary' },
        { data: 'deadline' },
        { data: 'skills' }
        // {
        //     data: null, orderable: false,
        //     createdCell: function (td, cellData, rowData, row, col) {
        //         $(td).addClass('aa-group-action');
        //     },
        //     render: function (data, type, row) {
        //         return `<a href="/vehicles/edit/${data.vehicle_id}" title="Edit Vehicle" class="btn btn-primary btn-circle-lg action-btn"><i class="far fa-edit"></i></a>
        //                 <a href="/vehicles/delete/${data.vehicle_id}" title="Delete Vehicle" class="btn btn-primary btn-circle-lg action-btn" onclick="return confirm('Are you sure you want to delete this item?');"><i class="fas fa-trash-alt"></i></a>`;
        //     }
        // }
    ],
    order: [[0, 'desc']],
})