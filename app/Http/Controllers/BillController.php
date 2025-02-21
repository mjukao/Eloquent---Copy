<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\BillItem;
use App\Models\BillSummary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BillController extends Controller
{
    public function index()
    {
        return Bill::with('items.product')->get();
    }

    public function store(Request $request)
    {
        $bill = Bill::create([
            'table_number' => $request->table_number,
            'total' => $request->total,
        ]);

        foreach ($request->items as $item) {
            BillItem::create([
                'bill_id' => $bill->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        return response()->json($bill->load('items.product'), 201);
    }

    public function complete(Request $request, $id)
    {
        try {
            $bill = Bill::findOrFail($id);
            $bill->status = 'completed';
            $bill->save();

            // Store the completed bill data in the BillSummary
            $billSummary = BillSummary::create([
                'table_number' => $bill->table_number,
                'total' => $bill->total,
            ]);

            foreach ($bill->items as $item) {
                // Avoid creating duplicate BillItem entries
                BillItem::updateOrCreate(
                    ['bill_id' => $billSummary->id, 'product_id' => $item->product_id],
                    ['quantity' => $item->quantity, 'price' => $item->price]
                );
            }


            return response()->json($billSummary->load('items.product'), 200);
        } catch (\Exception $e) {
            Log::error('Failed to complete bill: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to complete bill'], 500);
        }
    }
}
