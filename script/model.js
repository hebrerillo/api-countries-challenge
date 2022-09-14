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
    async performSearchByName(name)
    {
        try
        {
            let finalSearch = name ? ('name/' + name) : 'all';
            return await this.performSearch(API_URL + finalSearch);
        }
        catch (error)
        {
            throw error;
        }
    }

    /**
     * Performs a search of countries by using the acc2 code. 
     * 
     * @param {String} code The acc2 code of the country to search for.
     * @returns A JSON object with the information of the country with acc2 code 'code'.
     */
    async performSearchByCode(code)
    {
        try
        {
            return await this.performSearch(API_URL + 'alpha/' + code);
        }
        catch (error)
        {
            throw error;
        }
    }
    
    /**
     * Performs a 'fetch' on the URI 'uri' and returns the result.
     * 
     * @param {string} uri The URI of the final request.
     * @returns The contents of fetching the URI 'uri'.
     */
    async performSearch(uri) 
    {
        let timeoutIdFetch;
        try
        {
            let abortController = new AbortController();
            timeoutIdFetch = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT);

            const result = await fetch(uri, {signal: abortController.signal});
            return await result.json();
        }
        catch (error)
        {
            throw error;
        }
        finally
        {
            clearTimeout(timeoutIdFetch);
        }
    }
}

export default new Model();
