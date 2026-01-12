import React from 'react';
import PolicyLayout from '../components/PolicyLayout';

const ShippingPolicy = () => {
    return (
        <PolicyLayout title="Delivery and Shipping Policy">
            <p className="text-sm text-gray-500 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

            <h3>1. Digital Delivery</h3>
            <p>
                MS Innovatics primarily deals in digital products and software services. Upon successful payment, you will receive an email confirmation containing the download link or access credentials for your purchased product.
            </p>

            <h3>2. Delivery Timelines</h3>
            <ul className="list-disc pl-5 mb-4">
                <li><strong>Instant Download Products:</strong> Access is provided immediately upon successful payment confirmation.</li>
                <li><strong>Services/Custom Projects:</strong> Delivery timelines will be as per the agreed project proposal. Tyically, project milestones are delivered within 3-7 business days depending on complexity.</li>
            </ul>

            <h3>3. Shipping Charges</h3>
            <p>
                Since our products are digital, there are <strong>zero shipping charges</strong>. You can download the products from anywhere in the world.
            </p>

            <h3>4. Non-receipt of Product</h3>
            <p>
                If you do not receive the download link or access details within 2 hours of purchase, please check your spam/junk folder. If it's still missing, please contact our support team at support@msinnovatics.com with your order ID.
            </p>
        </PolicyLayout>
    );
};

export default ShippingPolicy;
