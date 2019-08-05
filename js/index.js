/*查询所有project，同时包含机组*/
$(function () {
    let getData = () => {
        $.ajax({
            url: 'http://huixiuyun.cn:8081/api/projects?filter[include][collectors][units]&filter[fields][id]=true&filter[fields][name]=true&filter[fields][id]=true&filter[fields][address]=true&filter[order]=created DESC&filter[fields][created]=true',
            data: {
                'access_token': sessionStorage.getItem('token'),
            },
            type: 'get',
            success(data) {
                data = data[0].collectors;
                /* data.sort((a,b)=>{
                 let _a=a.units[0].name;
                 let _b=b.units[0].name;
                 return _a.localeCompare(_b)
                 })*/
                let newData = [];
                for (var i = 0; i < data.length; i++) {
                    for (var n = 0; n < data[i].units.length; n++) {
                        newData.push(data[i].units[n]);
                    }
                }
                /* console.log(newData)*/
                let $matchTemplate = $('#matchTemplate'),
                    template = $matchTemplate.html();
                let result = ejs.render(template, {newData});
                $('#match').html(result);
                /*再去发送请求得到温度湿度*/
                let ary = newData.map((item, index) => {
                    $('.more').eq(index).attr({
                        idNum: item.id,
                        name: item.name,
                        model: item.model
                    });
                    return item.id
                })
                for (let i = 0; i < ary.length; i++) {
                    /*获取机组最新数据*/
                    $.ajax({
                        url: 'http://huixiuyun.cn:8081/api/realtimelogs',
                        type: 'get',
                        data: {
                            'access_token': sessionStorage.getItem('token'),
                            'filter[where][unitId]': ary[i],
                            'filter[order]': 'id%20DESC',
                            'filter[limit]': '1'
                        },
                        success (data) {
                            data = data[0];

                            if (data) {
                                /*有数据才往里面添加*/
                                $('.temperature').eq(i).html(data.wendu + '℃');
                                $('.humidity').eq(i).html(data.shidu + '%');

                                /*填充完数据后 绑定点击事件*/
                                $('.more').on('click', (e) => {
                                    sessionStorage.setItem('idNum', $(e.target).attr('idNum'));
                                    sessionStorage.setItem('name', $(e.target).attr('name'));
                                    sessionStorage.setItem('model', $(e.target).attr('model'));
                                    location.href = 'dataList.html';
                                })
                            } else {

                            }


                        }
                    })

                }

            }
        })
    }
    getData();

    if (time) {
        clearInterval(time)
    }
    var time = setInterval(() => {
        window.t = $(document).scrollTop();
        window.location.reload();
    }, 60000)

    $(document).scrollTop(window.t)
    console.log(sessionStorage.getItem('token'))

});



