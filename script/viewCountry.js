class ViewCountry 
{
    #backButton;
    #countryContainer;
    constructor()
    {
        this.#backButton = document.querySelector('.back-button');
        this.#countryContainer = document.querySelector('.country-container');
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
}

export default new ViewCountry;