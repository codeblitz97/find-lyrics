declare function getAccessToken(): Promise<any>;

declare function getTrack(query: string): Promise<any>;

declare function getLyrics(query: string): Promise<string>;
declare function getSyncedLyrics(query: string): Promise<
  {
    text: string;
    time: {
      total: number;
      minutes: number;
      seconds: number;
      hundredths: number;
    };
  }[]
>;

export { getLyrics, getSyncedLyrics };
