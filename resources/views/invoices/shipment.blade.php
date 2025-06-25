<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice {{ $invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
        }
        .company-info {
            flex: 1;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .company-details {
            font-size: 14px;
            line-height: 1.5;
        }
        .invoice-info {
            text-align: right;
            flex: 1;
        }
        .invoice-title {
            font-size: 32px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
        }
        .invoice-details {
            font-size: 14px;
            line-height: 1.5;
        }
        .billing-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .billing-box {
            flex: 1;
            margin-right: 20px;
        }
        .billing-box:last-child {
            margin-right: 0;
        }
        .billing-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #1f2937;
        }
        .billing-content {
            font-size: 14px;
            line-height: 1.5;
        }
        .shipment-details {
            background-color: #f9fafb;
            padding: 20px;
            margin-bottom: 30px;
            border-radius: 8px;
        }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .detail-item {
            margin-bottom: 10px;
        }
        .detail-label {
            font-weight: bold;
            color: #374151;
            margin-bottom: 5px;
        }
        .detail-value {
            color: #6b7280;
        }
        .amount-section {
            margin-top: 30px;
            text-align: right;
        }
        .amount-table {
            width: 300px;
            margin-left: auto;
            border-collapse: collapse;
        }
        .amount-table td {
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        .amount-table .label {
            text-align: left;
            font-weight: 500;
        }
        .amount-table .value {
            text-align: right;
            width: 120px;
        }
        .total-row {
            font-weight: bold;
            font-size: 18px;
            border-top: 2px solid #374151;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-paid {
            background-color: #dcfce7;
            color: #166534;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-info">
            <div class="company-name">{{ $company_name }}</div>
            <div class="company-details">
                {{ $company_address }}<br>
                Phone: {{ $company_phone }}<br>
                Email: {{ $company_email }}
            </div>
        </div>
        <div class="invoice-info">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-details">
                <strong>Invoice #:</strong> {{ $invoice_number }}<br>
                <strong>Date:</strong> {{ $invoice_date->format('M d, Y') }}<br>
                <strong>Status:</strong> <span class="status-badge status-paid">Paid</span>
            </div>
        </div>
    </div>

    <div class="billing-section">
        <div class="billing-box">
            <div class="billing-title">Bill To:</div>
            <div class="billing-content">
                <strong>{{ $shipment->sender->name }}</strong><br>
                {{ $shipment->sender->email }}<br>
                @if($shipment->sender->phone)
                    Phone: {{ $shipment->sender->phone }}<br>
                @endif
                @if($shipment->sender->address)
                    {{ $shipment->sender->address }}
                @endif
            </div>
        </div>
        <div class="billing-box">
            <div class="billing-title">Shipment Details:</div>
            <div class="billing-content">
                <strong>Tracking ID:</strong> {{ $shipment->tracking_id }}<br>
                <strong>Status:</strong> {{ ucfirst(str_replace('_', ' ', $shipment->status)) }}<br>
                <strong>Created:</strong> {{ $shipment->created_at->format('M d, Y') }}
            </div>
        </div>
    </div>

    <div class="shipment-details">
        <div class="billing-title">Shipment Information</div>
        <div class="details-grid">
            <div class="detail-item">
                <div class="detail-label">Recipient Name:</div>
                <div class="detail-value">{{ $shipment->recipient_name }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Recipient Phone:</div>
                <div class="detail-value">{{ $shipment->recipient_phone }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Origin:</div>
                <div class="detail-value">
                    {{ $shipment->originLocation->name }}<br>
                    {{ $shipment->originLocation->city }}, {{ $shipment->originLocation->state }}
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Destination:</div>
                <div class="detail-value">
                    {{ $shipment->destinationLocation->name }}<br>
                    {{ $shipment->destinationLocation->city }}, {{ $shipment->destinationLocation->state }}
                </div>
            </div>
            @if($shipment->description)
            <div class="detail-item">
                <div class="detail-label">Description:</div>
                <div class="detail-value">{{ $shipment->description }}</div>
            </div>
            @endif
            @if($shipment->weight)
            <div class="detail-item">
                <div class="detail-label">Weight:</div>
                <div class="detail-value">{{ $shipment->weight }} kg</div>
            </div>
            @endif
        </div>
    </div>

    <div class="amount-section">
        <table class="amount-table">
            <tr>
                <td class="label">Shipping Cost:</td>
                <td class="value">${{ number_format($shipment->price, 2) }}</td>
            </tr>
            <tr>
                <td class="label">Tax (0%):</td>
                <td class="value">$0.00</td>
            </tr>
            <tr class="total-row">
                <td class="label">Total Amount:</td>
                <td class="value">${{ number_format($shipment->price, 2) }}</td>
            </tr>
        </table>
    </div>

    @if($payment_history)
    <div style="margin-top: 30px; padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
        <div class="billing-title">Payment Information</div>
        <div style="font-size: 14px; line-height: 1.5;">
            <strong>Payment Method:</strong> {{ $payment_history->type === 'manual' ? 'Manual Payment' : 'Credit Card' }}<br>
            <strong>Payment Date:</strong> {{ $payment_history->completed_at->format('M d, Y \a\t g:i A') }}<br>
            @if($payment_history->stripe_charge_id)
                <strong>Transaction ID:</strong> {{ $payment_history->stripe_charge_id }}<br>
            @endif
        </div>
    </div>
    @endif

    <div class="footer">
        <p>Thank you for choosing {{ $company_name }}!</p>
        <p>This invoice was generated on {{ now()->format('M d, Y \a\t g:i A') }}</p>
    </div>
</body>
</html>