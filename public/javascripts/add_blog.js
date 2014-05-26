$(document).ready(function () {
    $("#btn-blog-publish").one('click', function () {
        console.log('form submited')
        $("#form-blog").submit() 
    })

    $("#btn-blog-update").one('click', function () {
        $("#form-blog").submit()
    })

    $('.category-list li a').bind('click', function () {
        $("#blog-category-id").val($(this).attr('data-category-id'))
        console.log($(this).text())
        $('#drop-category').text($(this).text())
    })
}) 

