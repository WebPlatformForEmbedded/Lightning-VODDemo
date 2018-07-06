class VodApi{
    constructor(){
        this._urls = {
            popular:'data/popular-movies.json'
        }
    }

    getPopular(){
        return this._req(this._urls.popular)
    }

    getGenre(genre){
        const url = `data/movies-${genre.toLowerCase()}.json`
        return this._req(url)
    }

    _req(url){
        return fetch(url).then(response => response.json())
    }
}