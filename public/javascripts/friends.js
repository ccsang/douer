$(document).ready(function () {
    $('#nav-friend').addClass('active')
    
    $('.btn-unfriend').bind('click', function () {
        var id = $(this).data('id'),
            nickname = $(this).data('nickname')
        var html = '<p>你和' + nickname + '的友谊已经走到了尽头吗？</p>' + 
            '<form id="form-unfriend", action="/del_friends", method="post"><input type="hidden", name="friend_id" value=' + id + '/></form>'
        $('#modal-unfriend .modal-body').html(html)
    })

    $('#btn-confirm-unfriend').bind('click', function () {
        $('#form-unfriend').submit()
    })

})