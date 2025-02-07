// provide a factory for creating random companies, for testing purposes

'use strict';

var RandomString = require('randomstring');

class RandomCompanyFactory {

	constructor (options) {
		Object.assign(this, options);
	}

	// create the company by submitting a request to the server
	createCompany (data, token, callback) {
		this.apiRequester.doApiRequest({
			method: 'post',
			path: '/companies',
			data: data,
			token: token
		}, (error, response) => {
			if (error) { return callback(error); }
			// we need this because behavior is different depending on whether this is
			// the user's first company or not ... if it is not, under one-user-per-org,
			// we get a new access token and must do a login to get the company info
			if (response.accessToken) {
				this.getCompanyInfoThroughLogin(response.accessToken, callback);
			} else {
				callback(null, response);
			}
		});
	}

	getCompanyInfoThroughLogin (accessToken, callback) {
		const apiRequest = {
			method: 'put',
			path: '/login',
			token: accessToken
		};
		if (accessToken.startsWith('MNR-')) {
			const nrUserId = accessToken.split('-')[1];
			apiRequest.requestOptions = {
				headers: {
					'x-cs-mock-nr-user-id': nrUserId
				}
			};
		}
		this.apiRequester.doApiRequest(apiRequest, (error, response) => {
			if (error) { return callback(error); }
			const info = {
				company: response.companies[0],
				team: response.teams[0],
				streams: response.streams,
				user: response.user,
				accessToken
			};
			callback(null, info);
		});
	}

	// return a random company name
	randomName () {
		return 'company ' + RandomString.generate(12);
	}

	// get some random attributes to create a random company
	getRandomCompanyData (callback) {
		let data = {
			name: this.randomName()
		};
		return callback(null, data);
	}

	// return a random company domain
	randomDomain () {
		return `${RandomString.generate(10)}.${RandomString.generate(3)}`;
	}

	// create a random comapny in the database
	createRandomCompany (callback, options = {}) {
		this.getRandomCompanyData(
			(error, data) => {
				if (error) { return callback(error); }
				this.createCompany(data, options.token, callback);
			},
			options
		);
	}
}

module.exports = RandomCompanyFactory;
