const fetch = require('node-fetch');

class Article {
  constructor(title) {
    this._title = title.replace(' ', '_');
  }

  async _fetchJson() {
    if (!this._json) {
      const response = await fetch(`http://en.wikipedia.org/w/api.php?action=query&prop=info&format=json&titles=${this._title}`);
      const data = await response.json();
      this._json = data;
    }
    return this._json;
  }

  async getLanguage() {
    const json = await this._fetchJson();
    if (!json) {
      throw new Error(`Error fetching ${this._title}`);
    }
    const pages = Object.keys(json.query.pages);
    if (!pages || pages.length === 0) {
      throw new Error(`Error fetching ${this._title}`);
    }
    return json.query.pages[pages[0]].pagelanguage;
  }
}

module.exports = Article;