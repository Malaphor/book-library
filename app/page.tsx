import RecentlyAdded from "@/components/RecentlyAdded";

const Home = async () => {
  return (
    <main className="flex min-h-screen flex-col p-24">
      <div className="w-full max-w-5xl justify-between font-mono text-sm lg:flex">
        currently reading
      </div>
      <div>
        <RecentlyAdded />
      </div>
    </main>
  );
};

export default Home;
