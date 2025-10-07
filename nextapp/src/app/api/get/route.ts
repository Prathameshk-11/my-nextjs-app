// app/api/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

type Book = {
  id: number;
  name: string;
  price: number;
};

// GET /api/books
export async function GET(req: NextRequest) {
  try {
    const result = await pool.query<Book>('SELECT * FROM books');
    return NextResponse.json(result.rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/books
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, price } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const result = await pool.query<Book>(
      'INSERT INTO books(name, price) VALUES($1, $2) RETURNING *',
      [name, price]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
