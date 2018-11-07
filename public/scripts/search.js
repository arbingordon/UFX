$('#btnSearch').on('click',function(){
    var criteria = $('#txtSearch').val();
    if(!criteria||criteria=='')
    {
        window.location.href = '/';
    }
    else{
    window.location.href = '/listings/search/'+ criteria;
    }
   //alert($('#txtSearch').val());
});

