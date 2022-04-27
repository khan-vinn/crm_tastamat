import RetailerCRMRepositoryInterface from './RetailerCRMRepositoryInterface';
import axios, { AxiosInstance } from 'axios';
import PostmanRequestExeption from '../../Exceptions/Postamat/PostamatRequestExeption';
import Helper from 'sosise-core/build/Helper/Helper';
import Lodash from 'lodash';
import Qs from 'qs';
import { crmConfig } from '../../../config/APiConfig';
import CrmRequestException from '../../Exceptions/CRM/CrmRequestExeption';
import { IProduct } from '../../Types/IProduct';
import CrmOrderNotFoundException from '../../Exceptions/CRM/CrmOrderNotFoundExeption';

export default class CrmApiV5Repository implements RetailerCRMRepositoryInterface {

    static MAX_SEND_RETRIES = 3;
    static DELAY_BETWEEN_RETRIES_IN_MS = 5000;
    static API_PREFIX = '/api/v5';
    private apiKey: string;
    httpClient: AxiosInstance;

    /**
     * Constructor
     */

    constructor() {

        this.apiKey = crmConfig.apiKey as string;

        this.httpClient = axios.create({
            baseURL: crmConfig.baseURL
        });

    }

    public async getInfoById(id: number): Promise<any> {

        const response = await this.fetchOrderIdInfo(id)

        const result: IProduct = {

            address: `${response.customer.address?.text || response.customer.address?.id || 'no address'}`,
            fullName: `${response.customer?.firstName || ''} ${response.customer?.lastName || ''}`,
            mobilePhone: response.phone,
            parcerValue: response.totalSum || response.totalSumm,
            lockIndex: `s`,
            trackNumber: id.toString()

        };

        return result;

    }

    public async updateStatus(params: any): Promise<any> {

        const response = await this.fetchOrderIdInfo(params.identifier);

        console.log(response);

        const body = {
            apiKey: this.apiKey,
            site: response.data.orders[0].site,
            order: JSON.stringify({
                tastamat_status: params.status,
            })
        };
        console.log(body);

        const result = await this.makeRequest(`${CrmApiV5Repository.API_PREFIX}/orders/${response.data.orders[0].externalId}/edit`, "POST", null, body);

        return result.data;

    }

    private async fetchOrderIdInfo(id: number) {

        const param = {

            apiKey: this.apiKey,
            filter: {
                ids: [
                    id
                ]
            },
            limit: 20

        };

        const response = await this.makeRequest(CrmApiV5Repository.API_PREFIX + '/orders', "GET", param);

        if (!(response.data.orders.length === 1)) throw new CrmOrderNotFoundException(
            'Order was not found', id.toString(), null
        );

        return response.data.orders[0];
    }

    private async makeRequest(url: string, method: "GET" | "DELETE" | "POST" | "PUT", params: any = null, body: any = null, headers: any = null, auth: any = null): Promise<any> {
        // Current amount of tries
        let tries = 0;

        // Try to send get request in endless loop
        while (true) {
            // Increment try
            tries++;

            try {
                // Make request
                const response = await this.httpClient.request({
                    url,
                    auth,
                    method,
                    headers,
                    params,
                    paramsSerializer(par: any) {
                        return Qs.stringify(par, { arrayFormat: 'brackets' });
                    },
                    data: body
                });

                // Send response, everything is fine
                return response;
                // Check for max tries
            } catch (error) {
                if (tries === CrmApiV5Repository.MAX_SEND_RETRIES) {
                    throw new CrmRequestException(
                        `Maximum amount of ${CrmApiV5Repository.MAX_SEND_RETRIES} tries is reached while requesting CRM`,
                        url,
                        params,
                        Lodash.get(error, 'response.data', '')
                    );
                }

                // Wait some time
                await Helper.sleep(CrmApiV5Repository.DELAY_BETWEEN_RETRIES_IN_MS);
            }
        }
    }
}
