import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Clock, CreditCard, Eye, FileText, XCircle } from 'lucide-react';

interface PaymentHistory {
    id: number;
    amount: number;
    currency: string;
    status: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'requires_action';
    type: 'automatic' | 'manual';
    payment_intent_id?: string;
    payment_method_id?: string;
    stripe_charge_id?: string;
    failure_reason?: string;
    attempted_at: string;
    completed_at?: string;
    shipment: {
        id: number;
        tracking_id: string;
        recipient_name: string;
        payment_status: string;
    };
}

interface Props {
    payments: {
        data: PaymentHistory[];
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

const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    succeeded: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    failed: { color: 'bg-red-100 text-red-800', icon: XCircle },
    canceled: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
    requires_action: { color: 'bg-blue-100 text-blue-800', icon: Clock }
};

export default function MyPaymentHistory({ payments }: Props) {
    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase()
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: PaymentHistory['status']) => {
        const config = statusConfig[status];
        const IconComponent = config.icon;

        return (
            <Badge variant="secondary" className={`${config.color} flex items-center gap-1`}>
                <IconComponent className="h-3 w-3" />
                {status.replace('_', ' ').toUpperCase()}
            </Badge>
        );
    };

    const totalSpent = payments.data
        .filter(p => p.status === 'succeeded')
        .reduce((sum, p) => sum + p.amount, 0);

    const successfulPayments = payments.data.filter(p => p.status === 'succeeded').length;

    return (
        <AppLayout>
            <Head title="My Payment History" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Payment History</h1>
                        <p className="text-muted-foreground">
                            View your payment transactions and download invoices
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{payments.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Successful</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{successfulPayments}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(totalSpent, 'USD')}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Shipment</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.data.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{formatDate(payment.attempted_at)}</div>
                                                {payment.completed_at && (
                                                    <div className="text-muted-foreground text-xs">
                                                        Completed: {formatDate(payment.completed_at)}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div className="font-medium">{payment.shipment.tracking_id}</div>
                                                <div
                                                    className="text-muted-foreground">{payment.shipment.recipient_name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">
                                                {formatCurrency(payment.amount, payment.currency)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(payment.status)}
                                            {payment.failure_reason && (
                                                <div className="text-xs text-red-600 mt-1">
                                                    {payment.failure_reason}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link href={route('shipments.show', payment.shipment.id)}>
                                                    <Button variant="ghost" size="sm" title="View Shipment">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {payment.status === 'succeeded' && payment.shipment.payment_status === 'paid' && (
                                                    <a href={route('invoices.generate', payment.shipment.id)} target="_blank">
                                                        <Button type={'button'} variant="ghost" size="sm" title="Download Invoice">
                                                            <FileText className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {payments.data.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">No payment history found</p>
                                <p className="text-sm">Your payment transactions will appear here once you make your
                                    first shipment payment.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {payments.last_page > 1 && (
                            <div className="flex items-center justify-center space-x-2 mt-4">
                                {payments.links.map((link, index) => (
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
