const axios = require("axios").default;

async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ZmU1NTBhNzY5MjMyNDIxMThjNGE5ZDI2NzIwZGViMGU6MTFhZmZjMTBjOTM5NDczYmFhNjlhN2Q1YzRjOWIyMGI=`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

/**
 * Get ISRC
 * @param {string} query - The query to get isrc from
 * @returns {Promise<string>}} - ISRC
 */
const getTrack = async (query) => {
  const accessToken = await getAccessToken();

  const searchParams = new URLSearchParams();
  searchParams.append("q", query);
  searchParams.append("type", "track");
  searchParams.append("limit", "1");

  const response = await axios.get(
    `https://api.spotify.com/v1/search?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response?.data;
  const track = data.tracks.items[0];

  return track;
};

const baseRequest = async (query) => {
  const headers = {
    authority: "apic-desktop.musixmatch.com",
    cookie: "x-mxm-token-guid=",
  };

  const info = await getTrack(query);
  const baseURL = `https://apic-desktop.musixmatch.com/ws/1.1/macro.subtitles.get?format=json&namespace=lyrics_richsynched&subtitle_format=mxm&app_id=web-desktop-app-v1.0&`;

  const durr = info.duration / 1000;

  const params = new URLSearchParams();

  params.append("q_album", info.album);
  params.append("q_artist", info.artist);
  params.append("q_artists", info.artist);
  params.append("q_track", info.title);
  params.append("track_spotify_id", info.uri);
  params.append("q_duration", durr);
  params.append("f_subtitle_length", Math.floor(durr));
  params.append(
    "usertoken",
    "200501593b603a3fdc5c9b4a696389f6589dd988e5a1cf02dfdce1"
  );

  const finalURL = baseURL + params.toString();

  try {
    const response = await axios.get(finalURL, { headers: headers });
    const body = response.data.message.body.macro_calls;

    return body;
  } catch (error) {
    console.error("Axios request error:", error);
    return {
      error: "An error occurred while fetching lyrics.",
      uri: info.uri,
    };
  }
};

/**
 *
 * @param {string} query - The search query
 */
async function getLyrics(query) {
  try {
    const body = await baseRequest(query);

    return body["track.lyrics.get"].message.body.lyrics.lyrics_body;
  } catch (error) {
    console.error("Axios request error:", error);
    return {
      error: "An error occurred while fetching lyrics.",
      uri: info.uri,
    };
  }
}

/**
 *
 * @param {string} query - The search query
 */
async function getSyncedLyrics(query) {
  try {
    const body = await baseRequest(query);

    const subStri = await body["track.subtitles.get"].message.body
      .subtitle_list[0].subtitle.subtitle_body;

    const subObj = JSON.parse(subStri);

    return subObj;
  } catch (error) {
    console.error("Axios request error:", error);
    return {
      error: "An error occurred while fetching lyrics.",
      uri: info.uri,
    };
  }
}

module.exports = { getLyrics, getSyncedLyrics };
