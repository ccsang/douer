$(document).ready(function () {
    $("#btn-blog-publish").one('click', function () {
        console.log('form submited')
        $("#form-blog").submit() 
    })

    $("#btn-blog-update").one('click', function () {
        $("#form-blog").submit()
    })
}) 

