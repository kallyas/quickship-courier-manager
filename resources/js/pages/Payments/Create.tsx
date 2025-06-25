import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AppLayout from "@/layouts/app-layout";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    CreditCard,
    Lock,
    ArrowLeft,
    Package,
    Shield,
    CheckCircle,
    AlertCircle
} from "lucide-react";

// Note: In a real application, you would use @stripe/stripe-js and @stripe/react-stripe-js
// For this demo, we'll create a placeholder component structure

interface Shipment {
    id: number;
    tracking_id: string;
    recipient_name: string;
    price: number;
    payment_status: string;
    description: string;
    origin_location: {
        name: string;
        city: string;
        state: string;
    };
    destination_location: {
        name: string;
        city: string;
        state: string;
    };
}

interface Intent {
    client_secret: string;
}

interface Props {
    shipment: Shipment;
    intent: Intent;
}

export default function Create({ shipment }: Props) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const toast = useToast();

    const { setData, post, processing } = useForm({
        payment_method: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setPaymentError(null);

        try {
            // In a real implementation, you would:
            // 1. Confirm the payment with Stripe
            // 2. Get the payment method ID
            // 3. Submit to your backend

            // For demo purposes, we'll simulate the flow
            setTimeout(() => {
                toast.info("Processing payment...");
                setData("payment_method", "pm_card_visa"); // Demo payment method
                post(route("payments.process", shipment.id));
                setIsProcessing(false);
            }, 2000);

        } catch {
            setPaymentError("Payment failed. Please try again.");
            setIsProcessing(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <AppLayout>
            <Head title={`Payment - ${shipment.tracking_id}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route("shipments.show", shipment.id)}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Shipment
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Payment</h1>
                        <p className="text-muted-foreground">
                            Complete payment for shipment {shipment.tracking_id}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Payment Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {paymentError && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{paymentError}</AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Security Notice */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <h4 className="font-medium text-blue-900">Secure Payment</h4>
                                                <p className="text-sm text-blue-700">
                                                    Your payment information is encrypted and processed securely through Stripe.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Demo Card Input */}
                                    <div className="space-y-4">
                                        <h3 className="font-medium">Card Information</h3>

                                        {/* In a real app, this would be Stripe Elements */}
                                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                            <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <h4 className="font-medium text-gray-900 mb-2">
                                                Stripe Elements Integration
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                In a production environment, this would contain the actual Stripe card input elements.
                                            </p>
                                            <div className="max-w-sm mx-auto space-y-3">
                                                <div className="p-3 bg-white border rounded text-left text-sm">
                                                    Demo: 4242 4242 4242 4242
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="p-3 bg-white border rounded text-sm">
                                                        MM / YY
                                                    </div>
                                                    <div className="p-3 bg-white border rounded text-sm">
                                                        CVC
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                        disabled={isProcessing || processing}
                                        size="lg"
                                    >
                                        {isProcessing || processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                Processing Payment...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="mr-2 h-4 w-4" />
                                                Pay {formatPrice(shipment.price)}
                                            </>
                                        )}
                                    </Button>

                                    {/* Security Features */}
                                    <div className="text-center space-y-2">
                                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Lock className="h-4 w-4" />
                                                SSL Encrypted
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Shield className="h-4 w-4" />
                                                PCI Compliant
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CheckCircle className="h-4 w-4" />
                                                Stripe Powered
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            We don't store your card information. All payments are processed securely by Stripe.
                                        </p>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-medium">Shipment Details</h4>
                                        <p className="text-sm text-gray-600">{shipment.description}</p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Tracking ID:</span>
                                            <Badge variant="outline">{shipment.tracking_id}</Badge>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Recipient:</span>
                                            <span>{shipment.recipient_name}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>From:</span>
                                            <span>{shipment.origin_location.city}, {shipment.origin_location.state}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>To:</span>
                                            <span>{shipment.destination_location.city}, {shipment.destination_location.state}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Shipping Cost:</span>
                                            <span>{formatPrice(shipment.price)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Processing Fee:</span>
                                            <span>$0.00</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between font-medium">
                                        <span>Total:</span>
                                        <span className="text-lg">{formatPrice(shipment.price)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Security */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Payment Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                        <div>
                                            <div className="font-medium">256-bit SSL encryption</div>
                                            <div className="text-gray-600">Your data is protected</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                        <div>
                                            <div className="font-medium">PCI DSS compliant</div>
                                            <div className="text-gray-600">Industry standard security</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                        <div>
                                            <div className="font-medium">Fraud protection</div>
                                            <div className="text-gray-600">Advanced fraud detection</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
