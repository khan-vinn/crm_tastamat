export default interface RetailerCRMRepositoryInterface {
    /**
     * Get all customers
     */
    getInfoById(id: number): Promise<any>;
    updateStatus(params: any): Promise<any>;

}
