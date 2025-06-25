import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { 
    Package, 
    MapPin, 
    Clock, 
    CheckCircle, 
    Truck, 
    AlertCircle,
    ArrowRight,
    Phone,
    DollarSign,
    FileText,
    RefreshCcw,
    Search
} from 'lucide-react';

interface Location {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    phone?: string;
}

interface ShipmentHistory {
    id: number;
    status: string;
    location: string;
    notes?: string;
    created_at: string;
    updated_by?: {
        name: string;
    };
}

interface Shipment {
    id: number;
    tracking_id: string;
    status: string;
    payment_status: string;
    recipient_name: string;
    recipient_phone: string;
    recipient_email?: string;
    price: number;
    weight: number;
    dimensions: string;
    description?: string;
    special_instructions?: string;
    estimated_delivery_date?: string;
    actual_delivery_date?: string;
    created_at: string;
    updated_at: string;
    origin_location: Location;
    destination_location: Location;
    history: ShipmentHistory[];
}

interface Props {
    shipment: Shipment;
}

const statusConfig = {
    pending: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: Clock
    },
    picked_up: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: Package
    },
    in_transit: { 
        color: 'bg-purple-100 text-purple-800', 
        icon: Truck
    },
    out_for_delivery: { 
        color: 'bg-orange-100 text-orange-800', 
        icon: Truck
    },
    delivered: { 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle
    },
    failed_delivery: { 
        color: 'bg-red-100 text-red-800', 
        icon: AlertCircle
    },
    returned: { 
        color: 'bg-gray-100 text-gray-800', 
        icon: RefreshCcw
    }
};

export default function TrackingShow({ shipment }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const currentStatus = statusConfig[shipment.status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = currentStatus.icon;

    const getEstimatedDelivery = () => {
        if (shipment.actual_delivery_date) {
            return `Delivered on ${formatDate(shipment.actual_delivery_date)}`;
        }
        if (shipment.estimated_delivery_date) {
            return `Estimated delivery: ${formatDate(shipment.estimated_delivery_date)}`;
        }
        return 'Delivery date will be updated soon';
    };

    return (
        <AppLayout>
            <Head title={`Track ${shipment.tracking_id}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Package Tracking</h1>
                        <p className="text-muted-foreground">
                            Tracking ID: <span className="font-mono">{shipment.tracking_id}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('tracking.index')}>
                            <Button variant="outline">
                                <Search className="w-4 h-4 mr-2" />
                                Track Another
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            <RefreshCcw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Status Overview */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`rounded-full p-2 ${currentStatus.color.replace('text-', 'bg-').replace('-800', '-200')}`}>
                                    <IconComponent className={`h-6 w-6 ${currentStatus.color.split(' ')[1]}`} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {shipment.status.replace('_', ' ').toUpperCase()}
                                    </h2>
                                    <p className="text-muted-foreground">{getEstimatedDelivery()}</p>
                                </div>
                            </div>
                            <Badge className={currentStatus.color}>
                                {shipment.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Shipment Details */}
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
                                    <label className="text-sm font-medium text-muted-foreground">Recipient</label>
                                    <p className="text-sm">{shipment.recipient_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                    <p className="text-sm">{shipment.recipient_phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Weight</label>
                                    <p className="text-sm">{shipment.weight} lbs</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Dimensions</label>
                                    <p className="text-sm">{shipment.dimensions}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Value</label>
                                    <p className="text-sm">{formatCurrency(shipment.price)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Payment</label>
                                    <Badge variant={shipment.payment_status === 'paid' ? 'default' : 'secondary'}>
                                        {shipment.payment_status.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                            {shipment.description && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                                    <p className="text-sm mt-1">{shipment.description}</p>
                                </div>
                            )}
                            {shipment.special_instructions && (
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <label className="text-sm font-medium text-yellow-800">Special Instructions</label>
                                    <p className="text-sm text-yellow-700 mt-1">{shipment.special_instructions}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Route Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Route Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <h4 className="font-medium text-green-700">Origin</h4>
                                </div>
                                <div className="ml-5 text-sm space-y-1">
                                    <p className="font-medium">{shipment.origin_location.name}</p>
                                    <p>{shipment.origin_location.address}</p>
                                    <p>{shipment.origin_location.city}, {shipment.origin_location.state} {shipment.origin_location.zip_code}</p>
                                    {shipment.origin_location.phone && (
                                        <p className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {shipment.origin_location.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <h4 className="font-medium text-blue-700">Destination</h4>
                                </div>
                                <div className="ml-5 text-sm space-y-1">
                                    <p className="font-medium">{shipment.destination_location.name}</p>
                                    <p>{shipment.destination_location.address}</p>
                                    <p>{shipment.destination_location.city}, {shipment.destination_location.state} {shipment.destination_location.zip_code}</p>
                                    {shipment.destination_location.phone && (
                                        <p className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {shipment.destination_location.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tracking History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Tracking History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {shipment.history.length > 0 ? (
                            <div className="space-y-4">
                                {shipment.history.map((event, index) => (
                                    <div key={event.id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                            {index < shipment.history.length - 1 && (
                                                <div className="w-px h-16 bg-gray-200 mt-2"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge 
                                                    variant="secondary" 
                                                    className={`text-xs ${index === 0 ? 'bg-blue-100 text-blue-800' : ''}`}
                                                >
                                                    {event.status.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(event.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium">{event.location}</p>
                                            {event.notes && (
                                                <p className="text-xs text-muted-foreground mt-1">{event.notes}</p>
                                            )}
                                            {event.updated_by && (
                                                <p className="text-xs text-muted-foreground">
                                                    Updated by: {event.updated_by.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No tracking history available yet</p>
                                <p className="text-sm">Updates will appear here as your package moves</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Actions */}
                {shipment.payment_status === 'paid' && (
                    <div className="flex justify-center">
                        <Link href={route('invoices.generate', shipment.id)}>
                            <Button variant="outline">
                                <FileText className="w-4 h-4 mr-2" />
                                Download Invoice
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}