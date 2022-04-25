import LogRepositoryInterface from "../Repositories/Log/LogRepositoryInterface";
import RetailerCRMRepositoryInterface from "../Repositories/RetailerCRM/RetailerCRMRepositoryInterface";

export default class RetailerCRMService {
    /**
     * Constructor
     */
    constructor(private retailerRepository: RetailerCRMRepositoryInterface, private logger: LogRepositoryInterface) {

    }
    public async getInform(id){
        return this.retailerRepository.getInform(id)
    }

}
