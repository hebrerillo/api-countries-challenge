class ViewCountries
{

    #selectRegion;
    #countriesContainer;
    #controller;
    #currentRegion;
    #formAndCountriesContainer;
    #errorBox;
    constructor(controller)
    {
        this.#selectRegion = document.querySelector('.select-region');
        this.#countriesContainer = document.querySelector('.countries-container');
        this.#formAndCountriesContainer = document.querySelector('.form-countries-container');
        this.#controller = controller;
        this.#currentRegion = '';
        this.#errorBox = this.#formAndCountriesContainer.querySelector('.error-container');
        this.setEvents();
    }

    showErrorMessage(message)
    {
        this.cleanCountries();
        this.#errorBox.classList.add('error-container--show');
        this.#errorBox.querySelector('.error-search').textContent = message;
    }
    
    hideErrorMessage()
    {
        this.#errorBox.classList.remove('error-container--show');
        this.#errorBox.querySelector('.error-search').replaceChildren();
    }
    
    /**
     * Adds a handler when the user clicks a country.
     * @param {function} handler The handler to be executed when the user clicks a country.
     */
    setCountriesClickHandler(handler)
    {
        this.#countriesContainer.addEventListener('click', handler);
    }

    /**
     * Shows the form and the container of countries.
     */
    show()
    {
        this.#formAndCountriesContainer.classList.remove('form-countries-container--hide');
    }

    /**
     * Hides the form and the container of countries.
     */
    hide()
    {
        this.#formAndCountriesContainer.classList.add('form-countries-container--hide');
    }

    /**
     * Sets the initial events.
     */
    setEvents()
    {
        this.#selectRegion.addEventListener('click', this.toggleRegionsDisplay.bind(this));
        document.querySelector('#theme-button').addEventListener('click', this.switchMode.bind(this));
        document.querySelector('.regions').addEventListener('click', this.setCurrentRegion.bind(this));
        this.#countriesContainer.addEventListener('load', this.handleFlagLoaded.bind(this), true);
    }

    /**
     * Shows the country once the image has been loaded.
     * 
     * @param {Event} event The loaded event.
     */
    handleFlagLoaded(event)
    {
        const country = event.target.closest('.country');
        if (!country)
        {
            return;
        }

        country.classList.remove('country--invisible');
    }

    /**
     * Sets the current region.
     * 
     * @param {Event} event The event triggered in the click
     */
    setCurrentRegion(event)
    {
        this.toggleRegionsDisplay();
        const clickedRegion = event.target.closest('.region');
        if (!clickedRegion)
        {
            return;
        }

        this.#currentRegion = clickedRegion.dataset.value;
        this.displayCurrentRegion();
        this.filterCountries();
    }

    /**
     * Displays the current region in the fake select.
     */
    displayCurrentRegion()
    {
        let finalRegion = this.#currentRegion || 'Filter by Region';
        this.#selectRegion.querySelector('[data-current-region]').textContent = finalRegion;
    }

    /**
     * Switches between dark and light mode.
     *
     */
    switchMode()
    {
        document.documentElement.classList.toggle('dark-theme');
    }

    /**
     * Shows and hides the regions options.
     */
    toggleRegionsDisplay()
    {
        this.#selectRegion.closest('.select-region-wrapper').classList.toggle('display--regions');
    }

    filterCountries()
    {
        let countriesChildren = this.#countriesContainer.children;
        for (let i = 0; i < countriesChildren.length; i++)
        {
            if (!this.#currentRegion || countriesChildren[i].dataset.region === this.#currentRegion)
            {
                countriesChildren[i].classList.remove('country--hidden');
            }
            else
            {
                countriesChildren[i].classList.add('country--hidden');
            }
        }
    }

    /**
     * Insert the countries contained in the array 'countriesArray' in the DOM.
     *
     * @param {Array} countriesArray The array containing the countries to be inserted.
     */
    showCountries(countriesArray)
    {
        this.cleanCountries();
        if (!countriesArray || !Array.isArray(countriesArray))
        {
            return;
        }

        this.hideErrorMessage();
        let html = '';
        countriesArray.forEach(country => {
            let displayCountry = (this.#currentRegion && this.#currentRegion !== country.region) ? 'country--hidden' : '';
            html += `<div class="country ${displayCountry} country--invisible" data-region="${country.region}" data-code="${country.cca2}">
                        <div class="country__flag">
                            <img class="country__flag-img" src="${country.flags.png}" alt="${country.name.official}"/>
                        </div>
                        <div class="country__text">
                            <h3 class="heading-3">${country.name.official}</h3>
                            <div class="country__detailed-info">
                                <div><span class="title-info">Population: </span><span class="info-item">${country.population.toLocaleString("en-US")}</span></div>
                                <div><span class="title-info">Region: </span><span class="info-item">${country.region}</span></div>
                                <div><span class="title-info">Capital: </span><span class="info-item">${country.capital && country.capital[0]}</span></div>
                            </div>
                        </div>
                    </div>`;
        });
        this.#countriesContainer.insertAdjacentHTML('beforeend', html);
    }

    /**
     * Removes all the countries in the view.
     */
    cleanCountries()
    {
        this.#countriesContainer.replaceChildren();
    }    
}

export default new ViewCountries;