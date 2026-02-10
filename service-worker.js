// Service Worker for PWA - 实现离线缓存
const CACHE_NAME = 'magic-word-game-v2.2';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/words.js',
    '/js/memory.js',
    '/js/speech.js',
    '/js/memory-helper.js',
    '/js/game.js'
];

// 安装 Service Worker
self.addEventListener('install', event => {
    console.log('[Service Worker] 正在安装...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] 正在缓存文件');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('[Service Worker] 安装完成');
                return self.skipWaiting();
            })
    );
});

// 激活 Service Worker
self.addEventListener('activate', event => {
    console.log('[Service Worker] 正在激活...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] 删除旧缓存:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] 激活完成');
            return self.clients.claim();
        })
    );
});

// 拦截请求，优先使用缓存
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 如果缓存中有，直接返回缓存
                if (response) {
                    console.log('[Service Worker] 从缓存返回:', event.request.url);
                    return response;
                }

                // 否则发起网络请求
                console.log('[Service Worker] 从网络获取:', event.request.url);
                return fetch(event.request)
                    .then(response => {
                        // 检查响应是否有效
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // 克隆响应并缓存
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(error => {
                        console.log('[Service Worker] 网络请求失败:', error);
                        // 这里可以返回一个离线页面
                        return caches.match('/index.html');
                    });
            })
    );
});

// 后台同步（如果支持）
self.addEventListener('sync', event => {
    if (event.tag === 'sync-data') {
        console.log('[Service Worker] 后台同步数据');
        event.waitUntil(syncData());
    }
});

// 数据同步函数
async function syncData() {
    // 这里可以实现数据同步逻辑
    console.log('[Service Worker] 执行数据同步');
}

// 消息处理
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
