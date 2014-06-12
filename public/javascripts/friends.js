$(document).ready(function () {
    $('#nav-friend').addClass('active')
    var url_prefix = "/" + $('#notice-list').data('id')
    $('.btn-unfriend').bind('click', function () {
        var id = $(this).data('id'),
            nickname = $(this).data('nickname'),
            url = url_prefix +  "/del_friends"
        var html = '<p>你和' + nickname + '的友谊已经走到了尽头吗？</p>' + 
            '<form id="form-unfriend", action=' + url + ' method="post"><input type="hidden", name="friend_id" value=' + id + '/></form>'
        $('#modal-unfriend .modal-body').html(html)
    })

    $('#btn-confirm-unfriend').bind('click', function () {
        $('#form-unfriend').submit()
    })

})