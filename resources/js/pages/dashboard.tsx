import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, Calendar, CheckCircle, Clock, DollarSign, Package, Plus, Search, TrendingUp, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardStats {
    total_shipments: number;
    in_transit: number;
    pending_pickup: number;
    delivered: number;
    total_spent?: number;
    pending_payments?: number;
    today_shipments?: number;
    today_deliveries?: number;
    total_revenue?: number;
    monthly_revenue?: number;
    total_users?: number;
    active_customers?: number;
    unread_notifications: number;
}

interface Shipment {
    id: number;
    tracking_id: string;
    recipient_name: string;
    status: string;
    price: number;
    created_at: string;
    sender?: {
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

interface NotificationItem {
    id: number;
    title: string;
    message: string;
    type: string;
    created_at: string;
    read_at: string | null;
}

interface DashboardProps {
    auth: { user: { name?: string; user_type?: string } };
    stats: DashboardStats;
    recent_shipments: Shipment[];
    recent_notifications: NotificationItem[];
    status_breakdown?: Record<string, number>;
    user_type: 'customer' | 'staff';
    [key: string]: unknown;
}

export default function Dashboard() {
    const { props } = usePage<DashboardProps>();
    const { auth, stats, recent_shipments, recent_notifications, user_type } = props;
    const user = auth?.user;
    const isCustomer = user_type === 'customer';
    const isStaff = user_type === 'staff';

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'User'}!</h1>
                        <p className="text-muted-foreground">
                            {isCustomer && 'Manage your shipments and track packages'}
                            {isStaff && 'Monitor operations and manage shipments'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {isCustomer && (
                            <Link href={route('shipments.create')}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Shipment
                                </Button>
                            </Link>
                        )}
                        <Link href={route('tracking.index')}>
                            <Button variant="outline">
                                <Search className="mr-2 h-4 w-4" />
                                Track Package
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{isCustomer ? 'My Shipments' : 'Total Shipments'}</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_shipments}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.total_shipments === 0
                                    ? 'No shipments yet'
                                    : isStaff && stats.today_shipments
                                      ? `+${stats.today_shipments} today`
                                      : 'Total created'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.in_transit}</div>
                            <p className="text-xs text-muted-foreground">Currently shipping</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Pickup</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_pickup}</div>
                            <p className="text-xs text-muted-foreground">Awaiting pickup</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.delivered}</div>
                            <p className="text-xs text-muted-foreground">
                                {isStaff && stats.today_deliveries ? `+${stats.today_deliveries} today` : 'Successfully delivered'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Stats for Different User Types */}
                {isCustomer && (stats.total_spent || stats.pending_payments) && (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(stats.total_spent || 0)}</div>
                                <p className="text-xs text-muted-foreground">Completed payments</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                                <Bell className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.pending_payments || 0}</div>
                                <p className="text-xs text-muted-foreground">Awaiting payment</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {isStaff && (
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue || 0)}</div>
                                <p className="text-xs text-muted-foreground">All time earnings</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(stats.monthly_revenue || 0)}</div>
                                <p className="text-xs text-muted-foreground">This month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_users || 0}</div>
                                <p className="text-xs text-muted-foreground">Registered users</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.active_customers || 0}</div>
                                <p className="text-xs text-muted-foreground">Last 30 days</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isCustomer && (
                                <Link href={route('shipments.create')} className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create New Shipment
                                    </Button>
                                </Link>
                            )}
                            <Link href={route('shipments.index')} className="block">
                                <Button variant="outline" className="w-full justify-start">
                                    <Package className="mr-2 h-4 w-4" />
                                    {isCustomer ? 'View My Shipments' : 'Manage All Shipments'}
                                </Button>
                            </Link>
                            <Link href={route('tracking.index')} className="block">
                                <Button variant="outline" className="w-full justify-start">
                                    <Search className="mr-2 h-4 w-4" />
                                    Track a Package
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Getting Started</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isCustomer ? (
                                <>
                                    <div className="text-sm">
                                        <h4 className="font-medium">Welcome to QuickShip!</h4>
                                        <p className="mt-1 text-muted-foreground">
                                            Start by creating your first shipment or tracking an existing package.
                                        </p>
                                    </div>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        <li>• Create shipments with detailed tracking</li>
                                        <li>• Real-time status updates</li>
                                        <li>• Secure and reliable delivery</li>
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <div className="text-sm">
                                        <h4 className="font-medium">Staff Dashboard</h4>
                                        <p className="mt-1 text-muted-foreground">
                                            Manage shipments, update statuses, and provide excellent customer service.
                                        </p>
                                    </div>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        <li>• Process new shipments</li>
                                        <li>• Update tracking information</li>
                                        <li>• Generate reports and analytics</li>
                                    </ul>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Shipments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Recent Shipments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recent_shipments.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    <Package className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>No recent shipments</p>
                                    <p className="mt-1 text-sm">Shipments will appear here once created</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recent_shipments.slice(0, 5).map((shipment) => (
                                        <div
                                            key={shipment.id}
                                            className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-gray-50"
                                        >
                                            <div className="flex-shrink-0">
                                                <Package className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">{shipment.tracking_id}</p>
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                            {
                                                                pending: 'bg-yellow-100 text-yellow-800',
                                                                picked_up: 'bg-blue-100 text-blue-800',
                                                                in_transit: 'bg-purple-100 text-purple-800',
                                                                out_for_delivery: 'bg-orange-100 text-orange-800',
                                                                delivered: 'bg-green-100 text-green-800',
                                                                cancelled: 'bg-red-100 text-red-800',
                                                            }[shipment.status] || 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {shipment.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <p className="truncate text-sm text-muted-foreground">
                                                    {isStaff && shipment.sender ? `${shipment.sender.name} → ` : ''}
                                                    {shipment.recipient_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {shipment.origin_location.city} → {shipment.destination_location.city}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{formatCurrency(shipment.price)}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(shipment.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {recent_shipments.length > 5 && (
                                        <Link href={route('shipments.index')} className="block">
                                            <Button variant="outline" className="w-full text-sm">
                                                View All Shipments
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Recent Notifications
                                {stats.unread_notifications > 0 && (
                                    <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">{stats.unread_notifications}</span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recent_notifications.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    <Bell className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                    <p>No notifications</p>
                                    <p className="mt-1 text-sm">Notifications will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recent_notifications.slice(0, 5).map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`rounded-lg border p-3 transition-colors ${
                                                !notification.read_at ? 'border-blue-200 bg-blue-50' : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`flex-shrink-0 rounded-full p-1 ${
                                                        {
                                                            info: 'bg-blue-100 text-blue-600',
                                                            success: 'bg-green-100 text-green-600',
                                                            warning: 'bg-yellow-100 text-yellow-600',
                                                            error: 'bg-red-100 text-red-600',
                                                        }[notification.type] || 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    <Bell className="h-3 w-3" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium">{notification.title}</p>
                                                        {!notification.read_at && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                                                    </div>
                                                    <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {recent_notifications.length > 0 && (
                                        <Link href={route('notifications.index')} className="block">
                                            <Button variant="outline" className="w-full text-sm">
                                                View All Notifications
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
