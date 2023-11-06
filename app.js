// Define a variable to keep track of the current page of results
let currentPage = 1; 
const itemsPerPage = 12;
let totalItemsDisplayed = 0;

// search your phone 
const searchPhone = (loadMore = false) => {
    const searchField = document.getElementById('search-field');
    const searchText = searchField.value;
    // clear data 
    searchField.value = '';

    // Show the loading spinner
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    // load data
    if (!loadMore){
        currentPage = 1; // Reset to the first page if not loading more
    }
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchText}&page=${currentPage}`;

    // console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => {
            displaySearchResult(data.data, loadMore);
            
            // Hide the loading spinner in case of an error
            loader.style.display = 'none';
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Hide the loading spinner in case of an error
            loader.style.display = 'none';
        });
}

// display search result 
const displaySearchResult = (phones, loadMore) => {
    const searchResult = document.getElementById('search-result');

    if (currentPage === 1 && !loadMore) {
        // Clear the search results if it's the first page
        searchResult.innerHTML = '';
        totalItemsDisplayed = 0;
    }

    // Check if no phone found
    if (phones.length === 0 && currentPage === 1) {
        searchResult.innerHTML = '<h3 class="mx-auto">No phone found</h3>';
    } else {
        phones.slice(totalItemsDisplayed, totalItemsDisplayed + itemsPerPage).forEach(phone => {
                const div = document.createElement('div');
                div.classList.add('col');
                div.innerHTML = `
                <div onclick="loadPhoneDetail('${phone.slug}')" class="card h-100">
                    <img src="${phone.image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${phone.phone_name}</h5>
                        <p class="card-text">${phone.brand}</p>
                    </div>
                </div>
                `;
                searchResult.appendChild(div);
                totalItemsDisplayed++;
        });

        if (totalItemsDisplayed < phones.length) {
            // Show "Show More" button only if there are more items to load
            const showMoreButton = document.createElement('button');
            showMoreButton.textContent = 'Show More';
            showMoreButton.onclick = () => {
                searchPhone(true);
            };
            searchResult.appendChild(showMoreButton);
        }
    }
};

// load single phone details  
const loadPhoneDetail = phoneId => {
    const url = `https://openapi.programming-hero.com/api/phone/${phoneId}
    `;
    fetch(url)
        .then(res => res.json())
        .then(data => displayPhoneDetail(data.data))
        .catch(error => {
            console.error('Error loading phone detail:', error);
        });
}

// dislplay single phone details  
const displayPhoneDetail = phone =>{
    // console.log(phone);
    const phoneDetails = document.getElementById('phone-details');

    // clear single phone details 
    phoneDetails.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <img src="${phone.image}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${phone.name}</h5>
            <p class="card-text">${phone.brand}</p>
            <p class="card-text">Release Date: ${phone.releaseDate ? phone.releaseDate : 'Release Date not found'}</p>
            <a href="${phone.releaseDate ? phone.releaseDate : '#'}" class="btn btn-primary">Detail</a>
        </div>
    `;
    phoneDetails.appendChild(div);
}