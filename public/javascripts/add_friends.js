$(document).ready(function () {
    
    var url_prefix = "/" + $('#notice-list').data('id')
    var modal_content = ''
    $('#btn-add-friends').one('click', function () {
        // $('#form-add-friends').submit()
        // $(this).hide()
        var id = $('#input-req-friend-id').val()
        var content = $('#textarea-req-content').val()
        console.log("坑爹轰！" + content)
        modal_content = $('#modal-req-add-friends .modal-body').html()
        console.log("modal_content -> " + modal_content)
        $.post(url_prefix + '/req_to_add_friends', {id: id, content: content}, function (data) {
            if (data.ok === 1) {
                $('#form-add-friends').replaceWith('<div class="alert alert-info">请求成功，等待对方确认。</div>')
            }
            else {
                $('#form-add-friends').replaceWith('<div class="alert alert-danger">请求失败。</div>')    
            }
            
            $('#btn-add-friends').hide()

        })
    })

    $('.btn-req-add').bind('click', function () {
        $('#input-req-friend-id').val($(this).data('id'))
        $('#req-modal-label').text('确定加 ' + $(this).data("name") + ' 为好友?')
        //$('#btn-add-friends').toggle()
    })

    $('.btn-cancel-add').bind('click', function () {
        console.log('取消啦！！')
        console.log("modal_content -> " + modal_content)
        if (modal_content.trim() !== '') {
            $('#modal-req-add-friends .modal-body').html(modal_content)
            $('#btn-add-friends').show()
        }
    })
})