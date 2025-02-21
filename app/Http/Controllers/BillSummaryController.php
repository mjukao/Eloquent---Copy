<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use Illuminate\Http\Request;

class BillSummaryController extends Controller
{
    public function summary()
    {
        $bills = Bill::with('items.product')
            ->where('status', 'completed')
            ->get()
            ->groupBy('table_number')
            ->map(function ($tableBills) {
                $total = $tableBills->sum('total');
                $items = $tableBills->flatMap->items
                    ->groupBy('product_id')
                    ->map(function ($productItems) {
                        $quantity = $productItems->sum('quantity');
                        $price = $productItems->sum('price');
                        $product = $productItems->first()->product;
                        return [
                            'product' => $product,
                            'quantity' => $quantity,
                            'price' => $price,
                        ];
                    })
                    ->values();
                return [
                    'table_number' => $tableBills->first()->table_number,
                    'total' => $total,
                    'items' => $items,
                ];
            })
            ->values();

        return response()->json($bills);
    }
}
