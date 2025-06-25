import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Edit, Package, Truck, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Shipment {
    id: number;
    tracking_id: string;
    status: string;
    status_label: string;
}

interface Props {
    shipment: Shipment;
    canUpdate?: boolean;
}

const statusOptions = [
    { value: 'pending', label: 'Pending Pickup', icon: Package, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'picked_up', label: 'Picked Up', icon: Truck, color: 'bg-blue-100 text-blue-800' },
    { value: 'in_transit', label: 'In Transit', icon: Truck, color: 'bg-purple-100 text-purple-800' },
    { value: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, color: 'bg-orange-100 text-orange-800' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800' },
    { value: 'returned', label: 'Returned', icon: RotateCcw, color: 'bg-gray-100 text-gray-800' },
];

export function ShipmentStatusUpdate({ shipment, canUpdate = false }: Props) {
    const [open, setOpen] = useState(false);
    const { data, setData, patch, processing, errors, reset } = useForm({
        status: shipment.status,
        location: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('shipments.update-status', shipment.id), {
            onSuccess: () => {
                setOpen(false);
                reset();
                // Reload the page to show updated data
                router.reload();
            },
        });
    };

    const currentStatus = statusOptions.find(status => status.value === shipment.status);
    const selectedStatus = statusOptions.find(status => status.value === data.status);

    if (!canUpdate) {
        return (
            <Badge className={currentStatus?.color || 'bg-gray-100 text-gray-800'}>
                {currentStatus && <currentStatus.icon className="mr-1 h-3 w-3" />}
                {shipment.status_label}
            </Badge>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Edit className="h-4 w-4" />
                    Update Status
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Shipment Status</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Current Status</Label>
                        <div className="flex items-center gap-2">
                            <Badge className={currentStatus?.color || 'bg-gray-100 text-gray-800'}>
                                {currentStatus && <currentStatus.icon className="mr-1 h-3 w-3" />}
                                {shipment.status_label}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                → Updating to
                            </span>
                            {selectedStatus && (
                                <Badge className={selectedStatus.color}>
                                    <selectedStatus.icon className="mr-1 h-3 w-3" />
                                    {selectedStatus.label}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">New Status *</Label>
                        <Select 
                            value={data.status} 
                            onValueChange={(value) => setData('status', value)}
                        >
                            <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        <div className="flex items-center gap-2">
                                            <status.icon className="h-4 w-4" />
                                            {status.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="text-sm text-red-600">{errors.status}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location (Optional)</Label>
                        <Input
                            id="location"
                            type="text"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            placeholder="e.g., Distribution Center, Customer Address"
                            className={errors.location ? 'border-red-500' : ''}
                        />
                        {errors.location && (
                            <p className="text-sm text-red-600">{errors.location}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Add any additional notes about this status update..."
                            rows={3}
                            className={errors.notes ? 'border-red-500' : ''}
                        />
                        {errors.notes && (
                            <p className="text-sm text-red-600">{errors.notes}</p>
                        )}
                    </div>

                    {data.status === 'delivered' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <div className="text-sm text-green-800">
                                <p className="font-medium">Delivery Confirmation</p>
                                <p>The delivery date will be automatically set to now when marking as delivered.</p>
                            </div>
                        </div>
                    )}

                    {(data.status === 'cancelled' || data.status === 'returned') && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium">Important</p>
                                <p>Please provide detailed notes explaining the reason for this status change.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || data.status === shipment.status}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {processing ? 'Updating...' : 'Update Status'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}