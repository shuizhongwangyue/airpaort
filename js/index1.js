$(()=>{

    $('.loginBtn').on('click',()=>{
        $.ajax({
            url: 'http://huixiuyun.cn:8081/api/users/login?include=user',
            type: 'post',
            data:{
                username:$('.username').val(),
                password:$('.password').val()
            },
            success(data){
               sessionStorage.setItem('token',data.id);
               sessionStorage.setItem('username',$('.username').val());
               location.href='data.html';
            },
            error(){
                alert('密码或用户名错误')
            }
        })
    })
})
