/*INSTALL 事件，載入快取資源*/
// 快取的名子
var CACHE_NAME = 'ChiayiSecretaryMobile'; 
// 快取要放入哪些檔案 App_shell
var urlsToCache = [
    '/',
    './css/layout.css',
    './css/login.css',
    './css/main.css',
    './css/loading.css',
    './js/jquery-2.1.1.js',
    './js/main.js',
    './js/include.js',
    './js/init.js',
    './js/loading.js',
    './js/list.js',
    './js/sql-wasm.js'

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