
const mealsEl = document.getElementById('meals')
const favMeals = document.getElementById('fav-meals')

const searchTerm = document.getElementById('search-term')
const searchBtn = document.getElementById('search')

const mealPopup = document.getElementById('meal-popup');
const popupBtn = document.getElementById('close-popup');
const mealInfo = document.getElementById('meal-info');

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
    // random meal API
    const resp = await fetch(
        'https://www.themealdb.com/api/json/v1/1/random.php'
    );
    const respData = await resp.json();
    // API has key-value pair for 'meals':[obj meals]
    const randomMeal = respData.meals[0]
    console.log(randomMeal);

    addMeal(randomMeal, true); // add random meal to random recipe
}

async function getMealById(id) {
    // Meal by Id API + arg(id)
    const resp = await fetch(
        'https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id
    );

    const respData = await resp.json();
    const meal = await respData.meals[0];

    return meal;
}

async function getMealBySearch(term) {
    // meal by name API + arg(term)
    const resp = await fetch(
        'https://www.themealdb.com/api/json/v1/1/search.php?s='+term
    );
    const respData = await resp.json();
    const meals = respData.meals;

    return meals;

}
//  Add randm meal to the random recipe
function addMeal(mealData, random = false) {
    // console.log(mealData);

    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
        <div class='meal-header'>
            ${random ? `
            <span class="random">Random Recipe</span>` : ''}
            <img 
                src="${mealData.strMealThumb}" alt="${mealData.strMeal}"
            />
        </div>
        <div class='meal-body'>
            <h4>${mealData.strMeal}</h4>
            <button class='fav-btn'>
                <i class='fas fa-heart'></i>
            </button>
        </div>    
    `;
    // add fav btn functionality for fav meals.
    const btn = meal.querySelector('.meal-body .fav-btn');

    btn.addEventListener('click', () => {
        if(btn.classList.contains('active')) {
            removeMealLS(mealData.idMeal);
            btn.classList.remove('active');
        } else {
            addMealLS(mealData.idMeal);
            btn.classList.add('active');
        }
        // clean the fav container
        fetchFavMeals();
    });
    // show meal description
    meal.addEventListener('click', () => {
        showMealInfo(mealData);
    })

    mealsEl.appendChild(meal);
};


// add meal to local storage on favourite.
function addMealLS(mealId) {
    const mealIds = getMealLS();

    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
};


// remove meal from local storage on de-favourite.
function removeMealLS(mealId) {
    const mealIds = getMealLS();

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)));
};


// get meal from Local storage to add/remove fav.
//  fav meals are stored in local storage in the application bar in dev tools.
function getMealLS() {
    const mealId = JSON.parse(localStorage.getItem('mealIds'));
    // console.log(mealId);
    return mealId === null ? [] : mealId;
};

async function fetchFavMeals() {
    // clean the container
    favMeals.innerHTML = '';

    const mealId = getMealLS();

    for(let i=0; i<mealId.length; i++) {
        const mealID = mealId[i];
        meal = await getMealById(mealID);

        addMealFav(meal);
    }
    // console.log(meals);

}

function addMealFav(mealData) {
    const favMeal = document.createElement('li');

    favMeal.innerHTML = `
        <img
            src='${mealData.strMealThumb}' alt='${mealData.strMeal}'
        /><span>${mealData.strMeal}</span>
        <button class='clear'><i class='fas fa-window-close'></i></button>
    `;
    const btn = favMeal.querySelector('.clear');

    btn.addEventListener('click', () => {
        removeMealLS(mealData.idMeal);

        fetchFavMeals();
    });
    // show meal description
    favMeal.addEventListener('click', () => {
        showMealInfo(mealData);
    })

    // favMeals is a global scope variable 
    favMeals.appendChild(favMeal);
};

// display meal description, making, ingredients.
function showMealInfo(mealData) {
    // clean it up
    mealInfo.innerHTML = '';

    // update the meal-info
    const mealEl = document.createElement('div');

    // get ingredients, measures
    const ingredients = [];
    for(let i=1; i<20; i++) {
        if(mealData['strIngredient'+i]) {
            ingredients.push(
                `${mealData['strIngredient'+i]}
                - ${mealData['strMeasure' + i]}`
            );
        } else {
            break;
        }
    }
    console.log(ingredients);

    mealEl.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img 
            src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients.map(ing => `
            <li>${ing}</li>
            `).join('')}
        </ul>
        <p>${mealData.strInstructions}</p>
    `;

    mealInfo.appendChild(mealEl);

    // show popup
    mealPopup.classList.remove('hidden')
};

searchBtn.addEventListener('click', async () => {
    // clean random recipe container
    mealsEl.innerHTML = '';
    const search = searchTerm.value;

    //console.log(await getMealBySearch(search));

    const meals = await getMealBySearch(search);

    if(meals) {
        meals.forEach(meal => {
            addMeal(meal);
        });
    }
})

//  info popup button functionality to display datails.
popupBtn.addEventListener('click', () => {
    mealPopup.classList.add('hidden');
});