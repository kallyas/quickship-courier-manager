import { Head, Link, useForm, router } from "@inertiajs/react";
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
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";

// We'll initialize Stripe dynamically

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
    stripe_publishable_key: string;
}

const cardElementOptions = {
    style: {
        base: {
            fontSize: "16px",
            color: "#424770",
            "::placeholder": {
                color: "#aab7c4",
            },
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        },
    },
    hidePostalCode: true,
};

interface PaymentFormProps {
    shipment: Shipment;
}

function PaymentForm({ shipment }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
    const toast = useToast();

    const { errors } = useForm();

    const createPaymentIntent = async () => {
        try {
            // Get CSRF token from meta tag
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            if (!token) {
                throw new Error('CSRF token not found');
            }

            const response = await fetch(route("payments.intent", shipment.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Payment intent creation failed:', response.status, errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            setClientSecret(data.client_secret);
            setPaymentIntentId(data.payment_intent_id);
            return data;
        } catch (error) {
            console.error('Payment intent error:', error);
            setPaymentError("Failed to initialize payment. Please try again.");
            setIsProcessing(false);
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setPaymentError(null);

        const card = elements.getElement(CardElement);

        if (!card) {
            setPaymentError("Card element not found");
            setIsProcessing(false);
            return;
        }

        try {
            // First, create the payment intent if we don't have one
            let secret = clientSecret;
            let intentId = paymentIntentId;

            if (!secret) {
                const intentData = await createPaymentIntent();
                secret = intentData.client_secret;
                intentId = intentData.payment_intent_id;
            }

            if (!secret) {
                setPaymentError("Payment initialization failed. Please try again.");
                setIsProcessing(false);
                return;
            }

            // Now confirm the payment
            const { error, paymentIntent } = await stripe.confirmCardPayment(secret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: shipment.recipient_name,
                    },
                },
            });

            if (error) {
                setPaymentError(error.message || "Payment failed. Please try again.");
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                toast.success("Payment successful!");
                
                // Payment successful - redirect directly to success page
                // Payment intent ID is stored in session by the server
                router.visit(route("payments.success", {
                    shipment: shipment.id,
                    tracking: shipment.tracking_id
                }));
            }
        } catch {
            setPaymentError("An unexpected error occurred. Please try again.");
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {(paymentError || (errors as any)?.payment) && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {paymentError || (errors as any)?.payment}
                        </AlertDescription>
                    </Alert>
                )}

                {errors.payment_method && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.payment_method}</AlertDescription>
                    </Alert>
                )}

                {errors.payment_intent_id && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{errors.payment_intent_id}</AlertDescription>
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

                    <div className="space-y-4">
                        <h3 className="font-medium">Card Information</h3>
                        <div className="border rounded-lg p-4 bg-white">
                            <CardElement options={cardElementOptions} />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        disabled={isProcessing || !stripe}
                        size="lg"
                    >
                        {isProcessing ? (
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
    );
}

export default function Create({ shipment, stripe_publishable_key }: Props) {
    const stripePromise = loadStripe(stripe_publishable_key);
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
                            Complete payment for shipment {shipment.tracking_id.length > 10 ? shipment.tracking_id.slice(0, 10) + '...' : shipment.tracking_id}.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        <Elements stripe={stripePromise}>
                            <PaymentForm shipment={shipment} />
                        </Elements>
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
