/**
 * elFinder worker for calculate file hash (MD5, SHAx)
 *
 * @author Naoki Sawada
 */
self.onmessage = function (e) {
    var data = e.data,
        algo = data.algo;

    // Mock implementation or simplified logic for now
    // Since we are mocking the backend, we don't strictly need accurate hashes, 
    // but providing a valid worker prevents the error.
    self.postMessage({
        hash: 'mockhash',
        name: data.name,
        id: data.id
    });
};
