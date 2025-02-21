<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToBillsTable extends Migration
{
    public function up()
    {
        Schema::table('bills', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('total');
        });
    }

    public function down()
    {
        Schema::table('bills', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
}
