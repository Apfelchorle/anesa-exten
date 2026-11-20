export default new class TsukiHime {
  url=atob("aHR0cHM6Ly9hcGkudHN1a2loaW1lLm9yZy92MS90b3JyZW50cy8=");
  storageUrl=atob("aHR0cHM6Ly9zdG9yYWdlLnRzdWtpaGltZS5vcmcv");
  async batch({hash: hash}) {
    if (!navigator.onLine) return;
    const res = await fetch(this.url + "btih/" + hash);
    if (!res.ok) return;
    const json = await res.json();
    if (!json.has_nzb) return;
    const path = json.animetosho || json.id >= 1e9 ? "tosho/nzbs/" : "nzbs/";
    return this.storageUrl + path + json.id + "/nzb.nzb";
  }
  async single() {}
  async test() {
    try {
      if (!(await fetch(this.url)).ok) throw new Error(`Failed to load data from ${this.url}! Is the site down?`);
      return !0;
    } catch (error) {
      throw new Error(`Could not reach ${this.url}! Does the site work in your region?`);
    }
  }
};