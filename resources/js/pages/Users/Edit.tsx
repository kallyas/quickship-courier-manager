import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { FormEvent } from 'react';
import {
    ArrowLeft,
    Save,
    AlertCircle,
    User as UserIcon,
    Mail,
    Phone,
    MapPin,
    Building,
    Shield,
    Crown
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    company_name?: string;
    user_type: 'customer' | 'receptionist' | 'admin' | 'super_admin';
    roles: Array<{ name: string; id: number }>;
}

interface Role {
    id: number;
    name: string;
}

interface Props {
    user: User;
    roles: Role[];
}

const userTypeIcons = {
    customer: UserIcon,
    receptionist: Building,
    admin: Shield,
    super_admin: Crown,
};

export default function Edit({ user, roles }: Props) {
    const { data, setData, put, processing, errors, isDirty } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        company_name: user.company_name || '',
        user_type: user.user_type || 'customer',
        roles: user.roles.map(role => role.name) || [],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id), {
            preserveScroll: true,
        });
    };

    const handleRoleChange = (roleName: string, checked: boolean) => {
        if (checked) {
            setData('roles', [...data.roles, roleName]);
        } else {
            setData('roles', data.roles.filter(role => role !== roleName));
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const Icon = userTypeIcons[data.user_type];

    return (
        <AppLayout>
            <Head title={`Edit ${user.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('users.show', user.id)}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to User
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
                            <p className="text-muted-foreground">
                                Update user information and permissions
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* User Preview Card */}
                        <Card className="md:col-span-1">
                            <CardHeader className="text-center pb-4">
                                <Avatar className="h-24 w-24 mx-auto mb-4">
                                    <AvatarImage src="" alt={data.name || user.name} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                                        {getInitials(data.name || user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-xl">{data.name || 'User Name'}</CardTitle>
                                <div className="flex items-center justify-center gap-1">
                                    <Icon className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                        {data.user_type.replace('_', ' ')}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{data.email || 'email@example.com'}</span>
                                    </div>
                                    {data.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span>{data.phone}</span>
                                        </div>
                                    )}
                                    {data.company_name && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Building className="h-4 w-4 text-muted-foreground" />
                                            <span>{data.company_name}</span>
                                        </div>
                                    )}
                                </div>

                                {data.roles.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-2 text-sm">Assigned Roles</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {data.roles.map((role) => (
                                                <Badge key={role} variant="outline" className="text-xs">
                                                    {role}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Edit Form */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={errors.name ? 'border-red-500' : ''}
                                                placeholder="Enter full name"
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600">{errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={errors.email ? 'border-red-500' : ''}
                                                placeholder="Enter email address"
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className={errors.phone ? 'border-red-500' : ''}
                                                placeholder="Enter phone number"
                                            />
                                            {errors.phone && (
                                                <p className="text-sm text-red-600">{errors.phone}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="company_name">Company Name</Label>
                                            <Input
                                                id="company_name"
                                                type="text"
                                                value={data.company_name}
                                                onChange={(e) => setData('company_name', e.target.value)}
                                                className={errors.company_name ? 'border-red-500' : ''}
                                                placeholder="Enter company name"
                                            />
                                            {errors.company_name && (
                                                <p className="text-sm text-red-600">{errors.company_name}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className={errors.address ? 'border-red-500' : ''}
                                            placeholder="Enter full address"
                                            rows={3}
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-red-600">{errors.address}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* User Type & Permissions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>User Type & Permissions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="user_type">User Type *</Label>
                                        <Select 
                                            value={data.user_type} 
                                            onValueChange={(value) => setData('user_type', value as typeof data.user_type)}
                                        >
                                            <SelectTrigger className={errors.user_type ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Select user type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="customer">Customer</SelectItem>
                                                <SelectItem value="receptionist">Receptionist</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="super_admin">Super Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.user_type && (
                                            <p className="text-sm text-red-600">{errors.user_type}</p>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Roles</Label>
                                        <div className="grid gap-3 md:grid-cols-2">
                                            {roles.map((role) => (
                                                <div key={role.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`role-${role.id}`}
                                                        checked={data.roles.includes(role.name)}
                                                        onCheckedChange={(checked) => 
                                                            handleRoleChange(role.name, checked as boolean)
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor={`role-${role.id}`}
                                                        className="text-sm font-normal cursor-pointer"
                                                    >
                                                        {role.name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.roles && (
                                            <p className="text-sm text-red-600">{errors.roles}</p>
                                        )}
                                    </div>

                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Changes to user type and roles will affect the user's access permissions 
                                            and available features in the system.
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between">
                                <Link href={route('users.show', user.id)}>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button 
                                    type="submit" 
                                    disabled={processing || !isDirty}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}