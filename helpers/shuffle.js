function reservoirSample(array, sampleSize) {
    const result = [];

    for (let i = 0; i < array.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        if (result.length < sampleSize) {
            result.push(array[i]);
        } else if (Math.random() < sampleSize / (i + 1)) {
            result[Math.floor(Math.random() * sampleSize)] = array[i];
        }
    }
    
    return result;
}

module.exports = reservoirSample;