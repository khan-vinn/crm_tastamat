import ValidationException from "sosise-core/build/Exceptions/Validation/ValidationException";
import Validator from "validatorjs";

export default class OrderProductIdUnifier {
    private params: any;
    public pkgIdentifier: string;

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
            identifier: ["required", "numeric", "min:0"],
        });

        // If it fails throw exception
        if (validator.fails()) {
            throw new ValidationException(
                "Validation exception",
                validator.errors.all() as any
            );
        }
    }

    /**
     * Request data mapping
     */
    private map() {
        this.pkgIdentifier = this.params.identifier;
    }
}
