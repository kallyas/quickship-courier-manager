import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Edit, Package, Truck, XCircle, RotateCcw, AlertTriangle } from 'lucide-react';

interface Shipment {
    id: number;
    tracking_id: string;
    status: string;
    status_label: string;
}

interface Props {
    shipments: Shipment[];
    onUpdate?: () => void;
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

export function BulkStatusUpdate({ shipments, onUpdate }: Props) {
    const [open, setOpen] = useState(false);
    const [selectedShipments, setSelectedShipments] = useState<number[]>([]);
    const { data, setData, patch, processing, errors, reset } = useForm({
        shipment_ids: [] as number[],
        status: '',
        location: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (selectedShipments.length === 0) {
            return;
        }

        // Update the form data and submit
        setData({
            ...data,
            shipment_ids: selectedShipments,
        });
        
        // Use patch instead of post for bulk update
        patch(route('shipments.bulk-update-status'), {
            preserveState: true,
            onSuccess: () => {
                if (onUpdate) onUpdate();
                // Also reload the page to show updated data
                router.reload();
            },
        });

        setOpen(false);
        setSelectedShipments([]);
        reset();
    };

    const handleShipmentToggle = (shipmentId: number) => {
        setSelectedShipments(prev => 
            prev.includes(shipmentId) 
                ? prev.filter(id => id !== shipmentId)
                : [...prev, shipmentId]
        );
    };

    const selectedStatus = statusOptions.find(status => status.value === data.status);

    if (shipments.length === 0) {
        return null;
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
                    Bulk Update Status
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Bulk Status Update</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Shipments to Update</label>
                        <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
                            {shipments.map((shipment) => {
                                const currentStatus = statusOptions.find(s => s.value === shipment.status);
                                return (
                                    <div key={shipment.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                        <input
                                            type="checkbox"
                                            checked={selectedShipments.includes(shipment.id)}
                                            onChange={() => handleShipmentToggle(shipment.id)}
                                            className="rounded border-gray-300"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{shipment.tracking_id}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className={currentStatus?.color || 'bg-gray-100 text-gray-800'}>
                                                    {currentStatus && <currentStatus.icon className="mr-1 h-3 w-3" />}
                                                    {shipment.status_label}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {selectedShipments.length} of {shipments.length} shipments selected
                        </p>
                    </div>

                    {selectedShipments.length > 0 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">New Status</label>
                                <Select 
                                    value={data.status} 
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger>
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
                            </div>

                            {selectedStatus && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-sm text-blue-800">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span className="font-medium">Bulk Update Preview</span>
                                    </div>
                                    <p className="text-sm text-blue-700 mt-1">
                                        {selectedShipments.length} shipments will be updated to: 
                                        <Badge className={`${selectedStatus.color} ml-2`}>
                                            <selectedStatus.icon className="mr-1 h-3 w-3" />
                                            {selectedStatus.label}
                                        </Badge>
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setOpen(false);
                                        setSelectedShipments([]);
                                        reset();
                                    }}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.status || selectedShipments.length === 0}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {processing ? 'Updating...' : `Update ${selectedShipments.length} Shipments`}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}