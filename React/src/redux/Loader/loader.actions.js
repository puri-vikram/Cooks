

    import { Loading } from './loader.types';


    export const loader = (payload) => {

        return {

            type: Loading,
            payload: payload
        };

    };