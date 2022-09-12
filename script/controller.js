import View from './view.js';

class Controller
{

    #view;
    constructor()
    {
        this.#view = new View(this);
        this.setEvents();
    }

    setEvents()
    {
        document.querySelector('#theme-button').addEventListener('click', View.prototype.switchMode.bind(this.#view));
    }
}

const controller = new Controller();
