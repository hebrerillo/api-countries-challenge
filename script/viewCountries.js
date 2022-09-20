import View from './view.js';
import {WAITING_TIME_FOR_REQUEST} from './config.js';
import {MARGIN_TO_SHOW_TOTOP_BUTTON} from './config.js';
import {MARGIN_TO_LOAD_COUNTRY_IMAGES} from './config.js';

class ViewCountries extends View
{

    #selectRegion;
    #countriesContainer;
    #controller;
    #currentRegion;
    #formAndCountriesContainer;
    #inputSearch;
    #scrollToTopButton;
    #timeoutIdAfterSeach;
    #currentScrollTop;
    #observerTopButton;
    #countriesObserver;

    constructor(controller)
    {
        super(controller);
        this.#selectRegion = document.querySelector('.select-region');
        this.#countriesContainer = document.querySelector('.countries-container');
        this.#formAndCountriesContainer = document.querySelector('.form-countries-container');
        this._errorBox = this.#formAndCountriesContainer.querySelector('.error-container');
        this.#currentRegion = '';
        this.#inputSearch = document.querySelector('.input-search');
        this.#scrollToTopButton = document.querySelector('.toTop');
        this.#currentScrollTop = 0;
        this.setEvents();
        this.performSearchByName();
    }

    /**
     * Sets the initial events.
     */
    setEvents()
    {
        this.#inputSearch.addEventListener('keyup', this.waitBeforePerformRequest.bind(this));
        this.#selectRegion.addEventListener('click', this.toggleRegionsDisplay.bind(this));
        document.querySelector('#theme-button').addEventListener('click', this.switchMode.bind(this));
        document.querySelector('.regions').addEventListener('click', this.setCurrentRegion.bind(this));
        this.#scrollToTopButton.addEventListener('click', this.scrollDocumentToTop.bind(this));
        this.#countriesContainer.addEventListener('load', this.countryImageLoaded.bind(this), true);

        this.#observerTopButton = new IntersectionObserver(this.handleScrollToTopButtonDisplay.bind(this), {
            root: this.#inputSearch.parent,
            rootMargin: MARGIN_TO_SHOW_TOTOP_BUTTON
        });

        this.#countriesObserver = new IntersectionObserver(this.observeCountry.bind(this), {
            root: null,
            rootMargin: MARGIN_TO_LOAD_COUNTRY_IMAGES
        });

        this.#observerTopButton.observe(this.#inputSearch);
        this.#countriesContainer.addEventListener('click', this.clickCountry.bind(this));
    }

    /**
     * Callback that fires when the image of a country is loaded. When that happens, the country itself will be displayed
     * by removing the class 'country--invisible'.
     * 
     * @param {Event} event The event that is fired when the image has finished loading.
     */
    countryImageLoaded(event)
    {
        const flagImg = event.target.closest('.country__flag-img');
        if (!flagImg)
        {
            return;
        }
        const country = flagImg.closest('.country');
        country.classList.remove('country--invisible');
        this.#countriesObserver.unobserve(country);
    }

    /**
     * Callback that will be executed when the countries are displayed. This method takes care of the lazy image load.
     * 
     * @param {Array} entries An array with the entries that potentially intersect with the viewport.
     */
    observeCountry(entries)
    {
        entries.forEach(entry => {
            if (!entry.target.closest('.country') || !entry.isIntersecting)
            {
                return;
            }

            const country = entry.target;
            const img = country.querySelector('.country__flag-img');

            if (img.getAttribute('src').length === 0)
            {
                img.setAttribute('src', img.dataset.flag); //The 'load' event will be handled in 'countryImageLoaded'.
            }
        });
    }

    /**
     * Handles the click in a country box.
     * 
     * @param {Event} event The event triggered in the click.
     */
    async clickCountry(event)
    {
        const clickedCountry = event.target.closest('.country');
        if (!clickedCountry)
        {
            return;
        }

        try
        {
            this.showSpinner();
            await this._controller.fromCountriesViewToCountryView(clickedCountry.dataset.code);
        }
        catch (error)
        {
            this.cleanCountries();
            this.showErrorMessage(error);
            console.error(error);
        }
        finally
        {
            this.hideSpinner();
        }
    }

    scrollDocumentToTop()
    {
        document.documentElement.scrollTop = 0;
    }

    /**
     * Waits for WAITING_TIME_FOR_REQUEST milliseconds after the user has pressed a key before performing the actual request.
     * This will help to not overkill the UI, because sending a request each time the user presses a key is very inefficient.
     * 
     */
    waitBeforePerformRequest()
    {
        if (!this._controller.checkInputCountry(this.#inputSearch.value))
        {
            return;
        }

        clearTimeout(this.#timeoutIdAfterSeach);
        this.#timeoutIdAfterSeach = setTimeout(this.performSearchByName.bind(this), WAITING_TIME_FOR_REQUEST);
    }

    /**
     * Performs an actual search of countries.
     */
    async performSearchByName()
    {
        try
        {
            this.showSpinner();
            const data = await this._controller.getCountriesByName(this.#inputSearch.value);
            this.showCountries(data);
        }
        catch (error)
        {
            this.cleanCountries();
            this.showErrorMessage(error);
            console.error(error);
        }
        finally
        {
            this.hideSpinner();
        }
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

            if (entry.isIntersecting || !this.isVisible())
            {
                this.#scrollToTopButton.classList.remove('toTop--display');
                return;
            }

            this.#scrollToTopButton.classList.add('toTop--display');
        });
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
     * 
     * @returns true if this view is displayed, false otherwise.
     */
    isVisible()
    {
        return !this.#formAndCountriesContainer.classList.contains('form-countries-container--hide');
    }

    /**
     * Shows the form and the container of countries.
     */
    show()
    {
        this.#formAndCountriesContainer.classList.remove('form-countries-container--hide');
        document.documentElement.scrollTop = this.#currentScrollTop;
    }

    /**
     * Hides the form and the container of countries.
     */
    hide()
    {
        this.#currentScrollTop = document.documentElement.scrollTop; //Save the current scroll in the countries view.
        this.#formAndCountriesContainer.classList.add('form-countries-container--hide');
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

        const fragment = document.createDocumentFragment();
        countriesArray.forEach(country => {
            
            let displayCountry = (this.#currentRegion && this.#currentRegion !== country.region) ? 'country--hidden' : ''; //The country will be displayed only if its region matches 
                                                                                                                           //the current selected region.

            const countryElement = document.createElement('div');
            countryElement.dataset.region = country.region;
            countryElement.dataset.code = country.cca2;
            countryElement.setAttribute('class', 'country ' + displayCountry + ' country--invisible');

            let html = `<div class="country__flag">
                        <img class="country__flag-img" data-flag="${country.flags.png}" src="" alt="${country.name.official}"/>
                    </div>
                    <div class="country__text">
                        <h3 class="heading-3">${country.name.official}</h3>
                        <div class="country__detailed-info">
                            <div><span class="title-info">Population: </span><span class="info-item">${country.population.toLocaleString("en-US")}</span></div>
                            <div><span class="title-info">Region: </span><span class="info-item">${country.region}</span></div>
                            <div><span class="title-info">Capital: </span><span class="info-item">${country.capital && country.capital[0]}</span></div>
                        </div>    
                    </div>`;
            countryElement.insertAdjacentHTML('beforeend', html);
            fragment.appendChild(countryElement);
            this.#countriesObserver.observe(countryElement);
        });

        this.#countriesContainer.appendChild(fragment);
    }

    /**
     * Removes all the countries in the view.
     */
    cleanCountries()
    {
        this.#countriesContainer.replaceChildren();
    }
}

export default ViewCountries;