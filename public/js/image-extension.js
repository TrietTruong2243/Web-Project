$(() => {
    const modal = $('#my-modal-image');
    const img = $('.image-has-modal');
    const modalImg = modal.find('.modal-image-content');
    const captionText = modal.find('.modal-image-caption');
    const close = modal.find('.modal-image-close');
    img.on('click', (e) => {
        const targetImg = $(e.target);
        console.log(targetImg.attr('src'));
        modal.css('display', 'block');
        modalImg.attr('src', targetImg.attr('src'));
        captionText.html(targetImg.attr('alt'));
    });
    close.click(() => {
        modal.css('display', 'none');
    });
});