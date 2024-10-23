export interface RequestGenerate{
    imageUrl: string;
    effect: string;
    width: number;
    height: number;
}

export interface Response1{
    job: string;
    status: string;
}

export interface Response2{
    job: string;
    status: string;
    imageUrl: string;
}