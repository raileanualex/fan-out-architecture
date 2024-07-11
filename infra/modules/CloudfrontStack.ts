import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';


export type ServiceStackProps = cdk.StackProps & {
    label: {
        id: string;
    },
    domainName: string;
    api: apigateway.LambdaRestApi;
};

export class CloudfrontStack extends cdk.Stack {
    constructor(scope: constructs.Construct, id: string, props: ServiceStackProps) {
        super(scope, `${id}-cloudfront-stack`, props);

        // Look up or create Route 53 hosted zone
        const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
            domainName: props.domainName,
        });

        const certificate = certificatemanager.Certificate.fromCertificateArn(this, "certificate-arn", "arn:aws:acm:us-east-1:339712871873:certificate/99c73a0e-43a0-4416-9d96-db36e66e29db");

        const originRequestPolicy = new cloudfront.OriginRequestPolicy(this, `${id}-orp`, {
            headerBehavior: cloudfront.OriginRequestHeaderBehavior.allowList("x-api-key"),
            queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
        });

        // Create CloudFront distribution with SSL/TLS certificate
        const distribution = new cloudfront.Distribution(this, `${id}-distribution`, {
            defaultBehavior: {
                origin: new origins.HttpOrigin(`${props.api.restApiId}.execute-api.${this.region}.amazonaws.com`, {
                    originPath: `/${props.api.deploymentStage.stageName}`,
                }),
                cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
                originRequestPolicy: originRequestPolicy, // Use the created origin request policy
            },
            domainNames: [`api.${props.domainName}`],
            certificate: certificate,
        });
        
        // Create DNS record for the CloudFront distribution
        new route53.ARecord(this, `${id}-CloudFrontAliasRecord`, {
            zone: hostedZone,
            region: props.env?.region,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
            recordName: `api.${props.domainName}`,
        });

        // Output the CloudFront URL
        new cdk.CfnOutput(this, `${id}-CloudFrontURL`, {
            value: `https://${distribution.domainName}`,
            description: 'The URL of the CloudFront distribution',
        });

        // Output the DNS URL
        new cdk.CfnOutput(this, `${id}-DNSURL`, {
            value: `https://api.${props.domainName}`,
            description: 'The DNS URL for the CloudFront distribution',
        });
    }
}
