

declare type Action ={
    +type: string
};

declare type Dispatch<A: Action> = (action: A ) => A;