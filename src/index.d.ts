declare function getAccessToken(): Promise<any>;

declare function getTrack(query: string): Promise<any>;

declare function getLyrics(query: string): Promise<string>;

export { getLyrics };
