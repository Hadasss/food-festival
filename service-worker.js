const APP_PREFIX = "FoodFest-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
  // We can't use absolute path if we want this to work in development and production, because this page will be hosted at the github.io/projectname subroute. Instead, we'll use relative paths.
  "./index.html",
  "./events.html",
  "./tickets.html",
  "./schedule.html",
  "./assets/css/style.css",
  "./assets/css/bootstrap.css",
  "./assets/css/tickets.css",
  "./dist/app.bundle.js",
  "./dist/events.bundle.js",
  "./dist/tickets.bundle.js",
  "./dist/schedule.bundle.js",
];

// service workers run before the window object has even been created, that's why we use the self keyword to instantiate listeners on the service worker, instead of window.addEventListener(). The context of self here refers to the service worker object.

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache: " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

//.keys() returns an array of all cache names, which we're calling keyList. keyList is a parameter that contains all cache names under <username>.github.io. Because we may host many sites from the same URL, we should filter out caches that have the app prefix. We'll capture the ones that have that prefix, stored in APP_PREFIX, and save them to an array called cacheKeeplist using the .filter() method.
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheKeeplist.push(CACHE_NAME);

      // This last bit of the activate listener returns a Promise that resolves once all old versions of the cache have been deleted.
      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("deleting cache: " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

// listen for the fetch event, log the URL of the requested resource, and then begin to define the respond to the request.
self.addEventListener("fetch", function (e) {
  console.log("fetch request: ", +e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log("responding with cache: ", +e.request.url);
        return request;
      } else {
        // if the resource is not in caches, we allow the resource to be retrieved from the online network as usual
        console.log("file is not cached, fetching: ", +e.request.url);
        return fetch(e.request);
      }
      // You can omit if/else for console.log & put one line below like this too:
      // return request || fetch(e.request)
    })
  );
});
