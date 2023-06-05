/**
 * The parent class of all views.
 */
class View
{
    static get DefaultSpinnerTimeout() { 
        return 700; 
    }

    _controller;
    _errorBox;
    #spinner;
    #timeoutSpinner; //The timeout after which the timeout will be shown
    
    constructor(controller)
    {
        this._controller = controller;
        this.#spinner = document.querySelector('.spinner');
        this.#timeoutSpinner = null;
    }

    /**
     * Shows an error message
     * 
     * @param {string} message The string containing the message to be shown.
     */
    showErrorMessage(message)
    {
        this._errorBox.classList.add('error-container--show');
        this._errorBox.querySelector('.error-search').textContent = message;
    }

    /**
     * Hides the box containing the error message.
     */
    hideErrorMessage()
    {
        this._errorBox.classList.remove('error-container--show');
        this._errorBox.querySelector('.error-search').replaceChildren();
    }

    showSpinner(delay = View.DefaultSpinnerTimeout) {
        this.#timeoutSpinner = window.setTimeout(() => { this.#spinner.classList.add('display--spinner') }, delay);
    }

    hideSpinner()
    {
        window.clearTimeout(this.#timeoutSpinner);
        this.#spinner.classList.remove('display--spinner');
    }
}

export default View;