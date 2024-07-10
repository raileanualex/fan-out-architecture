#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ServiceStack } from "./modules/ServiceStack";

const app = new cdk.App();

const config = {
    account: '339712871873',
    region: 'eu-central-1',
}

const label = {
    id: 'fan-out-architecture'
}
new ServiceStack(app, `${label.id}-service-stack`, {
    env: { account: config.account, region: config.region },
    label,
    domainName: "railalex.com"
});