$(document).ready(function () {
    $('#form-profile').delegate('#btn-update-profile-confirm', 'click', function () {
        $('#form-profile').submit()
    })

    $('#form-profile').delegate('#btn-update-profile-cancel', 'click', function () {
        window.location.href = window.location.href
    })
    
    $('#btn-edit-profile').bind('click', function () {
        $('fieldset').removeAttr('disabled')
        $('#form-profile').append('<div class="col-sm-offset-2 col-md-offset-3">\
            <button id="btn-update-profile-confirm" class="btn btn-default" type="button">保存</button>\
            <button id="btn-update-profile-cancel" class="btn btn-default" type="button">取消</button></div>')
    })

})