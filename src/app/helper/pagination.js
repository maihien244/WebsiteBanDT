module.exports = {
    compare: (a, b) => {
        return a > b
    },
    prePage: (currentPage) => {
        if(currentPage > 1) {
            return `<li class="page-item"><a class="page-link" href="?page=${currentPage-1}">Previous</a></li>`
        } else {
            return '<li class="page-item"><a class="page-link" href="#" style="pointer-events: none;">Previous</a></li>'
        }
    },
    nextPage: (currentPage, pageNumbers) => {
        if(currentPage < pageNumbers) {
            return `<li class="page-item"><a class="page-link" href="?page=${parseInt(currentPage)+1}">Next</a></li>`
        } else {
            return `<li class="page-item"><a class="page-link" href="#" style="pointer-events: none;">Next</a></li>`
        }
    },
    renderPagination: (numberPage, currentPage) => {
        const html = []
        if(currentPage >= numberPage-5) {
            if(numberPage-5 > 0) {
                for(let i = numberPage-5; i <= numberPage; ++i) {
                    html.push(`<li class="page-item"><a class="page-link" href="?page=${i}">${i}</a></li>`)
                }
            } else {
                for(let i = 1; i <= numberPage; ++i) {
                    html.push(`<li class="page-item"><a class="page-link" href="?page=${i}">${i}</a></li>`)
                }
            }
        } else {
            for(let i = currentPage; i <= currentPage+2; ++i) {
                html.push(`<li class="page-item"><a class="page-link" href="?page=${i}">${i}</a></li>`)
            }
            html.push(`<li class="page-item"><a class="page-link" href="#">.</a></li>`)            
            html.push(`<li class="page-item"><a class="page-link" href="#">.</a></li>`)            
            html.push(`<li class="page-item"><a class="page-link" href="#">.</a></li>`)            
            for(let i = numberPage-2; i <= numberPage; ++i) {
                html.push(`<li class="page-item"><a class="page-link" href="?page=${i}">${i}</a></li>`)
            }
        }
        return html.join('')
    }
}