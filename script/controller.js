import {API_URL} from './config.js';
import {MARGIN_TO_SHOW_TOTOP_BUTTON} from './config.js';
import {WAITING_TIME_FOR_REQUEST} from './config.js';
import viewCountries from './viewCountries.js';
import viewCountry from './viewCountry.js';
import model from './model.js';

class RestApiCountriesController
{
    #viewCountries;
    #viewCountry;
    #inputSearch;
    #timeoutIdAfterSeach;
    #currentScrollTop;
    #spinner;
    #scrollToTopButton;
    constructor()
    {
        this.#viewCountry = viewCountry;
        this.#spinner = document.querySelector('.spinner');
        this.#viewCountries = viewCountries;
        this.#inputSearch = document.querySelector('.input-search');
        this.#scrollToTopButton = document.querySelector('.toTop');
        this.setEvents();
        this.performSearchByName();
        this.#currentScrollTop = 0;
    }

    /**
     * Set the initial events.
     * 
     */
    setEvents()
    {
        this.#inputSearch.addEventListener('keyup', this.waitBeforePerformRequest.bind(this));
        this.#viewCountry.setBackButtonHandler(this.handleBackClick.bind(this));
        this.#viewCountry.setBorderCountryClickHandler(this.handleBorderCountryClick.bind(this));
        this.#viewCountries.setCountriesClickHandler(this.handleCountryClick.bind(this));
        this.#scrollToTopButton.addEventListener('click', this.scrollDocumentToTop.bind(this));

        let observer = new IntersectionObserver(this.handleScrollToTopButtonDisplay.bind(this), {
            root: this.#inputSearch.parent,
            rootMargin: MARGIN_TO_SHOW_TOTOP_BUTTON
        });
        observer.observe(this.#inputSearch);
    }

    /**
     * Shows or hides the scroll to top button depending on the scroll of the document.
     * 
     * @param {array} entries The entries parameter passed to the Intersection Observer callback.
     */
    handleScrollToTopButtonDisplay(entries)
    {
        entries.forEach(entry => {
            if (entry.target !== this.#inputSearch)
            {
                return;
            }

            entry.isIntersecting ? this.#scrollToTopButton.classList.remove('toTop--display')
                    : this.#scrollToTopButton.classList.add('toTop--display');
        });
    }

    scrollDocumentToTop()
    {
        document.documentElement.scrollTop = 0;
    }

    /**
     * Handles the click on a border country in the country view.
     * 
     * @param {Event} event The event that was triggered in the click.
     */
    async handleBorderCountryClick(event)
    {
        try
        {
            this.showSpinner();
            const clickedBorderCountry = event.target.closest('[data-border-code]');
            if (!clickedBorderCountry)
            {
                return;
            }

            await this.fetchCountryAndFillView(clickedBorderCountry.dataset.borderCode);
        }
        catch (error)
        {
            this.#viewCountry.showErrorMessage(error);
        }
        finally
        {
            this.hideSpinner();
        }
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
     * Handles the click event on a country box in the countries view.
     * 
     * @param {Event} event The event that was triggered in the click.
     */
    async handleCountryClick(event)
    {
        this.#currentScrollTop = document.documentElement.scrollTop;
        const clickedCountry = event.target.closest('.country');
        if (!clickedCountry)
        {
            return;
        }
        try
        {
            this.showSpinner();
            await this.fetchCountryAndFillView(clickedCountry.dataset.code);
            this.#viewCountries.hide();
            this.#viewCountry.show();
        }
        catch (error)
        {
            this.#viewCountries.showErrorMessage(error);
        }
        finally
        {
            this.hideSpinner();
        }
    }

    /**
     * Fetch the informaton about a country to fill the country view.
     * 
     * @param {string} code The code of the country to fetch.
     */
    async fetchCountryAndFillView(code)
    {
        const countryData = await this.performSearchByCode(code);
        await this.getBordersNames(countryData[0]);
        this.#viewCountry.fill(countryData);
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
            this.showSpinner();
            let finalSearch = this.#inputSearch.value ? ('name/' + this.#inputSearch.value) : 'all';
            const data = await model.performSearch(API_URL + finalSearch);
            this.#viewCountries.showCountries(data);
        }
        catch (error)
        {
            this.#viewCountries.showErrorMessage(error);
        }
        finally
        {
            this.hideSpinner();
        }
    }

    showSpinner()
    {
        this.#spinner.classList.add('display--spinner');
    }

    hideSpinner()
    {
        this.#spinner.classList.remove('display--spinner');
    }
}

const controller = new RestApiCountriesController();
