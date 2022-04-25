import Validator from 'validatorjs';
import ValidationException from 'sosise-core/build/Exceptions/Validation/ValidationException';
import { IBookCellRequest } from '../Types/IProduct';
import { CellType } from '../Enums/cellType';

/**
 * If you need more validation rules, see: https://github.com/mikeerickson/validatorjs
 */
export default class CellBookUnifier {

    private params: IBookCellRequest;
    public identifier: string;
    public size: CellType;


    /**
     * Constructor
     */
    constructor(params: IBookCellRequest) {
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
            size: ['required', 'string', 'min:1',],
            identifier: ['required', 'string', 'min:1']
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
        this.identifier = this.params.identifier;
        this.size = this.params.size;
    }
}
