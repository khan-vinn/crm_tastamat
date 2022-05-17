import Validator from 'validatorjs';
import ValidationException from 'sosise-core/build/Exceptions/Validation/ValidationException';
import { ITransferStatus } from '../Types/IProduct';
import { OrderStatus } from '../Enums/cellType';

/**
 * If you need more validation rules, see: https://github.com/mikeerickson/validatorjs
 */

const orderStatusesArray: string[] = Object.values(OrderStatus)
    .filter((value) => typeof value === "string")
    .map((value) => (value as string));

export default class StatusTransferUnifier {

    private params;
    public identifier: number;
    public status: OrderStatus;
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
            identificator: ['required', 'numeric', 'min:0'],
            status: ['required', 'string', 'in:' + orderStatusesArray]
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
        this.identifier = + this.params.identificator;
        this.status = this.params.status;
        this.date = + this.params.date;
    }
}
