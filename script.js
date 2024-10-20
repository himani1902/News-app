const apiKey = 'e51cece1737244989f50d3f1fcaf7928';
const newsContainer = document.getElementById('news-container');
const searchInput = document.getElementById('search');
const languageSelect = document.getElementById('language');
const sortSelect = document.getElementById('sort');
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function changeBackgroundColor() {
    document.body.style.backgroundColor = getRandomColor();
}

async function loadNews() {
    const query = searchInput.value.trim() || "technology"; 
    const language = languageSelect.value || 'en';
    const sortBy = sortSelect.value || 'publishedAt';
    const searchIn = document.getElementById('searchIn').value;
   
    let url = `https://newsapi.org/v2/everything?apiKey=${apiKey}&q=${encodeURIComponent(query)}&sortBy=${sortBy}`;

    if (language) url += `&language=${language}`;
    if (searchIn) url += `&searchIn=${searchIn}`; 

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.articles) {
            displayNews(data.articles);
        } else if (data.message) {
            newsContainer.innerHTML = `<p>${data.message}</p>`; 
        } else {
            newsContainer.innerHTML = '<p>No news found</p>';
        }
    } catch (error) {
        console.error('Error fetching the news:', error);
        newsContainer.innerHTML = '<p>Error fetching the news.</p>';
    }
}


function displayNews(articles) {
    newsContainer.innerHTML = ''; 

    articles.forEach(article => {
        if (article.urlToImage) { 
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <div class="source">${article.source.name || 'Unknown Source'}</div>
                <img src="${article.urlToImage}" alt="News Image">
                <h2>${article.title}</h2>
                <p>${article.description || 'No description available'}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            `;

            newsContainer.appendChild(card);
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
  
    changeBackgroundColor();
    loadNews(); 
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            loadNews();
        }
    });
    languageSelect.addEventListener('change', loadNews);
    sortSelect.addEventListener('change', loadNews);
    document.getElementById('searchIn').addEventListener('change', loadNews);
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', loadNews);
    }
});
