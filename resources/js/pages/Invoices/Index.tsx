import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, DollarSign, Download, Eye, FileText } from 'lucide-react';

interface Shipment {
    id: number;
    tracking_id: string;
    recipient_name: string;
    price: number;
    payment_status: string;
    status: string;
    created_at: string;
    updated_at: string;
    sender: {
        id: number;
        name: string;
        email: string;
    };
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

interface Props {
    shipments: {
        data: Shipment[];
        links: Array<{
            url?: string;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function InvoicesIndex({ shipments }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const totalRevenue = shipments.data.reduce((sum, shipment) => sum + shipment.price, 0);

    return (
        <AppLayout>
            <Head title="Invoices" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                        <p className="text-muted-foreground">
                            Manage and download invoices for all paid shipments
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{shipments.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Paid Shipments</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{shipments.data.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Shipment</TableHead>
                                    <TableHead>Route</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {shipments.data.map((shipment) => (
                                    <TableRow key={shipment.id}>
                                        <TableCell>
                                            <span className="font-mono text-sm">
                                                INV-{String(shipment.id).padStart(6, '0')}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {formatDate(shipment.updated_at)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium">{shipment.sender.name}</div>
                                                <div className="text-muted-foreground">{shipment.sender.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium">{shipment.tracking_id}</div>
                                                <div className="text-muted-foreground">{shipment.recipient_name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{shipment.origin_location.city}, {shipment.origin_location.state}</div>
                                                <div
                                                    className="text-muted-foreground">→ {shipment.destination_location.city}, {shipment.destination_location.state}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">
                                                {formatCurrency(shipment.price)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                PAID
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link href={route('shipments.show', shipment.id)}>
                                                    <Button variant="ghost" size="sm" title="View Shipment">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <a href={route('invoices.generate', shipment.id)} target="_blank">
                                                    <Button variant="ghost" size="sm" title="Download Invoice">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </a>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {shipments.data.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">No invoices found</p>
                                <p className="text-sm">Invoices will appear here once shipments are paid for.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {shipments.last_page > 1 && (
                            <div className="flex items-center justify-center space-x-2 mt-4">
                                {shipments.links.map((link, index) => (
                                    <div key={index}>
                                        {link.url ? (
                                            <Link href={link.url}>
                                                <Button
                                                    variant={link.active ? 'default' : 'outline'}
                                                    size="sm"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            </Link>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
