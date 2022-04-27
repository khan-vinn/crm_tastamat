import Validator from 'validatorjs';
import ValidationException from 'sosise-core/build/Exceptions/Validation/ValidationException';
import { IBookCellRequest } from '../Types/IProduct';
import { TypeOfCellChange } from '../Enums/cellType';

const cellChangeTypeArray: string[] = Object.values(TypeOfCellChange)
    .filter((value) => typeof value === "string")
    .map((value) => (value as string));

/**
 * If you need more validation rules, see: https://github.com/mikeerickson/validatorjs
 */
export default class CellBookMethodUnifier {

    private params: any;
    public method: TypeOfCellChange;


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
            method: ['required', 'string', 'min:1', 'in:' + cellChangeTypeArray],
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
        this.method = this.params.method;
    }
}
