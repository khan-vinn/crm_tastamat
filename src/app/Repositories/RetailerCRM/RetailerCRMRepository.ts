import RetailerCRMRepositoryInterface from './RetailerCRMRepositoryInterface';
import axios, { AxiosInstance } from 'axios';
import tastamatConfig from '../../../config/crmConfig';
import PostmanRequestExeption from '../../Exceptions/Postamat/PostamatRequestExeption';
import Helper from 'sosise-core/build/Helper/Helper';
import Lodash from 'lodash';
import Qs from 'qs';

export default class RetailerCRMRepository implements RetailerCRMRepositoryInterface {
    static MAX_SEND_RETRIES = 3;
    static DELAY_BETWEEN_RETRIES_IN_MS = 5000;
    httpClient: AxiosInstance;
    /**
     * Constructor
     */
    constructor() {
        this.httpClient = axios.create({
            baseURL: tastamatConfig.baseURL
        });
    }

    public async getInform(id: string): Promise<any> {
        return await 0;
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
                // this.generateHeader(params)
                //
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
                if (tries === RetailerCRMRepository.MAX_SEND_RETRIES) {
                    throw new PostmanRequestExeption(
                        `Maximum amount of ${RetailerCRMRepository.MAX_SEND_RETRIES} tries is reached while requesting CRM`,
                        url,
                        params,
                        Lodash.get(error, 'response.data', '')
                    );
                }

                // Wait some time
                await Helper.sleep(RetailerCRMRepository.DELAY_BETWEEN_RETRIES_IN_MS);
            }
        }
    }
}
