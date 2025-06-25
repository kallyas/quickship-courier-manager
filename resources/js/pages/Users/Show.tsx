import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import {
    ArrowLeft,
    Edit,
    Mail,
    Phone,
    MapPin,
    Building,
    Calendar,
    Crown,
    Shield,
    User as UserIcon,
    Package,
    CreditCard,
    Activity
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    company_name?: string;
    user_type: 'customer' | 'receptionist' | 'admin' | 'super_admin';
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    roles: Array<{ name: string; id: number }>;
    sentShipments: Array<{
        id: number;
        tracking_id: string;
        recipient_name: string;
        status: string;
        payment_status: string;
        price: number;
        created_at: string;
    }>;
    subscriptions?: Array<{
        id: string;
        name: string;
        stripe_status: string;
        created_at: string;
    }>;
}

interface Props {
    user: User;
}

const userTypeColors = {
    customer: "bg-blue-100 text-blue-800",
    receptionist: "bg-green-100 text-green-800",
    admin: "bg-purple-100 text-purple-800",
    super_admin: "bg-red-100 text-red-800",
};

const userTypeIcons = {
    customer: UserIcon,
    receptionist: Building,
    admin: Shield,
    super_admin: Crown,
};

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    picked_up: "bg-blue-100 text-blue-800",
    in_transit: "bg-purple-100 text-purple-800",
    out_for_delivery: "bg-orange-100 text-orange-800",
    delivered: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
};

const paymentStatusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
};

export default function Show({ user }: Props) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

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

    const Icon = userTypeIcons[user.user_type];
    const totalShipments = user.sentShipments?.length || 0;
    const totalRevenue = user.sentShipments?.reduce((sum, shipment) => sum + shipment.price, 0) || 0;
    const completedShipments = user.sentShipments?.filter(s => s.status === 'delivered').length || 0;
    const paidShipments = user.sentShipments?.filter(s => s.payment_status === 'paid').length || 0;

    return (
        <AppLayout>
            <Head title={`${user.name} - User Details`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('users.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Users
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
                            <p className="text-muted-foreground">
                                View and manage user information
                            </p>
                        </div>
                    </div>
                    <Link href={route('users.edit', user.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* User Profile Card */}
                    <Card className="md:col-span-1">
                        <CardHeader className="text-center pb-4">
                            <Avatar className="h-24 w-24 mx-auto mb-4">
                                <AvatarImage src="" alt={user.name} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-xl">{user.name}</CardTitle>
                            <Badge
                                className={`${userTypeColors[user.user_type]} flex items-center gap-1 w-fit mx-auto`}
                            >
                                <Icon className="h-3 w-3" />
                                {user.user_type.replace('_', ' ')}
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{user.phone}</span>
                                    </div>
                                )}
                                {user.address && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{user.address}</span>
                                    </div>
                                )}
                                {user.company_name && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Building className="h-4 w-4 text-muted-foreground" />
                                        <span>{user.company_name}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Joined {formatDate(user.created_at)}</span>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="font-medium mb-2">Roles</h4>
                                <div className="flex flex-wrap gap-1">
                                    {user.roles.map((role) => (
                                        <Badge key={role.id} variant="outline" className="text-xs">
                                            {role.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Activity className="h-4 w-4 text-muted-foreground" />
                                    <span className={user.email_verified_at ? "text-green-600" : "text-red-600"}>
                                        {user.email_verified_at ? "Email Verified" : "Email Not Verified"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats and Activity */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Statistics Cards */}
                        <div className="grid gap-4 md:grid-cols-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Shipments</p>
                                            <p className="text-2xl font-bold">{totalShipments}</p>
                                        </div>
                                        <Package className="h-8 w-8 text-blue-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Completed</p>
                                            <p className="text-2xl font-bold">{completedShipments}</p>
                                        </div>
                                        <Package className="h-8 w-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Paid Orders</p>
                                            <p className="text-2xl font-bold">{paidShipments}</p>
                                        </div>
                                        <CreditCard className="h-8 w-8 text-purple-500" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                                        </div>
                                        <CreditCard className="h-8 w-8 text-green-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Shipments */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Shipments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {user.sentShipments && user.sentShipments.length > 0 ? (
                                    <div className="space-y-4">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Tracking ID</TableHead>
                                                    <TableHead>Recipient</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Payment</TableHead>
                                                    <TableHead>Amount</TableHead>
                                                    <TableHead>Date</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {user.sentShipments.slice(0, 10).map((shipment) => (
                                                    <TableRow key={shipment.id}>
                                                        <TableCell>
                                                            <Link 
                                                                href={route('shipments.show', shipment.id)}
                                                                className="font-medium text-blue-600 hover:underline"
                                                            >
                                                                {shipment.tracking_id}
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell>{shipment.recipient_name}</TableCell>
                                                        <TableCell>
                                                            <Badge className={statusColors[shipment.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                                                                {shipment.status.replace('_', ' ')}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={paymentStatusColors[shipment.payment_status as keyof typeof paymentStatusColors] || "bg-gray-100 text-gray-800"}>
                                                                {shipment.payment_status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{formatCurrency(shipment.price)}</TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {new Date(shipment.created_at).toLocaleDateString()}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        {user.sentShipments.length > 10 && (
                                            <div className="text-center pt-4">
                                                <Link href={route('shipments.index', { user_id: user.id })}>
                                                    <Button variant="outline">
                                                        View All Shipments ({user.sentShipments.length})
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No shipments found for this user.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Subscriptions (if any) */}
                        {user.subscriptions && user.subscriptions.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Subscriptions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {user.subscriptions.map((subscription) => (
                                            <div key={subscription.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{subscription.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Started {new Date(subscription.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge variant={subscription.stripe_status === 'active' ? 'default' : 'secondary'}>
                                                    {subscription.stripe_status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}