

const image = {
    new: () => {
        $.ajax({
            url: '/image',
            data: {
                imageStr: $('#imageText').val(),
            },
            type: 'POST',
            dataType: 'JSON',
            beforeSend: () => {
                $('.spinner').css('display', 'block');
                $('.policy').css('display', 'none');
            },
            complete: () => {
                $('.spinner').css('display', 'none');
            },
            success: function(response) {
                $('.image-container').empty();

                if (!response.errors.length) {
                    for (let i = 0; i < response.images.length; i++) {
                        let img = $('<img>').attr('src', response.images[i].url);
                        $('.image-container').append(img);
                    }
                } else {
                    for (let i = 0; i < response.errors.length; i++) {
                        let p = $('<p>').text(response.errors[i]);
                        $('.image-container').append(p);
                    }
                    $('.policy').css('display', 'block');
                }
            },
            error: function(response) {
                console.log(response);
            }
        });
    }
}

