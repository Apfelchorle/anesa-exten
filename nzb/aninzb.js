export default new class AniNZB {
  url=atob("aHR0cHM6Ly9hbmluemIubW9lL2FwaT8=");
  _parseItems(string) {
    const itemRegex = /<item>([\s\S]*?)<\/item>/g, items = [];
    for (const itemMatch of string.matchAll(itemRegex)) {
      const itemString = itemMatch[1], item = {}, enclosureMatch = itemString.match(/<enclosure url="([^"]+)"[^>]*>/);
      enclosureMatch && (item.link = enclosureMatch[1]);
      const titleMatch = itemString.match(/<title>([^<]+)<\/title>/);
      titleMatch && (item.title = titleMatch[1]);
      const nzbnameMatch = itemString.match(/<newznab:attr name="nzbname" value="([^"]+)"\/>/);
      nzbnameMatch && (item.nzbname = nzbnameMatch[1]);
      const filesMatch = itemString.match(/<newznab:attr name="files" value="([^"]+)"\/>/);
      filesMatch && (item.files = Number(filesMatch[1])), items.push(item);
    }
    return items;
  }
  _findByName(string, name, files) {
    const items = this._parseItems(string), nameWithoutExt = name.replace(/\.[^.]+$/, "");
    return (items.find(item => item.nzbname?.includes(name) && item.files >= files) || items.find(item => item.title?.includes(name) && item.files >= files) || items.find(item => item.nzbname?.includes(nameWithoutExt) && item.files >= files) || items.find(item => item.title?.includes(nameWithoutExt) && item.files >= files))?.link?.replaceAll("&amp;", "&");
  }
  async batch({name: name, files: files, fetch: fetch}) {
    if (!navigator.onLine) return;
    const stringSearch = new URLSearchParams({
      t: "search",
      q: name.replace(/\.[^.]+$/, "")
    }), stringRes = await fetch(this.url + stringSearch.toString());
    return stringRes.ok ? this._findByName(await stringRes.text(), name, files.length) : void 0;
  }
  async single({file: file, fetch: fetch}) {
    if (!navigator.onLine) return;
    const stringSearch = new URLSearchParams({
      t: "search",
      q: file.replace(/\.[^.]+$/, "")
    }), stringRes = await fetch(this.url + stringSearch.toString());
    return stringRes.ok ? this._findByName(await stringRes.text(), file, 1) : void 0;
  }
  async test() {
    try {
      if (!(await fetch(this.url)).ok) throw new Error(`Failed to load data from ${this.url}! Is the site down?`);
      return !0;
    } catch (error) {
      throw new Error(`Could not reach ${this.url}! Does the site work in your region?`);
    }
  }
};