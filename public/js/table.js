function renderPagination(page, total, size, navigation, urlParams) {
    const totalPages = size ? Math.ceil(total / size) : Math.ceil(total / 10);
    let firstIndex, lastIndex;
    firstIndex = page - 4 > 0 ? page - 4 : 1;
    lastIndex = page + 4 < totalPages ? page + 4 : totalPages;
    if (firstIndex === 1) {
        lastIndex = totalPages - 9 < 0 ? totalPages : 9;
    }
    if (lastIndex === totalPages) {
        firstIndex = lastIndex - 8 > 0 ? lastIndex - 8 : 1;
    }
    if(urlParams){
        urlParams = '&' + urlParams;
    } else{
        urlParams = '';
    }

    let html = `
            <li class="page-item ${(page === 1 || totalPages === 0) ? 'disabled' : ''}">
                <a class="page-link" href="/${navigation}?page=${page - 1}${urlParams}" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `;
    for (let i = firstIndex; i <= lastIndex; ++i) {
        html += `
                <li class="page-item ${i === page ? 'active' : ''}">
                    <a class="page-link" href="/${navigation}?page=${i}${urlParams}">${i}</a>
                </li>
            `;
    }
    html += `
            <li class="page-item ${(page === totalPages || totalPages === 0)? 'disabled' : ''}">
                <a class="page-link" href="/${navigation}?page=${page + 1}${urlParams}" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `;

    return html;
}

