import ShopCard from '@/Components/ShopCard';

export default function Basic({ shops }) {
    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Chocolateras Básicas</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {shops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                ))}
            </div>
        </div>
    );
}