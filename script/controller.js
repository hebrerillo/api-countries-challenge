import view from './view.js';
import model from './model.js';
import {WAITING_TIME_FOR_REQUEST} from './config.js';

class RestApiCountriesController
{
    #view;
    #inputSearch;
    #timeoutIdAfterSeach;
    constructor()
    {
        this.#view = view;
        this.#inputSearch = document.querySelector('.input-search');
        this.setEvents();
        this.performSearch();
    }

    /**
     * Set the initial events.
     * 
     */
    setEvents()
    {
        this.#inputSearch.addEventListener('keyup', this.waitBeforePerformRequest.bind(this));
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
        this.#timeoutIdAfterSeach = setTimeout(this.performSearch.bind(this), WAITING_TIME_FOR_REQUEST);
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
    async performSearch()
    {
        try
        {
            this.#view.showSpinner();
            const data = await model.performSearch(this.#inputSearch.value);
            this.#view.showCountries(data);
        }
        catch (error)
        {
            console.log(error);
        }
        finally
        {
            this.#view.hideSpinner();
        }
    }
}

const controller = new RestApiCountriesController();
