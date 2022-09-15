class ViewCountry 
{
    #backButton;
    #countryContainer;
    #bordersContainer;
    constructor()
    {
        this.#backButton = document.querySelector('.back-button');
        this.#countryContainer = document.querySelector('.country-container');
        this.#bordersContainer = document.querySelector('.country-data__text-borders');
    }
    
    /**
     * Shows the country container
     */
    show()
    {
        this.#countryContainer.classList.remove('country-container--hide');
    }
    
    /**
     * Hides the country container
     */
    hide()
    {
        this.#countryContainer.classList.add('country-container--hide');
    }
    
    setBackButtonHandler(handler)
    {
        this.#backButton.addEventListener('click', handler);
    }
    
    /**
     * Fills all the DOM data related to a specific country by using 'countryData'
     * 
     * @param {Array} countryData An array with only one object that has all the information related to a country.
     */
    fill(countryData)
    {
        if (!countryData || !Array.isArray(countryData) || countryData.length === 0)
        {
            throw new Error("Information about the country was not found");
        }
        
        const country = countryData[0];
        this.#countryContainer.querySelector('.country-data__flag').src = country.flags.png;
        this.#countryContainer.querySelector('[data-country-name]').textContent = country.name.official;
        this.#countryContainer.querySelector('[data-country-native-name]').textContent = country.name.nativeName[Object.keys(country.name.nativeName)[0]].official;
        this.#countryContainer.querySelector('[data-country-population]').textContent = country.population.toLocaleString("en-US");
        this.#countryContainer.querySelector('[data-country-region]').textContent = country.region;
        this.#countryContainer.querySelector('[data-country-subregion]').textContent = country.subregion;
        this.#countryContainer.querySelector('[data-country-capital]').textContent = country.capital && country.capital[0];
        this.#countryContainer.querySelector('[data-country-level-domain]').textContent = country.tld && country.tld[0];
        this.#countryContainer.querySelector('[data-country-currencies]').textContent = this.getCurrencies(country.currencies);
        this.#countryContainer.querySelector('[data-country-languages]').textContent = Object.values(country.languages).join(", ");
        this.addBorders(country.borders);
    }
    
    /**
     * Add buttons related to the borders.
     * 
     * @param {Array} borders An array containing all the borders of the country.
     */
    addBorders(borders)
    {
        if (!borders)
        {
            this.#bordersContainer.classList.add('country-data__text-borders--hide');
            return;
        }

        this.#bordersContainer.classList.remove('country-data__text-borders--hide');

        let html = '';
        borders.forEach(border => {
            html += `<a class="button button--small" data-code="${border}">Spain</a>`;
        });
        
        document.querySelector('.border-countries').replaceChildren();
        document.querySelector('.border-countries').insertAdjacentHTML('beforeend', html);
    }
    
    /**
     * Using 'currenciesInfo', returns a comma separated string with all the currencies used in the country.
     *
     * @param {Object} currenciesInfo An object with all the currencies.
     * @returns A comma separated string with all the currencies used in the country.
     */
    getCurrencies(currenciesInfo)
    {
        return Object.values(currenciesInfo).map(currency => currency.name).join(", ");
    }
}

export default new ViewCountry;