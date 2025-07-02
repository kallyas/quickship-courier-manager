<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreShipmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'recipient_name' => 'required|string|max:255',
            'recipient_phone' => 'required|string|max:20',
            'recipient_email' => 'nullable|email|max:255',
            'recipient_address' => 'required|string',
            'origin_location_id' => 'required|exists:locations,id',
            'destination_location_id' => 'required|exists:locations,id|different:origin_location_id',
            'description' => 'required|string|max:1000',
            'weight' => 'required|numeric|min:0.01|max:999999.99',
            'dimensions' => 'nullable|string|max:100',
            'declared_value' => 'nullable|numeric|min:0|max:999999.99',
            'service_type' => 'required|in:standard,express,overnight',
            'price' => 'required|numeric|min:0|max:999999.99',
            'pickup_date' => 'nullable|date|after_or_equal:today',
            'estimated_delivery' => 'nullable|date|after:pickup_date',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'origin_location_id.different' => 'Origin and destination locations must be different.',
            'weight.min' => 'Weight must be at least 0.01 kg.',
            'pickup_date.after_or_equal' => 'Pickup date cannot be in the past.',
            'estimated_delivery.after' => 'Estimated delivery must be after pickup date.',
        ];
    }
}
