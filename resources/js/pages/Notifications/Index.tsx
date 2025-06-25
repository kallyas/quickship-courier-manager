import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/confirm-dialog';
import AppLayout from '@/layouts/app-layout';
import { useConfirm } from '@/hooks/use-confirm';
import {
    AlertTriangle,
    Bell,
    Check,
    CheckCheck,
    CheckCircle,
    Eye,
    Info,
    MoreHorizontal,
    Trash2,
    XCircle
} from 'lucide-react';

interface Notification {
    id: number;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    read_at: string | null;
    action_url?: string;
    action_text?: string;
    created_at: string;
    data?: Record<string, unknown>;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    notifications: {
        data: Notification[];
        links: PaginationLink[];
        total: number;
        from: number;
        to: number;
        current_page: number;
        last_page: number;
        per_page: number;
    };
}

const typeIcons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle
};

const typeColors = {
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200'
};

export default function Index({ notifications }: Props) {
    const { confirm, isOpen, options, onConfirm, onOpenChange } = useConfirm();

    const handleMarkAsRead = (notificationId: number) => {
        router.patch(route('notifications.read', notificationId));
    };

    const handleMarkAllAsRead = () => {
        router.patch(route('notifications.mark-all-read'));
    };

    const handleDelete = async (notificationId: number) => {
        const confirmed = await confirm({
            title: 'Delete Notification',
            description: 'Are you sure you want to delete this notification? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'destructive'
        });

        if (confirmed) {
            router.delete(route('notifications.destroy', notificationId));
        }
    };

    const unreadCount = notifications.data.filter(n => !n.read_at).length;

    return (
        <AppLayout>
            <Head title="Notifications" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                            {unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white">
                                    {unreadCount} unread
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground">
                            Stay updated with important information and alerts
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button onClick={handleMarkAllAsRead} variant="outline">
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Mark All Read
                        </Button>
                    )}
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                                    <p className="text-2xl font-bold">{notifications.total}</p>
                                </div>
                                <Bell className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Unread</p>
                                    <p className="text-2xl font-bold">{unreadCount}</p>
                                </div>
                                <Bell className="h-8 w-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Success</p>
                                    <p className="text-2xl font-bold">
                                        {notifications.data.filter(n => n.type === 'success').length}
                                    </p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-yellow-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                                    <p className="text-2xl font-bold">
                                        {notifications.data.filter(n => n.type === 'warning').length}
                                    </p>
                                </div>
                                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Notifications List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {notifications.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No notifications yet
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    When you receive notifications, they'll appear here.
                                </p>
                                <Link href={route('test.notifications')}>
                                    <Button variant="outline">
                                        Create Test Notifications
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <ScrollArea className="h-[600px]">
                                <div className="space-y-4">
                                    {notifications.data.map((notification) => {
                                        const Icon = typeIcons[notification.type];
                                        const isUnread = !notification.read_at;

                                        return (
                                            <div
                                                key={notification.id}
                                                className={`relative p-4 border rounded-lg transition-all hover:shadow-md ${
                                                    isUnread ? 'bg-blue-50 border-blue-200' : 'bg-white'
                                                }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Icon */}
                                                    <div
                                                        className={`flex-shrink-0 p-2 rounded-full ${typeColors[notification.type]}`}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="font-semibold text-gray-900">
                                                                        {notification.title}
                                                                    </h4>
                                                                    {isUnread && (
                                                                        <div
                                                                            className="w-2 h-2 bg-blue-500 rounded-full" />
                                                                    )}
                                                                </div>
                                                                <p className="text-gray-600 text-sm mb-2">
                                                                    {notification.message}
                                                                </p>
                                                                <div
                                                                    className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>
                                    {new Date(notification.created_at).toLocaleString()}
                                  </span>
                                                                    <Badge variant="outline" className="capitalize">
                                                                        {notification.type}
                                                                    </Badge>
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    {isUnread && (
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                                        >
                                                                            <Check className="mr-2 h-4 w-4" />
                                                                            Mark as Read
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    {notification.action_url && (
                                                                        <DropdownMenuItem asChild>
                                                                            <Link href={notification.action_url}>
                                                                                <Eye className="mr-2 h-4 w-4" />
                                                                                {notification.action_text || 'View'}
                                                                            </Link>
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    <DropdownMenuItem
                                                                        className="text-red-600"
                                                                        onClick={() => handleDelete(notification.id)}
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>

                                                        {/* Action Button */}
                                                        {notification.action_url && (
                                                            <div className="mt-3">
                                                                <Link href={notification.action_url}>
                                                                    <Button variant="outline" size="sm">
                                                                        {notification.action_text || 'View Details'}
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        )}

                        {/* Pagination */}
                        {notifications.data.length > 0 && (
                            <div className="flex items-center justify-between pt-6 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Showing {notifications.from} to {notifications.to} of{' '}
                                    {notifications.total} notifications
                                </p>
                                {/* Pagination component would go here */}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ConfirmDialog
                open={isOpen}
                onOpenChange={onOpenChange}
                title={options.title}
                description={options.description}
                confirmText={options.confirmText}
                cancelText={options.cancelText}
                variant={options.variant}
                onConfirm={onConfirm}
            />
        </AppLayout>
    );
}
