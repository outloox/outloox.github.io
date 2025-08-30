export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">Outloox</h1>
        <p className="mt-4 text-lg text-gray-600">
          منصة أدواتك (Firebase • Sketchware • Requests • Auth) بواجهة حديثة وخفيفة.
        </p>
        <div className="mt-8 flex gap-3">
          <a href="#features" className="px-5 py-3 rounded-2xl shadow">الميزات</a>
          <a href="#docs" className="px-5 py-3 rounded-2xl border">التوثيق</a>
        </div>
      </section>

      <section id="features" className="max-w-5xl mx-auto px-4 pb-20 grid sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold">تكامل Firebase</h3>
          <p className="mt-2 text-gray-600">Auth, Firestore, Hosting جاهزة.</p>
        </div>
        <div className="p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold">Requests/Networking</h3>
          <p className="mt-2 text-gray-600">قوالب استدعاءات HTTP جاهزة.</p>
        </div>
      </section>
    </main>
  );
}
