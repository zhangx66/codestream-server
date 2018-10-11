'use strict';

const CodeStreamAPITest = require(process.env.CS_API_TOP + '/lib/test_base/codestream_api_test');
const BoundAsync = require(process.env.CS_API_TOP + '/server_utils/bound_async');
const RepoTestConstants = require('../repo_test_constants');

class GetRepoTest extends CodeStreamAPITest {

	constructor (options) {
		super(options);
		this.teamOptions.creatorIndex = 1;
		this.streamOptions.creatorIndex = 1;
		Object.assign(this.postOptions, {
			creatorIndex: 0,
			wantCodeBlock: true
		});
	}

	get description () {
		return 'should return a valid repo when requesting a repo created by me';
	}

	getExpectedFields () {
		return { repo: RepoTestConstants.EXPECTED_REPO_FIELDS };
	}

	// before the test runs...
	before (callback) {
		BoundAsync.series(this, [
			super.before,
			this.setPath
		], callback);
	}

	// set the path for the test request
	setPath (callback) {
		this.repo = this.postData[0].repos[0];
		// fetch the repo (created by submitting a post with a code block and remotes)
		this.path = '/repos/' + this.repo._id;
		callback();
	}

	// validate the response to the test request
	validateResponse (data) {
		// make sure we got the expected repo
		this.validateMatchingObject(this.repo._id, data.repo, 'repo');
		// make sure we didn't get attributes not suitable for the client 
		this.validateSanitized(data.repo, RepoTestConstants.UNSANITIZED_ATTRIBUTES);
	}
}

module.exports = GetRepoTest;
