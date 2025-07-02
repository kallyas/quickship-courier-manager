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

        // Create test users with different roles
        $users = [
            // 1 Super Admin
            [
                'name' => 'Super Admin',
                'email' => 'admin@quickship.com',
                'password' => bcrypt('password'),
                'user_type' => 'super_admin',
                'role' => 'super_admin'
            ],
            
            // 3 Admins
            [
                'name' => 'Admin User 1',
                'email' => 'admin1@quickship.com',
                'password' => bcrypt('password'),
                'user_type' => 'admin',
                'role' => 'admin'
            ],
            [
                'name' => 'Admin User 2',
                'email' => 'admin2@quickship.com',
                'password' => bcrypt('password'),
                'user_type' => 'admin',
                'role' => 'admin'
            ],
            [
                'name' => 'Sarah Admin',
                'email' => 'sarah.admin@quickship.com',
                'password' => bcrypt('password'),
                'user_type' => 'admin',
                'role' => 'admin'
            ],
            
            // 4 Receptionists
            [
                'name' => 'Receptionist Mary',
                'email' => 'mary.receptionist@quickship.com',
                'password' => bcrypt('password'),
                'user_type' => 'receptionist',
                'role' => 'receptionist'
            ],
            [
                'name' => 'Receptionist Tom',
                'email' => 'tom.receptionist@quickship.com',
                'password' => bcrypt('password'),
                'user_type' => 'receptionist',
                'role' => 'receptionist'
            ],
            [
                'name' => 'Lisa Reception',
                'email' => 'lisa.reception@quickship.com',
                'password' => bcrypt('password'),
                'user_type' => 'receptionist',
                'role' => 'receptionist'
            ],
            [
                'name' => 'Mike Receptionist',
                'email' => 'mike.receptionist@quickship.com',
                'password' => bcrypt('password'),
                'user_type' => 'receptionist',
                'role' => 'receptionist'
            ],
            
            // 12 Customers
            [
                'name' => 'John Customer',
                'email' => 'john.customer@example.com',
                'password' => bcrypt('password'),
                'user_type' => 'customer',
                'phone' => '+1234567890',
                'address' => '123 Main St, New York, NY 10001',
                'role' => 'customer'
            ],
            [
                'name' => 'Alice Smith',
                'email' => 'alice.smith@example.com',
                'password' => bcrypt('password'),
                'user_type' => 'customer',
                'phone' => '+1234567891',
                'address' => '456 Oak Ave, Los Angeles, CA 90210',
                'role' => 'customer'
            ],
            [
                'name' => 'Bob Johnson',
                'email' => 'bob.johnson@example.com',
                'password' => bcrypt('password'),
                'user_type' => 'customer',
                'phone' => '+1234567892',
                'address' => '789 Pine St, Chicago, IL 60601',
                'role' => 'customer'
            ],
            [
                'name' => 'Emma Wilson',
                'email' => 'emma.wilson@example.com',
                'password' => bcrypt('password'),
                'user_type' => 'customer',
                'phone' => '+1234567893',
                'address' => '321 Elm St, Houston, TX 77001',
                'role' => 'customer'
            ],
            [
                'name' => 'David Brown',
                'email' => 'david.brown@example.com',
                'password' => bcrypt('password'),
                'user_type' => 'customer',
                'phone' => '+1234567894',
                'address' => '654 Maple Dr, Phoenix, AZ 85001',
                'role' => 'customer'
            ],
            [
                'name' => 'Sophie Davis',
                'email' => 'sophie.davis@example.com',
                'password' => bcrypt('password'),
                'user_type' => 'customer',
                'phone' => '+1234567895',
                'address' => '987 Cedar Ln, Philadelphia, PA 19101',
                'role' => 'customer'
            ],
            [
                'name' => 'Michael Garcia',
                'email' => 'michael.garcia@example.com',
                'password' => bcrypt('password'),
                'user_type' => 'customer',
                'phone' => '+1234567896',
                'address' => '147 Birch Rd, San Antonio, TX 78201',
                'role' => 'customer'
            ],
            [
                'name' => 'Olivia Martinez',
                'email' => 'olivia.martinez@example.com',
                'password' => bcrypt('password'),
                'user_type' => 'customer',
                'phone' => '+1234567897',
                'address' => '258 Spruce St, San Diego, CA 92101',
                'role' => 'customer'
            ],
            [
                'name' => 'James Rodriguez',
                'email' => 'james.rodriguez@example.com',
                'password' => bcrypt('password'),
                'user_type' => 'customer',
                'phone' => '+1234567898',
                'address' => '369 Ash Ave, Dallas, TX 75201',
                'role' => 'customer'
            ],
            [
                'name' => 'Isabella Lopez',
                'email' => 'isabella.lopez@example.com',
                'password' => bcrypt('password'),
                'user_type' => 'customer',
                'phone' => '+1234567899',
                'address' => '741 Willow Way, San Jose, CA 95101',
                'role' => 'customer'
            ],
            [
                'name' => 'William Anderson',
                'email' => 'william.anderson@example.com',
                'password' => bcrypt('password'),
                'user_type' => 'customer',
                'phone' => '+1234567800',
                'address' => '852 Poplar Pl, Austin, TX 78701',
                'role' => 'customer'
            ],
            [
                'name' => 'Charlotte Taylor',
                'email' => 'charlotte.taylor@example.com',
                'password' => bcrypt('password'),
                'user_type' => 'customer',
                'phone' => '+1234567801',
                'address' => '963 Hickory Hill, Jacksonville, FL 32099',
                'role' => 'customer'
            ]
        ];

        foreach ($users as $userData) {
            $role = $userData['role'];
            unset($userData['role']);
            
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
            $user->assignRole($role);
        }
    }
}
