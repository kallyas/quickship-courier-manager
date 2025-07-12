import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, Clock, Eye, FileText, Home, Loader2, Package } from 'lucide-react';

interface Shipment {
    id: number;
    tracking_id: string;
    recipient_name: string;
    price: number;
    payment_status: string;
    status: string;
    description?: string;
    origin_location?: {
        name: string;
        city: string;
        state: string;
    };
    destination_location?: {
        name: string;
        city: string;
        state: string;
    };
}

interface Props {
    shipment?: Shipment;
    trackingId?: string;
}

export default function PaymentSuccess({ shipment, trackingId }: Props) {
    const [paymentStatus, setPaymentStatus] = useState(shipment?.payment_status || 'pending');
    const [isPolling, setIsPolling] = useState(shipment?.payment_status !== 'paid');


    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Poll for payment status if not yet paid
    useEffect(() => {
        if (!shipment || paymentStatus === 'paid' || !isPolling) return;

        const pollInterval = setInterval(async () => {
            try {
                // Payment intent ID is now stored in session on the server
                const response = await fetch(route('payments.status', shipment.id), {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    },
                    credentials: 'same-origin'
                });

                if (response.ok) {
                    const data = await response.json();
                    setPaymentStatus(data.payment_status);

                    if (data.payment_status === 'paid') {
                        setIsPolling(false);
                        // Refresh the page to get updated shipment data
                        window.location.reload();
                    }
                }
            } catch (error) {
                console.error('Error polling payment status:', error);
            }
        }, 3000); // Poll every 3 seconds

        // Stop polling after 2 minutes
        const timeout = setTimeout(() => {
            setIsPolling(false);
        }, 120000);

        return () => {
            clearInterval(pollInterval);
            clearTimeout(timeout);
        };
    }, [shipment, paymentStatus, isPolling]);

    return (
        <AppLayout>
            <Head title="Payment Successful" />

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Success Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            paymentStatus === 'paid'
                                ? 'bg-green-100'
                                : 'bg-yellow-100'
                        }`}>
                            {paymentStatus === 'paid' ? (
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            ) : isPolling ? (
                                <Loader2 className="w-8 h-8 text-yellow-600 animate-spin" />
                            ) : (
                                <Clock className="w-8 h-8 text-yellow-600" />
                            )}
                        </div>
                    </div>
                    <div>
                        <h1 className={`text-3xl font-bold ${
                            paymentStatus === 'paid'
                                ? 'text-green-900'
                                : 'text-yellow-900'
                        }`}>
                            {paymentStatus === 'paid'
                                ? 'Payment Successful!'
                                : 'Payment Processing...'
                            }
                        </h1>
                        <p className="text-lg text-muted-foreground mt-2">
                            {paymentStatus === 'paid'
                                ? 'Your payment has been processed successfully'
                                : 'Please wait while we confirm your payment'
                            }
                        </p>
                    </div>
                </div>

                {/* Processing Alert */}
                {paymentStatus !== 'paid' && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                            Your payment is being processed. This usually takes a few seconds.
                            {isPolling && 'We\'re checking the status automatically...'}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Payment Details */}
                {shipment ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Shipment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tracking ID</label>
                                    <div className="font-mono text-lg">{shipment.tracking_id}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Amount Paid</label>
                                    <div className="text-lg font-semibold">{formatCurrency(shipment.price)}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Recipient</label>
                                    <div>{shipment.recipient_name}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                                    <div>
                                        <Badge className={paymentStatus === 'paid'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }>
                                            {paymentStatus === 'paid' ? (
                                                <><CheckCircle className="w-3 h-3 mr-1" />PAID</>
                                            ) : (
                                                <><Clock className="w-3 h-3 mr-1" />PROCESSING</>
                                            )}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {shipment.origin_location && shipment.destination_location && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Route</label>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span>{shipment.origin_location.city}, {shipment.origin_location.state}</span>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                        <span>{shipment.destination_location.city}, {shipment.destination_location.state}</span>
                                    </div>
                                </div>
                            )}

                            {shipment.description && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                                    <div className="text-sm">{shipment.description}</div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="text-center py-8">
                            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Payment Confirmed</h3>
                            {trackingId && (
                                <p className="text-muted-foreground">
                                    Your payment for tracking ID <span className="font-mono">{trackingId}</span> has
                                    been processed successfully.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Next Steps */}
                <Card>
                    <CardHeader>
                        <CardTitle>What's Next?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-3">
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                <div
                                    className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-blue-600 text-sm font-semibold">1</span>
                                </div>
                                <div>
                                    <h4 className="font-medium">Confirmation Email</h4>
                                    <p className="text-sm text-muted-foreground">
                                        You'll receive a payment confirmation email shortly with your receipt.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                <div
                                    className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-blue-600 text-sm font-semibold">2</span>
                                </div>
                                <div>
                                    <h4 className="font-medium">Shipment Processing</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Your shipment will be processed and tracking updates will be available soon.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                <div
                                    className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-blue-600 text-sm font-semibold">3</span>
                                </div>
                                <div>
                                    <h4 className="font-medium">Track Your Package</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Use your tracking ID to monitor your shipment's progress.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {shipment ? (
                        <>
                            <Link href={route('shipments.show', shipment.id)} className="flex-1">
                                <Button className="w-full">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Shipment Details
                                </Button>
                            </Link>
                            <div className="flex gap-2 flex-1">
                                <a href={route('invoices.generate', { shipment: shipment.id, action: 'view' })} className="flex-1" target="_blank">
                                    <Button variant="outline" className="w-full">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Invoice
                                    </Button>
                                </a>
                                <a href={route('invoices.generate', shipment.id)} className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </a>
                            </div>
                        </>
                    ) : (
                        <Link href={route('shipments.index')} className="flex-1">
                            <Button className="w-full">
                                <Package className="w-4 h-4 mr-2" />
                                View My Shipments
                            </Button>
                        </Link>
                    )}
                    <Link href={route('dashboard')}>
                        <Button variant="outline">
                            <Home className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Additional Info */}
                <div className="text-center text-sm text-muted-foreground">
                    <p>
                        Need help? <Link href={route('support.index')} className="text-blue-600 hover:underline">Contact
                        Support</Link>
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
