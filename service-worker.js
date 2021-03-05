/*INSTALL 事件，載入快取資源*/
// 快取的名子
var CACHE_NAME = 'ChiayiSecretaryMobile'; 
// 快取要放入哪些檔案 App_shell
var urlsToCache = [
    '/',
    '/css/layout.css',
    '/css/login.css',
    '/css/main.css',
    '/css/loading.css',
    '/js/main.js',
    '/js/include.js',
    '/js/init.js',
    '/js/loading.js',
    '/js/list.js',
    '/js/sql-wasm.js',
    '/js/sql-wasm.wasm'
];


self.addEventListener('install', function(event){
     console.log("install");

     event.waitUntil(
        caches.open(CACHE_NAME)
          .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
          })
      );

});

/*ACTIVATE 事件，更新Service worker*/
self.addEventListener('activate', function(event){
    console.log("activate");

    event.waitUntil(
        // 取得這個 application 下的所有 cacheStorage 名稱
        caches.keys().then(function(cacheNames) {
          console.log(cacheNames);
          var promiseArr = cacheNames.map(function(item) {
                if (item !== CACHE_NAME) {
                // Delete that cached file
                  return caches.delete(item);
                }
          })
          return Promise.all(promiseArr);
        })
    );


});



self.addEventListener('fetch', event => {
    console.log('now fetch!');
    console.log(event.request);
    event.respondWith(
    //當有重複的請求時，就直接拿cache裡的response當回應，沒有的話就送出請求，並且把回應存到cache裡
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request).then(res =>
        // 存 caches 之前，要先打開 caches.open(dataCacheName)
          caches.open(CACHE_NAME).then(function(cache) {
          // cache.put(key, value)
          // 下一次 caches.match 會對應到 event.request
            cache.put(event.request, res.clone());
            return res;
          })
        );
      })
    );
});

/*FETCH 事件，任何在Service Worker控制範圍底下的 HTTP 請求發出時，都會觸發 fetch 事件*/
// self.addEventListener('fetch',function(event){
//     console.log("fetch")

//     event.respondWith(
//         caches.match(event.request)
//           .then(function(response) {
//             // Cache hit - return response
//             if (response) {
//               return response;
//             }
    
//             // IMPORTANT: Clone the request. A request is a stream and
//             // can only be consumed once. Since we are consuming this
//             // once by cache and once by the browser for fetch, we need
//             // to clone the response.
//             var fetchRequest = event.request.clone();
    
//             return fetch(fetchRequest).then(
//               function(response) {
//                 // Check if we received a valid response
//                 if(!response || response.status !== 200 || response.type !== 'basic') {
//                   return response;
//                 }
    
//                 // IMPORTANT: Clone the response. A response is a stream
//                 // and because we want the browser to consume the response
//                 // as well as the cache consuming the response, we need
//                 // to clone it so we have two streams.
//                 var responseToCache = response.clone();
    
//                 caches.open(CACHE_NAME)
//                   .then(function(cache) {
//                     cache.put(event.request, responseToCache);
//                   });
    
//                 return response;
//               }
//             );
//           })
//         );

// });




//// 10. INSTALL 事件，載入快取資源
//// install的事件發生的時候，我們可以快取頁面上最少的必要性資源，
//// 快取的容量是有限的，因此，不應該什麼資源都快取起來，所以我們選擇將網頁中，
//// 每一頁都有的必要資源快取起來，並以網頁不跑版為前提做選擇。
//
//const filesToCache = [
//	'/',
//  '/login.html',
//  './res/db.sqlite',
//  './images/test_icon_128.png',
//  './images/test_icon_512.png',
//  './css',
//  './js'
//
//];
//
//self.addEventListener('install', event => {
//  console.log('installing........');
//	event.waitUntil(
//		caches.open('static-v1').then(cache => {
//			return cache.addAll(filesToCache);
//		})
//	);
//});
//
//// activate
//self.addEventListener('activate', event => {
//	console.log('now ready to handle fetches!');
//// 	  event.waitUntil(
//// 		caches.keys().then(function(cacheNames) {
//// 			var promiseArr = cacheNames.map(function(item) {
//// 				if (item !== cacheNames) {
//// 					// Delete that cached file
//// 					return caches.delete(item);
//// 				}
//// 			})
//// 			return Promise.all(promiseArr);
//// 		})
//// 	); // end e.waitUntil
//});
//
//// fetch
//cnt = 0;
//self.addEventListener('fetch', event => {
//  // event.respondWith(caches.match(event.request)
//  // .then(function(responce){//抓不到會拿到null
//  //   if(responce){return responce;} else{ fetch(event.request);}
//  // }))
//
//    console.log('now fetch!');
//    console.log('event.target', cnt = cnt + 1 , event.request);
//    console.log('[ServiceWorker] Fetch' , cnt  , event.request.url);
//    // event.respondWith(null); // 網站會掛掉
//
//
//});