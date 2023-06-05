import View from './view.js';

/**
 * This view corresponds with the view that shows all the detailed information
 * about a country.
 */
class ViewDetailedCountry extends View
{
    #backButton;
    #countryContainer;
    #bordersContainer;
    #countryData;
    constructor(controller)
    {
        super(controller);
        this.#backButton = document.querySelector('.back-button');
        this.#countryContainer = document.querySelector('.country-container');
        this.#bordersContainer = document.querySelector('.country-data__text-borders');
        this.#countryData = this.#countryContainer.querySelector('.country-data');
        this._errorBox = this.#countryContainer.querySelector('.error-container');
        this.setEvents();
    }

    setEvents()
    {
        this.#bordersContainer.querySelector('.border-countries').addEventListener('click', this.borderCountryClick.bind(this));
        this.#backButton.addEventListener('click', this.goBackToCountriesView.bind(this));
    }

    /**
     * When the user clicks the back button to go back to the home page.
     */
    goBackToCountriesView()
    {
        this._controller.fromCountryViewToCountriesView();
    }

    /**
     * Handles the click event in a border country.
     * 
     * @param {Event} event The event triggered in the click.
     */
    async borderCountryClick(event)
    {
        try
        {
            this.showSpinner(View.DefaultSpinnerTimeout);
            const clickedBorderCountry = event.target.closest('[data-border-code]');
            if (!clickedBorderCountry)
            {
                return;
            }

            const countryData = await this._controller.fetchCountry(clickedBorderCountry.dataset.borderCode);
            this.fill(countryData);

        }
        catch (error)
        {
            this.showErrorMessage(error);
        }
        finally
        {
            this.hideSpinner();
        }
    }

    /**
     * Adds the handler that is executed when the user clicks a border country.
     * 
     * @param {type} handler The handler.
     */
    setBorderCountryClickHandler(handler)
    {
        this.#bordersContainer.querySelector('.border-countries').addEventListener('click', handler);
    }

    /**
     * Shows the country container
     */
    show()
    {
        document.documentElement.scrollTop = 0;
        this.#countryContainer.classList.remove('country-container--hide');
    }

    /**
     * Hides the country container
     */
    hide()
    {
        this.#countryContainer.classList.add('country-container--hide');
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
        this.hideErrorMessage();
        const country = countryData[0];
        let countryImage = this.#countryData.querySelector('.country-data__flag');
        if (!countryImage)
        {
            this.#countryData.insertAdjacentHTML('afterbegin', '<img class="country-data__flag" alt="" src="'+ country.flags.png +'"/>');
        }
        else
        {
            countryImage.src = country.flags.png;
        }

        this.#countryData.querySelector('[data-country-name]').textContent = country.name.official;
        this.#countryData.querySelector('[data-country-native-name]').textContent = country.name.nativeName ? country.name.nativeName[Object.keys(country.name.nativeName)[0]].official : '';
        this.#countryData.querySelector('[data-country-population]').textContent = country.population.toLocaleString("en-US");
        this.#countryData.querySelector('[data-country-region]').textContent = country.region;
        this.#countryData.querySelector('[data-country-subregion]').textContent = country.subregion;
        this.#countryData.querySelector('[data-country-capital]').textContent = country.capital && country.capital[0];
        this.#countryData.querySelector('[data-country-level-domain]').textContent = country.tld && country.tld[0];
        this.#countryData.querySelector('[data-country-currencies]').textContent = this.getCurrencies(country.currencies);
        this.#countryData.querySelector('[data-country-languages]').textContent = country.languages ? Object.values(country.languages).join(", ") : '';
        this.addBorders(country.borderNames);
    }

    /**
     * Add buttons related to the borders.
     * 
     * @param {Array} borderNames An array containing all the borders of the country.
     */
    addBorders(borderNames)
    {
        if (!borderNames)
        {
            this.#bordersContainer.classList.add('country-data__text-borders--hide');
            return;
        }

        this.#bordersContainer.classList.remove('country-data__text-borders--hide');

        let html = '';
        borderNames.forEach(border => {
            html += `<a class="button button--small" data-border-code="${border.cca2}">${border.name}</a>`;
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
        return currenciesInfo ? Object.values(currenciesInfo).map(currency => currency.name).join(", ") : '';
    }
}

export default ViewDetailedCountry;