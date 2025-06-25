import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/layouts/app-layout";
import { 
    CheckCircle, 
    Package, 
    FileText, 
    Eye, 
    Home,
    ArrowRight
} from "lucide-react";

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
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <AppLayout>
            <Head title="Payment Successful" />
            
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Success Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-green-900">Payment Successful!</h1>
                        <p className="text-lg text-muted-foreground mt-2">
                            Your payment has been processed successfully
                        </p>
                    </div>
                </div>

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
                                        <Badge className="bg-green-100 text-green-800">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            PAID
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
                                    Your payment for tracking ID <span className="font-mono">{trackingId}</span> has been processed successfully.
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
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
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
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
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
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
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
                            <Link href={route('invoices.generate', shipment.id)} className="flex-1">
                                <Button variant="outline" className="w-full">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Download Invoice
                                </Button>
                            </Link>
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
                        Need help? <Link href={route('support.index')} className="text-blue-600 hover:underline">Contact Support</Link>
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}