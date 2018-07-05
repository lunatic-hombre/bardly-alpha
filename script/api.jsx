class ApiEndpoint {

    constructor(url, type, api={}) {
        this.url = url;
        this.type = type;
        let self = this;
        this.type.save = function() {
            self.save(this);
        };
        this.beforeSend = api.beforeSend || function(xhr) {};
        this.ondelete = api.ondelete || function(xhr) {
            if (xhr.status < 200 && xhr.status >= 300)
                return this.onerror(xhr);

        };
        this.onload = api.onload || function(xhr) {
            if (xhr.status >= 200 && xhr.status < 300) {
                let result = xhr.responseText ? JSON.parse(xhr.responseText) : true;
                let totalHeader = xhr.getResponseHeader('Total');
                if (totalHeader)
                    result.total = parseInt(totalHeader);
                return result;
            }
            else
                return this.onerror(xhr);
        };
        this.onerror = api.onerror || function(xhr) {
            console.error('Error '+xhr.status+': '+xhr.statusText);
        };
    }

    get(id) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var url = self.url + '/' + id;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onload = () => resolve(self.onload(xhr));
            xhr.onerror = () => reject(self.onerror(xhr));
            self.beforeSend(xhr);
            xhr.send();
        }).then(self.wrap.bind(self));
    }

    getAll(ids) {
        var self = this;
        var promise = !ids || ids.length === 0 ? Promise.resolve([]) : new Promise(function(resolve, reject) {
            var url = self.url + '/' + ids.join(',');
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onload = () => resolve(self.onload(xhr));
            xhr.onerror = () => reject(self.onerror(xhr));
            self.beforeSend(xhr);
            xhr.send();
        });
        if (ids.length == 1)
            promise = promise.then(item => [item]);
        return promise.then(array => { // TODO
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
            var url = self.url;
            if (query)
                url += '?'+Object.entries(query).map(e => typeof e[1] === 'undefined' ? '' : e[0]+'='+encodeURIComponent(e[1])).join('&');
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onload = () => resolve(self.onload(xhr));
            xhr.onerror = () => reject(self.onerror(xhr));
            self.beforeSend(xhr);
            xhr.send();
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
            collection.forEach(inject);
            collection.total = array.total;
            if (collection.length < collection.total) {
                collection.loadMore = () =>
                    self.list(Object.assign({ offset: collection.length }, query))
                        .then(nextPage => nextPage.forEach(collection.push.bind(collection)));
            } else {
                collection.loadMore = () => Promise.resolve(null);
            }
            collection.update = function(assignments) {
                var updateQuery = Object.assign({}, query, { limit: undefined, offset:undefined })
                self.update(updateQuery, assignments).then(() => {
                    collection.forEach(item => Object.assign(item, assignments));
                });
            };
            return collection;
        });
    }

    update(query, assignments) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var url = self.url;
            if (query)
                url += '?'+Object.entries(query).map(e => typeof e[1] === 'undefined' ? '' : e[0]+'='+encodeURIComponent(e[1])).join('&');
            var xhr = new XMLHttpRequest();
            xhr.open("PATCH", url, true);
            xhr.onload = () => resolve(self.onload(xhr));
            xhr.onerror = () => reject(self.onerror(xhr));
            self.beforeSend(xhr);
            xhr.send(JSON.stringify(assignments));
        });
    }

    save(item = {}) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var url = item.id ? self.url + '/' + item.id : self.url;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => resolve(self.onload(xhr));
            xhr.onerror = () => reject(self.onerror(xhr));
            self.beforeSend(xhr);
            xhr.send(JSON.stringify(item));
        }).then(saved => Object.assign(item, saved)).then(self.wrap.bind(self));
    }

    remove(id) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var url = self.url + '/' + id;
            var xhr = new XMLHttpRequest();
            xhr.open("DELETE", url, true);
            xhr.onload = () => resolve(self.ondelete(xhr));
            xhr.onerror = () => reject(self.onerror(xhr));
            self.beforeSend(xhr);
            xhr.send();
        });
    }

    wrap(e) {
        let item = new this.type(e)
        item.save = this.save.bind(this, item);
        item.clone = this.save.bind(this, Object.assign({}, item, {id: null}));
        item.remove = this.remove.bind(this, item.id);
        return item;
    }

}