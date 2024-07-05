$('#inspectors').DataTable({
    processing: true,
    serverSide: true,
    search: {
        caseInsensitive: true,
        return: true
    },
    ajax: {
        url: '/api/all-inspectors',
        type: 'POST',
    },
    columns: [
        { data: 'id' },
        { data: 'username' },
        { data: 'email' },
        { data: 'status' },
        { data: 'created_at' },
        {
            data: null, orderable: false,
            createdCell: function (td, cellData, rowData, row, col) {
                $(td).addClass('aa-group-action');
            },
            render: function (data, type, row) {
                return `<a href="/users/inspector/edit/${data.id}" title="Edit Inspector" class="btn btn-primary btn-circle-lg action-btn"><i class="far fa-edit"></i></a>
                        <a href="/users/inspector/${data.status === 'active' ? 'suspend' : 'reactivate'}/${data.id}" title="${data.status === 'active' ? 'Suspend' : 'Re-activate'} Inspector" class="btn btn-danger btn-circle-lg action-btn" onclick="return confirm('Are you sure you want to ${data.status === 'active' ? 'suspend' : 're-activate'} this inspector?');">${data.status === 'active' ? '<svg xmlns="http://www.w3.org/2000/svg" height="10px" viewBox="0 0 640 512" fill="white"><path d="M633.8 458.1L362.3 248.3C412.1 230.7 448 183.8 448 128 448 57.3 390.7 0 320 0c-67.1 0-121.5 51.8-126.9 117.4L45.5 3.4C38.5-2 28.5-.8 23 6.2L3.4 31.4c-5.4 7-4.2 17 2.8 22.4l588.4 454.7c7 5.4 17 4.2 22.5-2.8l19.6-25.3c5.4-6.8 4.1-16.9-2.9-22.3zM96 422.4V464c0 26.5 21.5 48 48 48h350.2L207.4 290.3C144.2 301.3 96 356 96 422.4z"/></svg>' : '<i class="fas fa-user"></i>'}</a>`;
            }
        }
    ],
    order: [[0, 'desc']],
})