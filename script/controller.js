import {API_URL} from './config.js';
import ViewCountries from './viewCountries.js';
import ViewCountry from './viewCountry.js';
import model from './model.js';

class RestApiCountriesController
{
    #viewCountries;
    #viewCountry;
    #currentScrollTop; //TODO to view
    constructor()
    {
        this.#viewCountry = new ViewCountry(this);
        this.#viewCountries = new ViewCountries(this);
        this.setEvents();
        this.#currentScrollTop = 0;
    }

    /**
     * Set the initial events.
     * 
     */
    setEvents()
    {
        this.#viewCountry.setBackButtonHandler(this.handleBackClick.bind(this));
    }

    /**
     * Hides the view of country and shows back the countries view.
     * 
     */
    handleBackClick()
    {
        this.#viewCountry.hide();
        this.#viewCountries.show();
        document.documentElement.scrollTop = this.#currentScrollTop;
    }

    /**
     * When the user clicks a country in the countries view, this method handles the transition from 
     * the countries view to the country view.
     * 
     * @param {string} code The code of the country to retrieve.
     */
    async fromCountriesViewToCountryView(code)
    {
        this.#currentScrollTop = document.documentElement.scrollTop; //Save the current scroll in the countries view.
        const countryData = await this.fetchCountry(code);
        this.#viewCountry.fill(countryData);
        this.#viewCountries.hide();
        this.#viewCountry.show();
    }

    /**
     * Returns the informaton about a country.
     * 
     * @param {string} code The code of the country to fetch.
     * @return The JSON data retrieved from the country with code 'code'.
     */
    async fetchCountry(code)
    {
        const countryData = await this.performSearchByCode(code);
        await this.getBordersNames(countryData[0]);
        return countryData;
    }

    /**
     * By using the borders contained in 'countryData.borders', this method inserts a new field called 'borderNames', which is an array
     * containing the codes and the names of the borders the country has.
     * 
     * @param {Object} countryData The object with all the information about borders.
     */
    async getBordersNames(countryData)
    {
        if (!countryData || !countryData.borders)
        {
            return;
        }

        const bordersCodes = countryData.borders.join();
        const countries = await this.performSearchByCode(bordersCodes);
        countryData.borderNames = countries.map(country => {
            return {'cca2': country.cca2, 'name': country.name.common};
        });
    }

    /**
     * Performs an actual search of countries by code.
     * 
     * @param {string} code The code of the country to search for. It also accepts a comma separated list of codes.
     * @return An array with the countries found.
     */
    async performSearchByCode(code)
    {
        return await model.performSearch(API_URL + 'alpha?codes=' + code);
    }

    /**
     * Checks whether the input country has valid characters.
     * 
     * @param {String} inputCountry The input country to check.
     * @returns {Boolean} true if the input country is valid, false otherwise.
     */
    checkInputCountry(inputCountry)
    {
        if (inputCountry === "")
        {
            return true;
        }

        return /^[A-Za-z\s]*$/.test(inputCountry);
    }

    /**
     * Performs a search of countries by name.
     * 
     * @param {string} name The query input by the user.
     */
    async getCountriesByName(name = '')
    {
        let finalSearch = (name && name.length > 0) ? ('name/' + name) : 'all';
        return await model.performSearch(API_URL + finalSearch);
    }
}

const controller = new RestApiCountriesController();
