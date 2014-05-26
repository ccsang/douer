$(document).ready(function () {
    $('#nav-album').addClass('active')
    $("#btn-photo-upload-confirm").bind('click', function () {
        $('#form-upload').submit()
    })
    $("#btn-add-album-confirm").bind('click', function () {
        $('#form-add-album').submit()
    })


}) 