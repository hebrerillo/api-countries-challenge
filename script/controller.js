import {API_URL} from './config.js';
import ViewCountries from './viewCountries.js';
import viewCountry from './viewCountry.js';
import model from './model.js';

class RestApiCountriesController
{
    #viewCountries;
    #viewCountry;
    #currentScrollTop; //TODO to view
    #spinner;//TODo to view.
    constructor()
    {
        this.#viewCountry = viewCountry;
        this.#spinner = document.querySelector('.spinner');
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
        this.#viewCountry.setBorderCountryClickHandler(this.handleBorderCountryClick.bind(this));
        this.#viewCountries.setCountriesClickHandler(this.handleCountryClick.bind(this));
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
            this.#viewCountries.cleanCountries();
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
