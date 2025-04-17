const VERSION = 'v1';

//offline resources list
const APP_STATIC_RESOURCES = [
    "mainPage.html",
    "details.html",
    "favorites.html",
    "style.css",
    "main.js",
    "data/places.json",
    "assets/icons/arrow.png",
    "assets/icons/highlighted_star.png",
    "assets/icons/unhighlighted_star.png",
    "assets/img/geneseeHighFalls.jpg",
    "assets/img/georgeEastmanMuseum.jpg",
    "assets/img/memoralArtGallery.jpg",
    "assets/img/redwings.jpg",
    "assets/img/rocMuseum&SciCenter.jpg",
    "assets/img/rocPublicMarket.jpg",
    "assets/img/seabreeze.jpg",
    "assets/img/senecaZoo.jpg",
    "assets/img/strongMuseum.jpg",
    "assets/img/wickhamFarm.jpg"
];

const CACHE_Name = `places-cache-${VERSION}`;
let cache;

//install event listener to retrieve the cache
self.addEventListener('install', event => {
    event.waitUntil(
        (async () =>{
            cache = await caches.open(CACHE_Name);
            cache.addAll(APP_STATIC_RESOURCES);
        }) ()
    );
});

//activate event listener to update or remove old cache
self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
            names.map(names => {
                if (names !== CACHE_Name) {
                    caches.delete(names);
                }

            })
        );//promise.all

        await clients.claim();
        })()
    );
});

//listen for fetch event
self.addEventListener('fetch', event => {
    event.respondWith(

        (async () => {
            const currentCache = await caches.open(CACHE_Name);
            const cacheResponse = await currentCache.match(event.request);
            if (cacheResponse) {
                return cacheResponse;
            }

            try  {
                const networkResponse = await fetch(event.request);
                
                currentCache.put(event.request, networkResponse.clone());

                return networkResponse;
            }
            catch (error) {
                console.error('Fetch failed:', error);

                if (event.request.mode === 'navigate') {
                    return caches.match('mainPage.html');
                }

                throw error;
            }
           
        })()
    );
});

//listen for message event
self.addEventListener('message', async (event) => {
    if (event.data === 'FETCH_PLACES') {
        try {
            const response = await fetch('data/places.json');
            const data = await response.json();
            
            event.source.postMessage({
                type: 'PLACES_DATA',
                data: data.places,
            });
        }
        catch (error) {
            console.error('Error fetching places', error);
            event.source.postMessage({
                type: 'PLACES_DATA',
                data: null,
            });
        }
    }
});