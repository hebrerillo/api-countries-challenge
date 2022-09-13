class View
{

    #selectRegion;
    #spinner;
    #countriesContainer;
    #controller;
    constructor(controller)
    {
        this.#selectRegion = document.querySelector('.select-region');
        this.#spinner = document.querySelector('.spinner');
        this.#countriesContainer = document.querySelector('.countriesContainer');
        this.#controller = controller;
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
        document.querySelector('#theme-button').addEventListener('click', this.switchMode.bind(this)); //TODO: move to view
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

    /**
     * Insert the countries contained in the array 'countriesArray' in the DOM.
     *
     * @param {Array} countriesArray The array containing the countries to be inserted.
     */
    showCountries(countriesArray)
    {
        if (!countriesArray || !Array.isArray(countriesArray))
        {
            console.error("View::showCountries: Expected an array");
            return;
        }
        let html = '';
        countriesArray.forEach(country => {
            html += `<div class="country">
                            <div class="country__flag">
                               <img src="${country.flags.png}" alt="${country.name.official}"/>
                            </div>
                            <div class="country__text">
                                <h3 class="heading-3">${country.name.official}</h3>
                                <div class="country__detailed-info">
                                    <div><span class="title-info">Population: </span><span class="info-item">${country.population.toLocaleString("en-US")}</span></div>
                                    <div><span class="title-info">Region: </span><span class="info-item">${country.region}</span></div>
                                    <div><span class="title-info">Capital: </span><span class="info-item">${country.capital[0]}</span></div>
                                </div>
                            </div>
                        </div>`;
        });
        this.#countriesContainer.insertAdjacentHTML('beforeend', html);
    }
}

export default new View;