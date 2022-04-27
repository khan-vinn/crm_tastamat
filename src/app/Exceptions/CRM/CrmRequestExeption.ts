import Exception from 'sosise-core/build/Exceptions/Exception';
import ExceptionResponse from 'sosise-core/build/Types/ExceptionResponse';

export default class CrmRequestException extends Exception {

    public url: string;
    public params: any;
    public response: any;
    protected httpCode = 503;
    protected code = 1005;

    /**
     * Constructor
     */
    constructor(message: string, url: string, params: any, response: any) {
        super(message);
        this.url = url;
        this.params = params;
        this.response = response;
    }

    /**
     * Handle exception
     */
    public handle(exception: this): ExceptionResponse {
        const response: ExceptionResponse = {
            code: this.code,
            httpCode: this.httpCode,
            message: exception.message,
            data: {
                url: this.url,
                params: this.params,
                response: this.response
            }
        };
        return response;
    }
}
