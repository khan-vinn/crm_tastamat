import Validator from 'validatorjs';
import ValidationException from 'sosise-core/build/Exceptions/Validation/ValidationException';
import { ITransferStatus } from '../Types/IProduct';

/**
 * If you need more validation rules, see: https://github.com/mikeerickson/validatorjs
 */
export default class StatusTransferUnifier {

    private params: ITransferStatus;
    public identifier: number;
    public status: string;
    public date: number;

    /**
     * Constructor
     */
    constructor(params: any) {
        // Remember incoming params
        this.params = params;

        // Validate, await is important otherwise we could not catch the exception
        this.validate();

        // Map data
        this.map();
    }

    /**
     * Request data validation
     */
    private validate() {
        // Create validator
        const validator = new Validator(this.params, {
            date: ['required', 'numeric', 'min:1'],
            identifier: ['required', 'numeric', 'min:0'],
            status: ['required', 'string']
        });

        // If it fails throw exception
        if (validator.fails()) {
            throw new ValidationException('Validation exception', (validator.errors.all() as any));
        }
    }

    /**
     * Request data mapping
     */
    private map() {
        this.identifier = + this.params.identifier;
        this.status = this.params.status;
        this.date = + this.params.date;
    }
}
