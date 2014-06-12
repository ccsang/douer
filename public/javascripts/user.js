
$("#btn-submit").bind('click', function () {
	console.log(validate())
    if (validate()) {
        $(".form-signin").submit()
    }
})


$('#input-nickname').bind('blur', function () {
    var nickname = $('#input-nickname').val() 
    var self = $(this)   
    $.post('check_nickname', {nickname: nickname}, function (data) {
        if (data.ok === 0) {
            console.log('该昵称已被使用')
            self.next().replaceWith('<div class="alert alert-danger">该昵称已被使用</div>')
            self.data({'ok': 0})
            console.log(self.data('ok'))
        }
        else {
            console.log('该昵称没被使用')
            self.next().replaceWith('<div class="alert alert-danger">该昵称可以使用</div>')
            self.data({'ok': 1})    
            console.log(self.data('ok'))
        }
    })
})

var validate = function () {
    if ($('#input-email').val().trim() === '') {
        return false
    }
    if ($('#input-pwd').val().trim() === '') {
        return false
    }
    if ($('#input-nickname').val().trim() === '') {
        return false
    }
    if ($('#input-nickname').data('ok') === 0) {
        return false
    }

    console.log('validate success')
    return true
 
}