<?php

namespace App\Http\Controllers;

use App\Models\Meetings;
use App\Models\Rooms;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class MeetingsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $meetings = DB::table('meetings')
            ->leftJoin('rooms', 'meetings.room_id', '=', 'rooms.id')
            ->get();
        return ($meetings);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name_user' => 'required|max:255',
            'room_id' => 'required|exists:rooms,id',
            'initial_date' => 'required',
            'end_date' => 'required',
        ]);

        if ($validator->fails()) {
            return $validator->errors();
        }

        $meetings = Meetings::create([
            'name_user' => $request->name_user,
            'room_id' => $request->room_id,
            'initial_date' => $request->initial_date,
            'end_date' => $request->end_date,
        ]);
    }

    public function show(Request $request)
    {
        $meetings = DB::table('meetings')
            ->leftJoin('rooms', 'meetings.room_id', '=', 'rooms.id')
            ->where('idMeet', $request->idMeet)
            ->get();
        return ($meetings);
    }
    public function update(Request $request)
    {
        Meetings::where('idMeet', $request->idMeet)
            ->update([
                'name_user' => $request->name_user,
                'room_id' => $request->room_id,
                'initial_date' => $request->initial_date,
                'end_date' => $request->end_date,
            ]);
    }

    public function destroy(Request $request)
    {
        $meetings = Meetings::where('idMeet', $request->idMeet)->delete();
        return $meetings;
    }

    public function indexRoom(Request $request)
    {
        return Rooms::all();
    }
}
