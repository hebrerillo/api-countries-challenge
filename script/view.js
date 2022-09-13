class View
{

    #selectRegion;

    constructor()
    {
        this.#selectRegion = document.querySelector('.select-region');
        this.setEvents();
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
}

export default new View;