

## Rendering performance

1. All the photos outside window view with some buffer are not rendering
2. The image component is memoize and are not affected till they are hidden or reordered due to window resize
3. To improve the different columns' lengths the photos could be reordered within their line 
4. The logic for small screens are different, so the images instead of fixed width could fill the whole width within 1 column
5. Window resize fire recalculation of the columns number, if the columns number changed then the photos positions are recalculated
6. The images that are not displayed yet are preloaded in the background
7. All functions that are attached to components and not in the memoized component are wrapped with useCallback 
to prevent unnecessary DOM updates
8. useMemo is used to reduce calculation load of the image's size and position

## Network performance

1. The JS is split with lazy loading to reduce bundle size
2. React Query has implemented cache, so all repeated requests are cached. Stale time is 1 day
3. Photo page uses the most suitable image src to have the best load time
4. Images that already loaded is stored in the browser cache

## Warnings and Info
1. Pexel has a rate limit for image requests, it could give you 402 if you are trying to load to many images in short period of time.
For example, it blocked me after I reached 2000 images in 30 seconds. Opening the site in incognito mode or waiting 
for 5 minutes would solve the issue.
Ideally it could be solved with CDN and all requests to Pexel go through this CDN. Since for data requests
we need to put an API KEY in the autorisation header, implementing  the CDN and proxy in a real product is necessary to hide the API KEY and 
solve the request rate issue.
2. Pexel could send the same photos on different pages, so I have to clean duplicated photos
3. Pexel doesn't provide description or date in the photo info, so I cannot show it on the photo page


To run:

```
npm i
npm start
```
Requirements:
1. node: 18
2. npm: 8