<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BranchSelection
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if(!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated user.'
            ], 401);
        }

        if($user->BranchID == 0){

            if($request->has('branchid')){
                session(['superadmin_branch_id' => $request->input('branchid')]);
            }

            $branchId = session('superadmin_branch_id');

            if(!$branchId){
                return response()->json([
                    'status' => 'branch_required',
                    'message' => 'Superadmin must select a branch first.',
                ], 403);
            }

            $request->merge(['effective_branch_id' => $branchId]);
        } else{
            $request->merge(['effective_branch_id' => $user->BranchID]);
        }
        
        return $next($request);
    }
}
