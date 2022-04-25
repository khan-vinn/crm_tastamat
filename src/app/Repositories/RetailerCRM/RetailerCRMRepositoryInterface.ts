export default interface RetailerCRMRepositoryInterface {
    /**
     * Get all customers
     */
    getInform(id: string): Promise<any>;

}
