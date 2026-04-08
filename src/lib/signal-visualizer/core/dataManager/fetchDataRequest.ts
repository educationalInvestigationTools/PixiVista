


export type FetchDataRequest = {
    requestId: string;
    labels: string[];
    viewPort: {
        startSeconds: number,
        lengthSeconds : number,
    }
    expectedWidth: number;
};
