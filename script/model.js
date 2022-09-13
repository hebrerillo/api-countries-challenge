import {API_URL} from './config.js';
import {REQUEST_TIMEOUT} from './config.js';

class Model
{
    /**
     * Performs a search of countries with name 'name'. 
     * 
     * @param {String} name The name of the country or contries to search for.
     * @returns A JSON object with a list containing the countries that matched 'name'.
     */
    async performSearch(name)
    {
        let timeoutIdFetch;
        let finalSearch = name ? ('name/' + name) : 'all';
        try
        {
            let abortController = new AbortController();
            timeoutIdFetch = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT);

            const result = await fetch(API_URL + '/' + finalSearch, {signal: abortController.signal});
            return await result.json();
        }
        catch (error)
        {
            throw error;
        }
        finally {
            clearTimeout(timeoutIdFetch);
        }
    }
}

export default new Model();
