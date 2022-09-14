class ViewCountries
{

    #selectRegion;
    #spinner;
    #countriesContainer;
    #controller;
    #currentRegion;
    constructor(controller)
    {
        this.#selectRegion = document.querySelector('.select-region');
        this.#spinner = document.querySelector('.spinner');
        this.#countriesContainer = document.querySelector('.countries-container');
        this.#controller = controller;
        this.#currentRegion = '';
        this.setEvents();
    }

    showSpinner()
    {
        this.#spinner.classList.add('display--spinner');
    }

    hideSpinner()
    {
        this.#spinner.classList.remove('display--spinner');
    }

    /**
     * Sets the initial events.
     */
    setEvents()
    {
        this.#selectRegion.addEventListener('click', this.toggleRegionsDisplay.bind(this));
        document.querySelector('#theme-button').addEventListener('click', this.switchMode.bind(this));
        document.querySelector('.regions').addEventListener('click', this.setCurrentRegion.bind(this));
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
        for(let i = 0; i < countriesChildren.length; i++)
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
        this.#countriesContainer.replaceChildren();
        if (!countriesArray || !Array.isArray(countriesArray))
        {
            return;
        }
        let html = '';
        countriesArray.forEach(country => {
            let displayCountry = (this.#currentRegion && this.#currentRegion !== country.region) ? 'country--hidden' : '';
            html += `<div class="country ${displayCountry}" data-region="${country.region}" data-code="${country.cca2}">
                            <div class="country__flag">
                               <img src="${country.flags.png}" alt="${country.name.official}"/>
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
}

export default new ViewCountries;