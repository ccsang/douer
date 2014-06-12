$(document).ready(function () {
    $('#nav-feed').addClass('active')
    var path_prefix = '/' + $('#notice-list').data('id')
    $('.btn-check-review').bind('click', function () {
        var self = $(this)
        self.parent().next().toggle('fast')

        if (self.text() === '查看回复') {
            self.text('隐藏回复')
            var review_id = self.data('id')
            var type = self.data('type')
            $.post(path_prefix + '/list_reply', {review_id: review_id, type: type}, function (data) {
                var html = ''
                var length = data.length
                for (var i = 0 ; i < length ; i++) {
                    html += '<div class="media"><a class="pull-left" href="/' + data[i].user_id + '"><img class="media-object img-rounded img-sm" src="' + data[i].photo + '"/></a>\
                            <div class="media-body"><h4 class="media-heading">' + data[i].nickname + '<span>' + data[i].review_time + '</span></h4><p>' + data[i].content + '</p></div></div>'
                }

                self.parent().next().children(0).eq(0).html(html)
                console.log('完事')
            })
        }
        else {
            self.text('查看回复')
        }
       
    })
})