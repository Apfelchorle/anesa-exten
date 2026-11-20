const QUALITIES = [ "1080", "720", "540", "480" ];

export default new class NekoBT {
  url=atob("aHR0cHM6Ly9uZWtvYnQudG8vYXBpL3YxLw==");
  async _fetch(fetch, search) {
    const res = await fetch(`${this.url}torrents/search?${search}`), json = await res.json();
    if (json.error) throw new Error("NekoBT: " + json.message);
    if (!json.data) throw new Error("NekoBT: Invalid response from server!");
    return json.data;
  }
  async _media({tvdbId: tvdbId, tvdbEId: tvdbEId, tmdbId: tmdbId, fetch: fetch, anilistId: anilistId}) {
    const mediaParams = new URLSearchParams({
      limit: "1"
    });
    tvdbId && mediaParams.append("tvdbid", tvdbId.toString()), tmdbId && mediaParams.append("tmdbid", tmdbId), 
    tmdbId || tvdbEId || mediaParams.append("media_id", "anilist-" + anilistId);
    let mappings = await this._fetch(fetch, mediaParams);
    if (mappings?.media || (tmdbId || tvdbEId) && (mappings = await this._fetch(fetch, new URLSearchParams({
      limit: "1",
      media_id: "anilist-" + anilistId
    }))), !mappings?.media) throw new Error("NekoBT: No media found for the given anime!");
    return mappings.media;
  }
  async single({tvdbId: tvdbId, tvdbEId: tvdbEId, tmdbId: tmdbId, episode: episode, fetch: fetch, resolution: resolution, exclusions: exclusions, anilistId: anilistId}, options) {
    if (!navigator.onLine) return [];
    const media = await this._media({
      tvdbId: tvdbId,
      tvdbEId: tvdbEId,
      tmdbId: tmdbId,
      fetch: fetch,
      anilistId: anilistId
    }), ep = media.episodes?.find(ep => ep.tvdbId === tvdbEId) ?? media.episodes?.find(ep => ep.episode === episode);
    if (!ep?.id) return [];
    const searchParams = new URLSearchParams({
      media_id: media.id,
      episode_ids: ep.id.toString()
    });
    options?.language && (searchParams.append("fansub_lang", options.language.toString()), 
    searchParams.append("sub_lang", options.language.toString()));
    const high = ep?.tvdbId === tvdbEId;
    exclusions = exclusions.map(e => e.toLowerCase());
    const excl = resolution ? exclusions.concat(...QUALITIES.filter(q => q !== resolution).map(q => `${q}p`)) : exclusions;
    return (await this._fetch(fetch, searchParams)).results?.filter(({title: title}) => !excl.length || (title = title.toLowerCase(), 
    !excl.some(excl => title.includes(excl)))).map(entry => ({
      title: entry.title,
      link: `${this.url}torrents/${entry.id}/download?public=true`,
      seeders: Number(entry.seeders),
      leechers: Number(entry.leechers),
      downloads: Number(entry.completed),
      hash: entry.infohash,
      size: Number(entry.filesize),
      accuracy: high ? "high" : "medium",
      type: (entry.level ?? 0) >= 3 ? "alt" : entry.batch ? "batch" : void 0,
      date: new Date(entry.uploaded_at)
    })) ?? [];
  }
  async movie({tvdbId: tvdbId, tvdbEId: tvdbEId, tmdbId: tmdbId, episode: episode, fetch: fetch, resolution: resolution, exclusions: exclusions, anilistId: anilistId}, options) {
    if (!navigator.onLine) return [];
    const media = await this._media({
      tvdbId: tvdbId,
      tvdbEId: tvdbEId,
      tmdbId: tmdbId,
      fetch: fetch,
      anilistId: anilistId
    });
    if (media.episodes?.find(ep => ep.tvdbId === tvdbEId) ?? media.episodes?.find(ep => ep.episode === episode)) return [];
    const searchParams = new URLSearchParams({
      media_id: media.id
    });
    options?.language && (searchParams.append("fansub_lang", options.language.toString()), 
    searchParams.append("sub_lang", options.language.toString())), exclusions = exclusions.map(e => e.toLowerCase());
    const excl = resolution ? exclusions.concat(...QUALITIES.filter(q => q !== resolution).map(q => `${q}p`)) : exclusions;
    return (await this._fetch(fetch, searchParams)).results?.filter(({title: title}) => !excl.length || (title = title.toLowerCase(), 
    !excl.some(excl => title.includes(excl)))).map(entry => ({
      title: entry.title,
      link: `${this.url}torrents/${entry.id}/download?public=true`,
      seeders: Number(entry.seeders),
      leechers: Number(entry.leechers),
      downloads: Number(entry.completed),
      hash: entry.infohash,
      size: Number(entry.filesize),
      accuracy: "medium",
      type: (entry.level ?? 0) >= 3 ? "alt" : entry.batch ? "batch" : void 0,
      date: new Date(entry.uploaded_at)
    })) ?? [];
  }
  batch=() => [];
  async test() {
    try {
      const {ok: ok} = await fetch(this.url + "announcements");
      if (!ok) throw new Error(`Failed to load data from ${this.url}! Is the site down?`);
      return !0;
    } catch (error) {
      throw new Error(`Could not reach ${this.url}! Does the site work in your region?`);
    }
  }
};