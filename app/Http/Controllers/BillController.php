<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\BillItem;
use Illuminate\Http\Request;

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
}
