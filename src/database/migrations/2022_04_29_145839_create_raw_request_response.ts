import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema
 */
export default class RawRequestResponse extends BaseSchema {

    protected tableName = 'raw_requests_responses';

    /**
     * Run the migrations.
     */
    public async up(): Promise<void> {
        await this.dbConnection.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('ip').notNullable();
            table.string('method').notNullable();
            table.string('uri', 1024).notNullable();
            table.string('api_key');
            table.text('request_headers');
            table.text('request_body');
            table.text('middle_api_response', 'longtext');
            table.text('middle_api_request', 'longtext');
            table.text('response_body', 'longtext');
            table.integer('response_code');
            table.integer('duration_ms');
            table.timestamps(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public async down(): Promise<void> {
        await this.dbConnection.schema.dropTable(this.tableName);
    }
}
