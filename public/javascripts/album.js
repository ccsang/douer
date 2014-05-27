$(document).ready(function () {
    $('#nav-album').addClass('active')
    $("#btn-photo-upload-confirm").bind('click', function () {
        $('#form-upload').submit()
    })
    $("#btn-add-album-confirm").bind('click', function () {
        $('#form-add-album').submit()
    })

    $('#btn-del-confirm').bind('click', function () {
        $('#form-del-album').submit()
    })

    $('#btn-update-confirm').bind('click', function () {
        $('#form-update-album').submit()
    })


}) 