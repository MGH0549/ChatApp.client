export interface User {
    username: string;
    photourl: string;
    token?: string;
    knownAs: string;
    gender: string;
    roles: string[];
}