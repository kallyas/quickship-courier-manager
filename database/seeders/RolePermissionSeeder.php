<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            'manage_shipments',
            'create_shipments',
            'view_shipments',
            'update_shipments',
            'delete_shipments',
            'manage_users',
            'view_reports',
            'manage_locations',
            'upload_files',
            'view_tracking',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $receptionist = Role::firstOrCreate(['name' => 'receptionist']);
        $customer = Role::firstOrCreate(['name' => 'customer']);

        // Assign permissions to roles
        $superAdmin->givePermissionTo(Permission::all());
        
        $admin->givePermissionTo([
            'manage_shipments',
            'view_shipments',
            'update_shipments',
            'view_reports',
            'manage_locations',
            'upload_files',
            'view_tracking',
        ]);

        $receptionist->givePermissionTo([
            'create_shipments',
            'view_shipments',
            'update_shipments',
            'upload_files',
            'view_tracking',
        ]);

        $customer->givePermissionTo([
            'create_shipments',
            'view_shipments',
            'view_tracking',
        ]);

        // Create a super admin user
        $superAdminUser = User::firstOrCreate(
            ['email' => 'admin@quickship.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
                'user_type' => 'super_admin',
            ]
        );
        $superAdminUser->assignRole('super_admin');

        // Create a customer user
        $customerUser = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'John Customer',
                'password' => bcrypt('password'),
                'user_type' => 'customer',
                'phone' => '+1234567890',
                'address' => '123 Main St, City, State 12345',
            ]
        );
        $customerUser->assignRole('customer');
    }
}
