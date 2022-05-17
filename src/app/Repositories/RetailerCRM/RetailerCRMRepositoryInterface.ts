export default interface RetailerCRMRepositoryInterface {
    /**
     * Get all customers
     */
    getInfoById(id: string): Promise<any>;
    updateStatus(params: any): Promise<any>;
}
