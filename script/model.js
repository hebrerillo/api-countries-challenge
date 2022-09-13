import {API_URL} from './config.js';
import {REQUEST_TIMEOUT} from './config.js';

class Model {

    /**
     * Performs a search of countries with name 'name'. 
     * 
     * @param {String} name The name of the country or contries to search for.
     * @returns A JSON object with a list of the found countries.
     */
    async performSearch(name) {
        console.log("performing search " + name);
        //const result = await fetch(API_URL + '/' + name);
    }
}

export default new Model();
