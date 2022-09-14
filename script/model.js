import {REQUEST_TIMEOUT} from './config.js';

class Model
{
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
