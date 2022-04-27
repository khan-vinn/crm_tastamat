import Exception from 'sosise-core/build/Exceptions/Exception';
import ExceptionResponse from 'sosise-core/build/Types/ExceptionResponse';

export default class CrmOrderNotFoundException extends Exception {

    public orderId: string;
    public response: any;
    protected httpCode = 404;
    protected code = 1004;

    /**
     * Constructor
     */
    constructor(message: string, orderId: string, response: any) {
        super(message);
        this.orderId = orderId;
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
                orderId: this.orderId,
                response: this.response
            }
        };
        return response;
    }
}
