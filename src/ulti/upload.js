module.exports = {
    filesToArray(arr, desc) {
        arr.forEach(e => {
            desc.push(e.filename);
        });
    }
}