#!/usr/bin/env node

// Main executable for running the CodeStream Outbound Email Server
// (normally run on AWS Lambda, but can be run as a service for on-prem installations)

'use strict';

const OutboundEmailServerConfig = require(process.env.CS_OUTBOUND_EMAIL_TOP + '/src/config');
const SimpleFileLogger = require(process.env.CS_OUTBOUND_EMAIL_TOP + '/src/server_utils/simple_file_logger');
const ClusterWrapper = require(process.env.CS_OUTBOUND_EMAIL_TOP + '/src/server_utils/cluster_wrapper');

// start up the master, this will launch workers to really get down to work
(async function() {
	let Config = await OutboundEmailServerConfig.loadConfig({custom: true});

	// establish our logger
	var Logger = new SimpleFileLogger(Config.logging);
	Config.logger = Logger;

	// invoke a node cluster master with our configurations provided
	var ServerClass = require(process.env.CS_OUTBOUND_EMAIL_TOP + '/src/outboundEmailServer');
	var MyClusterWrapper = new ClusterWrapper(
		ServerClass,
		Config,
		Logger
	);

	try {
		await MyClusterWrapper.start();
	}
	catch (error) {
		console.error('Failed to start: ' + error); // eslint-disable-line no-console
		process.exit(1);
	}
})();
