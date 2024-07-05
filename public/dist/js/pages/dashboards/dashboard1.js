$(function () {

    let pass = parseInt(document.getElementById('pass').textContent);
    const warning = parseInt(document.getElementById('warning').textContent);
    const fail = parseInt(document.getElementById('fail').textContent);

    if (!pass && !warning && !fail) {
        pass = 1;
    }

    c3.generate({
        bindto: '#inspections-chart',
        data: {
            columns: [
                ['Pass', pass],
                ['Warning', warning],
                ['Fail', fail]
            ],

            type: 'donut',
            tooltip: {
                show: true
            }
        },
        donut: {
            label: {
                show: false
            },
            title: 'Inspections',
            width: 18
        },

        legend: {
            hide: true
        },
        color: {
            pattern: [
                '#59b85d',
                '#ff7f00',
                '#e53935'
            ]
        }
    });

    d3.select('#inspections-chart .c3-chart-arcs-title').style('font-family', 'Rubik');
})