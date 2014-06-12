$(document).ready(function () {

    var user_id = $('#notice-list').data('id')
    $('#btn-avatar-confirm').bind('click', function () {
        $('#form-avatar').submit()
    })

    $('#btn-search-confirm').bind('click', function () {
        $('#form-search').submit()
    })

    var pull_req = function () {
        var url = '/' + user_id + '/get_friend_req';
        $.post(url, function (data) {
            var length = data.length
            var html = ''
            if (length === 0) {
                html = '<p>暂时没人加你好友哦</p>'
            }
            else {
                $('#a-notice .badge').text(length)
                for (var i = 0 ; i < length ; i++) {
                    html += '<li role="presentation",class="item-msg"><p>' + data[i].nickname + ' 请求加你为好友,</p>' +  '<p>附加信息: ' + data[i].content + 
                    '</p><button type="button" class="btn btn-primary btn-xs btn-accept-friend" data-id=' + data[i].user_id + ' data-name=' + data[i].nickname + ' data-photo=' + data[i].photo + ' >接受</button> \
                    <button type="button" class="btn btn-default btn-xs btn-deny-friend" data-id=' + data[i].user_id + '>拒绝</button>' +
                    '<a role="menu-item",tab-index="-1",href="#"></a></li>'
                }
            }

            $('#notice-list').html(html)
        })
    }
    pull_req()
    // setInterval(pull_req, 5000)
    
    $('#notice-list').delegate('.btn-accept-friend', 'click', function () {
        var id = $(this).data('id'),
            status = 0,
            nickname = $(this).data('name'),
            photo = $(this).data('photo')

        var args = {
            id: id,
            status : status,
            nickname : nickname,
            photo    : photo
        }

        $(this).unbind()
        $.post('/' + user_id + '/add_friends', args, function (data) {
            if (data.ok === 0) {
                alert('服务器错误.')
            }
            else {
                $(this).parent().html('<p>成功加为好友</p>')
            }
        })
    })
})