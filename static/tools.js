$(document).ready(function() {
    var editor = new Editor();
    editor.render();

    function refreshEditor(data) {
        var data = data || {};
        $('#title').val(data.title || '');
        $('#slug').val(data.slug || '');
        $('#title').trigger( "change" );
        editor.codemirror.setValue(data.content || '');
    }

    function showAlert(message) {
        $('#alert-content').html(message);
        $('#alert').show();
    }

    function slugify(text) {
        return text.toLowerCase().replace(/ /g,'-').replace(/[-]+/g, '-').replace(/[^\w-]+/g,'');
    }

    $('#title').change(function() {
        var title = $('#title').val() || '';
        var slug = $('#slug').val() || '';
        if (title === '') {
            $('#btn-save').addClass('disabled');
        } else {
            $('#btn-save').removeClass('disabled');
        }
        if (slug === '') {
            $('#btn-delete').addClass('disabled');
        } else {
            $('#btn-delete').removeClass('disabled');
        }
    })

    $('#btn-files').click(function() {

        $('.menuitem').remove();

        $.getJSON('/api/', function(data) {
            var files = '';
            $.each(data.files, function(key, item) {
                files += '<li><a class="menuitem" tabindex="-1" href="#" data-slug="'+item.slug+'">'+item.title+'</a></li>';
            });
            $('#fileList').prepend(files);
            $('.menuitem').click(function() {
                $.getJSON('/api/file/'+$(this).data('slug'), refreshEditor);
            })
        });

    });


    $('#btn-save').click(function() {
        var title = $('#title').val() || prompt('Please enter the title');
        if (title !== undefined && title !== null && title !== '') {
            var slug = $('#slug').val() || slugify(title);
            $.post('/api/file/'+slug, {
                title: title,
                content: editor.codemirror.getValue(),
            }, refreshEditor);
            showAlert("Saved file '"+$('#title').val() +"'");
        }
    });

    $('#btn-new').click(function() {
        refreshEditor();
    });

    $('#btn-delete').click(function() {
        var slug = $('#slug').val();
        $.ajax({
            url: '/api/file/'+slug,
            type: 'DELETE',
            success: function() {
                refreshEditor();
            }
        });
    });

    $('#btn-sync').click(function() {
        $.get('/api/sync/', function(data) {
            showAlert(data.status);
        });
    });
});
