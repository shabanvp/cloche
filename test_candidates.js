const candidates = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80"
];

async function checkCandidates() {
  for (const c of candidates) {
    try {
      const res = await fetch(c, { method: 'GET' });
      console.log(`[${res.status}] ${c}`);
    } catch(err) {
      console.log(`[FAIL] ${c} -> ${err.message}`);
    }
  }
}
checkCandidates();
