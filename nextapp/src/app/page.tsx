"use client";
import { useState, useEffect, FormEvent } from 'react';

type Book = {
  id: number;
  name: string;
  price: number;
};

export default function Home() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [books, setBooks] = useState<Book[]>([]);

 const fetchBooks = async () => {
  const res = await fetch('/api/get');
  const data = await res.json();

  // ensure data is always an array
  if (Array.isArray(data)) {
    setBooks(data);
  } else {
    setBooks([]);
    console.error('Expected array but got', data);
  }
};


  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price: parseFloat(price) }),
    });
    const data: Book = await res.json();
    setBooks([...books, data]);
    setName('');
    setPrice('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Book Entry</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Book Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">Save</button>
      </form>

      <h2>Books List</h2>
     <ul>
  {books?.map((book) => (
    <li key={book.id}>
      {book.name} - ${book.price}
    </li>
  ))}
</ul>

    </div>
  );
}
