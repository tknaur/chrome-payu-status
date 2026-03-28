# Chrome PayU status extension

A simple add-on for Google Chrome that informs about changes in the status of PayU services.

## How it works

The extension periodically checks the RSS feed (https://status.secure.payu.com/history.rss) for new incidents by:

1. **Extracting the first (latest) incident GUID** - Only the unique identifier of the most recent incident is tracked
2. **Comparing with the previously stored GUID** - If the GUID has changed, a new incident has been detected
3. **Displaying a notification badge** - The `[NEW]` badge appears only when a genuinely new incident is detected

This approach prevents false positives caused by minor XML formatting changes or whitespace variations.

## Check frequency

The extension checks for new incidents every **15 minutes**. This interval aligns with the PayU status page's cache policy and prevents excessive API calls.

