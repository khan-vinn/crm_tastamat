import Axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import { TastamatAPiRepositoryInterface } from './TastamatAPIRepositoryInterface';
import Lodash from 'lodash';
import Qs from 'qs';
import Helper from 'sosise-core/build/Helper/Helper';
import TastamatRequestExeption from '../../Exceptions/Tastamat/TastamatRequestExeption';
import { ITransferStatus } from '../../Types/IProduct';
import { tastamatConfig } from '../../../config/APiConfig';

export class TastamatAPIRepository implements TastamatAPiRepositoryInterface {
    static MAX_SEND_RETRIES = 3;
    static DELAY_BETWEEN_RETRIES_IN_MS = 5000;
    static API_PREFIX = '/platform/v1/rest/i';

    httpClient: AxiosInstance;

    constructor() {
        this.httpClient = Axios.create({
            baseURL: tastamatConfig.baseURL,
            timeout: 30000,
            headers: {
                'Accept': 'application/json',
                'x-hmac-key': tastamatConfig.KEY,
            }
        });
    }

    async bookCell(identifier, size): Promise<any> {

        const body = {
            id: identifier,
            size
        };

        await this.makeRequest(TastamatAPIRepository.API_PREFIX + '/orders/book', "POST", null, body);

        return await 0;

    }

    async checkCellStatus(id: string): Promise<any> {

        return await (+id * 21 + 87 - (+id) * 42);

    }

    async cancelOrderCell(): Promise<any> {

        return await 0;
    }

    private generateHeader(message: string, token: string = tastamatConfig.TOKEN as string): void {

        const hmac = crypto.createHmac('sha1', token);

        hmac.update(message);

        this.httpClient.defaults.headers.common['x-hmac: '] = hmac.digest('base64');
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
                this.generateHeader(params);
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
                if (tries === TastamatAPIRepository.MAX_SEND_RETRIES) {
                    throw new TastamatRequestExeption(
                        `Maximum amount of ${TastamatAPIRepository.MAX_SEND_RETRIES} tries is reached while requesting CRM`,
                        url,
                        params,
                        Lodash.get(error, 'response.data', '')
                    );
                }

                // Wait some time
                await Helper.sleep(TastamatAPIRepository.DELAY_BETWEEN_RETRIES_IN_MS);
            }
        }
    }
}