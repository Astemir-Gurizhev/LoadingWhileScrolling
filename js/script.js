const testimonials = async () => {
    try {
        const response = await fetch('http://o-complex.com:1337/reviews');
        const data = await response.json();
        
        const responseHTML = data.map(el => {
            const testimonialsRow = document.querySelector('.testimonials__row');
            const testimonialsPost = document.createElement('div')
            testimonialsPost.textContent = el.text
            testimonialsPost.className = 'testimonials__post'
            testimonialsRow.appendChild(testimonialsPost)
        })
        
        return responseHTML
        
    } catch (error) {
        console.error('Ошибка при получении отзывов:', error);
    }
}

testimonials();