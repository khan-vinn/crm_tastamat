import RetailerCRMRepositoryInterface from "../Repositories/RetailerCRM/RetailerCRMRepositoryInterface";

export default class RetailerCRMService {
    /**
     * Constructor
     */
    constructor(private retailerRepository: RetailerCRMRepositoryInterface) {}

    public async getInform(id: string) {
        return this.retailerRepository.getInfoById(id);
    }

    public updateStatus(params: any) {
        return this.retailerRepository.updateStatus(params);
    }
}
