/* Chỉnh ảnh: lấy trang từ mạng trước (chờ 4 giây), lỗi thì dùng bản đã lưu */
var CACHE='chinhanh-v1';
var FILES=['./','./index.html','./icon-180.png','./icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES).catch(function(){})}));self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(new Promise(function(res){
    var done=false,t=setTimeout(function(){if(done)return;caches.match(r).then(function(m){if(m&&!done){done=true;res(m)}})},4000);
    fetch(r).then(function(n){if(done)return;done=true;clearTimeout(t);var cp=n.clone();caches.open(CACHE).then(function(c){c.put(r,cp)});res(n)}).catch(function(){clearTimeout(t);caches.match(r).then(function(m){if(!done){done=true;res(m||Response.error())}})});
  }));
});
