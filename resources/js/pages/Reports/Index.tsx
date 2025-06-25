import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { BarChart3, TrendingUp, Package, DollarSign, Users, Calendar, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Stats {
    total_revenue: number;
    revenue_growth: number;
    total_shipments: number;
    shipment_growth: number;
    active_users: number;
    avg_order_value: number;
}

interface ChartData {
    revenue: Array<{ month: string; revenue: number }>;
    shipments: Array<{ month: string; shipments: number }>;
    status_distribution: Array<{ status: string; count: number }>;
    top_locations: Array<{ location: string; shipments: number }>;
}

interface RecentActivity {
    shipments: Array<{
        id: number;
        tracking_id: string;
        sender: string;
        origin: string;
        destination: string;
        status: string;
        payment_status: string;
        price: number;
        created_at: string;
    }>;
    payments: Array<{
        id: number;
        user: string;
        shipment_tracking: string;
        amount: number;
        status: string;
        type: string;
        created_at: string;
    }>;
}

interface Props {
    stats: Stats;
    chartData: ChartData;
    recentActivity: RecentActivity;
}

export default function Index({ stats, chartData, recentActivity }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {Math.abs(growth)}%
      </div>
    );
  };

  return (
    <AppLayout>
      <Head title="Reports" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Monitor performance and track key business metrics
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={route('reports.export', { type: 'shipments', format: 'csv' })}>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Shipments
              </Button>
            </Link>
            <Link href={route('reports.export', { type: 'payments', format: 'csv' })}>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Payments
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</p>
                  {formatGrowth(stats.revenue_growth)}
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Shipments</p>
                  <p className="text-2xl font-bold">{stats.total_shipments.toLocaleString()}</p>
                  {formatGrowth(stats.shipment_growth)}
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{stats.active_users}</p>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.avg_order_value)}</p>
                  <p className="text-xs text-muted-foreground">Per shipment</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Performing Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chartData.top_locations.length > 0 ? (
                  chartData.top_locations.map((location, index) => (
                    <div key={location.location} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">#{index + 1}</div>
                        <div>
                          <div className="font-medium">{location.location}</div>
                          <div className="text-sm text-muted-foreground">{location.shipments} shipments</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ 
                              width: `${(location.shipments / Math.max(...chartData.top_locations.map(l => l.shipments))) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No location data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Shipment Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chartData.status_distribution.length > 0 ? (
                  chartData.status_distribution.map((status) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={
                            status.status === 'Delivered' ? 'default' :
                            status.status === 'In Transit' ? 'secondary' :
                            status.status === 'Pending' ? 'outline' : 'destructive'
                          }
                        >
                          {status.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{status.count}</div>
                        <div className="text-sm text-muted-foreground">
                          {((status.count / stats.total_shipments) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No shipment data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Shipments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recent Shipments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.shipments.length > 0 ? (
                    recentActivity.shipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-mono text-sm">{shipment.tracking_id}</TableCell>
                        <TableCell>{shipment.sender}</TableCell>
                        <TableCell>{shipment.origin} → {shipment.destination}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              shipment.status === 'delivered' ? 'default' :
                              shipment.status === 'in_transit' ? 'secondary' :
                              shipment.status === 'pending' ? 'outline' : 'destructive'
                            }
                          >
                            {shipment.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={shipment.payment_status === 'paid' ? 'default' : 'secondary'}>
                            {shipment.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(shipment.price)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{shipment.created_at}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No recent shipments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Shipment</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.payments.length > 0 ? (
                    recentActivity.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.user}</TableCell>
                        <TableCell className="font-mono text-sm">{payment.shipment_tracking}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              payment.status === 'succeeded' ? 'default' :
                              payment.status === 'pending' ? 'secondary' : 'destructive'
                            }
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{payment.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{payment.created_at}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No recent payments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}