import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutGrid, Package, Search, Plus, MapPin, Users, BarChart3, Settings, Bell, UserCircle, Palette, TestTube, CreditCard, FileText, DollarSign } from 'lucide-react';
import AppLogo from './app-logo';

// Core navigation items available to all authenticated users
const coreNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Notifications',
        href: '/notifications',
        icon: Bell,
    },
    {
        title: 'Track Package',
        href: '/track',
        icon: Search,
    },
];

// Shipment management items for customers
const shipmentNavItems: NavItem[] = [
    {
        title: 'My Shipments',
        href: '/shipments',
        icon: Package,
    },
    {
        title: 'Create Shipment',
        href: '/shipments/create',
        icon: Plus,
    },
];

// Payment items for customers
const customerPaymentNavItems: NavItem[] = [
    {
        title: 'My Payments',
        href: '/payments/my-history',
        icon: CreditCard,
    },
    {
        title: 'My Invoices',
        href: '/invoices/my-invoices',
        icon: FileText,
    },
];

// Admin-only navigation items
const adminNavItems: NavItem[] = [
    {
        title: 'Shipments',
        href: '/shipments',
        icon: Package,
        items: [
            {
                title: 'All Shipments',
                href: '/shipments',
                icon: Package,
            },
            {
                title: 'Create Shipment',
                href: '/shipments/create',
                icon: Plus,
            },
        ],
    },
    {
        title: 'Payments',
        href: '/payments',
        icon: CreditCard,
        items: [
            {
                title: 'Payment History',
                href: '/payments/history',
                icon: DollarSign,
            },
            {
                title: 'Invoices',
                href: '/invoices',
                icon: FileText,
            },
        ],
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Locations',
        href: '/locations',
        icon: MapPin,
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
    },
    {
        title: 'Test Data',
        href: '/test/notifications',
        icon: TestTube,
    },
];

function getNavigationItems(userType?: string): NavItem[] {
    const items = [...coreNavItems];
    
    // Add shipment management for customers and staff
    if (userType && ['customer', 'receptionist', 'admin', 'super_admin'].includes(userType)) {
        if (userType === 'customer') {
            items.push(...shipmentNavItems);
            items.push(...customerPaymentNavItems);
        } else {
            // Staff members see admin navigation
            items.push(...adminNavItems);
        }
    }
    
    return items;
}

const footerNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
        items: [
            {
                title: 'Profile',
                href: '/settings/profile',
                icon: UserCircle,
            },
            {
                title: 'Password',
                href: '/settings/password',
                icon: Settings,
            },
            {
                title: 'Appearance',
                href: '/settings/appearance',
                icon: Palette,
            },
        ],
    },
    {
        title: 'Support',
        href: '/support',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { props } = usePage<{ auth: { user: { user_type?: string } } }>();
    const user = props.auth?.user;
    const userType = user?.user_type;
    const navigationItems = getNavigationItems(userType);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navigationItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
