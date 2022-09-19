class View {
    
    _errorBox;

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
}

export default View;