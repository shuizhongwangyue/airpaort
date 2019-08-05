$(function () {
    $('#device').html('设备' + sessionStorage.getItem('name'));
    $('#location').html(sessionStorage.getItem('model'));
    $('.project').on('click', () => {
        $('#projectSelect').toggle();
    })
    $('#projectSelect').on('click', (e) => {
        if (e.target.tagName == 'LI') {
            $('.sel').html($(e.target).html())
        }
    })

    let i = 0
    let last = moment().subtract(1 + i, 'hours').toISOString();
    let lastTime = moment().subtract(0 + i, 'hours').toISOString();
    $('#leftMove').on('click', () => {
        i += 1;
        last = moment().subtract(2 + i, 'hours').toISOString();
        lastTime = moment().subtract(0 + i, 'hours').toISOString();
        queryData(last, lastTime)
    })
    $('#rightMove').on('click', (e) => {
        if (i >= 0) {
            i -= 1
            last = moment().subtract(2 + i, 'hours').toISOString();
            lastTime = moment().subtract(0 + i, 'hours').toISOString();
            queryData(last, lastTime)
        }

    })

    $('#query').on('click', () => {
        let last = moment($('#timeSel').val()).toISOString() || moment().subtract(1 + i, 'hours').toISOString();
        let lastTime = moment($('#timeSele').val()).toISOString() || moment().toISOString();
        $.ajax({
            url: 'http://huixiuyun.cn:8081/api/realtimelogs',
            data: {
                'access_token': sessionStorage.getItem('token'),
                'filter[where][unitId]': sessionStorage.getItem('idNum'),
                'filter[where][and][0][created][gt]': last,
                'filter[where][and][1][created][lt]': lastTime,
                'filter[order]': 'id%20DESC',
                'filter[limit]': '1000'
            },
            type: 'get',
            success(data) {
                console.log(data)
                let wenduAry = [];
                let shiduAry = [];
                let shijianAry = [];
                let LI = [];
                if (data.length) {
                    for (let i = 0; i < data.length; i++) {
                        wenduAry.push(data[i].wendu);
                        shiduAry.push(data[i].shidu);
                        shijianAry.push(moment(data[i].created).format('HH:mm'))
                        LI.push(
                            ` <li class='dataList'>
                <span>${ $('.sel').html()}</span>
                <span>${$('.sel').html() == '温度' ? (data[i].wendu) + '℃' : (data[i].shidu + '%')}</span>
                <span>${moment(data[i].created).format('YYYY-MM-DD HH:mm')}</span>
            </li>`)
                    }
                }
                $('#container').html(LI)
            }
        })

    })

    /*机组某个时段*/

    console.log(lastTime);
    console.log(last);
    console.log(moment().toISOString());
    console.log(moment(moment().toISOString()).format('HH:mm'));
    console.log(moment().subtract(5, 'hours').toISOString());

    let queryData = (last, lastTime) => {
        $.ajax({
            url: 'http://huixiuyun.cn:8081/api/realtimelogs',
            data: {
                'access_token': sessionStorage.getItem('token'),
                'filter[where][unitId]': sessionStorage.getItem('idNum'),
                'filter[where][and][0][created][gt]': last,
                'filter[where][and][1][created][lt]': lastTime,
                'filter[order]': 'id%20DESC',
                'filter[limit]': '1000'
            },
            type: 'get',
            success: function (data) {
                console.log(data)
                let wenduAry = [];
                let shiduAry = [];
                let shijianAry = [];
                let LI = [];
                if (data.length) {
                    for (let i = 0; i < data.length; i++) {
                        wenduAry.push(data[i].wendu)
                        shiduAry.push(data[i].shidu)
                        shijianAry.push(moment(data[i].created).format('HH:mm'))
                      /*  console.log(moment(data[i].created))*/
                        LI.push(` <li class='dataList'>
                <span>${ $('.sel').html()}</span>
                <span>${data[i].wendu}℃</span>
                <span>${moment(data[i].created).format('YYYY-MM-DD HH:mm')} </span>
            </li>`)
                    }
                }
                $('#container').html(LI)

                /*折线图*/
                var myChart = echarts.init($('#echarts')[0]);
                var option = {
                    legend: {
                        right: '10%',
                        itemWidth: 14,
                        itemHeight: 14,
                        itemGap: 15,
                        data: [{name: '温度', icon: 'rect'},
                            {name: '湿度', icon: 'rect',},
                            /*{name: 'co2', icon: 'rect'},
                             {name: 'voc', icon: 'rect'},*/
                        ]
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#d9dcde'
                            }
                        },
                        axisLabel: {
                            margin: 20,
                            textStyle: {
                                color: '#333'
                            }
                        },
                        axisLine: {

                            lineStyle: {
                                color: '#d9dcde',
                                width: 2
                            }
                        },
                        axisTick: {
                            show: false,
                            alignWithLabel: false,


                        },
                        data: shijianAry
                    }, {
                        type: 'category',
                        boundaryGap: false,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#d9dcde'
                            }
                        },
                        axisLabel: {
                            margin: 20,
                            textStyle: {
                                color: '#333'
                            }
                        },
                        axisLine: {

                            lineStyle: {
                                color: '#d9dcde',
                                width: 2
                            }
                        },
                        axisTick: {
                            show: false,
                            alignWithLabel: false,


                        },
                        data: shijianAry
                    },],
                    yAxis: [{
                        type: 'value',
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#f6f7f8'
                            }
                        },
                       /* minInterval: 0.25,*/
                        axisTick: {
                            show: false,
                            alignWithLabel: true,

                        },
                        max: 35,
                        min: 23,
                        interval: 1,
                        axisLabel: {
                            margin: 20,
                            textStyle: {
                                color: '#333'
                            },
                            formatter: '{value}℃'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#d9dcde',
                                width: 2
                            }

                        }

                    }, {
                        type: 'value',
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#f6f7f8'
                            }
                        },
                       /* minInterval: 0.5,*/
                        axisTick: {
                            show: false,
                            alignWithLabel: true,

                        },
                        max: 75,
                        min: 30,
                        interval: 5,
                        axisLabel: {
                            margin: 20,
                            textStyle: {
                                color: '#333'
                            },
                            formatter: '{value}%'

                        },
                        axisLine: {
                            lineStyle: {
                                color: '#d9dcde',
                                width: 2
                            }

                        }

                    },],
                    series: [
                        {
                            name: '温度',
                            type: 'line',
                            data: wenduAry
                        },
                        {
                            name: '湿度',
                            type: 'line',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            data: shiduAry
                        },
                        /* {
                         name: 'co2',
                         type: 'line',
                         data: [0.1, 0.2, 0.9, 0.4, 0.8]
                         }, {
                         name: 'voc',
                         type: 'line',
                         data: [0.5, 0.4, 0.6, 0.7, 0.9]
                         }*/
                    ]
                };
                myChart.setOption(option);
            }
        })
    }

    queryData(last, lastTime)
})
