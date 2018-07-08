class VodApi{
    constructor(){
        this._urls = {
            movies:'data/movies.json'
        }
    }

    getMovies(){
        return this._req(this._urls.movies)
    }

    _req(url){
        return window.fetch(url).then(response => { return response.json() })
    }
}