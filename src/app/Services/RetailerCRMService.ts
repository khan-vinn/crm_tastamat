import LogRepositoryInterface from "../Repositories/Log/LogRepositoryInterface";
import RetailerCRMRepositoryInterface from "../Repositories/RetailerCRM/RetailerCRMRepositoryInterface";
import StatusTransferUnifier from "../Unifiers/StatusTransferUnifier";

export default class RetailerCRMService {
    /**
     * Constructor
     */
    constructor(
        private retailerRepository: RetailerCRMRepositoryInterface,
        private logger: LogRepositoryInterface
    ) { }

    public async getInform(id: number) {
        return this.retailerRepository.getInfoById(id);
    }

    public updateStatus(params: any) {
        return this.retailerRepository.updateStatus(params);
    }

}
