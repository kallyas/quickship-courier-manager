import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Column, DataTable } from '@/components/data-table';
import { BulkStatusUpdate } from '@/components/bulk-status-update';
import { ShipmentStatusUpdate } from '@/components/shipment-status-update';
import AppLayout from '@/layouts/app-layout';
import { Eye, Package, Plus } from 'lucide-react';

interface Shipment {
    id: number;
    tracking_id: string;
    recipient_name: string;
    status: string;
    status_label: string;
    price: number;
    created_at: string;
    sender: {
        name: string;
    };
    origin_location: {
        city: string;
        state: string;
    };
    destination_location: {
        city: string;
        state: string;
    };
}


interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    shipments: {
        data: Shipment[];
        links: PaginationLink[];
        total: number;
        from: number;
        to: number;
        current_page: number;
        last_page: number;
        per_page: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    picked_up: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-purple-100 text-purple-800',
    out_for_delivery: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-gray-100 text-gray-800'
};

export default function Index({ shipments }: Props) {
    const { auth } = usePage<{ auth: { user: { user_type: string[] } } }>().props;
    const isAdmin = auth.user?.user_type?.includes('admin') || auth.user?.user_type?.includes('super_admin');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const columns: Column<Shipment>[] = [
        {
            key: 'tracking_id',
            header: 'Tracking ID',
            sortable: true,
            searchable: true,
            render: (value, row) => (
                <Link 
                    href={route('shipments.show', row.id)} 
                    className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                    {value as string}
                </Link>
            )
        },
        {
            key: 'sender',
            header: 'Sender',
            sortable: true,
            searchable: true,
            render: (value) => (value as { name: string }).name
        },
        {
            key: 'recipient_name',
            header: 'Recipient',
            sortable: true,
            searchable: true
        },
        {
            key: 'origin_location',
            header: 'From',
            render: (value) => {
                const location = value as { city: string; state: string };
                return `${location.city}, ${location.state}`;
            }
        },
        {
            key: 'destination_location',
            header: 'To',
            render: (value) => {
                const location = value as { city: string; state: string };
                return `${location.city}, ${location.state}`;
            }
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (value, row) => (
                <Badge
                    className={statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}
                >
                    {row.status_label}
                </Badge>
            )
        },
        {
            key: 'price',
            header: 'Price',
            sortable: true,
            render: (value) => formatCurrency(value as number)
        },
        {
            key: 'created_at',
            header: 'Created',
            sortable: true,
            render: (value) => formatDate(value as string)
        },
        {
            key: 'id',
            header: 'Actions',
            render: (value, row) => (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Link href={route('shipments.show', row.id)}>
                        <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                        </Button>
                    </Link>
                    {isAdmin && (
                        <div onClick={(e) => e.stopPropagation()}>
                            <ShipmentStatusUpdate shipment={row} canUpdate={true} />
                        </div>
                    )}
                </div>
            )
        }
    ];


    return (
        <AppLayout>
            <Head title="Shipments" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
                        <p className="text-muted-foreground">
                            Manage your shipments and track their progress
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isAdmin && shipments.data.length > 0 && (
                            <BulkStatusUpdate
                                shipments={shipments.data}
                                onUpdate={() => router.reload()}
                            />
                        )}
                        <Link href={route('shipments.create')}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Shipment
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Shipments</p>
                                    <p className="text-2xl font-bold">{shipments.total}</p>
                                </div>
                                <Package className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                                    <p className="text-2xl font-bold">
                                        {shipments.data.filter(s => ['picked_up', 'in_transit', 'out_for_delivery'].includes(s.status)).length}
                                    </p>
                                </div>
                                <Package className="h-8 w-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                    <p className="text-2xl font-bold">
                                        {shipments.data.filter(s => s.status === 'pending').length}
                                    </p>
                                </div>
                                <Package className="h-8 w-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                                    <p className="text-2xl font-bold">
                                        {shipments.data.filter(s => s.status === 'delivered').length}
                                    </p>
                                </div>
                                <Package className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Shipments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Shipments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {shipments.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Package className="h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No shipments found
                                </h3>
                                <p className="text-gray-500 text-center mb-4">
                                    Get started by creating your first shipment.
                                </p>
                                <Link href={route('shipments.create')}>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Shipment
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <DataTable
                                data={shipments.data.map(shipment => ({
                                    ...shipment,
                                    id: parseInt(shipment.id.toString().padStart(6, '0')),
                                }))}
                                columns={columns}
                                searchableColumns={['tracking_id', 'sender', 'recipient_name']}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
