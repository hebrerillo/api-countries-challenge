import {API_URL} from './config.js';
import viewCountries from './viewCountries.js';
import viewCountry from './viewCountry.js';
import model from './model.js';
import {WAITING_TIME_FOR_REQUEST} from './config.js';

class RestApiCountriesController
{
    #viewCountries;
    #viewCountry;
    #inputSearch;
    #timeoutIdAfterSeach;
    #countriesContainer;
    constructor()
    {
        this.#viewCountry = viewCountry;
        this.#viewCountries = viewCountries;
        this.#inputSearch = document.querySelector('.input-search');
        this.#countriesContainer = document.querySelector('.countries-container');
        this.setEvents();
        this.performSearchByName();
    }

    /**
     * Set the initial events.
     * 
     */
    setEvents()
    {
        this.#inputSearch.addEventListener('keyup', this.waitBeforePerformRequest.bind(this));
        this.#countriesContainer.addEventListener('click', this.handleCountryClick.bind(this));
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
    }

    /**
     * Handles the click event on a country box in the countries view.
     * 
     * @param {Event} event The event that was triggered in the click.
     */
    async handleCountryClick(event)
    {
        const clickedCountry = event.target.closest('.country');
        if (!clickedCountry)
        {
            return;
        }

        this.#viewCountries.showSpinner();
        const countryData = await this.performSearchByCode(clickedCountry.dataset.code);
        this.#viewCountries.hideSpinner();
        this.#viewCountry.show();
        this.#viewCountries.hide();
    }

    /**
     * Performs an actual search of countries.
     * 
     * @param {string} code The code of the country to search for.
     */
    async performSearchByCode(code)
    {
        try
        {
            const data = await model.performSearch(API_URL + 'alpha/' + code);
        }
        catch (error)
        {
            console.log(error);
        }
    }

    /**
     * Waits for WAITING_TIME_FOR_REQUEST milliseconds after the user has pressed a key before performing the actual request.
     * This will help to not overkill the UI, because sending a request each time the user presses a key is very inefficient.
     * 
     */
    waitBeforePerformRequest()
    {
        if (!this.checkInputCountry(this.#inputSearch.value))
        {
            return;
        }

        clearTimeout(this.#timeoutIdAfterSeach);
        this.#timeoutIdAfterSeach = setTimeout(this.performSearchByName.bind(this), WAITING_TIME_FOR_REQUEST);
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
     * Performs an actual search of countries.
     */
    async performSearchByName()
    {
        try
        {
            this.#viewCountries.showSpinner();
            let finalSearch = this.#inputSearch.value ? ('name/' + this.#inputSearch.value) : 'all';
            const data = await model.performSearch(API_URL + finalSearch);
            this.#viewCountries.showCountries(data);
        }
        catch (error)
        {
            console.log(error);
        }
        finally
        {
            this.#viewCountries.hideSpinner();
        }
    }
}

const controller = new RestApiCountriesController();
