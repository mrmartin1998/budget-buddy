import { NextResponse } from 'next/server';

export function middleware(request) {
  return NextResponse.next();
}

export function onError(error, request) {
  return NextResponse.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  );
}