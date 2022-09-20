/**
 * The parent class of all views.
 */
class View
{
    _controller;
    _errorBox;
    #spinner;
    
    constructor(controller)
    {
        this._controller = controller;
        this.#spinner = document.querySelector('.spinner');
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

    showSpinner()
    {
        this.#spinner.classList.add('display--spinner');
    }

    hideSpinner()
    {
        this.#spinner.classList.remove('display--spinner');
    }
}

export default View;