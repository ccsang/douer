$(document).ready(function () {
    var url_prefix = "/" + $('#notice-list').data('id')
    $('#btn-post-blog').bind('click', function () {
        window.location.href = url_prefix + '/add_blog'
    })
    
    $('#nav-blog').addClass('active')

    $.get(url_prefix + '/list_category', function (data) {
        var html = ''
        var category_url = url_prefix + '/category/'
        for (var item in data) {
            html += '<li data-id="' + data[item].id + '"><a href="' + category_url + data[item].id + '">' + data[item].category_name + '</a></li>'
        }

        $('#nav-category-list').html(html)        
    })
    

    $('.widget-manage-category').delegate('#btn-category-manage', 'click', function () {
        var html = '<table class="table table-condensed table-category">'
        // var list = $('#nav-category-list').children()
        var list = $('#nav-category-list a')
        var length = list.length

        for (var i = 0 ; i < length ; i++) {
            html += '<tr> <td><a href="#",data-id="' + list.eq(i).parent().data("id") + '">' + list.eq(i).text() + '</a></td>\
            <td align="right"><button class = "btn btn-default btn-xs btn-edit-category",type="button">编辑</button>\
            <button class="btn btn-default btn-xs btn-del-category" type="button" data-id="' + list.eq(i).parent().data("id") + '">删除</button></td></tr>'
        }
        // list.each(function () {
        //     html += '<row> <td><a href="#",data-id="' + this.attr('data-id')+ '">' + this.text() + '</a></td>\
        //     <td><a class = "btn btn-default btn-edit-category",href="#">编辑</a>\
        //     <a class="btn btn-default btn-del-category" href="#">删除</a></td></row>' 
        // })

        html += '<tr><td><a class="btn btn-default btn-xs btn-add-category">添加</a></td></tr></table>'
        $('#nav-category-list').replaceWith(html)
    })

    $('.widget-manage-category').delegate('.btn-add-category', 'click', function () {
        $(this).parent().parent().before('<tr class="row-category-add"><td style="width:57%"><div class="input-group input-group-sm"><input type="text", id="category_name", class="form-control", placeholder="名称"/></div></td>\
            <td align="right"><a class="btn btn-default btn-xs btn-confirm-add-category">确定</a>\
            <a class="btn btn-default btn-xs btn-cancel-add-category">取消</td></tr>').hide()            
    })
    
    $('.widget-manage-category').delegate('.btn-confirm-add-category', 'click', function () {
        var category_name = $('#category_name').val()
        $.post(url_prefix + '/add_category', {category_name: category_name}, function (data) {
            var html = '<tr><td><a href="#", data-id="' + data.id + '">' + category_name + '</a></td>\
            <td align="right"><a class = "btn btn-default btn-xs btn-edit-category",href="#">编辑</a>\
            <a class="btn btn-default btn-xs btn-del-category" href="#">删除</a></td></tr>' 
            $("#category_name").parent().parent().parent().replaceWith(html)
            $('.btn-add-category').parent().parent().attr('style', 'display:inline-block')
        })
    })

    $('.widget-manage-category').delegate('.btn-cancel-add-category', 'click', function () {
        $('.row-category-add').detach()
        $('.btn-add-category').parent().parent().attr('style', 'display:inline-block')
    })

    $('.widget-manage-category').delegate('.btn-edit-category', 'click', function () {
        var self = $(this)
    })

    $('.widget-manage-category').delegate('.btn-del-category', 'click', function () {
        var self = $(this)
        var category_id = $(this).data('id')
        $.post(url_prefix + '/del_category', {id: category_id}, function (data) {
            self.parent().parent().empty()
        })
    })
})

