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
    }

    /**
     * Set the initial events.
     * 
     */
    setEvents()
    {
        this.#inputSearch.addEventListener('keydown', this.waitBeforePerformRequest.bind(this));
    }

    /**
     * Waits for WAITING_TIME_FOR_REQUEST milliseconds after the user has pressed a key before performing the actual request.
     * This will help to not overkill the UI, because sending a request each time the user presses a key is very inefficient.
     */
    waitBeforePerformRequest()
    {
        clearTimeout(this.#timeoutIdAfterSeach);
        this.#timeoutIdAfterSeach = setTimeout(this.performSearch.bind(this), WAITING_TIME_FOR_REQUEST);
    }

    /**
     * Performs an actual search of countries.
     */
    performSearch()
    {
        model.performSearch(this.#inputSearch.value);
    }
}

const controller = new RestApiCountriesController();
