## Warnings

1. Pexel has a rate limit for image requests, it could give you 402 if you are trying to load to many images short period of time.
For example, it blocked me after I reached 2000 images in 30 seconds. Opening the site in incognito mode or waiting 
for 5 minutes would solve the issue.
Ideally it could be solved with CDN and all requests to Pexel go through this CDN. For real product, Since for data requests
we need to put an API KEY in the autorisation header,  implementing the CDN and proxy is necessary to hide the API KEY and 
solve the request rate issue.
