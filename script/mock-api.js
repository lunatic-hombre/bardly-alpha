class MockApiEndpoint {

    constructor(url, collection=[]) {
        this.url = url;
        this.collection = collection;
    }

    get(id) {
        var self = this;
        return new Promise(function(resolve, reject) {
            for (let e of self.collection) {
                if (e.id == id)
                    return resolve(e);
            }
            return reject();
        }).then(self.wrap.bind(self));
    }

    getAll(ids) {
        var self = this;
        return new Promise(function(resolve, reject) {
            let result = [];
            for (let e of self.collection) {
                if (e.id === id)
                    result.push(e);
            }
            resolve(result);
        }).then(array => { // TODO
            let collection = array.map(self.wrap.bind(self));
            let injectRemove = function(item) {
                item.remove = () => {
                    let i = collection.indexOf(item);
                    if (i >= 0) {
                        self.remove(collection[i].id);
                        collection.splice(i, 1);
                    }
                }
                return item;
            };
            collection.save = function(item = query) {
                return self.save(item).then(injectRemove).then(e => collection.unshift(e));
            };
            collection.forEach(injectRemove);
            return collection;
        });
    }

    list(query) {
        var self = this;
        return new Promise(function(resolve, reject) {
            resolve(self.collection);
        }).then(array => {
            let collection = array.map ? array.map(self.wrap.bind(self)) : [];
            let inject = function(item) {
                item.remove = () => {
                    let i = collection.indexOf(item);
                    if (i >= 0) {
                        self.remove(collection[i].id);
                        collection.splice(i, 1);
                    }
                };
                let clone = item.clone;
                item.clone = function() {
                    return clone().then(e => collection.unshift(e));
                };
                return item;
            };
            collection.save = function(item = query) {
                return self.save(item).then(inject).then(e => collection.unshift(e));
            };
            collection.update = function(assignments) {
                var updateQuery = Object.assign({}, query, { limit: undefined, offset: undefined })
                self.update(updateQuery, assignments).then(() => {
                    collection.forEach(item => Object.assign(item, assignments));
                });
            };
            return collection;
        });
    }

    update(query, assignments) {
        // TODO not implemented
    }

    save(item = {}) {
        var self = this;
        return new Promise(function(resolve, reject) {
            resolve(item);
        }).then(saved => Object.assign(item, saved)).then(self.wrap.bind(self));
    }

    remove(id) {
        var self = this;
        return new Promise(function(resolve, reject) {
            resolve();
        });
    }

    wrap(item) {
        item.save = this.save.bind(this, item);
        item.clone = this.save.bind(this, Object.assign({}, item, {id: null}));
        item.remove = this.remove.bind(this, item.id);
        return item;
    }

}