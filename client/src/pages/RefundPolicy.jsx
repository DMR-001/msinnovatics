import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const RefundPolicy = () => {
    return (
        <PolicyLayout title="Refund and Cancellation Policy">
            <p className="text-sm text-gray-500 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

            <h3>1. Cancellation Policy</h3>
            <p>
                You can cancel your order within 24 hours of placing it, provided that the project source code or digital asset has not yet been delivered or downloaded. Once the digital product is delivered/downloaded, the order cannot be cancelled.
            </p>

            <h3>2. Refund Policy</h3>
            <p>
                Due to the nature of digital goods (source code, software, reports), we generally do not offer refunds once the product has been accessed or downloaded.
            </p>
            <p>
                However, we may consider a refund request under the following exceptional circumstances:
            </p>
            <ul className="list-disc pl-5 mb-4">
                <li><strong>Non-delivery of the product:</strong> Due to some mailing issues of your e-mail provider or your own mail server, you might not receive a delivery e-mail from us. In this case, we recommend contacting us for assistance.</li>
                <li><strong>Major defects:</strong> Although all the products are thoroughly tested before release, unexpected errors may occur. Such issues must be reported to our technical support Team. If we are unable to rectify the error within 72 hours, a refund may be issued.</li>
                <li><strong>Product not-as-described:</strong> Such issues should be reported to our Technical Support Team within 7 days from the date of the purchase. Clear evidence must be provided proving that the purchased product is not as it is described on the website.</li>
            </ul>

            <h3>3. Processing of Refunds</h3>
            <p>
                If your refund is approved, we will initiate a refund to your credit card (or original method of payment). You will receive the credit within a certain amount of days, depending on your card issuer's policies.
            </p>
        </PolicyLayout>
    );
};

export default RefundPolicy;
