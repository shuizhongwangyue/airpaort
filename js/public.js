$(()=>{
    $('#name').html(sessionStorage.getItem('username'));
   $('#sign').on('click',()=>{
       location.href='index.html';
   })
})
