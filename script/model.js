import {REQUEST_TIMEOUT} from './config.js';
import {ERROR_MESSAGE_TIMEOUT} from './config.js';
import {ERROR_MESSAGE_SERVER_UNREACHABLE} from './config.js';


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
            if (error instanceof DOMException)
            {
                throw ERROR_MESSAGE_TIMEOUT;
            }
            throw ERROR_MESSAGE_SERVER_UNREACHABLE;
        }
        finally
        {
            clearTimeout(timeoutIdFetch);
        }
    }
}

export default new Model();
