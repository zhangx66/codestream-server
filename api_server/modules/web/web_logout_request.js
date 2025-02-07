'use strict';

const APIRequest = require(process.env.CSSVC_BACKEND_ROOT + '/api_server/lib/api_server/api_request.js');
const Icons = require('./icons.json');

class WebLogOutRequest extends APIRequest {

	async authorize() {
	}

	async process() {
		this.response.clearCookie('tcs', {
			secure: true,
			signed: true
		});

		const returnTo = encodeURIComponent(this.api.config.apiServer.publicApiUrl + '/web/finish');
		const loginHost = this.api.config.integrations.newRelicIdentity.loginServiceHost;
		const loginPath = `${loginHost}/idp/azureb2c-cs/redirect?return_to=${returnTo}`;
		this.module.evalTemplate(this, 'signed_out', {
			path: loginPath,
			newRelicIcon: Icons['newrelic']
		});
	}
}

module.exports = WebLogOutRequest;
