import morgan from 'morgan';
import { env, envTypes } from '../utils/logger';


const skip = () => {
    return env !== envTypes.DEV
};

const morganMiddleware = (stream?: morgan.StreamOptions | undefined) => morgan(
    // Define message format string (this is the default one).
    // The message format is made from tokens, and each token is
    // defined inside the Morgan library.
    // You can create your custom token to show what do you want from a request.
    ":remote-addr :method :url :status :res[content-length] - :response-time ms",
    // Options: in this case, I overwrote the stream and the skip logic.
    // See the methods above.
    { stream, skip }
);

export default morganMiddleware