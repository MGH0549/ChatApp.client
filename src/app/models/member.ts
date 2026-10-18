import { Photo } from "./photo";

export interface Member{
    userName: string;
    id:number;
    knownas:string;
    age:number;
    created:Date;
    lastactive:Date;
    gender:string;
    introduction:string;
    lookingfor:string;
    interests:string;
    city:string;
    country:string;
    photoUrl:string;
    photos:Photo[];
}